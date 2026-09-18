-- ============================================================================
-- THE CUSTODIAN OF THE TWO HOLY MOSQUES SCHOLARSHIP PROGRAM
-- ENTERPRISE POSTGRESQL HIGH-SCALE SCHEMA DEFINITION
-- Targets: Multi-million record capacity, Declarative Partitioning, 3NF Normalization
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- ENUMS & DOMAIN TYPES
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM (
        'applicant', 
        'supervisor', 
        'reviewer', 
        'admin', 
        'super_admin', 
        'content_manager', 
        'support_agent', 
        'cultural_mission', 
        'donor_entity'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status_enum AS ENUM ('active', 'suspended', 'pending_verification', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status_enum AS ENUM (
        'draft',
        'in_progress',
        'submitted',
        'under_review',
        'needs_information',
        'eligibility_check',
        'nominated',
        'accepted',
        'rejected',
        'withdrawn',
        'completed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE degree_level_enum AS ENUM ('bachelor', 'master', 'phd', 'fellowship');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE eligibility_decision_enum AS ENUM (
        'eligible', 
        'not_eligible', 
        'conditionally_eligible', 
        'needs_review'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_status_enum AS ENUM ('pending', 'verified', 'rejected', 'ai_scanned', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status_enum AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_type_enum AS ENUM (
        'academic_advising', 
        'visa_inquiry', 
        'scholarship_contract', 
        'financial_guarantee', 
        'general_support'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE audit_action_enum AS ENUM (
        'LOGIN', 'LOGOUT', 'FAILED_LOGIN', 
        'APPLICATION_CREATED', 'APPLICATION_SUBMITTED', 'APPLICATION_UPDATED', 'STATUS_CHANGED', 
        'DOCUMENT_UPLOADED', 'DOCUMENT_DELETED', 'DOCUMENT_VERIFIED',
        'ELIGIBILITY_CHECKED', 'NOMINATION_CREATED', 'APPROVAL_GRANTED', 'REJECTION_ISSUED',
        'ADMIN_ACTION', 'PERMISSION_CHANGED', 'SECURITY_ALERT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 1. IDENTITY & USERS DOMAIN
-- ============================================================================
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(64) PRIMARY KEY,
    name_ar VARCHAR(128) NOT NULL,
    name_en VARCHAR(128) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(128) PRIMARY KEY,
    domain VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id VARCHAR(64) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(128) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    national_id VARCHAR(10) NOT NULL UNIQUE,       -- 10-digit Saudi National ID / Iqama
    nafath_uid VARCHAR(128) UNIQUE,               -- Federated SSO identifier
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    full_name_ar VARCHAR(255) NOT NULL,
    full_name_en VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    nationality VARCHAR(64) NOT NULL DEFAULT 'Saudi',
    role user_role_enum NOT NULL DEFAULT 'applicant',
    status user_status_enum NOT NULL DEFAULT 'active',
    password_hash VARCHAR(255),                   -- Argon2id or bcrypt hash (null for pure Nafath SSO)
    avatar_url TEXT,
    last_login_at TIMESTAMPTZ,
    yakeen_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_national_id ON users(national_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);

CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    gpa NUMERIC(4, 2) NOT NULL DEFAULT 4.0,
    gpa_scale NUMERIC(3, 1) NOT NULL DEFAULT 5.0,
    current_degree degree_level_enum,
    ielts_score NUMERIC(3, 1),
    toefl_score INT,
    duolingo_score INT,
    gre_score INT,
    preferred_country_code CHAR(2),
    cultural_mission_id VARCHAR(64),
    bio TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    user_agent TEXT,
    ip_address INET,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id, expires_at);

-- ============================================================================
-- 2. SCHOLARSHIP TRACKS & REQUIREMENTS ENGINE DOMAIN
-- ============================================================================
CREATE TABLE IF NOT EXISTS scholarship_tracks (
    id VARCHAR(64) PRIMARY KEY,                   -- e.g. 'track-pioneers', 'track-supply'
    code VARCHAR(32) NOT NULL UNIQUE,             -- e.g. 'PIONEERS', 'IMDAD', 'RD'
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    short_description_ar TEXT,
    short_description_en TEXT,
    badge_color VARCHAR(32) NOT NULL DEFAULT 'emerald',
    image_url TEXT,
    icon_name VARCHAR(64) NOT NULL DEFAULT 'GraduationCap',
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    display_order INT NOT NULL DEFAULT 1,
    min_gpa NUMERIC(3, 2) NOT NULL DEFAULT 3.0,
    max_age INT NOT NULL DEFAULT 35,
    top_universities_rank_limit INT NOT NULL DEFAULT 30,
    annual_quota INT NOT NULL DEFAULT 1000,
    filled_seats INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tracks_active_order ON scholarship_tracks(is_active, display_order);

-- Dynamic Rules Management: Admins configure criteria without touching backend code
CREATE TABLE IF NOT EXISTS requirement_rules (
    id VARCHAR(64) PRIMARY KEY,
    track_id VARCHAR(64) NOT NULL REFERENCES scholarship_tracks(id) ON DELETE CASCADE,
    rule_code VARCHAR(64) NOT NULL,               -- e.g. 'MIN_GPA', 'MAX_AGE', 'MAX_QS_RANK', 'MIN_IELTS'
    rule_title_ar VARCHAR(255) NOT NULL,
    rule_title_en VARCHAR(255) NOT NULL,
    field_name VARCHAR(64) NOT NULL,              -- Target entity field to evaluate
    operator VARCHAR(16) NOT NULL,                -- '>=', '<=', '==', 'IN', 'CONTAINS'
    expected_value JSONB NOT NULL,                -- Dynamic threshold or allowed values
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    weight INT NOT NULL DEFAULT 10,               -- Weight for calculation
    error_message_ar TEXT NOT NULL,
    error_message_en TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rules_track ON requirement_rules(track_id, is_active);

-- ============================================================================
-- 3. ACADEMICS & UNIVERSITIES DOMAIN
-- ============================================================================
CREATE TABLE IF NOT EXISTS countries (
    code CHAR(2) PRIMARY KEY,                     -- ISO Alpha-2 e.g. 'US', 'GB', 'CA'
    name_ar VARCHAR(128) NOT NULL,
    name_en VARCHAR(128) NOT NULL,
    visa_processing_days INT DEFAULT 30,
    cultural_mission_name_ar VARCHAR(255),
    cultural_mission_name_en VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS universities (
    id VARCHAR(64) PRIMARY KEY,                   -- e.g. 'uni-oxford', 'uni-mit'
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    country_code CHAR(2) NOT NULL REFERENCES countries(code),
    city_ar VARCHAR(128) NOT NULL,
    city_en VARCHAR(128) NOT NULL,
    qs_rank INT NOT NULL,
    the_rank INT,
    shanghai_rank INT,
    min_ielts NUMERIC(3, 1) NOT NULL DEFAULT 6.5,
    min_toefl INT NOT NULL DEFAULT 85,
    acceptance_rate VARCHAR(16),
    website_url TEXT,
    logo_url TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_universities_rank ON universities(qs_rank ASC);
CREATE INDEX IF NOT EXISTS idx_universities_country ON universities(country_code);

-- Accredited tracks per university (normalized join table)
CREATE TABLE IF NOT EXISTS university_track_accreditations (
    university_id VARCHAR(64) NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    track_id VARCHAR(64) NOT NULL REFERENCES scholarship_tracks(id) ON DELETE CASCADE,
    accredited_since DATE NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (university_id, track_id)
);

CREATE TABLE IF NOT EXISTS majors (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    sector VARCHAR(64) NOT NULL,                  -- e.g. 'AI & Technology', 'Healthcare'
    is_priority BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS university_majors (
    university_id VARCHAR(64) NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    major_id VARCHAR(64) NOT NULL REFERENCES majors(id) ON DELETE CASCADE,
    degree_level degree_level_enum NOT NULL,
    PRIMARY KEY (university_id, major_id, degree_level)
);

-- ============================================================================
-- 4. APPLICATIONS CORE DOMAIN (PARTITIONED BY RANGE OF created_at)
-- ============================================================================
CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT uuid_generate_v4(),
    application_number VARCHAR(32) NOT NULL,       -- Human-facing un-guessable ID: SCH-2026-XXXXXXXX
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    track_id VARCHAR(64) NOT NULL REFERENCES scholarship_tracks(id) ON DELETE RESTRICT,
    university_id VARCHAR(64) NOT NULL REFERENCES universities(id) ON DELETE RESTRICT,
    major_name VARCHAR(255) NOT NULL,
    degree_level degree_level_enum NOT NULL,
    intake_term VARCHAR(64) NOT NULL,              -- e.g. 'Fall 2026'
    gpa NUMERIC(4, 2) NOT NULL,
    gpa_scale NUMERIC(3, 1) NOT NULL DEFAULT 5.0,
    ielts_score NUMERIC(3, 1),
    toefl_score INT,
    status application_status_enum NOT NULL DEFAULT 'draft',
    current_stage_order INT NOT NULL DEFAULT 1,
    eligibility_decision eligibility_decision_enum NOT NULL DEFAULT 'needs_review',
    eligibility_score INT NOT NULL DEFAULT 0,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    supervisor_notes TEXT,
    financial_guarantee_code VARCHAR(64),
    financial_guarantee_issued_at TIMESTAMPTZ,
    idempotency_key VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_applications PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Partitioned Index Strategy
CREATE INDEX IF NOT EXISTS idx_apps_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_apps_number ON applications(application_number);
CREATE INDEX IF NOT EXISTS idx_apps_track_status ON applications(track_id, status);
CREATE INDEX IF NOT EXISTS idx_apps_status_created ON applications(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_apps_idempotency ON applications(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- Partitions by calendar year
CREATE TABLE IF NOT EXISTS applications_y2025 PARTITION OF applications
    FOR VALUES FROM ('2025-01-01 00:00:00+00') TO ('2026-01-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS applications_y2026 PARTITION OF applications
    FOR VALUES FROM ('2026-01-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS applications_y2027 PARTITION OF applications
    FOR VALUES FROM ('2027-01-01 00:00:00+00') TO ('2028-01-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS applications_default PARTITION OF applications DEFAULT;

-- Application Status History: Complete immutable state machine audit
CREATE TABLE IF NOT EXISTS application_status_history (
    id UUID DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    application_created_at TIMESTAMPTZ NOT NULL,
    from_status application_status_enum,
    to_status application_status_enum NOT NULL,
    changed_by UUID NOT NULL REFERENCES users(id),
    change_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_app_status_history PRIMARY KEY (id, created_at),
    CONSTRAINT fk_history_app FOREIGN KEY (application_id, application_created_at)
        REFERENCES applications (id, created_at) ON DELETE CASCADE
) PARTITION BY RANGE (created_at);

CREATE TABLE IF NOT EXISTS app_status_history_y2026 PARTITION OF application_status_history
    FOR VALUES FROM ('2026-01-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');
CREATE TABLE IF NOT EXISTS app_status_history_default PARTITION OF application_status_history DEFAULT;

-- ============================================================================
-- 5. DOCUMENTS & OBJECT STORAGE DOMAIN
-- ============================================================================
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_id UUID,
    document_type VARCHAR(64) NOT NULL,           -- 'admission_letter', 'transcript', 'passport', 'language_cert'
    file_name VARCHAR(255) NOT NULL,
    storage_key VARCHAR(512) NOT NULL UNIQUE,     -- Object Storage S3 Key
    mime_type VARCHAR(128) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    sha256_checksum VARCHAR(64) NOT NULL,
    status document_status_enum NOT NULL DEFAULT 'pending',
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    ocr_extracted_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_docs_user ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_docs_app ON documents(application_id);
CREATE INDEX IF NOT EXISTS idx_docs_status ON documents(status);

-- ============================================================================
-- 6. ELIGIBILITY ENGINE EVALUATION LOGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS eligibility_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_id VARCHAR(64) NOT NULL REFERENCES scholarship_tracks(id) ON DELETE CASCADE,
    university_id VARCHAR(64) REFERENCES universities(id),
    decision eligibility_decision_enum NOT NULL,
    calculated_score INT NOT NULL,
    matched_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    failed_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    warnings JSONB NOT NULL DEFAULT '[]'::jsonb,
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_eligibility_user_track ON eligibility_evaluations(user_id, track_id);

-- ============================================================================
-- 7. APPOINTMENTS & CULTURAL MISSIONS DOMAIN
-- ============================================================================
CREATE TABLE IF NOT EXISTS cultural_missions (
    id VARCHAR(64) PRIMARY KEY,
    country_code CHAR(2) NOT NULL REFERENCES countries(code),
    city_ar VARCHAR(128) NOT NULL,
    city_en VARCHAR(128) NOT NULL,
    code VARCHAR(32) NOT NULL UNIQUE,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    attache_name_ar VARCHAR(255) NOT NULL,
    attache_name_en VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    emergency_phone VARCHAR(64) NOT NULL,
    working_hours_ar VARCHAR(255) NOT NULL,
    working_hours_en VARCHAR(255),
    address_ar TEXT NOT NULL,
    address_en TEXT,
    active_students_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cultural_mission_id VARCHAR(64) REFERENCES cultural_missions(id),
    appointment_type appointment_type_enum NOT NULL DEFAULT 'academic_advising',
    status appointment_status_enum NOT NULL DEFAULT 'scheduled',
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 30,
    assigned_supervisor_id UUID REFERENCES users(id),
    meeting_link VARCHAR(512),
    location TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_user ON appointments(user_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status, scheduled_at);

-- ============================================================================
-- 8. AUDIT LOGS & SECURITY EVENTS (PARTITIONED FOR HIGH THROUGHPUT)
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT uuid_generate_v4(),
    actor_id UUID,
    actor_role VARCHAR(64),
    action audit_action_enum NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(128),
    ip_address INET,
    user_agent TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_audit_logs PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE IF NOT EXISTS audit_logs_y2026 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-01-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');
CREATE TABLE IF NOT EXISTS audit_logs_default PARTITION OF audit_logs DEFAULT;

CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_logs(resource_type, resource_id);

CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(64) NOT NULL,              -- 'BRUTE_FORCE', 'RATE_LIMIT_EXCEEDED', 'UNAUTHORIZED_ACCESS'
    severity VARCHAR(32) NOT NULL DEFAULT 'WARNING',-- 'INFO', 'WARNING', 'CRITICAL'
    ip_address INET,
    user_id UUID,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sec_events_type_created ON security_events(event_type, created_at DESC);

-- ============================================================================
-- 9. NOTIFICATIONS & SUPPORT DOMAIN
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    content_ar TEXT NOT NULL,
    content_en TEXT NOT NULL,
    type VARCHAR(32) NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

CREATE TABLE IF NOT EXISTS faqs (
    id VARCHAR(64) PRIMARY KEY,
    question_ar TEXT NOT NULL,
    question_en TEXT NOT NULL,
    answer_ar TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    display_order INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category, display_order);

-- ============================================================================
-- 10. SYSTEM SETTINGS & LOCALIZATION
-- ============================================================================
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(128) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
