import { AIProcessingLog, Application, Appointment, NotificationItem, Track, User, University } from '../types';
import { ALL_SIX_TRACKS, UNIVERSITIES_DATABASE } from './scholarshipCatalog';

export const INITIAL_TRACKS: Track[] = ALL_SIX_TRACKS;
export const INITIAL_UNIVERSITIES: University[] = UNIVERSITIES_DATABASE;

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-01',
    nationalId: '1011883399',
    fullName: 'د. عبد العزيز بن إبراهيم الشمري',
    fullNameEn: 'Dr. Abdulaziz Ibrahim Al-Shammari',
    email: 'admin.kasp@moe.gov.sa',
    phone: '+966559876543',
    dateOfBirth: '1983-07-02',
    nationality: 'سعودي',
    gender: 'male',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    lastLogin: '2026-08-31T23:00:00',
    yakeenVerified: true
  },
  {
    id: 'usr-supervisor-02',
    nationalId: '1023948571',
    fullName: 'د. خالد بن فهد العتيبي',
    fullNameEn: 'Dr. Khaled Fahad Al-Otaibi',
    email: 'k.otaibi@moe.gov.sa',
    phone: '+12025550199',
    dateOfBirth: '1978-11-20',
    nationality: 'سعودي',
    gender: 'male',
    role: 'supervisor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    lastLogin: '2026-08-31T22:30:00',
    yakeenVerified: true,
    culturalMission: 'الملحقية الثقافية السعودية في واشنطن (SACM)'
  },
  {
    id: 'usr-content-03',
    nationalId: '1034992811',
    fullName: 'أ. فهد بن ناصر القحطاني',
    fullNameEn: 'Fahad Nasser Al-Qahtani',
    email: 'f.qahtani@moe.gov.sa',
    phone: '+966509988771',
    dateOfBirth: '1990-05-14',
    nationality: 'سعودي',
    gender: 'male',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    lastLogin: '2026-08-31T20:15:00',
    yakeenVerified: true
  },
  {
    id: 'usr-donor-04',
    nationalId: '1088223344',
    fullName: 'أ. نورة عبد الله السبيعي',
    fullNameEn: 'Noura Abdullah Al-Subaie',
    email: 'noura.subaie@hrdf.org.sa',
    phone: '+966541122334',
    dateOfBirth: '1987-03-10',
    nationality: 'سعودي',
    gender: 'female',
    role: 'donor',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    lastLogin: '2026-08-31T18:45:00',
    yakeenVerified: true,
    culturalMission: 'صندوق تنمية الموارد البشرية (هدف)'
  }
];

