-- ============================================================================
-- SEED DATA: CUSTODIAN OF THE TWO HOLY MOSQUES SCHOLARSHIP PROGRAM
-- ============================================================================

-- 1. Roles & Permissions
INSERT INTO roles (id, name_ar, name_en, description) VALUES
('applicant', 'متقدم / مبتعث', 'Applicant / Student', 'Saudi national applying or studying on scholarship'),
('supervisor', 'مشرف أكاديمي', 'Academic Supervisor', 'Oversees admissions, academic audits, and advising'),
('reviewer', 'مدقق وثائق', 'Document Reviewer', 'Verifies transcripts, language scores, and unconditional offers'),
('admin', 'مسؤول المنظومة', 'System Administrator', 'Manages tracks, universities, quotas, and dynamic rules'),
('super_admin', 'مدير عام البرنامج', 'Program Director', 'Full ministerial authority and executive reports')
ON CONFLICT (id) DO NOTHING;

-- 2. Scholarship Tracks (The 6 Strategic Tracks)
INSERT INTO scholarship_tracks (
    id, code, name_ar, name_en, description_ar, description_en, 
    short_description_ar, short_description_en, badge_color, 
    min_gpa, max_age, top_universities_rank_limit, annual_quota, is_active, display_order
) VALUES
(
    'track-pioneers', 'PIONEERS', 
    'مسار الرواد', 'Pioneers Track',
    'ابتعاث مباشر لأفضل 30 جامعة عالمية في كافة التخصصات لدعم القيادات وصناعة الكفاءات الريادية ذات التأثير الممتد.',
    'Direct scholarship to the top 30 global universities across all academic disciplines to foster national future leaders.',
    'أفضل 30 جامعة حول العالم', 'Top 30 Global Universities',
    'emerald', 3.75, 30, 30, 2500, TRUE, 1
),
(
    'track-supply', 'IMDAD', 
    'مسار إمداد', 'Imdad (Supply) Track',
    'تلبية احتياجات سوق العمل الاستراتيجي من خلال أفضل 200 جامعة في تخصصات محددة وفق متطلبات الرؤية وسوق العمل.',
    'Fulfilling strategic workforce demands across top 200 global universities in designated high-demand disciplines.',
    'أفضل 200 جامعة لاحتياجات سوق العمل', 'Top 200 Universities for Labor Market',
    'blue', 3.50, 32, 200, 4000, TRUE, 2
),
(
    'track-rd', 'RD', 
    'مسار البحث والتطوير', 'R&D Track',
    'دعم منظومة الابتكار وأولويات البحث والتطوير الوطنية الأربعة (صحة، استدامة، طاقة وصناعة، اقتصادات المستقبل).',
    'Empowering the national research, development, and innovation ecosystem across the 4 national priorities.',
    'دراسات عليا ومختبرات بحثية رائدة', 'Postgraduate R&D & Advanced Labs',
    'purple', 3.60, 35, 100, 1500, TRUE, 3
),
(
    'track-excellence', 'EXCELLENCE', 
    'مسار التميز المؤسسي', 'Institutional Excellence Track',
    'تطوير الكوادر القيادية والمهنية بالشراكة مع الوزارات والهيئات الحكومية لرفع كفاءة الأداء الوطني والمؤسسي.',
    'Upskilling executive and specialized talents in partnership with government bodies to drive public performance.',
    'برامج تنفيذية وتطوير مهني رفيع', 'Executive & Specialized Programs',
    'amber', 3.25, 45, 150, 1200, TRUE, 4
),
(
    'track-health', 'HEALTH', 
    'مسار التخصصات الصحية والطبية', 'Healthcare & Medical Track',
    'الابتعاث في التخصصات الطبية الدقيقة، الزمالات السريرية، والرعاية الصحية المتقدمة لتعزيز المنظومة الصحية الوطنية.',
    'Medical subspecialties, clinical fellowships, and modern healthcare leadership in premier hospitals worldwide.',
    'تخصصات طبية دقيقة وزمالات سريرية', 'Medical Subspecialties & Fellowships',
    'teal', 3.50, 38, 100, 800, TRUE, 5
),
(
    'track-waed', 'WAED', 
    'مسار واعد', 'Waed (Promising Sectors) Track',
    'توطين الوظائف التخصصية في القطاعات الاستراتيجية الواعدة مثل الطاقة المتجددة، الفضاء، والتعدين والألعاب الإلكترونية.',
    'Targeting emerging industries including aerospace, renewable energy, mining, and interactive technologies.',
    'الصناعات الواعدة والمستقبلية', 'Emerging & Futuristic Sectors',
    'indigo', 3.20, 32, 200, 1000, TRUE, 6
)
ON CONFLICT (id) DO UPDATE SET 
    name_ar = EXCLUDED.name_ar, 
    name_en = EXCLUDED.name_en, 
    min_gpa = EXCLUDED.min_gpa,
    top_universities_rank_limit = EXCLUDED.top_universities_rank_limit;

