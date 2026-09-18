# Enterprise Database Documentation & Data Dictionary
## The Custodian of the Two Holy Mosques Scholarship Program

### 1. Entity-Relationship Model (ERD)

```
+-----------------------------------------------------------------------------------+
|                                  ROLES & PERMISSIONS                              |
+-----------------------------------------------------------------------------------+
|  roles (id, name_ar, name_en)                                                     |
|    |                                                                              |
|    +--< role_permissions >-- permissions (id, domain, action)                     |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
|                                     USERS DOMAIN                                  |
+-----------------------------------------------------------------------------------+
|  users (id: UUID, national_id, nafath_uid, email, role, status, ...)              |
|    |                                                                              |
|    +--- 1:1 --- user_profiles (user_id, gpa, gpa_scale, ielts_score, ...)         |
|    +--- 1:N --- user_sessions (id, user_id, token_hash, expires_at)               |
|    +--- 1:N --- appointments (id, user_id, cultural_mission_id, scheduled_at)     |
|    +--- 1:N --- documents (id, user_id, application_id, storage_key, sha256)      |
|    +--- 1:N --- notifications (id, user_id, title, content, is_read)              |
|    +--- 1:N --- applications [PARTITIONED by created_at]                          |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
|                          TRACKS & REQUIREMENTS ENGINE                             |
+-----------------------------------------------------------------------------------+
|  scholarship_tracks (id, code, name_ar, name_en, min_gpa, rank_limit, quota, ...) |
|    |                                                                              |
|    +--- 1:N --- requirement_rules (id, track_id, rule_code, field, operator, val)|
|    +--- 1:N --- applications (track_id)                                           |
|    +--< university_track_accreditations >-- universities                          |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
|                            UNIVERSITIES & ACADEMICS                               |
+-----------------------------------------------------------------------------------+
|  countries (code, name_ar, name_en)                                               |
|    |                                                                              |
|    +--- 1:N --- universities (id, country_code, qs_rank, min_ielts, ...)          |
|    +--- 1:N --- cultural_missions (id, country_code, city_ar, email, ...)         |
|                                                                                   |
|  universities                                                                     |
|    +--- 1:N --- applications (university_id)                                      |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
|                         APPLICATIONS [RANGE PARTITIONED]                          |
+-----------------------------------------------------------------------------------+
|  applications (id: UUID, application_number: SCH-2026-XXXX, user_id, track_id,    |
|                university_id, status, eligibility_decision, created_at: PK)       |
|    |                                                                              |
|    +--- Partitions: applications_y2025, applications_y2026, applications_y2027... |
|    |                                                                              |
|    +--- 1:N --- application_status_history [PARTITIONED by created_at]            |
|    +--- 1:N --- documents (application_id)                                        |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
|                         AUDIT & SECURITY [RANGE PARTITIONED]                      |
+-----------------------------------------------------------------------------------+
|  audit_logs (id: UUID, actor_id, action, resource_type, ip, created_at: PK)       |
|    |                                                                              |
|    +--- Partitions: audit_logs_y2026, audit_logs_default                          |
|                                                                                   |
|  security_events (id: UUID, event_type, severity, ip_address, details)            |
+-----------------------------------------------------------------------------------+
```

---

### 2. High-Volume Partitioning Strategy

| Table Name | Partition Key | Strategy | Rationale & Retention Policy |
| :--- | :--- | :--- | :--- |
| **`applications`** | `created_at` | **RANGE (1 Year)** | Admissions operate on annual cycles (2025, 2026, 2027). Partition pruning ensures that queries targeting the current intake cycle only scan the active ~100k-500k partition instead of millions of historical rows. Past years can be detached or moved to cold storage without locking the table. |
| **`application_status_history`** | `created_at` | **RANGE (1 Year)** | Every status transition (Draft -> Submitted -> Reviewed -> Accepted) creates a row. Over 10M events accumulate over time. Yearly partitioning keeps write throughput high and indexes compact. |
| **`audit_logs`** | `created_at` | **RANGE (1 Year)** | Regulatory compliance requires 5+ years of audit history. Range partitioning allows instantaneous archiving by detaching old partitions (`ALTER TABLE audit_logs DETACH PARTITION audit_logs_y2025`) rather than running expensive `DELETE WHERE created_at < ...` that fragments pages. |

---

### 3. Data Dictionary (Core Tables)

#### Table: `users`
- **`id`**: `UUID` - Primary Key, cryptographic random identifier.
- **`national_id`**: `VARCHAR(10)` - UNIQUE, indexed, validated 10-digit Saudi Civil ID / Iqama.
- **`nafath_uid`**: `VARCHAR(128)` - Federated ID from the National Single Sign-On (Nafath).
- **`role`**: `user_role_enum` - RBAC role (`applicant`, `supervisor`, `admin`, etc.).
- **`status`**: `user_status_enum` - Account lifecycle state (`active`, `suspended`, etc.).

#### Table: `applications`
- **`id`**: `UUID` - Composite Primary Key with `created_at`.
- **`application_number`**: `VARCHAR(32)` - Public reference number formatted as `SCH-2026-XXXXXXXX` (Indexed, non-sequential, unique).
- **`track_id`**: `VARCHAR(64)` - Foreign Key referencing `scholarship_tracks(id)`.
- **`university_id`**: `VARCHAR(64)` - Foreign Key referencing `universities(id)`.
- **`status`**: `application_status_enum` - Workflow state machine (`draft`, `submitted`, `under_review`, `nominated`, `accepted`, `rejected`).
- **`eligibility_decision`**: `eligibility_decision_enum` - Outcome from the dynamic rules engine.
- **`idempotency_key`**: `VARCHAR(128)` - Unique token preventing duplicate submissions from rapid multi-clicks.
- **`created_at`**: `TIMESTAMPTZ` - Partition key and audit timestamp.

#### Table: `requirement_rules`
- **`track_id`**: `VARCHAR(64)` - Foreign key to track.
- **`rule_code`**: `VARCHAR(64)` - Identifier (e.g. `MIN_GPA`, `MAX_QS_RANK`).
- **`field_name`**: `VARCHAR(64)` - Candidate attribute evaluated by the engine.
- **`operator`**: `VARCHAR(16)` - Evaluation logic (`>=`, `<=`, `==`, `IN`, `CONTAINS`).
- **`expected_value`**: `JSONB` - Flexible threshold or value array.
- **`weight`**: `INT` - Weight contributing to total eligibility score (0-100).

---

### 4. Indexing & Query Optimization Matrix

1. **Foreign Keys Indexing**:
   - `idx_apps_user` on `applications(user_id)`: Instant lookup for student portal dashboard.
   - `idx_apps_track_status` on `applications(track_id, status)`: Supervisor quota tracking.
2. **Cursor-Based Pagination Indexes**:
   - `idx_apps_status_created` on `applications(status, created_at DESC)`: Eliminates high-cost `OFFSET N` scans when paginating through 1M+ applications.
3. **Array Search Index**:
   - GIN index on `university_track_accreditations` allows sub-millisecond filtering of universities eligible for specific scholarship tracks.
