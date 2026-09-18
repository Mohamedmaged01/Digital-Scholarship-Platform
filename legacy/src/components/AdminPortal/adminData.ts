import { 
  AdminRole, 
  AdminUser, 
  CmsPage, 
  MediaFile, 
  NewsArticle, 
  ScholarshipCountry, 
  AdminAuditEntry, 
  SystemSettingsState 
} from './adminTypes';

export const ADMIN_ROLE_PERMISSIONS: Record<AdminRole, {
  labelAr: string;
  labelEn: string;
  allowedSections: string[];
  canEdit: boolean;
  canPublish: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
}> = {
  SUPER_ADMIN: {
    labelAr: 'المشرف العام (Super Admin)',
    labelEn: 'Super Administrator',
    allowedSections: ['statistics', 'tracks', 'universities', 'majors', 'countries', 'faqs', 'news', 'pages', 'media', 'ai', 'users', 'audit', 'settings'],
    canEdit: true,
    canPublish: true,
    canManageUsers: true,
    canManageSettings: true
  },
  CONTENT_MANAGER: {
    labelAr: 'مدير المحتوى (Content Manager)',
    labelEn: 'Content Manager',
    allowedSections: ['statistics', 'pages', 'news', 'faqs', 'media'],
    canEdit: true,
    canPublish: true,
    canManageUsers: false,
    canManageSettings: false
  },
  SCHOLARSHIP_MANAGER: {
    labelAr: 'مدير مسارات الابتعاث (Scholarship Manager)',
    labelEn: 'Scholarship Tracks Manager',
    allowedSections: ['statistics', 'tracks', 'countries'],
    canEdit: true,
    canPublish: true,
    canManageUsers: false,
    canManageSettings: false
  },
  UNIVERSITY_MANAGER: {
    labelAr: 'مدير الجامعات والتخصصات (University Manager)',
    labelEn: 'University & Majors Manager',
    allowedSections: ['statistics', 'universities', 'majors', 'countries'],
    canEdit: true,
    canPublish: true,
    canManageUsers: false,
    canManageSettings: false
  },
  FAQ_MANAGER: {
    labelAr: 'مدير الأسئلة الشائعة (FAQ Manager)',
    labelEn: 'FAQ & Inquiries Manager',
    allowedSections: ['faqs'],
    canEdit: true,
    canPublish: true,
    canManageUsers: false,
    canManageSettings: false
  },
  MEDIA_MANAGER: {
    labelAr: 'مدير الوسائط الرقمية (Media Manager)',
    labelEn: 'Digital Media Manager',
    allowedSections: ['media'],
    canEdit: true,
    canPublish: true,
    canManageUsers: false,
    canManageSettings: false
  },
  SEO_MANAGER: {
    labelAr: 'مدير محركات البحث (SEO Manager)',
    labelEn: 'SEO & Metadata Manager',
    allowedSections: ['pages', 'settings'],
    canEdit: true,
    canPublish: true,
    canManageUsers: false,
    canManageSettings: false
  },
  AI_MANAGER: {
    labelAr: 'مدير محركات الذكاء الاصطناعي (AI Manager)',
    labelEn: 'AI & Chatbot Knowledge Manager',
    allowedSections: ['ai', 'statistics'],
    canEdit: true,
    canPublish: true,
    canManageUsers: false,
    canManageSettings: false
  },
  EDITOR: {
    labelAr: 'محرر محتوى (Editor)',
    labelEn: 'Content Editor',
    allowedSections: ['pages', 'news', 'faqs', 'media'],
    canEdit: true,
    canPublish: false, // Cannot publish directly
    canManageUsers: false,
    canManageSettings: false
  },
  VIEWER: {
    labelAr: 'مستعرض / مراقب (Viewer)',
    labelEn: 'Read-only Auditor / Viewer',
    allowedSections: ['statistics', 'tracks', 'universities', 'majors', 'countries', 'faqs', 'news', 'pages', 'media', 'audit'],
    canEdit: false, // Read only!
    canPublish: false,
    canManageUsers: false,
    canManageSettings: false
  }
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-01',
    nameAr: 'د. عبدالإله الغامدي',
    nameEn: 'Dr. Abdulelah Al-Ghamdi',
    email: 'admin.kasp@moe.gov.sa',
    role: 'SUPER_ADMIN',
    department: 'وكالة الوزارة للابتعاث',
    status: 'active',
    lastActive: 'الآن',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'adm-02',
    nameAr: 'أ. فهد الدوسري',
    nameEn: 'Fahad Al-Dossary',
    email: 'f.dossary@moe.gov.sa',
    role: 'CONTENT_MANAGER',
    department: 'الإدارة العامة للاتصال المؤسسي',
    status: 'active',
    lastActive: 'منذ 15 دقيقة'
  },
  {
    id: 'adm-03',
    nameAr: 'د. سارة بنت عبد الله التميمي',
    nameEn: 'Dr. Sarah Al-Tamimi',
    email: 's.tamimi@moe.gov.sa',
    role: 'SCHOLARSHIP_MANAGER',
    department: 'إدارة المسارات الاستراتيجية',
    status: 'active',
    lastActive: 'منذ ساعة'
  },
  {
    id: 'adm-04',
    nameAr: 'م. راشد بن سلطان المري',
    nameEn: 'Eng. Rashid Al-Marri',
    email: 'r.marri@moe.gov.sa',
    role: 'UNIVERSITY_MANAGER',
    department: 'إدارة التصنيف والاعتماد الأكاديمي',
    status: 'active',
    lastActive: 'منذ 3 ساعات'
  },
  {
    id: 'adm-05',
    nameAr: 'أ. هند بنت خالد السديري',
    nameEn: 'Hind Al-Sudairi',
    email: 'h.sudairi@moe.gov.sa',
    role: 'FAQ_MANAGER',
    department: 'مركز خدمة المستفيدين (تواصل)',
    status: 'active',
    lastActive: 'منذ يوم'
  },
  {
    id: 'adm-06',
    nameAr: 'أ. تركي بن صالح الحربي',
    nameEn: 'Turki Al-Harbi',
    email: 't.harbi@moe.gov.sa',
    role: 'MEDIA_MANAGER',
    department: 'الإنتاج الرقمي والإعلامي',
    status: 'active',
    lastActive: 'منذ يومين'
  },
  {
    id: 'adm-07',
    nameAr: 'م. نوف بنت فايز الشهراني',
    nameEn: 'Nouf Al-Shahrani',
    email: 'n.shahrani@moe.gov.sa',
    role: 'AI_MANAGER',
    department: 'إدارة الذكاء الاصطناعي والتحول الرقمي',
    status: 'active',
    lastActive: 'منذ 20 دقيقة'
  },
  {
    id: 'adm-08',
    nameAr: 'أ. خالد بن ماجد الغامدي',
    nameEn: 'Khaled Al-Ghamdi',
    email: 'k.ghamdi@moe.gov.sa',
    role: 'EDITOR',
    department: 'تحرير ونشر المحتوى الأكاديمي',
    status: 'active',
    lastActive: 'منذ 4 ساعات'
  },
  {
    id: 'adm-09',
    nameAr: 'أ. منيرة بنت سعد العجمي',
    nameEn: 'Munira Al-Ajmi',
    email: 'm.ajmi@nazaha.gov.sa',
    role: 'VIEWER',
    department: 'المراجعة والرقابة الداخلية',
    status: 'active',
    lastActive: 'منذ يوم'
  }
];