-- 3. Dynamic Requirement Rules for Tracks (Configurable without changing Code!)
INSERT INTO requirement_rules (
    id, track_id, rule_code, rule_title_ar, rule_title_en, field_name, operator, expected_value, weight, error_message_ar, error_message_en
) VALUES
-- Pioneers Track Rules
('rule-pioneers-gpa', 'track-pioneers', 'MIN_GPA', 'المعدل التراكمي الأدنى', 'Minimum Cumulative GPA', 'gpa', '>=', '{"value": 3.75, "scale": 5.0}', 20, 'المعدل التراكمي لا يستوفي شرط مسار الرواد (3.75 من 5.0)', 'GPA does not meet Pioneers requirement (3.75/5.0)'),
('rule-pioneers-rank', 'track-pioneers', 'MAX_QS_RANK', 'تصنيف الجامعة المعتمد', 'Accredited QS University Rank', 'qsRank', '<=', '{"value": 30}', 35, 'الجامعة ليست ضمن أفضل 30 جامعة عالمياً لمسار الرواد', 'University is not ranked within the Global Top 30 for Pioneers Track'),
('rule-pioneers-ielts', 'track-pioneers', 'MIN_IELTS', 'درجة اختبار الآيلتس', 'Minimum IELTS Academic Score', 'ieltsScore', '>=', '{"value": 7.0}', 15, 'درجة الآيلتس أقل من 7.0 المطلوبة لمسار الرواد', 'IELTS score is below the 7.0 threshold for Pioneers'),
('rule-pioneers-uncond', 'track-pioneers', 'UNCONDITIONAL_OFFER', 'قبول غير مشروط', 'Unconditional Admission Letter', 'admissionType', '==', '{"value": "unconditional"}', 30, 'يشترط مسار الرواد قبولاً نهائياً غير مشروط', 'Pioneers track requires an unconditional admission offer'),

-- Imdad Track Rules
('rule-imdad-gpa', 'track-supply', 'MIN_GPA', 'المعدل التراكمي الأدنى', 'Minimum Cumulative GPA', 'gpa', '>=', '{"value": 3.50, "scale": 5.0}', 25, 'المعدل التراكمي لا يستوفي شرط مسار إمداد (3.50 من 5.0)', 'GPA does not meet Imdad requirement (3.50/5.0)'),
('rule-imdad-rank', 'track-supply', 'MAX_QS_RANK', 'تصنيف الجامعة المعتمد', 'Accredited QS University Rank', 'qsRank', '<=', '{"value": 200}', 30, 'الجامعة خارج نطاق أفضل 200 جامعة معتمدة لمسار إمداد', 'University is outside the Top 200 accredited institutions for Imdad'),
('rule-imdad-ielts', 'track-supply', 'MIN_IELTS', 'درجة اختبار الآيلتس', 'Minimum IELTS Academic Score', 'ieltsScore', '>=', '{"value": 6.5}', 20, 'درجة الآيلتس أقل من 6.5', 'IELTS score is below the 6.5 requirement'),

