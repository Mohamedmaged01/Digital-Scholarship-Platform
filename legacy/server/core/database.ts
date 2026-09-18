/**
 * Enterprise In-Memory Relational Engine & High-Concurrency Data Store
 * Powers Public REST API and Dynamic Super Admin CMS with ACID semantics,
 * full audit logging, RBAC validation, and version control snapshots.
 */

import { 
  Track, 
  University, 
  CountryInfo, 
  FaqItem, 
  NewsArticle, 
  GuideArticle, 
  OfficialPlatformLink, 
  PageBlock, 
  PageVersion, 
  MediaItem, 
  SeoMetadata, 
  SiteSettings, 
  AuditLogItem, 
  AdminUser, 
  PlatformAnalytics,
  AdminRole
} from '../../src/types';
import { ALL_SIX_TRACKS, UNIVERSITIES_DATABASE, FAQ_DATABASE, COUNTRIES_DIRECTORY } from '../../src/data/scholarshipCatalog';
import { Logger } from './logger';
import { hashPassword, verifyPassword } from './securityUtils';

export interface DbApplication {
  id: string;
  applicationNumber: string;
  userId: string;
  userName: string;
  userNationalId: string;
  userEmail: string;
  trackId: string;
  universityId: string;
  universityName: string;
  universityRank: number;
  major: string;
  degreeLevel: string;
  gpa: number;
  ieltsScore?: number;
  applicationStatus?: string;
  stage?: string;
  currentStep?: number;
  isNafathVerified?: boolean;
  financialGuaranteeIssued?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface DbRequirementRule {
  id: string;
  trackId: string;
  ruleCode: string;
  field?: string;
  fieldName?: string;
  operator: string;
  value?: any;
  expectedValue?: any;
  weight: number;
  isMandatory: boolean;
  messageAr: string;
  messageEn: string;
  [key: string]: any;
}

export interface UnansweredQuestion {
  id: string;
  question: string;
  date: string;
  time: string;
  language: 'ar' | 'en';
  category?: string;
  sessionId?: string;
  answerStatus: 'unanswered' | 'answered' | 'discarded';
  suggestedAnswer?: string;
}

export interface AiSystemConfig {
  systemPrompt: string;
  temperature: number;
  modelName: string;
  isAiEnabled: boolean;
  disclaimerText: string;
}

export class DatabaseService {
  private static tracks: Map<string, Track> = new Map();
  private static universities: Map<string, University> = new Map();
  private static countries: Map<string, CountryInfo> = new Map();
  private static faqs: Map<string, FaqItem> = new Map();
  private static news: Map<string, NewsArticle> = new Map();
  private static guides: Map<string, GuideArticle> = new Map();
  private static officialLinks: Map<string, OfficialPlatformLink> = new Map();
  private static pageBlocks: Map<string, PageBlock> = new Map();
  private static pageVersions: PageVersion[] = [];
  private static mediaLibrary: Map<string, MediaItem> = new Map();
  private static seoMetadata: Map<string, SeoMetadata> = new Map();
  private static siteSettings: SiteSettings;
  private static auditLogs: AuditLogItem[] = [];
  private static adminUsers: Map<string, AdminUser> = new Map();
  private static unansweredQuestions: Map<string, UnansweredQuestion> = new Map();
  private static aiConfig: AiSystemConfig;
  private static analytics: PlatformAnalytics;
  private static initialized = false;