export const SAMPLE_ADMISSION_LETTERS = [
  {
    id: 'sample-mit-ai',
    titleAr: 'معهد ماساتشوستس للتكنولوجيا (MIT) - ماجستير ذكاء اصطناعي',
    titleEn: 'MIT - Master of Science in Artificial Intelligence',
    universityName: 'Massachusetts Institute of Technology (MIT)',
    universityCountry: 'الولايات المتحدة الأمريكية',
    universityRank: 1,
    major: 'Master of Science in Artificial Intelligence & Machine Learning',
    degreeLevel: 'Master' as const,
    admissionType: 'unconditional' as const,
    startDate: '2026-09-01',
    durationMonths: 24,
    annualTuitionUsd: 59750,
    languageScoreDetected: {
      testType: 'IELTS' as const,
      score: 8.0,
      meetsRequirement: true
    },
    rawText: `MASSACHUSETTS INSTITUTE OF TECHNOLOGY
77 Massachusetts Avenue, Cambridge, MA 02139
OFFICE OF GRADUATE ADMISSIONS

Date: August 15, 2026
Applicant: Sarah Mohammed Al-Qahtani
Application ID: MIT-GRAD-2026-88392

OFFICIAL UNCONDITIONAL ADMISSION LETTER

Dear Ms. Al-Qahtani,

We are pleased to inform you that the Graduate Admissions Committee at MIT has approved your application for admission to the Master of Science in Artificial Intelligence & Machine Learning program within the Department of Electrical Engineering and Computer Science (EECS) for the Fall 2026 Academic Term starting September 1, 2026.

Program Details:
- Degree: Master of Science (M.S.)
- Major: Artificial Intelligence & Machine Learning
- Program Duration: 24 Months (Full-Time)
- Admission Status: UNCONDITIONAL (All academic credentials and English proficiency verified: IELTS Score 8.0).
- Estimated Annual Tuition & Fees: $59,750 USD
- Official University Code: 3514

We look forward to welcoming you to Cambridge.

Sincerely,
Prof. Michael R. Evans
Dean of Graduate Education, MIT`
  },
  {
    id: 'sample-oxford-ppe',
    titleAr: 'جامعة أكسفورد (Oxford) - بكالوريوس الفلسفة والسياسة والاقتصاد',
    titleEn: 'University of Oxford - BA in Philosophy, Politics and Economics (PPE)',
    universityName: 'University of Oxford',
    universityCountry: 'المملكة المتحدة',
    universityRank: 3,
    major: 'Bachelor of Arts in Philosophy, Politics and Economics (PPE)',
    degreeLevel: 'Bachelor' as const,
    admissionType: 'unconditional' as const,
    startDate: '2026-10-05',
    durationMonths: 36,
    annualTuitionUsd: 48500,
    languageScoreDetected: {
      testType: 'IELTS' as const,
      score: 7.5,
      meetsRequirement: true
    },
    rawText: `UNIVERSITY OF OXFORD
University Offices, Wellington Square, Oxford OX1 2JD, United Kingdom
UNDERGRADUATE ADMISSIONS OFFICE

Offer Letter & Certificate of Acceptance
Applicant Name: Sarah Mohammed Al-Qahtani
UCAS ID: 198-472-9188
College: Balliol College

Dear Sarah,

The College and University are delighted to make you an UNCONDITIONAL OFFER to read for the Degree of Bachelor of Arts in Philosophy, Politics and Economics (PPE) beginning Michaelmas Term on 5 October 2026.

Key Course Information:
- Degree Title: Bachelor of Arts (Honours)
- Subject: Philosophy, Politics and Economics
- Expected Duration: 3 Academic Years (36 Months)
- Tuition Fees: £38,550 per annum (~$48,500 USD)
- English Language Requirement: Satisfied via IELTS (Score 7.5 Overall)

Please accept this letter as official confirmation for visa and governmental scholarship sponsorship purposes.

Yours sincerely,
Dr. Fiona C. Bennett
Tutor for Admissions, Balliol College, Oxford`
  },
  {
    id: 'sample-harvard-bio',
    titleAr: 'جامعة هارفارد (Harvard) - دكتوراه الهندسة الحيوية والطب التجديدي',
    titleEn: 'Harvard University - PhD in Bioengineering & Regenerative Medicine',
    universityName: 'Harvard University',
    universityCountry: 'الولايات المتحدة الأمريكية',
    universityRank: 4,
    major: 'Doctor of Philosophy (PhD) in Bioengineering & Regenerative Medicine',
    degreeLevel: 'PhD' as const,
    admissionType: 'unconditional' as const,
    startDate: '2026-09-08',
    durationMonths: 48,
    annualTuitionUsd: 54200,
    languageScoreDetected: {
      testType: 'TOEFL' as const,
      score: 112,
      meetsRequirement: true
    },
    rawText: `HARVARD UNIVERSITY
Graduate School of Arts and Sciences (GSAS)
Smith Campus Center 350, 1350 Massachusetts Avenue, Cambridge, MA 02138

ADMISSION DECISION NOTICE: PhD PROGRAM

Date: August 20, 2026
Student: Sarah Mohammed Al-Qahtani
HUID: 80992314

Dear Sarah,

It gives me immense pleasure to inform you that you have been admitted to the PhD Program in Bioengineering & Regenerative Medicine at Harvard University, starting in the Fall Term on September 8, 2026.

Academic Specifications:
- Program: Doctor of Philosophy in Bioengineering (SEAS/GSAS)
- Duration: 4 Years (48 Months full research track)
- Condition Status: FULL UNCONDITIONAL ACCEPTANCE
- Language Proficiency: Met (TOEFL iBT Score 112)
- Annual Estimated Costs: $54,200 USD

We eagerly anticipate your contributions to Harvard's research labs.

With warmest congratulations,
Emma Dench, Dean of GSAS, Harvard University`
  },
  {
    id: 'sample-stanford-cyber',
    titleAr: 'جامعة ستانفورد (Stanford) - ماجستير الأمن السيبراني والحوسبة السحابية',
    titleEn: 'Stanford University - M.S. in Computer Science (Cybersecurity & Systems)',
    universityName: 'Stanford University',
    universityCountry: 'الولايات المتحدة الأمريكية',
    universityRank: 2,
    major: 'Master of Science in Computer Science - Cybersecurity & Cloud Infrastructure',
    degreeLevel: 'Master' as const,
    admissionType: 'unconditional' as const,
    startDate: '2026-09-22',
    durationMonths: 24,
    annualTuitionUsd: 62400,
    languageScoreDetected: {
      testType: 'TOEFL' as const,
      score: 110,
      meetsRequirement: true
    },
    rawText: `STANFORD UNIVERSITY
School of Engineering - Department of Computer Science
Gates Computer Science Building, Stanford, CA 94305

OFFICIAL LETTER OF GRADUATE ADMISSION

Date: August 18, 2026
Applicant: Sarah Mohammed Al-Qahtani
Stanford ID: 06894412

Dear Sarah,

Congratulations! On behalf of the faculty of the Department of Computer Science, I am delighted to invite you to join Stanford University for graduate study leading to the Master of Science degree in Computer Science with a specialization in Cybersecurity & Cloud Infrastructure starting Autumn Quarter (September 22, 2026).

Program Summary:
- Degree Level: Master of Science (M.S.)
- Area of Focus: Cybersecurity, Cryptography & Cloud Computing
- Duration: 24 Months
- Status: Unconditional Admission
- Tuition & Associated Fees: $62,400 USD per year

Welcome to Stanford Engineering!

Sincerely,
John Mitchell
Chair, Department of Computer Science, Stanford University`
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-9812-sarah',
    applicationNumber: 'KASP-2026-9812',
    userId: 'usr-sarah-01',
    userName: 'سارة محمد القحطاني',
    userNationalId: '1098472918',
    userEmail: 'sarah.qahtani@example.com',
    userPhone: '+966501234567',
    userGpa: 4.85,
    userIelts: 8.0,
    trackId: 'track-pioneers',
    universityName: 'Massachusetts Institute of Technology (MIT)',
    universityCountry: 'الولايات المتحدة الأمريكية',
    universityRank: 1,
    major: 'Master of Science in Artificial Intelligence & Machine Learning',
    degreeLevel: 'Master',
    admissionLetterPath: '/documents/mit_admission_sarah.pdf',
    eligibilityStatus: 'eligible',
    applicationStatus: 'decision_issued',
    progressPercentage: 100,
    financialGuaranteeIssued: true,
    submittedAt: '2026-08-25T10:30:00',
    reviewedBy: 'usr-supervisor-02',
    reviewedByName: 'د. خالد بن فهد العتيبي (الملحقية الثقافية بواشنطن)',
    reviewedAt: '2026-08-29T14:15:00',
    supervisorNotes: 'تمت مراجعة خطاب القبول من MIT والتحقق من التخصص الدقيق ومطابقة السجل الأكاديمي ودرجة الآيلتس (8.0). الطالبة مستوفية لكافة معايير مسار الرواد وتم اعتماد إصدار الضمان المالي الرقمي فوراً.',
    createdAt: '2026-08-25T09:12:00',
    updatedAt: '2026-08-29T14:15:00',
    extractedData: {
      universityName: 'Massachusetts Institute of Technology (MIT)',
      universityCountry: 'الولايات المتحدة الأمريكية',
      universityRank: 1,
      major: 'Master of Science in Artificial Intelligence & Machine Learning',
      degreeLevel: 'Master',
      admissionType: 'unconditional',
      startDate: '2026-09-01',
      durationMonths: 24,
      estimatedAnnualTuitionUsd: 59750,
      languageScoreDetected: {
        testType: 'IELTS',
        score: 8.0,
        meetsRequirement: true
      },
      sponsorMentioned: 'None (Direct Government Sponsor Expected)',
      rawConfidence: 0.99
    },
    documents: [
      {
        id: 'doc-mit-01',
        applicationId: 'app-9812-sarah',
        type: 'admission_letter',
        titleAr: 'خطاب القبول الجامعي غير المشروط (MIT)',
        fileName: 'MIT_Official_Admission_Letter_Sarah.pdf',
        fileSize: '1.4 MB',
        mimeType: 'application/pdf',
        verificationStatus: 'verified',
        verifiedAt: '2026-08-28T11:00:00',
        verifiedBy: 'د. خالد بن فهد العتيبي',
        uploadedAt: '2026-08-25T09:15:00'
      },
      {
        id: 'doc-mit-02',
        applicationId: 'app-9812-sarah',
        type: 'academic_transcript',
        titleAr: 'السجل الأكاديمي الرسمي المعتمد (جامعة الملك سعود)',
        fileName: 'KSU_Official_Transcript_Sarah.pdf',
        fileSize: '2.1 MB',
        mimeType: 'application/pdf',
        verificationStatus: 'verified',
        verifiedAt: '2026-08-28T11:05:00',
        verifiedBy: 'د. خالد بن فهد العتيبي',
        uploadedAt: '2026-08-25T09:18:00'
      },
      {
        id: 'doc-mit-03',
        applicationId: 'app-9812-sarah',
        type: 'language_certificate',
        titleAr: 'شهادة اختبار الآيلتس الأكاديمي (IELTS Academic)',
        fileName: 'IELTS_Certificate_TRF_Sarah.pdf',
        fileSize: '890 KB',
        mimeType: 'application/pdf',
        verificationStatus: 'verified',
        verifiedAt: '2026-08-28T11:10:00',
        verifiedBy: 'د. خالد بن فهد العتيبي',
        uploadedAt: '2026-08-25T09:20:00'
      },
      {
        id: 'doc-mit-04',
        applicationId: 'app-9812-sarah',
        type: 'passport',
        titleAr: 'جواز السفر السعودي ساري المفعول',
        fileName: 'Saudi_Passport_Sarah.pdf',
        fileSize: '1.1 MB',
        mimeType: 'application/pdf',
        verificationStatus: 'verified',
        verifiedAt: '2026-08-28T11:12:00',
        verifiedBy: 'د. خالد بن فهد العتيبي',
        uploadedAt: '2026-08-25T09:22:00'
      }
    ],
    aiProcessingLog: {
      id: 'log-ai-mit-9812',
      applicationId: 'app-9812-sarah',
      applicantName: 'سارة محمد القحطاني',
      universityName: 'Massachusetts Institute of Technology (MIT)',
      ocrRawText: SAMPLE_ADMISSION_LETTERS[0].rawText,
      extractedData: {
        universityName: 'Massachusetts Institute of Technology (MIT)',
        universityCountry: 'الولايات المتحدة الأمريكية',
        universityRank: 1,
        major: 'Master of Science in Artificial Intelligence & Machine Learning',
        degreeLevel: 'Master',
        admissionType: 'unconditional',
        startDate: '2026-09-01',
        durationMonths: 24,
        estimatedAnnualTuitionUsd: 59750,
        languageScoreDetected: {
          testType: 'IELTS',
          score: 8.0,
          meetsRequirement: true
        },
        rawConfidence: 0.99
      },
      recommendation: {
        trackId: 'track-pioneers',
        trackName: 'مسار الرواد',
        trackNameEn: 'Pioneers Track',
        confidence: 0.99,
        eligibility: true,
        criteriaChecks: [
          { rule: 'تصنيف الجامعة الدولي (أفضل 30)', required: 'المرتبة 1 - 30', provided: 'المرتبة 1 عالمياً', passed: true },
          { rule: 'المعدل التراكمي للبكالوريوس', required: '>= 4.5 / 5.0', provided: '4.85 / 5.0', passed: true },
          { rule: 'درجة اختبار اللغة (IELTS)', required: '>= 7.0', provided: '8.0', passed: true },
          { rule: 'نوع القبول', required: 'قبول غير مشروط (Unconditional)', provided: 'غير مشروط', passed: true },
          { rule: 'السن النظامي', required: '<= 35 عاماً', provided: '27 عاماً', passed: true }
        ],
        reasoning: 'الملف مطابق بنسبة 100% لمعايير مسار الرواد مع تصنيف ممتاز وأولوية استراتيجية للذكاء الاصطناعي.'
      },
      confidenceScore: 99.2,
      processingTimeMs: 420,
      status: 'SUCCESS',
      createdAt: '2026-08-25T09:14:00'
    }
  },
  {
    id: 'app-7734-faisal',
    applicationNumber: 'KASP-2026-7734',
    userId: 'usr-faisal-02',
    userName: 'فيصل عبد الرحمن الغامدي',
    userNationalId: '1076543219',
    userEmail: 'faisal.ghamdi@example.com',
    userPhone: '+966551239988',
    userGpa: 4.10,
    userIelts: 7.0,
    trackId: 'track-supply',
    universityName: 'Imperial College London',
    universityCountry: 'المملكة المتحدة',
    universityRank: 6,
    major: 'MSc in Sustainable Energy & Grid Systems',
    degreeLevel: 'Master',
    admissionLetterPath: '/documents/imperial_admission_faisal.pdf',
    eligibilityStatus: 'eligible',
    applicationStatus: 'under_review',
    progressPercentage: 65,
    financialGuaranteeIssued: false,
    submittedAt: '2026-08-29T16:00:00',
    reviewedBy: 'usr-supervisor-02',
    reviewedByName: 'د. خالد بن فهد العتيبي (الملحقية الثقافية في لندن)',
    createdAt: '2026-08-29T15:30:00',
    updatedAt: '2026-08-30T10:00:00',
    extractedData: {
      universityName: 'Imperial College London',
      universityCountry: 'المملكة المتحدة',
      universityRank: 6,
      major: 'MSc in Sustainable Energy & Grid Systems',
      degreeLevel: 'Master',
      admissionType: 'unconditional',
      startDate: '2026-10-01',
      durationMonths: 12,
      estimatedAnnualTuitionUsd: 46000,
      languageScoreDetected: {
        testType: 'IELTS',
        score: 7.0,
        meetsRequirement: true
      },
      rawConfidence: 0.97
    },
    documents: [
      {
        id: 'doc-imp-01',
        applicationId: 'app-7734-faisal',
        type: 'admission_letter',
        titleAr: 'خطاب قبول إمبريال كوليدج لندن',
        fileName: 'Imperial_Offer_Faisal.pdf',
        fileSize: '1.2 MB',
        mimeType: 'application/pdf',
        verificationStatus: 'verified',
        uploadedAt: '2026-08-29T15:35:00'
      }
    ]
  },
  {
    id: 'app-6621-reem',
    applicationNumber: 'KASP-2026-6621',
    userId: 'usr-reem-03',
    userName: 'ريم سلطان الدوسري',
    userNationalId: '1099887766',
    userEmail: 'reem.dossary@example.com',
    userPhone: '+966567788990',
    userGpa: 4.70,
    userIelts: 7.5,
    trackId: 'track-rd',
    universityName: 'Oxford University',
    universityCountry: 'المملكة المتحدة',
    universityRank: 3,
    major: 'DPhil (PhD) in Oncology & Targeted Drug Delivery',
    degreeLevel: 'PhD',
    eligibilityStatus: 'eligible',
    applicationStatus: 'supervisor_approved',
    progressPercentage: 85,
    submittedAt: '2026-08-27T11:40:00',
    createdAt: '2026-08-27T11:00:00',
    updatedAt: '2026-08-30T16:20:00',
    extractedData: {
      universityName: 'University of Oxford',
      universityCountry: 'المملكة المتحدة',
      universityRank: 3,
      major: 'DPhil in Oncology & Targeted Drug Delivery',
      degreeLevel: 'PhD',
      admissionType: 'unconditional',
      startDate: '2026-10-01',
      durationMonths: 36,
      estimatedAnnualTuitionUsd: 52000,
      languageScoreDetected: {
        testType: 'IELTS',
        score: 7.5,
        meetsRequirement: true
      },
      rawConfidence: 0.98
    },
    documents: []
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    userId: 'usr-sarah-01',
    title: 'تم إصدار قرار الابتعاث والضمان المالي الرقمي 🎓',
    content: 'تهانينا يا سارة! تم اعتماد طلب ابتعاثك إلى معهد ماساتشوستس للتكنولوجيا (MIT) في مسار الرواد وإصدار الضمان المالي الرقمي الرسمي.',
    type: 'success',
    isRead: false,
    createdAt: '2026-08-29T14:15:00'
  },
  {
    id: 'notif-02',
    userId: 'usr-sarah-01',
    title: 'اكتمال فحص الذكاء الاصطناعي (AI OCR) ⚡',
    content: 'تم استخراج بيانات خطاب قبول MIT بنسبة ثقة 99.2% ومطابقة الشروط مع مسار الرواد بنجاح.',
    type: 'ai',
    isRead: true,
    createdAt: '2026-08-25T09:14:00'
  },
  {
    id: 'notif-03',
    userId: 'usr-sarah-01',
    title: 'تأكيد حجز موعد استشاري مع الملحقية 📅',
    content: 'تم تأكيد موعدك الاستشاري عبر الاتصال المرئي مع المستشار الأكاديمي د. خالد العتيبي يوم الخميس الساعة 11:00 صباحاً.',
    type: 'appointment',
    isRead: true,
    createdAt: '2026-08-27T10:00:00'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-01',
    userId: 'usr-sarah-01',
    userName: 'سارة محمد القحطاني',
    userNationalId: '1098472918',
    type: 'scholarship_contract',
    subject: 'مناقشة خطة البحث والبدء الأكاديمي في MIT',
    description: 'استفسار عن متطلبات تأشيرة F-1 وترتيبات السكن والتأمين الصحي الفيدرالي في كامبريدج بوسطن.',
    preferredDate: '2026-09-04',
    preferredTime: '11:00',
    status: 'confirmed',
    assignedSupervisorId: 'usr-supervisor-02',
    assignedSupervisorName: 'د. خالد بن فهد العتيبي',
    meetingLink: 'https://meet.moe.gov.sa/sacm-sarah-8821',
    location: 'الملحقية الثقافية بواشنطن (عبر الاتصال المرئي)',
    createdAt: '2026-08-27T10:00:00'
  },
  {
    id: 'apt-02',
    userId: 'usr-faisal-02',
    userName: 'فيصل عبد الرحمن الغامدي',
    userNationalId: '1076543219',
    type: 'visa_inquiry',
    subject: 'متطلبات تأشيرة الطالب البريطانية (Student Visa CAS)',
    description: 'الحاجة إلى خطاب الضمان المالي الموجه للسفارة البريطانية في الرياض.',
    preferredDate: '2026-09-06',
    preferredTime: '14:30',
    status: 'pending',
    assignedSupervisorId: 'usr-supervisor-02',
    assignedSupervisorName: 'د. خالد بن فهد العتيبي',
    location: 'اجتماع رقمي موثق',
    createdAt: '2026-08-30T11:20:00'
  }
];