-- R&D Track Rules
('rule-rd-gpa', 'track-rd', 'MIN_GPA', 'المعدل التراكمي الأدنى', 'Minimum Cumulative GPA', 'gpa', '>=', '{"value": 3.60, "scale": 5.0}', 20, 'المعدل لا يستوفي متطلبات مسار البحث والتطوير (3.60)', 'GPA is below the 3.60 threshold for R&D track'),
('rule-rd-degree', 'track-rd', 'DEGREE_LEVEL', 'المرحلة الأكاديمية للدراسات العليا', 'Postgraduate Degree Level', 'degreeLevel', 'IN', '{"values": ["master", "phd", "fellowship"]}', 30, 'مسار البحث والتطوير مخصص لمرحلتي الماجستير والدكتوراه والزمالة', 'R&D track is reserved for Master, PhD, and Fellowship programs'),
('rule-rd-rank', 'track-rd', 'MAX_QS_RANK', 'تصنيف الجامعة البحثية', 'Research University Rank', 'qsRank', '<=', '{"value": 100}', 30, 'الجامعة خارج قائمة أفضل 100 مركز بحثي عالمي', 'University is outside the Top 100 global research centers')
ON CONFLICT (id) DO UPDATE SET 
    rule_title_ar = EXCLUDED.rule_title_ar,
    expected_value = EXCLUDED.expected_value;

-- 4. Countries
INSERT INTO countries (code, name_ar, name_en, visa_processing_days, cultural_mission_name_ar, cultural_mission_name_en) VALUES
('US', 'الولايات المتحدة الأمريكية', 'United States of America', 25, 'الملحقية الثقافية السعودية بواشنطن', 'Saudi Arabian Cultural Mission in Washington, D.C.'),
('GB', 'المملكة المتحدة', 'United Kingdom', 20, 'الملحقية الثقافية السعودية بلندن', 'Saudi Cultural Bureau in London'),
('CA', 'كندا', 'Canada', 30, 'الملحقية الثقافية السعودية بأوتاوا', 'Saudi Cultural Bureau in Ottawa'),
('AU', 'أستراليا', 'Australia', 25, 'الملحقية الثقافية السعودية بكانبرا', 'Saudi Arabian Cultural Mission in Canberra'),
('DE', 'ألمانيا', 'Germany', 45, 'الملحقية الثقافية السعودية ببرلين', 'Saudi Cultural Bureau in Berlin'),
('FR', 'فرنسا', 'France', 35, 'الملحقية الثقافية السعودية بباريس', 'Saudi Cultural Bureau in Paris'),
('JP', 'اليابان', 'Japan', 20, 'الملحقية الثقافية السعودية بطوكيو', 'Saudi Arabian Cultural Mission in Tokyo'),
('SG', 'سنغافورة', 'Singapore', 15, 'الملحقية الثقافية السعودية بسنغافورة', 'Saudi Cultural Mission in Singapore')
ON CONFLICT (code) DO NOTHING;