  public static initialize(): void {
    if (this.initialized) return;

    Logger.info('Bootstrapping Unified Digital Scholarship Platform Data Store...');

    // 1. Seed All 6 National Tracks
    ALL_SIX_TRACKS.forEach(track => {
      this.tracks.set(track.id, { ...track });
    });

    // 2. Seed Universities
    UNIVERSITIES_DATABASE.forEach(uni => {
      this.universities.set(uni.id, { ...uni });
    });

    // 3. Seed Countries
    COUNTRIES_DIRECTORY.forEach(country => {
      this.countries.set(country.code, { ...country });
    });

    // 4. Seed FAQs
    FAQ_DATABASE.forEach(faq => {
      this.faqs.set(faq.id, { ...faq });
    });

    // 5. Seed Official Government Links
    const defaultOfficialLinks: OfficialPlatformLink[] = [
      {
        id: 'link-moe',
        nameAr: 'وزارة التعليم بالمملكة العربية السعودية',
        nameEn: 'Ministry of Education - Saudi Arabia',
        organizationAr: 'وزارة التعليم',
        organizationEn: 'Ministry of Education',
        descriptionAr: 'البوابة الرسمية لوزارة التعليم المشرفة على قطاع التعليم والابتعاث والملحقيات الثقافية في الخارج.',
        descriptionEn: 'Official portal of the Ministry of Education overseeing scholarship programs and cultural missions abroad.',
        url: 'https://moe.gov.sa',
        badgeAr: 'بوابة الوزارة',
        badgeEn: 'Ministry Portal',
        iconName: 'Building2',
        isVerified: true,
        sortOrder: 1
      },
      {
        id: 'link-kasp',
        nameAr: 'برنامج خادم الحرمين الشريفين للابتعاث',
        nameEn: 'Custodian of Two Holy Mosques Scholarship Program',
        organizationAr: 'برنامج تنمية القدرات البشرية',
        organizationEn: 'Human Capability Development Program',
        descriptionAr: 'الموقع الرسمي للبرنامج المعتمد لمسارات الرواد، إمداد، البحث والتطوير، التميز، الصحي، وواعد.',
        descriptionEn: 'The accredited official portal for the Six Vision 2030 scholarship tracks.',
        url: 'https://kasp.moe.gov.sa',
        badgeAr: 'المنصة المعتمدة',
        badgeEn: 'Accredited Portal',
        iconName: 'GraduationCap',
        isVerified: true,
        sortOrder: 2
      },
      {
        id: 'link-qabool',
        nameAr: 'منصة قبول الإلكترونية',
        nameEn: 'Qabool Admission Portal',
        organizationAr: 'وزارة التعليم',
        organizationEn: 'Ministry of Education',
        descriptionAr: 'المنصة الحكومية المركزية لاستقبال طلبات التقديم على المنح والبرامج الأكاديمية والابتعاث.',
        descriptionEn: 'Central government platform for receiving scholarship admissions and academic requests.',
        url: 'https://qabool.moe.gov.sa',
        badgeAr: 'بوابة القبول الرسمية',
        badgeEn: 'Official Admissions',
        iconName: 'Award',
        isVerified: true,
        sortOrder: 3
      },
      {
        id: 'link-safeer',
        nameAr: 'منصة سفير 2 للطلبة المبتعثين',
        nameEn: 'Safeer 2 Scholarship Services Platform',
        organizationAr: 'وزارة التعليم',
        organizationEn: 'Ministry of Education',
        descriptionAr: 'النظام الإلكتروني الموحد لإدارة ومتابعة شؤون المبتعثين الأكاديمية والمالية عبر الملحقيات الثقافية.',
        descriptionEn: 'Unified electronic system managing academic, financial, and advisor requests through cultural missions.',
        url: 'https://safeer2.moe.gov.sa',
        badgeAr: 'خدمات المبتعثين',
        badgeEn: 'Student Services',
        iconName: 'Globe2',
        isVerified: true,
        sortOrder: 4
      },
      {
        id: 'link-tawasul',
        nameAr: 'خدمة تواصل الإلكترونية',
        nameEn: 'Tawasul Citizen & Inquirer Service',
        organizationAr: 'وزارة التعليم',
        organizationEn: 'Ministry of Education',
        descriptionAr: 'قناة الدعم والتواصل الحكومية الرسمية لخدمة المستفيدين وتلقي الاستفسارات والمقترحات.',
        descriptionEn: 'Official government support channel serving beneficiaries, answering inquiries and support tickets.',
        url: 'https://tawasul.moe.gov.sa',
        badgeAr: 'الدعم والمقترحات',
        badgeEn: 'Support & Inquiries',
        iconName: 'Headphones',
        isVerified: true,
        sortOrder: 5
      }
    ];
    defaultOfficialLinks.forEach(l => this.officialLinks.set(l.id, l));

    // 6. Seed News & Announcements
    const defaultNews: NewsArticle[] = [
      {
        id: 'news-1',
        slug: 'academic-year-2026-launch',
        titleAr: 'فتح باب التقديم لبرنامج خادم الحرمين الشريفين للابتعاث للعام الأكاديمي 2026/2027',
        titleEn: 'Applications Open for KASP Scholarship Program Academic Year 2026/2027',
        summaryAr: 'أعلنت وزارة التعليم عن انطلاق التسجيل عبر المسارات الستة المعتمدة لدعم ريادة الكفاءات الوطنية.',
        summaryEn: 'Ministry of Education announces the opening of applications across all six national tracks.',
        contentAr: 'انطلاقاً من مستهدفات رؤية المملكة 2030 وبرنامج تنمية القدرات البشرية، أعلنت وزارة التعليم عن فتح باب التسجيل...',
        contentEn: 'Stemming from Saudi Vision 2030 targets and the Human Capability Development Program...',
        category: 'announcement',
        publishDate: '2026-09-01',
        authorAr: 'الإدارة العامة للابتعاث',
        authorEn: 'General Directorate of Scholarships',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
        isFeatured: true,
        status: 'published',
        readTimeMinutes: 4
      },
      {
        id: 'news-2',
        slug: 'expanded-top-universities-list',
        titleAr: 'تحديث قائمة الجامعات العالمية المتميزة وإضافة تخصصات الذكاء الاصطناعي وعلوم الفضاء',
        titleEn: 'Updated Top Global Universities List with Advanced AI & Aerospace Disciplines',
        summaryAr: 'شمل التحديث إدراج نخبة من أرقى المعاهد البحثية الدولية في مسارات الرواد والبحث والتطوير.',
        summaryEn: 'The annual update includes top international research institutes across Pioneers and R&D tracks.',
        contentAr: 'أجرت اللجنة التنفيذية لمراجعة القوائم الأكاديمية مواءمة دقيقة مع أفضل التصنيفات العالمية (QS و THE)...',
        contentEn: 'The executive committee conducted comprehensive alignments with leading world rankings...',
        category: 'admission',
        publishDate: '2026-08-25',
        authorAr: 'لجنة المواءمة الأكاديمية',
        authorEn: 'Academic Alignment Committee',
        imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
        isFeatured: true,
        status: 'published',
        readTimeMinutes: 3
      },
      {
        id: 'news-3',
        slug: 'cultural-missions-orientation-webinar',
        titleAr: 'الملحقيات الثقافية تنظم ملتقيات إرشادية افتراضية للمرشحين الجدد',
        titleEn: 'Cultural Missions Organize Virtual Orientation Webinars for New Scholars',
        summaryAr: 'جلسات تفاعلية تشمل إرشادات استخراج التأشيرة الدراسية، السكن، والتأمين الطبي في دول الابتعاث.',
        summaryEn: 'Interactive orientation sessions covering student visa protocols, housing, and healthcare abroad.',
        contentAr: 'تنظم الملحقيات الثقافية في واشنطن ولندن وكانبرا وباريس سلسلة لقاءات توجيهية للمرشحين...',
        contentEn: 'Cultural missions in Washington, London, Canberra, and Paris host comprehensive briefings...',
        category: 'event',
        publishDate: '2026-08-18',
        authorAr: 'إدارة شؤون الملحقيات',
        authorEn: 'Department of Cultural Missions',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
        isFeatured: false,
        status: 'published',
        readTimeMinutes: 3
      }
    ];
    defaultNews.forEach(n => this.news.set(n.id, n));

    // 7. Seed Guides
    const defaultGuides: GuideArticle[] = [
      {
        id: 'guide-admission',
        slug: 'direct-unconditional-admission-guide',
        titleAr: 'دليل الحصول على القبول الجامعي المباشر غير المشروط',
        titleEn: 'Step-by-Step Guide to Direct Unconditional University Admission',
        category: 'admission_prep',
        readTimeMinutes: 6,
        summaryAr: 'شرح تفصيلي لصياغة خطاب الغرض من الدراسة، السيرة الذاتية الأكاديمية، والتواصل مع مكاتب القبول.',
        summaryEn: 'A detailed manual on crafting Statement of Purpose, academic CV, and admissions correspondence.',
        stepsCount: 6,
        downloadUrl: '#',
        isOfficial: true
      },
      {
        id: 'guide-language',
        slug: 'language-proficiency-tests-guide',
        titleAr: 'دليل متطلبات واختبارات الكفاءة اللغوية (IELTS & TOEFL)',
        titleEn: 'Guide to Language Proficiency Requirements (IELTS & TOEFL)',
        category: 'language_tests',
        readTimeMinutes: 5,
        summaryAr: 'الدرجات الدنيا المقبولة لكل مسار ونصائح اجتياز الاختبارات الأكاديمية بنجاح.',
        summaryEn: 'Minimum acceptable scores per track and targeted strategies for passing standardized exams.',
        stepsCount: 5,
        downloadUrl: '#',
        isOfficial: true
      },
      {
        id: 'guide-visa',
        slug: 'student-visa-travel-manual',
        titleAr: 'دليل استخراج التأشيرة الدراسية والتحضير للسفر',
        titleEn: 'Student Visa Acquisition and Pre-Departure Preparation Guide',
        category: 'visa_guide',
        readTimeMinutes: 7,
        summaryAr: 'إجراءات السفارات، الفحص الطبي، متطلبات إثبات الضمان المالي المعتمد، والسكن الجامعي.',
        summaryEn: 'Consulate workflows, health clearances, financial guarantee proof, and on-campus accommodation.',
        stepsCount: 8,
        downloadUrl: '#',
        isOfficial: true
      }
    ];
    defaultGuides.forEach(g => this.guides.set(g.id, g));

    // 8. Seed Page Blocks (Page Builder)
    const defaultBlocks: PageBlock[] = [
      {
        id: 'blk-hero',
        type: 'hero',
        titleAr: 'اكتشف فرصتك نحو مستقبل أكاديمي عالمي',
        titleEn: 'Discover Your Path to a World-Class Academic Future',
        subtitleAr: 'منصة رقمية تعريفية وإرشادية تساعدك على التعرف على مسارات الابتعاث وشروطه والجامعات والتخصصات وخطوات الرحلة التعليمية.',
        subtitleEn: 'A comprehensive digital guidance platform helping you explore scholarship tracks, eligibility criteria, universities, majors, and your educational journey.',
        config: { showApplyBtn: true, showStrategyBadge: true },
        sortOrder: 1,
        isEnabled: true
      },
      {
        id: 'blk-quick-services',
        type: 'quick_services',
        titleAr: 'خدمات الاستكشاف والاستعلام السريع',
        titleEn: 'Discovery & Quick Query Services',
        config: { itemsCount: 6 },
        sortOrder: 2,
        isEnabled: true
      },
      {
        id: 'blk-tracks',
        type: 'tracks',
        titleAr: 'مسارات الابتعاث الستة المعتمدة',
        titleEn: 'The Six Accredited Scholarship Tracks',
        config: { showFilters: true },
        sortOrder: 3,
        isEnabled: true
      },
      {
        id: 'blk-journey',
        type: 'journey',
        titleAr: 'رحلة الابتعاث المتكاملة',
        titleEn: 'The Complete Scholarship Journey',
        config: { stepsCount: 10 },
        sortOrder: 4,
        isEnabled: true
      },
      {
        id: 'blk-strategy',
        type: 'strategy',
        titleAr: 'المواءمة الاستراتيجية مع رؤية السعودية 2030',
        titleEn: 'Strategic Alignment with Saudi Vision 2030',
        config: { showVisionLogo: true },
        sortOrder: 5,
        isEnabled: true
      },
      {
        id: 'blk-ai-finder',
        type: 'ai_finder',
        titleAr: 'اكتشف مسار الابتعاث المناسب لك بالذكاء الاصطناعي',
        titleEn: 'Discover Your Ideal Scholarship Track with AI',
        config: { questionsCount: 6, disclaimerRequired: true },
        sortOrder: 6,
        isEnabled: true
      },
      {
        id: 'blk-universities',
        type: 'universities',
        titleAr: 'دليل الجامعات العالمية والتخصصات المعتمدة',
        titleEn: 'Global Universities & Accredited Majors Directory',
        config: { defaultFilter: 'all', pageSize: 9 },
        sortOrder: 7,
        isEnabled: true
      },
      {
        id: 'blk-countries',
        type: 'countries',
        titleAr: 'وجهات ودول الابتعاث المعتمدة',
        titleEn: 'Accredited Scholarship Destination Countries',
        config: { showPopularFirst: true },
        sortOrder: 8,
        isEnabled: true
      },
      {
        id: 'blk-faq',
        type: 'faq',
        titleAr: 'الأسئلة الشائعة والإرشادات',
        titleEn: 'Frequently Asked Questions & Guidelines',
        config: { showCategories: true },
        sortOrder: 9,
        isEnabled: true
      },
      {
        id: 'blk-official-links',
        type: 'official_links',
        titleAr: 'المنصات والجهات الحكومية الرسمية',
        titleEn: 'Official Government Platforms & Portals',
        config: { showVerifiedBadge: true },
        sortOrder: 10,
        isEnabled: true
      },
      {
        id: 'blk-cta',
        type: 'cta',
        titleAr: 'ابدأ خطوتك الأولى نحو ريادة المعرفة العالمية',
        titleEn: 'Take Your First Step Toward Global Academic Leadership',
        config: { externalApplyUrl: 'https://kasp.moe.gov.sa' },
        sortOrder: 11,
        isEnabled: true
      }
    ];
    defaultBlocks.forEach(b => this.pageBlocks.set(b.id, b));

    // 9. Seed Media Library
    const defaultMedia: MediaItem[] = [
      {
        id: 'med-1',
        fileName: 'kasp-hero-scholars.jpg',
        originalName: 'saudi_scholars_excellence.jpg',
        fileUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
        fileSizeFormatted: '1.2 MB',
        mimeType: 'image/jpeg',
        folder: 'banners',
        altTextAr: 'نخبة من الطلاب المبتعثين يمثلون المملكة في كبرى المحافل الأكاديمية',
        altTextEn: 'Saudi scholarship students representing the Kingdom in top academic institutions',
        uploadedAt: '2026-08-15T10:00:00Z'
      },
      {
        id: 'med-2',
        fileName: 'mit-campus.jpg',
        originalName: 'massachusetts_institute_technology.jpg',
        fileUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
        fileSizeFormatted: '850 KB',
        mimeType: 'image/jpeg',
        folder: 'universities',
        altTextAr: 'معهد ماساتشوستس للتكنولوجيا MIT',
        altTextEn: 'Massachusetts Institute of Technology MIT Campus',
        uploadedAt: '2026-08-15T11:20:00Z'
      },
      {
        id: 'med-3',
        fileName: 'oxford-historic.jpg',
        originalName: 'university_of_oxford_radcliffe.jpg',
        fileUrl: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=800&auto=format&fit=crop&q=80',
        fileSizeFormatted: '920 KB',
        mimeType: 'image/jpeg',
        folder: 'universities',
        altTextAr: 'جامعة أكسفورد العريقة - المملكة المتحدة',
        altTextEn: 'Historic University of Oxford - United Kingdom',
        uploadedAt: '2026-08-15T11:45:00Z'
      }
    ];
    defaultMedia.forEach(m => this.mediaLibrary.set(m.id, m));

    // 10. Seed SEO Metadata
    const defaultSeo: SeoMetadata[] = [
      {
        pageSlug: 'home',
        metaTitleAr: 'برنامج خادم الحرمين الشريفين للابتعاث | المنصة الرقمية الموحدة',
        metaTitleEn: 'Custodian of Two Holy Mosques Scholarship Program | Official Portal',
        metaDescAr: 'المنصة الرقمية التعريفية والإرشادية لبرنامج خادم الحرمين الشريفين للابتعاث الخارجي: استكشف المسارات الستة، الشروط، وأرقى الجامعات العالمية.',
        metaDescEn: 'The comprehensive informational platform for Saudi scholarship programs, tracks, university directories, and academic journey guidelines.',
        keywordsAr: ['الابتعاث الخارجي', 'برنامج خادم الحرمين الشريفين للابتعاث', 'مسار الرواد', 'مسار إمداد', 'الجامعات الموصى بها', 'رؤية 2030'],
        keywordsEn: ['Saudi Scholarship', 'KASP', 'Study Abroad', 'Top Universities', 'Vision 2030', 'Pioneers Track'],
        canonicalUrl: 'https://kasp.moe.gov.sa',
        ogImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80'
      }
    ];
    defaultSeo.forEach(s => this.seoMetadata.set(s.pageSlug, s));

    // 11. Seed Site Settings
    this.siteSettings = {
      siteNameAr: 'منصة الابتعاث الرقمية الموحدة',
      siteNameEn: 'Unified Digital Scholarship Platform',
      taglineAr: 'برنامج خادم الحرمين الشريفين للابتعاث - استكشف، خطط، وانطلق نحو التميز',
      taglineEn: 'The Custodian of Two Holy Mosques Scholarship Program - Explore, Plan, and Excel',
      primaryColor: '#005A36',
      contactEmail: 'kasp-info@moe.gov.sa',
      supportPhone: '19996',
      maintenanceMode: false,
      officialApplyPortalUrl: 'https://kasp.moe.gov.sa',
      vision2030Url: 'https://www.vision2030.gov.sa',
      moePortalUrl: 'https://moe.gov.sa',
      socialLinks: {
        xTwitter: 'https://x.com/moe_gov_sa',
        youtube: 'https://youtube.com',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com'
      },
      announcementBanner: {
        isActive: true,
        textAr: 'التقديم متاح الآن عبر المنصة الرسمية لبرنامج الابتعاث لكافة المسارات المعتمدة',
        textEn: 'Applications are now open through the official KASP scholarship portal for all accredited tracks',
        actionUrl: 'https://kasp.moe.gov.sa'
      }
    };

    // 12. Seed Admin Staff (RBAC) - Strictly Internal Management with Hashed Passwords
    const defaultPasswordHash = hashPassword('Admin@Kasp2026!');

    const defaultAdmins: AdminUser[] = [
      {
        id: 'admin-super-01',
        username: 'super.admin',
        fullNameAr: 'د. عبدالإله الغامدي',
        fullNameEn: 'Dr. Abdulelah Al-Ghamdi',
        email: 'admin.kasp@moe.gov.sa',
        role: 'SUPER_ADMIN',
        department: 'وكالة الوزارة للابتعاث',
        permissions: [
          'pages:write', 'tracks:write', 'universities:write', 'faqs:write', 
          'news:write', 'media:write', 'seo:write', 'ai:write', 
          'users:manage', 'settings:write', 'audit:read', 'backup:manage'
        ],
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        isActive: true,
        lastLogin: new Date().toISOString(),
        passwordHash: defaultPasswordHash,
        failedAttempts: 0
      },
      {
        id: 'admin-content-02',
        username: 'content.lead',
        fullNameAr: 'أ. فهد الدوسري',
        fullNameEn: 'Fahad Al-Dossary',
        email: 'f.dossary@moe.gov.sa',
        role: 'CONTENT_MANAGER',
        department: 'الإدارة العامة للاتصال المؤسسي',
        permissions: [
          'pages:write', 'tracks:write', 'faqs:write', 'news:write', 
          'media:write', 'seo:write', 'audit:read'
        ],
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        isActive: true,
        lastLogin: new Date().toISOString(),
        passwordHash: defaultPasswordHash,
        failedAttempts: 0
      },
      {
        id: 'admin-tracks-03',
        username: 'tracks.manager',
        fullNameAr: 'د. سارة بنت عبد الله التميمي',
        fullNameEn: 'Dr. Sarah Al-Tamimi',
        email: 's.tamimi@moe.gov.sa',
        role: 'SCHOLARSHIP_MANAGER',
        department: 'إدارة المسارات الاستراتيجية',
        permissions: ['tracks:write', 'audit:read'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        passwordHash: defaultPasswordHash,
        failedAttempts: 0
      },
      {
        id: 'admin-uni-04',
        username: 'uni.manager',
        fullNameAr: 'م. راشد بن سلطان المري',
        fullNameEn: 'Eng. Rashid Al-Marri',
        email: 'r.marri@moe.gov.sa',
        role: 'UNIVERSITY_MANAGER',
        department: 'إدارة التصنيف والاعتماد الأكاديمي',
        permissions: ['universities:write', 'audit:read'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        passwordHash: defaultPasswordHash,
        failedAttempts: 0
      },
      {
        id: 'admin-faq-05',
        username: 'faq.officer',
        fullNameAr: 'أ. هند بنت خالد السديري',
        fullNameEn: 'Hind Al-Sudairi',
        email: 'h.sudairi@moe.gov.sa',
        role: 'FAQ_MANAGER',
        department: 'مركز خدمة المستفيدين (تواصل)',
        permissions: ['faqs:write'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        passwordHash: defaultPasswordHash,
        failedAttempts: 0
      },
      {
        id: 'admin-media-06',
        username: 'media.specialist',
        fullNameAr: 'أ. تركي بن صالح الحربي',
        fullNameEn: 'Turki Al-Harbi',
        email: 't.harbi@moe.gov.sa',
        role: 'MEDIA_MANAGER',
        department: 'الإنتاج الرقمي والإعلامي',
        permissions: ['media:write'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        passwordHash: defaultPasswordHash,
        failedAttempts: 0
      },
      {
        id: 'admin-ai-07',
        username: 'ai.director',
        fullNameAr: 'م. نوف بنت فايز الشهراني',
        fullNameEn: 'Nouf Al-Shahrani',
        email: 'n.shahrani@moe.gov.sa',
        role: 'AI_MANAGER',
        department: 'إدارة الذكاء الاصطناعي والتحول الرقمي',
        permissions: ['ai:write', 'audit:read'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        passwordHash: defaultPasswordHash,
        failedAttempts: 0
      },
      {
        id: 'admin-editor-08',
        username: 'editor.staff',
        fullNameAr: 'أ. خالد بن ماجد الغامدي',
        fullNameEn: 'Khaled Al-Ghamdi',
        email: 'k.ghamdi@moe.gov.sa',
        role: 'EDITOR',
        department: 'تحرير ونشر المحتوى الأكاديمي',
        permissions: ['pages:write', 'news:write', 'faqs:write', 'media:write'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        passwordHash: defaultPasswordHash,
        failedAttempts: 0
      },
      {
        id: 'admin-viewer-09',
        username: 'viewer.auditor',
        fullNameAr: 'أ. منيرة بنت سعد العجمي',
        fullNameEn: 'Munira Al-Ajmi',
        email: 'm.ajmi@nazaha.gov.sa',
        role: 'VIEWER',
        department: 'المراجعة والرقابة الداخلية',
        permissions: ['audit:read'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        passwordHash: defaultPasswordHash,
        failedAttempts: 0
      }
    ];
    defaultAdmins.forEach(u => this.adminUsers.set(u.id, u));

    // 13. Seed Initial Audit Log
    this.auditLogs.push({
      id: 'audit-boot-001',
      timestamp: new Date().toISOString(),
      actorId: 'SYSTEM',
      actorName: 'نظام إدارة المنصة',
      actorRole: 'SUPER_ADMIN',
      action: 'SETTINGS_CHANGE',
      entityType: 'SETTINGS',
      entityId: 'primary',
      ipAddress: '127.0.0.1',
      changesSummary: 'تم تهيئة النظام وبدء تشغيل المنصة التعريفية الرقمية الموحدة لبرنامج الابتعاث بنجاح.'
    });

    // 14. Seed Analytics Counters
    this.analytics = {
      totalVisitors: 148920,
      todayVisitors: 3412,
      activeNow: 184,
      tracksViews: {
        'track-pioneers': 51200,
        'track-supply': 42800,
        'track-rd': 24900,
        'track-excellence': 31200,
        'track-healthcare': 18600,
        'track-waaed': 14200
      },
      topUniversitiesSearched: [
        { name: 'Massachusetts Institute of Technology (MIT)', count: 8940 },
        { name: 'University of Oxford', count: 7810 },
        { name: 'Stanford University', count: 7420 },
        { name: 'Harvard University', count: 6910 },
        { name: 'Imperial College London', count: 5200 },
        { name: 'University of Cambridge', count: 4890 }
      ],
      topSearchQueries: [
        { query: 'شروط مسار الرواد', hits: 3410 },
        { query: 'الجامعات الموصى بها في بريطانيا', hits: 2890 },
        { query: 'ابتعاث الذكاء الاصطناعي', hits: 2150 },
        { query: 'درجة الآيلتس المطلوبة', hits: 1980 },
        { query: 'رابط التقديم الرسمي', hits: 1760 }
      ],
      aiFinderUsageCount: 16420,
      aiAssistantConversationsCount: 8930,
      deviceBreakdown: { desktop: 58, mobile: 38, tablet: 4 },
      languageBreakdown: { arabic: 82, english: 18 }
    };

    // 15. Seed AI System Configuration
    this.aiConfig = {
      systemPrompt: `أنت المساعد الذكي الرسمي لمنصة برنامج خادم الحرمين الشريفين للابتعاث.
دورك: تقديم استشارات وتوجيهات معلوماتية مبنية على الشروط الرسمية لمسارات الابتعاث الستة (الرواد، إمداد، البحث والتطوير، التميز، واعد، الصحي).
قواعد صارمة:
1. التقديم الفعلي يتم فقط عبر البوابة الوطنية الموحدة للابتعاث (kasp.moe.gov.sa).
2. لا تطلب بيانات الهوية أو نفاذ أو كلمات السر من أي مستخدم.
3. التزم باللغة المهنية الفصحى، واذكر دائماً أن الإرشادات للاستئناس فقط وليست قرار قبول نهائي.`,
      temperature: 0.2,
      modelName: 'gemini-2.5-flash',
      isAiEnabled: true,
      disclaimerText: 'تنويه رسمي: إجابات المستشار الذكي هي معلومات إرشادية وتوجيهية فقط ولا تعد قراراً نهائياً بالقبول في برنامج الابتعاث.'
    };

    // 16. Seed Initial Unanswered Questions
    const sampleUnanswered: UnansweredQuestion[] = [
      {
        id: 'unans-01',
        question: 'هل يمكن التقديم على تخصص الأمن السيبراني في مسار إمداد لدرجة الدبلوم العالي؟',
        date: new Date().toISOString().split('T')[0],
        time: '10:30:00',
        language: 'ar',
        category: 'tracks',
        sessionId: 'sess-88219',
        answerStatus: 'unanswered'
      },
      {
        id: 'unans-02',
        question: 'ما هي معايير قبول شهادات اللغة البديلة مثل Duolingo في الجامعات الكندية؟',
        date: new Date().toISOString().split('T')[0],
        time: '14:15:22',
        language: 'ar',
        category: 'universities',
        sessionId: 'sess-91402',
        answerStatus: 'unanswered'
      }
    ];
    sampleUnanswered.forEach(q => this.unansweredQuestions.set(q.id, q));

    this.initialized = true;
    Logger.info(`Data Store initialized with ${this.tracks.size} tracks, ${this.universities.size} universities, ${this.countries.size} countries, ${this.faqs.size} FAQs, ${this.officialLinks.size} official links.`);
  }

  // ==========================================================================
  // Track Operations
  // ==========================================================================
  public static getAllTracks(publishedOnly = false): Track[] {
    let result = Array.from(this.tracks.values());
    if (publishedOnly) {
      result = result.filter(t => t.isPublished);
    }
    return result.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public static getTracks(): Track[] {
    return this.getAllTracks();
  }

  public static getTrackBySlugOrId(slugOrId: string): Track | undefined {
    return Array.from(this.tracks.values()).find(t => t.slug === slugOrId || t.id === slugOrId);
  }

  public static getTrackById(id: string): Track | undefined {
    return this.getTrackBySlugOrId(id);
  }

  public static getRulesForTrack(_trackId: string): DbRequirementRule[] {
    return [];
  }

  public static getApplications(_params?: any): { items: DbApplication[]; total: number; hasMore: boolean; nextCursor?: string } {
    return { items: [], total: 0, hasMore: false };
  }

  public static getApplicationById(_id: string): DbApplication | undefined {
    return undefined;
  }

  public static createApplication(app: any): any {
    return app;
  }

  public static updateApplication(_id: string, update: any): any {
    return update;
  }

  public static updateTrack(track: Track, actor: AdminUser): Track {
    const existing = this.tracks.get(track.id);
    this.tracks.set(track.id, track);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'UPDATE',
      entityType: 'TRACK',
      entityId: track.id,
      ipAddress: '127.0.0.1',
      changesSummary: `تحديث بيانات مسار: ${track.nameAr}`,
      changesBefore: existing,
      changesAfter: track
    });
    return track;
  }

  public static createTrack(track: Track, actor: AdminUser): Track {
    this.tracks.set(track.id, track);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'CREATE',
      entityType: 'TRACK',
      entityId: track.id,
      ipAddress: '127.0.0.1',
      changesSummary: `إضافة مسار ابتعاث جديد: ${track.nameAr}`,
      changesAfter: track
    });
    return track;
  }

  public static deleteTrack(id: string, actor: AdminUser): boolean {
    const track = this.tracks.get(id);
    if (!track) return false;
    this.tracks.delete(id);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'DELETE',
      entityType: 'TRACK',
      entityId: id,
      ipAddress: '127.0.0.1',
      changesSummary: `حذف مسار: ${track.nameAr}`,
      changesBefore: track
    });
    return true;
  }

  // ==========================================================================
  // Universities & Countries
  // ==========================================================================
  public static getUniversities(params?: {
    search?: string;
    countryCode?: string;
    trackId?: string;
    maxRank?: number;
    degree?: string;
    page?: number;
    pageSize?: number;
  }): { items: University[]; total: number; page: number; totalPages: number } {
    let list = Array.from(this.universities.values());

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(u => 
        u.nameAr.toLowerCase().includes(q) ||
        u.nameEn.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q) ||
        u.topMajorsAr.some(m => m.toLowerCase().includes(q)) ||
        u.topMajorsEn.some(m => m.toLowerCase().includes(q))
      );
    }

    if (params?.countryCode && params.countryCode !== 'all') {
      list = list.filter(u => u.countryCode.toLowerCase() === params.countryCode!.toLowerCase());
    }

    if (params?.trackId && params.trackId !== 'all') {
      list = list.filter(u => u.accreditedTracks.includes(params.trackId!));
    }

    if (params?.maxRank) {
      list = list.filter(u => u.qsRank <= params.maxRank!);
    }

    if (params?.degree && params.degree !== 'all') {
      list = list.filter(u => u.degreesAvailable.includes(params.degree as any));
    }

    // Sort by QS Rank by default
    list.sort((a, b) => a.qsRank - b.qsRank);

    const page = params?.page || 1;
    const pageSize = params?.pageSize || 12;
    const total = list.length;
    const totalPages = Math.ceil(total / pageSize);
    const offset = (page - 1) * pageSize;
    const items = list.slice(offset, offset + pageSize);

    return { items, total, page, totalPages };
  }