export const INITIAL_AI_LOGS: AIProcessingLog[] = [
  INITIAL_APPLICATIONS[0].aiProcessingLog!,
  {
    id: 'log-ai-imp-7734',
    applicationId: 'app-7734-faisal',
    applicantName: 'فيصل عبد الرحمن الغامدي',
    universityName: 'Imperial College London',
    ocrRawText: `IMPERIAL COLLEGE LONDON - Department of Electrical and Electronic Engineering. Conditional Offer: MSc in Sustainable Energy & Grid Systems. IELTS 7.0 Verified. Start Date: Oct 2026.`,
    extractedData: {
      universityName: 'Imperial College London',
      universityCountry: 'المملكة المتحدة',
      universityRank: 6,
      major: 'MSc in Sustainable Energy & Grid Systems',
      degreeLevel: 'Master',
      admissionType: 'unconditional',
      startDate: '2026-10-01',
      durationMonths: 12,
      estimatedAnnualTuitionUsd: 46000,
      languageScoreDetected: {
        testType: 'IELTS',
        score: 7.0,
        meetsRequirement: true
      },
      rawConfidence: 0.97
    },
    recommendation: {
      trackId: 'track-supply',
      trackName: 'مسار إمداد',
      trackNameEn: 'Supply Track',
      confidence: 0.97,
      eligibility: true,
      criteriaChecks: [
        { rule: 'تصنيف الجامعة الدولي', required: 'أفضل 200', provided: 'المرتبة 6 عالمياً', passed: true },
        { rule: 'المعدل التراكمي', required: '>= 3.5 / 5.0', provided: '4.10 / 5.0', passed: true },
        { rule: 'الآيلتس', required: '>= 6.5', provided: '7.0', passed: true }
      ],
      reasoning: 'التخصص يلبي متطلبات قطاع الطاقة المتجددة وسلاسل الإمداد في رؤية 2030.'
    },
    confidenceScore: 97.4,
    processingTimeMs: 380,
    status: 'SUCCESS',
    createdAt: '2026-08-29T15:35:00'
  }
];