export const INITIAL_COUNTRIES: ScholarshipCountry[] = [
  {
    id: 'cnt-us',
    nameAr: 'الولايات المتحدة الأمريكية',
    nameEn: 'United States',
    code: 'USA',
    flag: '🇺🇸',
    region: 'Americas',
    approvedUniversitiesCount: 142,
    culturalMissionCity: 'واشنطن العاصمة (Washington D.C.)',
    status: 'active'
  },
  {
    id: 'cnt-uk',
    nameAr: 'المملكة المتحدة',
    nameEn: 'United Kingdom',
    code: 'GBR',
    flag: '🇬🇧',
    region: 'Europe',
    approvedUniversitiesCount: 48,
    culturalMissionCity: 'لندن (London)',
    status: 'active'
  },
  {
    id: 'cnt-au',
    nameAr: 'أستراليا',
    nameEn: 'Australia',
    code: 'AUS',
    flag: '🇦🇺',
    region: 'Asia-Pacific',
    approvedUniversitiesCount: 26,
    culturalMissionCity: 'كانبيرا (Canberra)',
    status: 'active'
  },
  {
    id: 'cnt-ca',
    nameAr: 'كندا',
    nameEn: 'Canada',
    code: 'CAN',
    flag: '🇨🇦',
    region: 'Americas',
    approvedUniversitiesCount: 22,
    culturalMissionCity: 'أوتاوا (Ottawa)',
    status: 'active'
  },
  {
    id: 'cnt-sg',
    nameAr: 'سنغافورة',
    nameEn: 'Singapore',
    code: 'SGP',
    flag: '🇸🇬',
    region: 'Asia-Pacific',
    approvedUniversitiesCount: 3,
    culturalMissionCity: 'سنغافورة (Singapore)',
    status: 'active'
  },
  {
    id: 'cnt-jp',
    nameAr: 'اليابان',
    nameEn: 'Japan',
    code: 'JPN',
    flag: '🇯🇵',
    region: 'Asia-Pacific',
    approvedUniversitiesCount: 12,
    culturalMissionCity: 'طوكيو (Tokyo)',
    status: 'active'
  },
  {
    id: 'cnt-de',
    nameAr: 'ألمانيا',
    nameEn: 'Germany',
    code: 'DEU',
    flag: '🇩🇪',
    region: 'Europe',
    approvedUniversitiesCount: 18,
    culturalMissionCity: 'برلين (Berlin)',
    status: 'active'
  },
  {
    id: 'cnt-fr',
    nameAr: 'فرنسا',
    nameEn: 'France',
    code: 'FRA',
    flag: '🇫🇷',
    region: 'Europe',
    approvedUniversitiesCount: 15,
    culturalMissionCity: 'باريس (Paris)',
    status: 'active'
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-01',
    titleAr: 'إعلان فتح التسجيل في مسار الرواد لبرنامج خادم الحرمين الشريفين للابتعاث',
    titleEn: 'Opening Registration for Pioneers Track in KASP',
    excerptAr: 'تعلن وزارة التعليم عن استمرار القبول المباشر في أفضل 30 جامعة عالمية وفق التصنيفات الدولية المعتمدة.',
    category: 'admission_cycle',
    status: 'published',
    publishedAt: '2026-09-01',
    author: 'وكالة الوزارة للابتعاث',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'news-02',
    titleAr: 'تحديث قائمة الجامعات الموصى بها لمسار البحث والتطوير والابتكار',
    titleEn: 'Updated List of Accredited Universities for R&D Track',
    excerptAr: 'إضافة 14 مركزاً بحثياً وجامعة متخصصة في الذكاء الاصطناعي وتقنيات الطاقة المستدامة.',
    category: 'guidelines',
    status: 'published',
    publishedAt: '2026-08-20',
    author: 'إدارة التصنيف الأكاديمي',
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'news-03',
    titleAr: 'توقيع شراكة تدريبية مبتعثة مع كبرى المؤسسات الصناعية العالمية',
    titleEn: 'Scholarship Training Partnership with Global Industrial Firms',
    excerptAr: 'تعزيز فرص التدريب على رأس العمل لمبتعثي مسار إمداد لربط المخرجات باحتياجات سوق العمل الوطني.',
    category: 'partnership',
    status: 'draft',
    publishedAt: '2026-09-15',
    author: 'الاتصال المؤسسي',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_MEDIA: MediaFile[] = [
  {
    id: 'med-01',
    name: 'kasp_official_emblem_2026.png',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    fileSize: '420 KB',
    fileType: 'image/png',
    extension: 'png',
    altTextAr: 'شعار برنامج خادم الحرمين الشريفين للابتعاث الرسمي',
    altTextEn: 'Official KASP Emblem',
    uploadedAt: '2026-08-15',
    uploadedBy: 'أ. تركي الحربي',
    dimensions: '1200x800'
  },
  {
    id: 'med-02',
    name: 'pioneers_track_guidelines_2026.pdf',
    url: 'https://kasp.moe.gov.sa/docs/pioneers_guidelines.pdf',
    fileSize: '1.8 MB',
    fileType: 'application/pdf',
    extension: 'pdf',
    altTextAr: 'دليل شروط وضوابط مسار الرواد للعام 2026',
    altTextEn: 'Pioneers Track Eligibility Guidelines 2026',
    uploadedAt: '2026-08-28',
    uploadedBy: 'د. سارة التميمي'
  },
  {
    id: 'med-03',
    name: 'saudi_scholars_oxford_ceremony.jpg',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    fileSize: '950 KB',
    fileType: 'image/jpeg',
    extension: 'jpg',
    altTextAr: 'حفل تكريم خريجي برنامج الابتعاث في جامعة أكسفورد',
    altTextEn: 'Oxford University Saudi Scholars Graduation',
    uploadedAt: '2026-07-22',
    uploadedBy: 'أ. تركي الحربي',
    dimensions: '1920x1080'
  }
];

export const INITIAL_CMS_PAGES: CmsPage[] = [
  {
    id: 'page-home',
    slug: 'home',
    titleAr: 'الصفحة الرئيسية لمنصة الابتعاث',
    titleEn: 'KASP Scholarship Home Page',
    descriptionAr: 'البوابة التعريفية الموحدة لبرنامج خادم الحرمين الشريفين للابتعاث',
    status: 'published',
    lastUpdated: '2026-09-10T11:00:00Z',
    author: 'د. عبد العزيز الشمري',
    seoTitle: 'برنامج خادم الحرمين الشريفين للابتعاث | وزارة التعليم',
    seoDescription: 'المنصة الرسمية المعتمدة لبرنامج خادم الحرمين الشريفين للابتعاث - تعرف على المسارات والجامعات والشروط.',
    versions: [
      {
        versionId: 'v1.0',
        savedAt: '2026-08-01T09:00:00Z',
        savedBy: 'د. عبد العزيز الشمري',
        comment: 'النسخة الأولية لإطلاق العام الأكاديمي',
        blocks: []
      },
      {
        versionId: 'v1.1',
        savedAt: '2026-09-10T11:00:00Z',
        savedBy: 'أ. فهد القحطاني',
        comment: 'تحديث شروط القبول وإضافة إحصائيات رؤية 2030',
        blocks: []
      }
    ],
    blocks: [
      {
        id: 'blk-01',
        type: 'Hero',
        title: 'البانر الترحيبي الرئيسي',
        content: 'وجهتك نحو أرقى جامعات العالم لتحقيق طموحات الوطن',
        order: 1,
        config: { showCta: true, ctaText: 'استكشف المسارات الستة' },
        isVisible: true
      },
      {
        id: 'blk-02',
        type: 'Statistics',
        title: 'مؤشرات الأداء الوطنية',
        content: 'أكثر من 14,000 مقعد ابتعاثي ضمن مستهدفات رؤية المملكة 2030',
        order: 2,
        config: { counters: 4, animate: true },
        isVisible: true
      },
      {
        id: 'blk-03',
        type: 'Tracks',
        title: 'استعراض المسارات الستة',
        content: 'مسارات الرواد، إمداد، البحث والتطوير، التميز، الصحي، وواعد',
        order: 3,
        config: { layout: 'grid', showSeats: true },
        isVisible: true
      },
      {
        id: 'blk-04',
        type: 'Universities',
        title: 'الجامعات الموصى بها عالمياً',
        content: 'دليل تفاعلي يبحث في أكثر من 300 جامعة مصنفة عالمياً',
        order: 4,
        config: { filterByTrack: true },
        isVisible: true
      },
      {
        id: 'blk-05',
        type: 'FAQ',
        title: 'الأسئلة الأكثر شيوعاً',
        content: 'إجابات رسمية وموثقة على استفسارات الطلاب وأولياء الأمور',
        order: 5,
        config: { category: 'all', count: 6 },
        isVisible: true
      },
      {
        id: 'blk-06',
        type: 'CTA',
        title: 'الدعوة للتقديم الرسمي',
        content: 'التقديم متاح إلكترونياً عبر بوابة الابتعاث الموحدة kasp.moe.gov.sa',
        order: 6,
        config: { buttonUrl: 'https://kasp.moe.gov.sa' },
        isVisible: true
      }
    ]
  },
  {
    id: 'page-about',
    slug: 'about',
    titleAr: 'عن برنامج خادم الحرمين الشريفين',
    titleEn: 'About KASP Program',
    descriptionAr: 'نبذة تاريخية واستراتيجية عن البرنامج وركائزه ضمن رؤية 2030',
    status: 'published',
    lastUpdated: '2026-08-15T14:30:00Z',
    author: 'أ. فهد القحطاني',
    versions: [],
    blocks: [
      {
        id: 'blk-ab-01',
        type: 'Hero',
        title: 'رؤية ورسالة البرنامج',
        content: 'الاستثمار في رأس المال البشري السعودي عبر الابتعاث لأرقى المؤسسات العالمية',
        order: 1,
        config: {},
        isVisible: true
      },
      {
        id: 'blk-ab-02',
        type: 'Timeline',
        title: 'محطات تطور الابتعاث الخارجي',
        content: 'من البدايات حتى إطلاق استراتيجية برنامج خادم الحرمين الشريفين المحدثة',
        order: 2,
        config: {},
        isVisible: true
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AdminAuditEntry[] = [
  {
    id: 'aud-101',
    timestamp: '2026-09-14 22:45:10',
    actorName: 'د. عبد العزيز الشمري',
    actorRole: 'SUPER_ADMIN',
    action: 'PUBLISH',
    targetEntity: 'الصفحة الرئيسية (page-home)',
    details: 'نشر التحديث رقم 1.1 لمتطلبات العام الأكاديمي',
    ipAddress: '10.240.12.88',
    previousValue: 'Draft v1.1',
    newValue: 'Published v1.1'
  },
  {
    id: 'aud-102',
    timestamp: '2026-09-14 19:12:04',
    actorName: 'د. سارة التميمي',
    actorRole: 'SCHOLARSHIP_MANAGER',
    action: 'UPDATE',
    targetEntity: 'مسار الرواد (track-pioneers)',
    details: 'تعديل الحد الأدنى لدرجة اختبار الآيلتس إلى 7.0 وإتاحة القبول المباشر',
    ipAddress: '10.240.14.21',
    previousValue: 'IELTS: 7.5',
    newValue: 'IELTS: 7.0'
  },
  {
    id: 'aud-103',
    timestamp: '2026-09-14 16:30:00',
    actorName: 'أ. فهد القحطاني',
    actorRole: 'CONTENT_MANAGER',
    action: 'CREATE',
    targetEntity: 'خبر صحفي (news-03)',
    details: 'إنشاء مسودة خبر شراكة تدريبية مبتعثة جديدة',
    ipAddress: '10.240.18.5',
    newValue: 'Status: Draft'
  },
  {
    id: 'aud-104',
    timestamp: '2026-09-14 11:20:15',
    actorName: 'أ. تركي الحربي',
    actorRole: 'MEDIA_MANAGER',
    action: 'CREATE',
    targetEntity: 'وسائط رقمية (med-02)',
    details: 'رفع دليل شروط مسار الرواد بصيغة PDF والتحقق الأمني',
    ipAddress: '10.240.22.40',
    newValue: 'File: pioneers_guidelines.pdf'
  },
  {
    id: 'aud-105',
    timestamp: '2026-09-13 14:05:32',
    actorName: 'د. عبد العزيز الشمري',
    actorRole: 'SUPER_ADMIN',
    action: 'ROLLBACK',
    targetEntity: 'الصفحة الرئيسية (page-home)',
    details: 'التراجع إلى النسخة v1.0 لإعادة مراجعة البانر الترويجي',
    ipAddress: '10.240.12.88',
    previousValue: 'Version 1.1',
    newValue: 'Version 1.0 (Restored)'
  }
];

export const INITIAL_SETTINGS: SystemSettingsState = {
  siteTitleAr: 'منصة برنامج خادم الحرمين الشريفين للابتعاث',
  siteTitleEn: 'The Custodian of the Two Holy Mosques Scholarship Program',
  maintenanceMode: false,
  officialApplicationUrl: 'https://kasp.moe.gov.sa',
  supportEmail: 'scholarships@moe.gov.sa',
  hotlinePhone: '19996',
  allowPublicAiChat: true,
  cacheTtlSeconds: 3600
};