-- 5. World-Class Universities
INSERT INTO universities (id, name_ar, name_en, country_code, city_ar, city_en, qs_rank, the_rank, min_ielts, min_toefl, website_url) VALUES
('uni-mit', 'معهد ماساتشوستس للتكنولوجيا (MIT)', 'Massachusetts Institute of Technology (MIT)', 'US', 'كامبريدج، بوسطن', 'Cambridge, MA', 1, 3, 7.0, 100, 'https://www.mit.edu'),
('uni-cambridge', 'جامعة كامبريدج', 'University of Cambridge', 'GB', 'كامبريدج', 'Cambridge', 2, 5, 7.5, 110, 'https://www.cam.ac.uk'),
('uni-oxford', 'جامعة أكسفورد', 'University of Oxford', 'GB', 'أكسفورد', 'Oxford', 3, 1, 7.5, 110, 'https://www.ox.ac.uk'),
('uni-harvard', 'جامعة هارفارد', 'Harvard University', 'US', 'كامبريدج، بوسطن', 'Cambridge, MA', 4, 4, 7.5, 108, 'https://www.harvard.edu'),
('uni-stanford', 'جامعة ستانفورد', 'Stanford University', 'US', 'ستانفورد، كاليفورنيا', 'Stanford, CA', 5, 2, 7.0, 102, 'https://www.stanford.edu'),
('uni-imperial', 'إمبريال كوليدج لندن', 'Imperial College London', 'GB', 'لندن', 'London', 6, 8, 7.0, 100, 'https://www.imperial.ac.uk'),
('uni-eth', 'المعهد الفيدرالي السويسري للتكنولوجيا (ETH Zurich)', 'ETH Zurich', 'DE', 'زيورخ', 'Zurich', 7, 11, 7.0, 100, 'https://ethz.ch'),
('uni-nus', 'جامعة سنغافورة الوطنية', 'National University of Singapore (NUS)', 'SG', 'سنغافورة', 'Singapore', 8, 19, 6.5, 95, 'https://www.nus.edu.sg'),
('uni-ucl', 'كلية لندن الجامعية (UCL)', 'University College London (UCL)', 'GB', 'لندن', 'London', 9, 22, 7.0, 100, 'https://www.ucl.ac.uk'),
('uni-toronto', 'جامعة تورنتو', 'University of Toronto', 'CA', 'تورنتو', 'Toronto', 21, 18, 7.0, 100, 'https://www.utoronto.ca'),
('uni-melbourne', 'جامعة ملبورن', 'University of Melbourne', 'AU', 'ملبورن', 'Melbourne', 14, 37, 6.5, 90, 'https://www.unimelb.edu.au'),
('uni-tokyo', 'جامعة طوكيو', 'University of Tokyo', 'JP', 'طوكيو', 'Tokyo', 28, 29, 6.5, 90, 'https://www.u-tokyo.ac.jp')
ON CONFLICT (id) DO UPDATE SET 
    qs_rank = EXCLUDED.qs_rank,
    min_ielts = EXCLUDED.min_ielts;

-- 6. Accreditations: Connect Universities to Tracks
INSERT INTO university_track_accreditations (university_id, track_id) VALUES
('uni-mit', 'track-pioneers'), ('uni-mit', 'track-rd'), ('uni-mit', 'track-supply'),
('uni-oxford', 'track-pioneers'), ('uni-oxford', 'track-rd'), ('uni-oxford', 'track-supply'),
('uni-harvard', 'track-pioneers'), ('uni-harvard', 'track-rd'), ('uni-harvard', 'track-supply'),
('uni-stanford', 'track-pioneers'), ('uni-stanford', 'track-rd'), ('uni-stanford', 'track-waed'),
('uni-cambridge', 'track-pioneers'), ('uni-cambridge', 'track-rd'), ('uni-cambridge', 'track-supply'),
('uni-imperial', 'track-pioneers'), ('uni-imperial', 'track-rd'), ('uni-imperial', 'track-health'),
('uni-toronto', 'track-pioneers'), ('uni-toronto', 'track-supply'), ('uni-toronto', 'track-health'),
('uni-melbourne', 'track-pioneers'), ('uni-melbourne', 'track-supply'),
('uni-tokyo', 'track-pioneers'), ('uni-tokyo', 'track-rd'), ('uni-tokyo', 'track-waed')
ON CONFLICT DO NOTHING;

-- 7. System Settings
INSERT INTO system_settings (key, value, description) VALUES
('scholarship_intake_status', '{"currentYear": 2026, "portalOpen": true, "applicationCycle": "FALL_2026"}', 'General intake configuration for the scholarship year'),
('financial_guarantee_config', '{"validityDays": 90, "qrVerificationUrl": "https://kasp.moe.gov.sa/verify/fg", "authoritySigner": "Ministry of Education - Overseas Scholarship Agency"}', 'Digital financial guarantee rules'),
('rate_limits', '{"publicRpm": 120, "authRpm": 20, "aiRpm": 30, "uploadRpm": 10}', 'High-scale API rate limits')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