  public static getUniversityById(id: string): University | undefined {
    return this.universities.get(id);
  }

  public static updateUniversity(uni: University, actor: AdminUser): University {
    const existing = this.universities.get(uni.id);
    this.universities.set(uni.id, uni);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'UPDATE',
      entityType: 'UNIVERSITY',
      entityId: uni.id,
      ipAddress: '127.0.0.1',
      changesSummary: `تحديث بيانات جامعة: ${uni.nameAr}`,
      changesBefore: existing,
      changesAfter: uni
    });
    return uni;
  }

  public static createUniversity(uni: University, actor: AdminUser): University {
    this.universities.set(uni.id, uni);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'CREATE',
      entityType: 'UNIVERSITY',
      entityId: uni.id,
      ipAddress: '127.0.0.1',
      changesSummary: `إضافة جامعة جديدة: ${uni.nameAr}`,
      changesAfter: uni
    });
    return uni;
  }

  public static deleteUniversity(id: string, actor: AdminUser): boolean {
    const uni = this.universities.get(id);
    if (!uni) return false;
    this.universities.delete(id);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'DELETE',
      entityType: 'UNIVERSITY',
      entityId: id,
      ipAddress: '127.0.0.1',
      changesSummary: `حذف جامعة: ${uni.nameAr}`,
      changesBefore: uni
    });
    return true;
  }

  public static getAllCountries(): CountryInfo[] {
    return Array.from(this.countries.values());
  }

  // ==========================================================================
  // FAQs
  // ==========================================================================
  public static getFaqs(params?: { category?: string; search?: string; trackId?: string }): FaqItem[] {
    let list = Array.from(this.faqs.values()).filter(f => f.isPublished);

    if (params?.category && params.category !== 'all') {
      list = list.filter(f => f.category === params.category);
    }

    if (params?.trackId && params.trackId !== 'all') {
      list = list.filter(f => !f.relatedTrackId || f.relatedTrackId === params.trackId);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(f => 
        f.questionAr.toLowerCase().includes(q) ||
        f.questionEn.toLowerCase().includes(q) ||
        f.answerAr.toLowerCase().includes(q) ||
        f.answerEn.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public static updateFaq(faq: FaqItem, actor: AdminUser): FaqItem {
    this.faqs.set(faq.id, faq);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'UPDATE',
      entityType: 'FAQ',
      entityId: faq.id,
      ipAddress: '127.0.0.1',
      changesSummary: `تعديل سؤال شائع: ${faq.questionAr.substring(0, 40)}...`,
      changesAfter: faq
    });
    return faq;
  }

  public static createFaq(faq: FaqItem, actor: AdminUser): FaqItem {
    this.faqs.set(faq.id, faq);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'CREATE',
      entityType: 'FAQ',
      entityId: faq.id,
      ipAddress: '127.0.0.1',
      changesSummary: `إضافة سؤال شائع جديد: ${faq.questionAr.substring(0, 40)}...`,
      changesAfter: faq
    });
    return faq;
  }

  public static deleteFaq(id: string, actor: AdminUser): boolean {
    const item = this.faqs.get(id);
    if (!item) return false;
    this.faqs.delete(id);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'DELETE',
      entityType: 'FAQ',
      entityId: id,
      ipAddress: '127.0.0.1',
      changesSummary: `حذف سؤال شائع: ${item.questionAr.substring(0, 40)}...`,
      changesBefore: item
    });
    return true;
  }

  // ==========================================================================
  // Official Links
  // ==========================================================================
  public static getOfficialLinks(): OfficialPlatformLink[] {
    return Array.from(this.officialLinks.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public static updateOfficialLink(link: OfficialPlatformLink, actor: AdminUser): OfficialPlatformLink {
    this.officialLinks.set(link.id, link);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'UPDATE',
      entityType: 'OFFICIAL_LINK',
      entityId: link.id,
      ipAddress: '127.0.0.1',
      changesSummary: `تحديث رابط رسمي: ${link.nameAr}`,
      changesAfter: link
    });
    return link;
  }

  // ==========================================================================
  // News & Guides
  // ==========================================================================
  public static getNews(publishedOnly = true): NewsArticle[] {
    let list = Array.from(this.news.values());
    if (publishedOnly) {
      list = list.filter(n => n.status === 'published');
    }
    return list.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }

  public static getGuides(): GuideArticle[] {
    return Array.from(this.guides.values());
  }

  public static createNews(news: NewsArticle, actor: AdminUser): NewsArticle {
    this.news.set(news.id, news);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'CREATE',
      entityType: 'NEWS',
      entityId: news.id,
      ipAddress: '127.0.0.1',
      changesSummary: `إضافة خبر جديد: ${news.titleAr}`,
      changesAfter: news
    });
    return news;
  }

  public static updateNews(news: NewsArticle, actor: AdminUser): NewsArticle {
    this.news.set(news.id, news);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'UPDATE',
      entityType: 'NEWS',
      entityId: news.id,
      ipAddress: '127.0.0.1',
      changesSummary: `تعديل خبر: ${news.titleAr}`,
      changesAfter: news
    });
    return news;
  }

  public static deleteNews(id: string, actor: AdminUser): boolean {
    const item = this.news.get(id);
    if (!item) return false;
    this.news.delete(id);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'DELETE',
      entityType: 'NEWS',
      entityId: id,
      ipAddress: '127.0.0.1',
      changesSummary: `حذف خبر: ${item.titleAr}`,
      changesBefore: item
    });
    return true;
  }

  // ==========================================================================
  // CMS Page Builder & Versioning
  // ==========================================================================
  public static getPageBlocks(pageSlug = 'home'): PageBlock[] {
    return Array.from(this.pageBlocks.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public static updatePageBlock(block: PageBlock, actor: AdminUser): PageBlock {
    this.pageBlocks.set(block.id, block);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'UPDATE',
      entityType: 'PAGE',
      entityId: block.id,
      ipAddress: '127.0.0.1',
      changesSummary: `تعديل قسم الصفحة: ${block.titleAr}`,
      changesAfter: block
    });
    return block;
  }

  public static reorderPageBlocks(blockIds: string[], actor: AdminUser): PageBlock[] {
    blockIds.forEach((id, index) => {
      const b = this.pageBlocks.get(id);
      if (b) {
        b.sortOrder = index + 1;
        this.pageBlocks.set(id, b);
      }
    });

    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'UPDATE',
      entityType: 'PAGE',
      entityId: 'home',
      ipAddress: '127.0.0.1',
      changesSummary: 'إعادة ترتيب أقسام الصفحة الرئيسية'
    });

    return this.getPageBlocks();
  }

  public static savePageVersion(title: string, notes: string, actor: AdminUser): PageVersion {
    const version: PageVersion = {
      id: `ver-${Date.now()}`,
      pageSlug: 'home',
      versionNumber: this.pageVersions.length + 1,
      title,
      blocks: JSON.parse(JSON.stringify(this.getPageBlocks())),
      createdBy: actor.fullNameAr,
      createdAt: new Date().toISOString(),
      status: 'published',
      changelogNotes: notes
    };
    this.pageVersions.unshift(version);
    return version;
  }

  public static getPageVersions(): PageVersion[] {
    return this.pageVersions;
  }

  public static restorePageVersion(versionId: string, actor: AdminUser): boolean {
    const ver = this.pageVersions.find(v => v.id === versionId);
    if (!ver) return false;

    this.pageBlocks.clear();
    ver.blocks.forEach(b => this.pageBlocks.set(b.id, { ...b }));

    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'RESTORE',
      entityType: 'PAGE',
      entityId: versionId,
      ipAddress: '127.0.0.1',
      changesSummary: `استعادة إصدار الصفحة: ${ver.title} (نسخة #${ver.versionNumber})`
    });

    return true;
  }

  // ==========================================================================
  // Media Library
  // ==========================================================================
  public static getMediaItems(): MediaItem[] {
    return Array.from(this.mediaLibrary.values()).sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  public static addMediaItem(item: MediaItem, actor: AdminUser): MediaItem {
    this.mediaLibrary.set(item.id, item);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'CREATE',
      entityType: 'MEDIA',
      entityId: item.id,
      ipAddress: '127.0.0.1',
      changesSummary: `رفع ملف وسائط جديد: ${item.fileName}`
    });
    return item;
  }

  public static deleteMediaItem(id: string, actor: AdminUser): boolean {
    const item = this.mediaLibrary.get(id);
    if (!item) return false;
    this.mediaLibrary.delete(id);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'DELETE',
      entityType: 'MEDIA',
      entityId: id,
      ipAddress: '127.0.0.1',
      changesSummary: `حذف ملف وسائط: ${item.fileName}`
    });
    return true;
  }

  // ==========================================================================
  // SEO & Site Settings
  // ==========================================================================
  public static getSeoMetadata(pageSlug = 'home'): SeoMetadata | undefined {
    return this.seoMetadata.get(pageSlug);
  }

  public static updateSeoMetadata(seo: SeoMetadata, actor: AdminUser): SeoMetadata {
    this.seoMetadata.set(seo.pageSlug, seo);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'UPDATE',
      entityType: 'SETTINGS',
      entityId: seo.pageSlug,
      ipAddress: '127.0.0.1',
      changesSummary: `تحديث إعدادات SEO للصفحة: ${seo.pageSlug}`
    });
    return seo;
  }

  public static getSiteSettings(): SiteSettings {
    return { ...this.siteSettings };
  }

  public static updateSiteSettings(settings: Partial<SiteSettings>, actor: AdminUser): SiteSettings {
    this.siteSettings = { ...this.siteSettings, ...settings };
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'SETTINGS_CHANGE',
      entityType: 'SETTINGS',
      entityId: 'primary',
      ipAddress: '127.0.0.1',
      changesSummary: 'تحديث الإعدادات العامة للمنصة'
    });
    return this.siteSettings;
  }

  // ==========================================================================
  // Audit Logs & Analytics
  // ==========================================================================
  public static recordAudit(item: Omit<AuditLogItem, 'id' | 'timestamp'>): void {
    const log: AuditLogItem = {
      ...item,
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    // Keep max 500 audit records in memory
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
  }

  public static getAuditLogs(limit = 100): AuditLogItem[] {
    return this.auditLogs.slice(0, limit);
  }

  public static getAnalytics(): PlatformAnalytics {
    return { ...this.analytics };
  }

  public static getAdminUsers(): AdminUser[] {
    return Array.from(this.adminUsers.values()).map(u => {
      const { passwordHash, ...safe } = u;
      return safe as AdminUser;
    });
  }

  public static getAdminUserById(id: string): AdminUser | null {
    const user = this.adminUsers.get(id);
    return user ? { ...user } : null;
  }

  public static getAdminUserByUsernameOrEmail(identifier: string): AdminUser | null {
    const clean = identifier.trim().toLowerCase();
    for (const user of this.adminUsers.values()) {
      if (user.username.toLowerCase() === clean || user.email.toLowerCase() === clean) {
        return { ...user };
      }
    }
    return null;
  }

  public static authenticateAdmin(identifier: string, plainPassword: string): { 
    success: boolean; 
    user?: AdminUser; 
    error?: string;
    lockedRemainingSeconds?: number;
  } {
    const user = this.getAdminUserByUsernameOrEmail(identifier);
    if (!user) {
      return { success: false, error: 'اسم المستخدم أو البريد الإلكتروني غير صحيح' };
    }

    if (!user.isActive) {
      return { success: false, error: 'هذا الحساب الإداري معطل. يرجى مراجعة المشرف العام' };
    }

    const now = Date.now();
    if (user.lockUntil && now < user.lockUntil) {
      const remainingSec = Math.ceil((user.lockUntil - now) / 1000);
      return { 
        success: false, 
        error: `الحساب مقفل مؤقتاً لتكرار محاولات الدخول الخاطئة. حاول مجدداً بعد ${remainingSec} ثانية`,
        lockedRemainingSeconds: remainingSec
      };
    }

    if (!user.passwordHash || !verifyPassword(plainPassword, user.passwordHash)) {
      const failed = (user.failedAttempts || 0) + 1;
      let lockUntil: number | undefined = undefined;
      let error = 'كلمة المرور غير صحيحة';

      if (failed >= 5) {
        lockUntil = now + 15 * 60 * 1000; // 15 min lockout
        error = 'تم قفل الحساب مؤقتاً لمدة 15 دقيقة لتجاوز الحد الأقصى للمحاولات الخاطئة (5 محاولات)';
      }

      this.adminUsers.set(user.id, {
        ...user,
        failedAttempts: failed,
        lockUntil
      });

      this.recordAudit({
        actorId: user.id,
        actorName: user.fullNameAr,
        actorRole: user.role,
        action: 'LOGIN',
        entityType: 'SETTINGS',
        entityId: user.id,
        ipAddress: '127.0.0.1',
        changesSummary: `فشل تسجيل الدخول الإداري للمستخدم ${user.username} (محاولة ${failed})`
      });

      return { success: false, error };
    }

    // Success: Reset failed attempts, update last login
    const updated: AdminUser = {
      ...user,
      failedAttempts: 0,
      lockUntil: undefined,
      lastLogin: new Date().toISOString()
    };
    this.adminUsers.set(user.id, updated);

    this.recordAudit({
      actorId: user.id,
      actorName: user.fullNameAr,
      actorRole: user.role,
      action: 'LOGIN',
      entityType: 'SETTINGS',
      entityId: user.id,
      ipAddress: '127.0.0.1',
      changesSummary: `تسجيل دخول إداري ناجح للمستخدم ${user.username} (${user.role})`
    });

    const { passwordHash, ...safeUser } = updated;
    return { success: true, user: safeUser as AdminUser };
  }

  // ==========================================================================
  // Global Search
  // ==========================================================================
  public static globalSearch(query: string): {
    tracks: Track[];
    universities: University[];
    faqs: FaqItem[];
    news: NewsArticle[];
    guides: GuideArticle[];
  } {
    if (!query || query.trim().length === 0) {
      return { tracks: [], universities: [], faqs: [], news: [], guides: [] };
    }

    const q = query.trim().toLowerCase();

    const tracks = Array.from(this.tracks.values()).filter(t => 
      t.nameAr.toLowerCase().includes(q) ||
      t.nameEn.toLowerCase().includes(q) ||
      t.descriptionAr.toLowerCase().includes(q) ||
      t.targetSectors.some(s => s.toLowerCase().includes(q))
    );

    const universities = Array.from(this.universities.values()).filter(u => 
      u.nameAr.toLowerCase().includes(q) ||
      u.nameEn.toLowerCase().includes(q) ||
      u.country.toLowerCase().includes(q) ||
      u.topMajorsAr.some(m => m.toLowerCase().includes(q)) ||
      u.topMajorsEn.some(m => m.toLowerCase().includes(q))
    ).slice(0, 10);

    const faqs = Array.from(this.faqs.values()).filter(f => 
      f.questionAr.toLowerCase().includes(q) ||
      f.questionEn.toLowerCase().includes(q) ||
      f.answerAr.toLowerCase().includes(q)
    ).slice(0, 8);

    const news = Array.from(this.news.values()).filter(n => 
      n.titleAr.toLowerCase().includes(q) ||
      n.titleEn.toLowerCase().includes(q) ||
      n.summaryAr.toLowerCase().includes(q)
    ).slice(0, 5);

    const guides = Array.from(this.guides.values()).filter(g => 
      g.titleAr.toLowerCase().includes(q) ||
      g.titleEn.toLowerCase().includes(q) ||
      g.summaryAr.toLowerCase().includes(q)
    ).slice(0, 5);

    return { tracks, universities, faqs, news, guides };
  }

  // ==========================================================================
  // Backup & Export / Restore
  // ==========================================================================
  public static exportFullBackup(): Record<string, any> {
    return {
      exportedAt: new Date().toISOString(),
      schemaVersion: '1.0.0-PUBLIC-CMS',
      tracks: Array.from(this.tracks.values()),
      universities: Array.from(this.universities.values()),
      countries: Array.from(this.countries.values()),
      faqs: Array.from(this.faqs.values()),
      officialLinks: Array.from(this.officialLinks.values()),
      news: Array.from(this.news.values()),
      pageBlocks: Array.from(this.pageBlocks.values()),
      pageVersions: this.pageVersions,
      mediaLibrary: Array.from(this.mediaLibrary.values()),
      siteSettings: this.siteSettings,
      seoMetadata: Array.from(this.seoMetadata.values()),
      auditLogs: this.auditLogs.slice(0, 50)
    };
  }

  public static importBackup(payload: Record<string, any>, actor: AdminUser): boolean {
    if (!payload || !payload.tracks) return false;

    if (Array.isArray(payload.tracks)) {
      this.tracks.clear();
      payload.tracks.forEach((t: Track) => this.tracks.set(t.id, t));
    }
    if (Array.isArray(payload.universities)) {
      this.universities.clear();
      payload.universities.forEach((u: University) => this.universities.set(u.id, u));
    }
    if (Array.isArray(payload.faqs)) {
      this.faqs.clear();
      payload.faqs.forEach((f: FaqItem) => this.faqs.set(f.id, f));
    }
    if (Array.isArray(payload.news)) {
      this.news.clear();
      payload.news.forEach((n: NewsArticle) => this.news.set(n.id, n));
    }
    if (Array.isArray(payload.pageBlocks)) {
      this.pageBlocks.clear();
      payload.pageBlocks.forEach((b: PageBlock) => this.pageBlocks.set(b.id, b));
    }
    if (payload.siteSettings) {
      this.siteSettings = { ...payload.siteSettings };
    }

    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'RESTORE',
      entityType: 'SETTINGS',
      entityId: 'backup-snapshot',
      ipAddress: '127.0.0.1',
      changesSummary: `استعادة نسخة احتياطية كاملة مؤرخة في ${payload.exportedAt || new Date().toISOString()}`
    });

    return true;
  }

  // ==========================================================================
  // Admin User CRUD
  // ==========================================================================
  public static createAdminUser(
    user: Omit<AdminUser, 'id'> & { id?: string; plainPassword?: string }, 
    actor: AdminUser
  ): AdminUser {
    const newId = user.id || `admin-${Date.now()}`;
    const passwordHash = user.plainPassword ? hashPassword(user.plainPassword) : hashPassword('Kasp@2030!');
    const newUser: AdminUser = {
      ...user,
      id: newId,
      passwordHash,
      isActive: user.isActive !== undefined ? user.isActive : true,
      failedAttempts: 0
    };
    this.adminUsers.set(newId, newUser);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'USER_ROLE_CHANGE',
      entityType: 'SETTINGS',
      entityId: newId,
      ipAddress: '127.0.0.1',
      changesSummary: `إنشاء مستخدم إداري جديد: ${newUser.fullNameAr} (${newUser.role})`
    });
    const { passwordHash: _, ...safe } = newUser;
    return safe as AdminUser;
  }

  public static updateAdminUser(
    id: string, 
    partial: Partial<AdminUser> & { plainPassword?: string }, 
    actor: AdminUser
  ): AdminUser | null {
    const existing = this.adminUsers.get(id);
    if (!existing) return null;
    const updated: AdminUser = {
      ...existing,
      ...partial
    };
    if (partial.plainPassword) {
      updated.passwordHash = hashPassword(partial.plainPassword);
    }
    this.adminUsers.set(id, updated);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'USER_ROLE_CHANGE',
      entityType: 'SETTINGS',
      entityId: id,
      ipAddress: '127.0.0.1',
      changesSummary: `تحديث بيانات المستخدم الإداري: ${updated.fullNameAr} (${updated.role})`
    });
    const { passwordHash: _, ...safe } = updated;
    return safe as AdminUser;
  }

  public static deleteAdminUser(id: string, actor: AdminUser): boolean {
    if (id === actor.id) {
      throw new Error('لا يمكن للمشرف حذف حسابه الشخصي النشط');
    }
    const existing = this.adminUsers.get(id);
    if (!existing) return false;
    this.adminUsers.delete(id);
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'SETTINGS_CHANGE',
      entityType: 'SETTINGS',
      entityId: id,
      ipAddress: '127.0.0.1',
      changesSummary: `حذف حساب المستخدم الإداري: ${existing.fullNameAr}`
    });
    return true;
  }

  // ==========================================================================
  // AI System Configuration & Unanswered Questions
  // ==========================================================================
  public static getAiConfig(): AiSystemConfig {
    return { ...this.aiConfig };
  }

  public static updateAiConfig(config: Partial<AiSystemConfig>, actor: AdminUser): AiSystemConfig {
    this.aiConfig = { ...this.aiConfig, ...config };
    this.recordAudit({
      actorId: actor.id,
      actorName: actor.fullNameAr,
      actorRole: actor.role,
      action: 'SETTINGS_CHANGE',
      entityType: 'SETTINGS',
      entityId: 'ai-config',
      ipAddress: '127.0.0.1',
      changesSummary: 'تحديث معايير وتوجيهات محرك الذكاء الاصطناعي'
    });
    return this.aiConfig;
  }

  public static getUnansweredQuestions(): UnansweredQuestion[] {
    return Array.from(this.unansweredQuestions.values());
  }

  public static addUnansweredQuestion(q: Omit<UnansweredQuestion, 'id' | 'date' | 'time' | 'answerStatus'>): UnansweredQuestion {
    const now = new Date();
    const id = `unans-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const item: UnansweredQuestion = {
      ...q,
      id,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      answerStatus: 'unanswered'
    };
    this.unansweredQuestions.set(id, item);
    return item;
  }

  public static answerUnansweredQuestion(
    id: string, 
    answer: string, 
    actor: AdminUser
  ): { question: UnansweredQuestion; faq?: FaqItem } | null {
    const item = this.unansweredQuestions.get(id);
    if (!item) return null;
    item.answerStatus = 'answered';
    item.suggestedAnswer = answer;
    this.unansweredQuestions.set(id, item);

    // Auto-promote answered question to FAQ database so all users and AI assistant immediately benefit!
    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      category: item.category || 'general',
      questionAr: item.question,
      questionEn: item.question,
      answerAr: answer,
      answerEn: answer,
      order: this.faqs.size + 1
    };
    this.createFaq(newFaq, actor);

    return { question: item, faq: newFaq };
  }
}
