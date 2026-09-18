export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export interface TranslationsSchema {
  nav: {
    programTitle: string;
    programTitleEn: string;
    programSub: string;
    overview: string;
    tracks: string;
    universities: string;
    guide: string;
    missions: string;
    faq: string;
    helpCenter: string;
    applicantPortal: string;
    supervisorPortal: string;
    adminPortal: string;
    applyNow: string;
    nafathLogin: string;
    searchPlaceholder: string;
    switchRole: string;
    notifications: string;
    markAllRead: string;
    noNotifications: string;
    langName: string;
    langSwitchTitle: string;
    darkMode: string;
    lightMode: string;
    welcomeUser: string;
  };
  hero: {
    eyebrow: string;
    titlePart1: string;
    titleHighlight: string;
    subtitle: string;
    ctaApply: string;
    ctaExploreTracks: string;
    ctaAiFinder: string;
    statScholarsValue: string;
    statScholarsLabel: string;
    statTracksValue: string;
    statTracksLabel: string;
    statGuaranteeValue: string;
    statGuaranteeLabel: string;
    statAccreditedValue: string;
    statAccreditedLabel: string;
  };
  infoStrip: {
    badge: string;
    headline: string;
    pill1: string;
    pill2: string;
    pill3: string;
    action: string;
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    serviceTracksTitle: string;
    serviceTracksDesc: string;
    serviceCheckTitle: string;
    serviceCheckDesc: string;
    serviceUnisTitle: string;
    serviceUnisDesc: string;
    serviceApplyTitle: string;
    serviceApplyDesc: string;
    serviceFaqTitle: string;
    serviceFaqDesc: string;
    serviceAiTitle: string;
    serviceAiDesc: string;
  };
  tracks: {
    eyebrow: string;
    title: string;
    subtitle: string;
    filterAll: string;
    detailsBtn: string;
    applyBtn: string;
    minGpaLabel: string;
    rankLimitLabel: string;
    targetSectorsLabel: string;
    degreesLabel: string;
    topLabel: string;
    outOfFive: string;
    unconditionalBadge: string;
  };
  trackModal: {
    strategicGoal: string;
    targetDegree: string;
    minGpa: string;
    rankLimit: string;
    eligibilityCriteria: string;
    targetSectors: string;
    close: string;
    applyNow: string;
    institutionHeader: string;
  };
  journey: {
    eyebrow: string;
    title: string;
    subtitle: string;
    stepPrefix: string;
    prevStep: string;
    nextStep: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    step5Title: string;
    step5Desc: string;
    step6Title: string;
    step6Desc: string;
    step7Title: string;
    step7Desc: string;
    step8Title: string;
    step8Desc: string;
  };
  strategy: {
    eyebrow: string;
    title: string;
    subtitle: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    pillar4Title: string;
    pillar4Desc: string;
    statVisionTitle: string;
    statVisionDesc: string;
    humanCapabilityBadge: string;
    visionBadge: string;
  };
  aiFinder: {
    eyebrow: string;
    title: string;
    subtitle: string;
    stepDegree: string;
    degreeBachelor: string;
    degreeMaster: string;
    degreePhD: string;
    degreeFellowship: string;
    stepGpa: string;
    stepIelts: string;
    stepField: string;
    fieldAI: string;
    fieldIndustry: string;
    fieldResearch: string;
    fieldMegaprojects: string;
    fieldHealth: string;
    fieldFuture: string;
    calcBtn: string;
    resultTitle: string;
    matchScore: string;
    eligibleStatus: string;
    criteriaPassed: string;
    applyThisTrack: string;
    recalculate: string;
  };
  universities: {
    eyebrow: string;
    title: string;
    subtitle: string;
    openDirectory: string;
    searchPlaceholder: string;
    allCountries: string;
    rankWorld: string;
    qsRank: string;
    topMajors: string;
    otherMajors: string;
    allTracksAccredited: string;
    visitWebsite: string;
  };
  unis: {
    eyebrow: string;
    title: string;
    subtitle: string;
    openFullBtn: string;
    searchPlaceholder: string;
    allCountries: string;
    rankPrefix: string;
    featuredMajors: string;
    accreditedBadge: string;
    websiteLink: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    viewAllFaq: string;
    askAiAdvisor: string;
    catAll: string;
    catAdmission: string;
    catTracks: string;
    catFinancial: string;
    catDocuments: string;
    catSafeer: string;
    catGeneral: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    subtitle: string;
    startApplication: string;
    exploreTracks: string;
    startBtn: string;
    exploreBtn: string;
    supportNote: string;
  };
  footer: {
    aboutTitle: string;
    aboutText: string;
    govPlatformNote: string;
    tracksTitle: string;
    trackPioneers: string;
    trackSupply: string;
    trackRd: string;
    trackExcellence: string;
    trackHealth: string;
    trackWaed: string;
    systemsTitle: string;
    portalsTitle: string;
    portalSafeer: string;
    portalUnis: string;
    portalAi: string;
    portalFinancial: string;
    portalMissions: string;
    safeerPortal: string;
    uniDirectory: string;
    smartCalc: string;
    financialGuarantee: string;
    missionsLink: string;
    supportTitle: string;
    beneficiaryCare: string;
    addressKsa: string;
    careCenter: string;
    email: string;
    location: string;
    backToTop: string;
    rights: string;
    copyright: string;
    privacy: string;
    terms: string;
    accessibility: string;
  };
  nafathModal: {
    title: string;
    subtitle: string;
    nationalIdLabel: string;
    placeholder: string;
    loginBtn: string;
    verificationStep: string;
    openAppInstruction: string;
    verifying: string;
    demoBypass: string;
    cancel: string;
  };
  aiChat: {
    title: string;
    subtitle: string;
    greeting: string;
    placeholder: string;
    send: string;
    suggestedTitle: string;
    q1: string;
    q2: string;
    q3: string;
    startAppAction: string;
  };
  applicantPortal: {
    myApplications: string;
    safeerServices: string;
    advisingAppointments: string;
    startNewApp: string;
    statusLabel: string;
    appNumber: string;
    uniLabel: string;
    majorLabel: string;
    trackLabel: string;
    downloadGuarantee: string;
    noApps: string;
  };
  common: {
    loading: string;
    error: string;
    empty: string;
    back: string;
    next: string;
    save: string;
    cancel: string;
    close: string;
    confirm: string;
    search: string;
    filter: string;
    all: string;
    yes: string;
    no: string;
    active: string;
    pending: string;
    approved: string;
    rejected: string;
    underReview: string;
    decisionIssued: string;
    returnToHome: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationsSchema> = {
  ar: {
    nav: {
      programTitle: 'برنامج الابتعاث',
      programTitleEn: 'The Scholarship Program',
      programSub: 'البوابة الرقمية الموحدة للابتعاث الخارجي',
      overview: 'الرئيسية',
      tracks: 'المسارات',
      universities: 'الجامعات',
      guide: 'دليل المستخدم',
      missions: 'الملحقيات',
      faq: 'الأسئلة الشائعة',
      helpCenter: 'المساعدة',
      applicantPortal: 'بوابة المبتعث',
      supervisorPortal: 'الملحقية والمشرف',
      adminPortal: 'الإدارة والتحليلات',
      applyNow: 'قدم طلب',
      nafathLogin: 'تسجيل عبر النفاذ الوطني',
      searchPlaceholder: 'ابحث عن مسار، جامعة، تخصص، أو استفسار...',
      switchRole: 'تبديل الحساب التجريبي',
      notifications: 'التنبيهات',
      markAllRead: 'تحديد الكل كمقروء',
      noNotifications: 'لا توجد تنبيهات جديدة',
      langName: 'English',
      langSwitchTitle: 'Change to English',
      darkMode: 'الوضع الليلي',
      lightMode: 'الوضع النهاري',
      welcomeUser: 'مرحباً،'
    },
    hero: {
      eyebrow: 'منظومة وطنية متكاملة برؤية السعودية 2030',
      titlePart1: 'استثمر في مستقبلك الأكاديمي والمهني',
      titleHighlight: 'بأرقى جامعات العالم',
      subtitle: 'البوابة الرقمية المعتمدة لتقديم ومتابعة ابتعاثك بدعم الفرز الذكي بالذكاء الاصطناعي، ربط مباشر مع منصة سفير، وإصدار فوري للضمان المالي الرقمي الموثق.',
      ctaApply: 'بدء تقديم طلب ابتعاث جديد',
      ctaExploreTracks: 'استكشاف مسارات الابتعاث الستة',
      ctaAiFinder: 'حاسبة المطابقة الذكية',
      statScholarsValue: '14,500+',
      statScholarsLabel: 'مبتعث ومبتعثة في أفضل صروح العالم',
      statTracksValue: '6',
      statTracksLabel: 'مسارات استراتيجية تلبي تطلعات الوطن',
      statGuaranteeValue: '100%',
      statGuaranteeLabel: 'ضمان مالي رقمي موثق ومقبول فورياً',
      statAccreditedValue: '300+',
      statAccreditedLabel: 'جامعة ومركز بحثي مصنف عالمياً'
    },
    infoStrip: {
      badge: 'إعلان رسمي',
      headline: 'التقديم متاح ومستمر طوال العام لمسارات الابتعاث الأكاديمية والمهنية',
      pill1: 'قبول غير مشروط',
      pill2: 'ضمان مالي رقمي فوري',
      pill3: 'ربط مباشر مع منصة سفير',
      action: 'استكشف متطلبات المسارات'
    },
    services: {
      eyebrow: 'منظومة الخدمات الرقمية',
      title: 'ابدأ من هنا — خدمات سريعة وميسرة',
      subtitle: 'وصول مباشر للخدمات الأكثر طلباً لاختصار وقتك وتسريع وتيرة رحلتك الأكاديمية',
      serviceTracksTitle: 'دليل المسارات الرسمية',
      serviceTracksDesc: 'استكشف تفاصيل وشروط مسارات الابتعاث الستة والقطاعات المستهدفة',
      serviceCheckTitle: 'رحلة ومحطات الابتعاث',
      serviceCheckDesc: 'تعرف على الخطوات الـ 8 من التقديم وحتى التخرج والعودة',
      serviceUnisTitle: 'الجامعات المصنفة',
      serviceUnisDesc: 'قائمة بأفضل الجامعات العالمية المعتمدة وتخصصاتها المتميزة',
      serviceApplyTitle: 'تقديم طلب جديد',
      serviceApplyDesc: 'ارفع خطاب قبولك وابدأ رحلة الابتعاث عبر النفاذ الموحد',
      serviceFaqTitle: 'مركز الاستفسارات',
      serviceFaqDesc: 'إجابات شافية عن الضمان المالي والتأشيرات والاشتراطات الأكاديمية',
      serviceAiTitle: 'المساعد الذكي',
      serviceAiDesc: 'استشارة رقمية فورية للإجابة عن أسئلتك على مدار الساعة'
    },
    tracks: {
      eyebrow: 'مسارات الابتعاث الاستراتيجية',
      title: 'اختر المسار المتوافق مع طموحك',
      subtitle: 'ستة مسارات نوعية منبثقة من برنامج تنمية القدرات البشرية لتحقيق الريادة الوطنية والتنافسية العالمية.',
      filterAll: 'كافة المسارات (6)',
      detailsBtn: 'عرض التفاصيل والشروط',
      applyBtn: 'التقديم على هذا المسار',
      minGpaLabel: 'أدنى معدل مطلوب',
      rankLimitLabel: 'نطاق التصنيف العالمي',
      targetSectorsLabel: 'أبرز القطاعات المستهدفة:',
      degreesLabel: 'الدرجات:',
      topLabel: 'أفضل',
      outOfFive: 'من 5.0',
      unconditionalBadge: 'قبول مباشر غير مشروط'
    },
    trackModal: {
      strategicGoal: 'الهدف الاستراتيجي من المسار:',
      targetDegree: 'الدرجة المستهدفة:',
      minGpa: 'الحد الأدنى للمعدل:',
      rankLimit: 'نطاق التصنيف:',
      eligibilityCriteria: 'شروط الأهلية والقبول الخاصة بالمسار:',
      targetSectors: 'القطاعات الحيوية ومجالات التخصص:',
      close: 'إغلاق',
      applyNow: 'بدء التقديم على هذا المسار',
      institutionHeader: 'برنامج خادم الحرمين الشريفين للابتعاث'
    },
    journey: {
      eyebrow: 'خارطة الطريق الأكاديمية',
      title: 'رحلة الابتعاث من الفكرة إلى التميز',
      subtitle: 'ثماني محطات واضحة تنظم مسيرتك الدراسية وتضمن حصولك على الدعم الكامل في كل خطوة.',
      stepPrefix: 'المحطة',
      prevStep: 'السابق',
      nextStep: 'المحطة التالية',
      step1Title: 'الحصول على قبول جامعي معتمد',
      step1Desc: 'قبول غير مشروط من إحدى الجامعات والمؤسسات المصنفة في قوائم البرنامج المعتمدة.',
      step2Title: 'التسجيل ورفع الملف عبر النفاذ الموحد',
      step2Desc: 'التحقق البيومتري الفوري ورفع المستندات الرسمية لتبدأ عملية الفرز الذكي.',
      step3Title: 'المطابقة الذكية وتحديد المسار',
      step3Desc: 'تحليل بيانات القبول بدقة عبر الذكاء الاصطناعي ومطابقتها مع شروط المسار الأنسب.',
      step4Title: 'التدقيق الأكاديمي من الملحقية الثقافية',
      step4Desc: 'مراجعة الملف من قبل المشرف الأكاديمي المختص ببلد الابتعاث والتأكد من استيفاء المتطلبات.',
      step5Title: 'صدور قرار الابتعاث والضمان المالي',
      step5Desc: 'إصدار قرار رسمي موثق مصحوباً بضمان مالي رقمي مشفر موجه للجامعة والسفارة.',
      step6Title: 'إجراءات التأشيرة وتذكرة السفر (سفير)',
      step6Desc: 'تقديم طلب أمر الإركاب وحجز تذكرة السفر والتنسيق مع الملحقية لاستقبالك.',
      step7Title: 'بدء الدراسة والمتابعة الأكاديمية',
      step7Desc: 'الانتظام الدراسي، صرف المخصصات الشهرية والتأمين الصحي ومكافآت التميز الفصلي.',
      step8Title: 'التخرج والعودة للإسهام الوطني',
      step8Desc: 'معادلة الشهادة والتكامل مع برامج التوظيف الوطنية والمشاريع التنموية الكبرى.'
    },
    strategy: {
      eyebrow: 'رؤية السعودية 2030',
      title: 'ركائز استراتيجية تنمية رأس المال البشري',
      subtitle: 'صُمم برنامج الابتعاث ليكون الرافد الأكبر للمشاريع التحولية الكبرى وصناعة اقتصاد معرفي مستدام ومنافس عالمياً.',
      pillar1Title: 'تطوير قاعدة مهارات صلبة',
      pillar1Desc: 'تأهيل جيل من القادة والخبراء في التخصصات الحديثة ليكونوا ركيزة التحول الاقتصادي.',
      pillar2Title: 'توسيع فرص التعلم التنافسي',
      pillar2Desc: 'إتاحة مقاعد دراسية في أرقى 30 و200 جامعة حول العالم للطلبة المتميزين دون عوائق مالية.',
      pillar3Title: 'تعزيز ثقافة الابتكار وريادة الأعمال',
      pillar3Desc: 'دعم الأبحاث التطبيقية وبراءات الاختراع ونقل التكنولوجيا وتأسيس الشركات المعرفية.',
      pillar4Title: 'التكامل مع أولويات سوق العمل',
      pillar4Desc: 'ربط مسارات الابتعاث باحتياجات القطاع الخاص والمشاريع العملاقة (نيوم، البحر الأحمر، القدية).',
      statVisionTitle: 'المستهدف الوطني 2030',
      statVisionDesc: 'تأهيل وتمكين أكثر من 70,000 كفاءة وطنية لقيادة التحول في القطاعات الاستراتيجية المستقبلية.',
      humanCapabilityBadge: 'برنامج تنمية القدرات البشرية',
      visionBadge: 'رؤية السعودية 2030'
    },
    aiFinder: {
      eyebrow: 'التوجيه الأكاديمي الرقمي',
      title: 'حاسبة المطابقة الذكية لمسار الابتعاث',
      subtitle: 'أدخل مؤهلاتك الأكاديمية ودرجات اللغة للحصول على تحليل فوري وتوصية بالمسار الأنسب لك.',
      stepDegree: '1. الدرجة الأكاديمية المستهدفة',
      degreeBachelor: 'بكالوريوس',
      degreeMaster: 'ماجستير',
      degreePhD: 'دكتوراه / أبحاث',
      degreeFellowship: 'زمالة طبية / إقامة سريرية',
      stepGpa: '2. المعدل التراكمي (GPA من 5.0)',
      stepIelts: '3. درجة اختبار الآيلتس (IELTS)',
      stepField: '4. مجال الاهتمام التخصصي',
      fieldAI: 'ذكاء اصطناعي وتقنيات متقدمة',
      fieldIndustry: 'سلاسل إمداد وصناعة وطنية',
      fieldResearch: 'أبحاث علمية وابتكار دوائي وطاقة',
      fieldMegaprojects: 'عمارة وسياحة وفنون ومشاريع كبرى',
      fieldHealth: 'طب وزمالات ورعاية صحية متقدمة',
      fieldFuture: 'فضاء وهيدروجين وأشباه موصلات',
      calcBtn: 'تحليل الملف والمطابقة الفورية',
      resultTitle: 'نتيجة التوصية والمطابقة الذكية',
      matchScore: 'نسبة التوافق الأكاديمي',
      eligibleStatus: 'مؤهل للمسار',
      criteriaPassed: 'استيفاء شروط المسار بنجاح',
      applyThisTrack: 'التقديم مباشرة على هذا المسار',
      recalculate: 'إعادة ضبط المعايير'
    },
    universities: {
      eyebrow: 'الصروح الأكاديمية العالمية',
      title: 'اكتشف الجامعات والتخصصات المعتمدة',
      subtitle: 'استعرض أبرز الجامعات والمراكز البحثية العالمية المعتمدة في مختلف مسارات الابتعاث ومجالات التفوق.',
      openDirectory: 'فتح دليل الجامعات الكامل',
      searchPlaceholder: 'ابحث باسم الجامعة (Harvard, Oxford) أو التخصص (ذكاء اصطناعي، طب، هندسة)...',
      allCountries: 'كافة الدول',
      rankWorld: 'عالمياً',
      qsRank: 'الترتيب #',
      topMajors: 'أبرز التخصصات المعتمدة:',
      otherMajors: 'أخرى',
      allTracksAccredited: 'معتمدة لكافة المسارات',
      visitWebsite: 'موقع الجامعة'
    },
    unis: {
      eyebrow: 'الصروح الأكاديمية العالمية',
      title: 'اكتشف الجامعات والتخصصات المعتمدة',
      subtitle: 'استعرض أبرز الجامعات والمراكز البحثية العالمية المعتمدة في مختلف مسارات الابتعاث ومجالات التفوق.',
      openFullBtn: 'فتح دليل الجامعات الكامل',
      searchPlaceholder: 'ابحث باسم الجامعة أو التخصص الأكاديمي...',
      allCountries: 'كافة الدول',
      rankPrefix: 'تصنيف QS',
      featuredMajors: 'أبرز التخصصات المعتمدة',
      accreditedBadge: 'معتمدة في مسارات الابتعاث',
      websiteLink: 'موقع الجامعة'
    },
    faq: {
      eyebrow: 'الأسئلة الشائعة والاستفسارات',
      title: 'إجابات وحقائق عن برنامج الابتعاث',
      subtitle: 'جمعنا لك أهم الإجابات حول شروط القبول، الضمان المالي، التأشيرات، ومنظومة سفير.',
      searchPlaceholder: 'ابحث في الأسئلة الشائعة...',
      viewAllFaq: 'عرض كافة الأسئلة الشائعة',
      askAiAdvisor: 'اسأل المساعد الذكي',
      catAll: 'الكل',
      catAdmission: 'القبول والذكاء الاصطناعي',
      catTracks: 'المسارات والشروط',
      catFinancial: 'الضمان المالي',
      catDocuments: 'المستندات واللغة',
      catSafeer: 'منظومة سفير',
      catGeneral: 'النفاذ الوطني والعام'
    },
    cta: {
      eyebrow: 'الفرصة بين يديك',
      title: 'ابدأ رحلتك نحو التميز الأكاديمي العالمي اليوم',
      subtitle: 'لا تفوت فرصة الالتحاق بأفضل جامعات العالم بدعم سخي ورعاية متكاملة من قيادة الوطن.',
      startApplication: 'تقديم طلب جديد عبر النفاذ الموحد',
      exploreTracks: 'استعراض دليل مسارات الابتعاث',
      startBtn: 'تقديم طلب جديد عبر النفاذ الموحد',
      exploreBtn: 'استعراض دليل مسارات الابتعاث',
      supportNote: 'مركز رعاية المستفيدين متاح على مدار الساعة عبر الرقم الموحد: 19996'
    },
    footer: {
      aboutTitle: 'عن برنامج الابتعاث',
      aboutText: 'برنامج خادم الحرمين الشريفين للابتعاث هو المبادرة الوطنية الرائدة المنبثقة من برنامج تنمية القدرات البشرية لتحقيق مستهدفات رؤية السعودية 2030، من خلال ابتعاث خيرة الكفاءات الوطنية لأفضل المؤسسات الأكاديمية والبحثية حول العالم.',
      govPlatformNote: 'منصة حكومية رقمية موحدة تابعة لوزارة التعليم',
      tracksTitle: 'مسارات الابتعاث',
      trackPioneers: 'مسار الرواد (أفضل 30 جامعة)',
      trackSupply: 'مسار إمداد (أفضل 200 جامعة)',
      trackRd: 'مسار البحث والتطوير',
      trackExcellence: 'مسار التميز المؤسسي',
      trackHealth: 'مسار التخصصات الصحية والطبية',
      trackWaed: 'مسار واعد (الصناعات الاستراتيجية)',
      systemsTitle: 'المنظومات والخدمات',
      portalsTitle: 'المنظومات والخدمات الإلكترونية',
      portalSafeer: 'بوابة سفير للدارسين بالخارج',
      portalUnis: 'دليل الجامعات والتخصصات',
      portalAi: 'حاسبة المطابقة الذكية للابتعاث',
      portalFinancial: 'الضمان المالي الرقمي الموثق',
      portalMissions: 'الملحقيات الثقافية حول العالم',
      safeerPortal: 'بوابة سفير للدارسين بالخارج',
      uniDirectory: 'دليل الجامعات والتخصصات المعتمدة',
      smartCalc: 'حاسبة المطابقة الذكية للابتعاث',
      financialGuarantee: 'الضمان المالي الرقمي الموثق',
      missionsLink: 'الملحقيات الثقافية حول العالم',
      supportTitle: 'الدعم والتواصل',
      beneficiaryCare: 'مركز رعاية المستفيدين',
      addressKsa: 'المملكة العربية السعودية، الرياض',
      careCenter: 'مركز رعاية المستفيدين: 19996',
      email: 'scholarship@moe.gov.sa',
      location: 'المملكة العربية السعودية، الرياض',
      backToTop: 'العودة لأعلى الصفحة',
      rights: 'جميع الحقوق محفوظة © {year} برنامج خادم الحرمين الشريفين للابتعاث • وزارة التعليم، المملكة العربية السعودية',
      copyright: 'جميع الحقوق محفوظة © 2026 برنامج خادم الحرمين الشريفين للابتعاث • وزارة التعليم، المملكة العربية السعودية',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الاستخدام',
      accessibility: 'إمكانية الوصول (WCAG 2.2 AA)'
    },
    nafathModal: {
      title: 'تسجيل الدخول عبر النفاذ الوطني الموحد',
      subtitle: 'منظومة الدخول الحكومي الرقمي الموحد لربط ملفك الأكاديمي وسجل الأحوال المدنية',
      nationalIdLabel: 'رقم الهوية الوطنية أو الإقامة',
      placeholder: 'أدخل رقم الهوية (10 أرقام)',
      loginBtn: 'طلب رمز التحقق عبر تطبيق نفاذ',
      verificationStep: 'التحقق من خلال تطبيق نفاذ',
      openAppInstruction: 'افتح تطبيق نفاذ على هاتفك المحمول وقم باختيار الرقم التالي لإتمام عملية المصادقة:',
      verifying: 'بانتظار مصادقة الطلب في تطبيق نفاذ...',
      demoBypass: 'مصادقة سريعة (بيئة العرض التجريبية)',
      cancel: 'إلغاء'
    },
    aiChat: {
      title: 'المستشار الأكاديمي الذكي للابتعاث',
      subtitle: 'مستشارك الرقمي المدعوم بالذكاء الاصطناعي للإجابة عن أسئلتك واقتراح المسار المناسب',
      greeting: 'أهلاً بك! أنا مستشارك الذكي لبرنامج خادم الحرمين الشريفين للابتعاث. كيف يمكنني مساعدتك اليوم بخصوص شروط المسارات، الجامعات المعتمدة، أو آلية إصدار الضمان المالي؟',
      placeholder: 'اكتب استفسارك هنا (مثال: ما شروط مسار الرواد؟ هل جامعة أكسفورد مشمولة؟)...',
      send: 'إرسال',
      suggestedTitle: 'أسئلة شائعة مقترحة:',
      q1: 'ما هو المسار المناسب لمعدل 4.6 وتخصص ذكاء اصطناعي؟',
      q2: 'كيف يصدر الضمان المالي للتقديم على السفارة؟',
      q3: 'هل يشترط قبول غير مشروط في مسار إمداد؟',
      startAppAction: 'بدء التقديم على هذا المسار'
    },
    applicantPortal: {
      myApplications: 'طلبات الابتعاث والقرارات',
      safeerServices: 'خدمات سفير الطلابية الإلكترونية',
      advisingAppointments: 'مواعيد الإرشاد الأكاديمي مع الملحقية',
      startNewApp: 'تقديم طلب ابتعاث جديد',
      statusLabel: 'حالة الطلب',
      appNumber: 'رقم الطلب',
      uniLabel: 'الجامعة',
      majorLabel: 'التخصص',
      trackLabel: 'المسار',
      downloadGuarantee: 'تحميل الضمان المالي الموثق',
      noApps: 'لا توجد طلبات ابتعاث مسجلة حالياً.'
    },
    common: {
      loading: 'جارٍ تحميل البيانات...',
      error: 'حدث خطأ أثناء تنفيذ العملية. يرجى المحاولة لاحقاً.',
      empty: 'لا توجد بيانات متوفرة حالياً.',
      back: 'رجوع',
      next: 'التالي',
      save: 'حفظ',
      cancel: 'إلغاء',
      close: 'إغلاق',
      confirm: 'تأكيد',
      search: 'بحث',
      filter: 'تصفية',
      all: 'الكل',
      yes: 'نعم',
      no: 'لا',
      active: 'نشط',
      pending: 'قيد الإجراء',
      approved: 'معتمد',
      rejected: 'مرفوض',
      underReview: 'تحت التدقيق',
      decisionIssued: 'صدر قرار الابتعاث',
      returnToHome: 'العودة للرئيسية'
    }
  },
  en: {
    nav: {
      programTitle: 'The Scholarship Program',
      programTitleEn: 'The Scholarship Program',
      programSub: 'Unified National Overseas Scholarship Portal',
      overview: 'Home',
      tracks: 'Tracks',
      universities: 'Universities',
      guide: 'User Guide',
      missions: 'Cultural Missions',
      faq: 'FAQ',
      helpCenter: 'Help',
      applicantPortal: 'Scholar Portal',
      supervisorPortal: 'Supervisor Portal',
      adminPortal: 'Admin & Analytics',
      applyNow: 'Apply Now',
      nafathLogin: 'Sign in with Nafath',
      searchPlaceholder: 'Search tracks, universities, majors, or FAQs...',
      switchRole: 'Switch Demo Role',
      notifications: 'Notifications',
      markAllRead: 'Mark all as read',
      noNotifications: 'No new notifications',
      langName: 'العربية',
      langSwitchTitle: 'التحويل للغة العربية',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      welcomeUser: 'Welcome,'
    },
    hero: {
      eyebrow: 'Integrated National Ecosystem under Saudi Vision 2030',
      titlePart1: 'Invest in Your Academic & Career Future',
      titleHighlight: 'at the World’s Leading Universities',
      subtitle: 'The certified digital gateway to apply for and track your overseas scholarship with AI-assisted verification, direct Safeer portal integration, and instant verifiable financial guarantees.',
      ctaApply: 'Start New Application',
      ctaExploreTracks: 'Explore the 6 Scholarship Tracks',
      ctaAiFinder: 'Smart Track Matcher',
      statScholarsValue: '14,500+',
      statScholarsLabel: 'Scholars in top global institutions',
      statTracksValue: '6',
      statTracksLabel: 'Strategic tracks powering national priorities',
      statGuaranteeValue: '100%',
      statGuaranteeLabel: 'Instant digital verifiable financial guarantee',
      statAccreditedValue: '300+',
      statAccreditedLabel: 'Top-ranked universities and research centers'
    },
    infoStrip: {
      badge: 'Official Notice',
      headline: 'Applications are open year-round across all academic and professional tracks',
      pill1: 'Unconditional Admission',
      pill2: 'Instant Digital Guarantee',
      pill3: 'Direct Safeer Integration',
      action: 'Explore Track Requirements'
    },
    services: {
      eyebrow: 'Digital Services Ecosystem',
      title: 'Start Here — Direct & Fast Services',
      subtitle: 'Instant access to key services designed to streamline and accelerate your academic journey',
      serviceTracksTitle: 'Official Tracks Catalog',
      serviceTracksDesc: 'Explore criteria, eligibility, and target sectors across all 6 tracks',
      serviceCheckTitle: 'Scholarship Journey Steps',
      serviceCheckDesc: 'Review the 8 chronological milestones from admission to graduation',
      serviceUnisTitle: 'Ranked Universities',
      serviceUnisDesc: 'Accredited world-class universities and featured academic disciplines',
      serviceApplyTitle: 'Submit New Application',
      serviceApplyDesc: 'Upload your acceptance letter and apply securely via Nafath',
      serviceFaqTitle: 'Inquiries & FAQ Center',
      serviceFaqDesc: 'Clear answers regarding financial guarantees, visas, and academic rules',
      serviceAiTitle: 'AI Academic Advisor',
      serviceAiDesc: '24/7 intelligent digital advising and instant track guidance'
    },
    tracks: {
      eyebrow: 'Strategic Scholarship Tracks',
      title: 'Choose the Track That Matches Your Ambition',
      subtitle: 'Six targeted tracks derived from the Human Capability Development Program driving national leadership and global competitiveness.',
      filterAll: 'All Tracks (6)',
      detailsBtn: 'View Details & Criteria',
      applyBtn: 'Apply to this Track',
      minGpaLabel: 'Minimum Required GPA',
      rankLimitLabel: 'Global Ranking Scope',
      targetSectorsLabel: 'Key Targeted Sectors:',
      degreesLabel: 'Degrees:',
      topLabel: 'Top',
      outOfFive: 'out of 5.0',
      unconditionalBadge: 'Direct Unconditional Admission'
    },
    trackModal: {
      strategicGoal: 'Strategic Track Objective:',
      targetDegree: 'Target Degree:',
      minGpa: 'Minimum GPA:',
      rankLimit: 'Ranking Scope:',
      eligibilityCriteria: 'Track-Specific Eligibility Criteria:',
      targetSectors: 'Vital Sectors & Disciplines:',
      close: 'Close',
      applyNow: 'Start Application for this Track',
      institutionHeader: 'The Custodian of the Two Holy Mosques Scholarship Program'
    },
    journey: {
      eyebrow: 'Academic Roadmap',
      title: 'The Scholarship Journey: From Admission to Excellence',
      subtitle: 'Eight structured milestones guiding your studies and ensuring comprehensive support at every stage.',
      stepPrefix: 'Milestone',
      prevStep: 'Previous',
      nextStep: 'Next Milestone',
      step1Title: 'Securing an Accredited Admission',
      step1Desc: 'Unconditional admission letter from an accredited university within the official program list.',
      step2Title: 'Register & Upload via Nafath',
      step2Desc: 'Instant biometric verification and document upload to initiate smart evaluation.',
      step3Title: 'Smart Matching & Track Selection',
      step3Desc: 'Accurate AI evaluation of your acceptance letter and matching to the optimal track.',
      step4Title: 'Academic Review by Cultural Mission',
      step4Desc: 'Comprehensive vetting by the assigned regional cultural attaché supervisor.',
      step5Title: 'Issuance of Decision & Financial Guarantee',
      step5Desc: 'Official ministerial decree and encrypted digital financial guarantee for university and visa.',
      step6Title: 'Visa Processing & Travel Tickets (Safeer)',
      step6Desc: 'Issuance of flight ticketing and coordinating pre-departure arrangements.',
      step7Title: 'Commencement of Studies & Advising',
      step7Desc: 'Academic progress monitoring, monthly allowances, comprehensive healthcare, and honor awards.',
      step8Title: 'Graduation & National Contribution',
      step8Desc: 'Degree accreditation and integration into strategic national employment pipelines.'
    },
    strategy: {
      eyebrow: 'Saudi Vision 2030',
      title: 'Pillars of Human Capital Development Strategy',
      subtitle: 'Engineered as the primary pipeline for Saudi megaprojects and a sustainable, globally competitive knowledge economy.',
      pillar1Title: 'Developing Robust Core Capabilities',
      pillar1Desc: 'Preparing leaders and specialists in emerging disciplines to drive economic transformation.',
      pillar2Title: 'Expanding Globally Competitive Learning',
      pillar2Desc: 'Providing access to the world’s top 30 and 200 institutions for standout talent without financial barriers.',
      pillar3Title: 'Fostering Innovation & Entrepreneurship',
      pillar3Desc: 'Supporting applied research, intellectual property, tech transfer, and deep-tech venture creation.',
      pillar4Title: 'Alignment with Labor Market Needs',
      pillar4Desc: 'Directly connecting tracks to national champions and sovereign gigaprojects (NEOM, Red Sea, Qiddiya).',
      statVisionTitle: 'National 2030 Target',
      statVisionDesc: 'Empowering 70,000+ top Saudi talents to lead transformation across strategic future industries.',
      humanCapabilityBadge: 'Human Capability Development Program',
      visionBadge: 'Saudi Vision 2030'
    },
    aiFinder: {
      eyebrow: 'Digital Academic Guidance',
      title: 'Smart Scholarship Track Matcher',
      subtitle: 'Enter your academic credentials and language scores to receive instant matching and tailored track recommendations.',
      stepDegree: '1. Target Academic Degree',
      degreeBachelor: 'Bachelor’s Degree',
      degreeMaster: 'Master’s Degree',
      degreePhD: 'PhD / Doctoral Research',
      degreeFellowship: 'Medical Fellowship / Residency',
      stepGpa: '2. Cumulative GPA (out of 5.0)',
      stepIelts: '3. IELTS Language Score',
      stepField: '4. Sector of Interest',
      fieldAI: 'Artificial Intelligence & Advanced Tech',
      fieldIndustry: 'Supply Chains & National Industry',
      fieldResearch: 'Scientific Research & Energy Innovation',
      fieldMegaprojects: 'Architecture, Tourism & Megaprojects',
      fieldHealth: 'Medicine, Fellowships & Healthcare',
      fieldFuture: 'Space, Clean Hydrogen & Semiconductors',
      calcBtn: 'Analyze Profile & Match Instantly',
      resultTitle: 'Smart Match Recommendation',
      matchScore: 'Academic Compatibility',
      eligibleStatus: 'Eligible for Track',
      criteriaPassed: 'Track criteria successfully met',
      applyThisTrack: 'Apply Directly to this Track',
      recalculate: 'Reset Parameters'
    },
    universities: {
      eyebrow: 'World-Class Academic Institutions',
      title: 'Explore Accredited Universities & Majors',
      subtitle: 'Browse world-renowned universities and research centers certified across all scholarship tracks.',
      openDirectory: 'Open Full Universities Directory',
      searchPlaceholder: 'Search by university name (Harvard, Oxford) or major (AI, Medicine, Engineering)...',
      allCountries: 'All Countries',
      rankWorld: 'globally',
      qsRank: 'Rank #',
      topMajors: 'Featured Accredited Majors:',
      otherMajors: 'more',
      allTracksAccredited: 'Accredited for All Tracks',
      visitWebsite: 'University Website'
    },
    unis: {
      eyebrow: 'World-Class Academic Institutions',
      title: 'Explore Accredited Universities & Majors',
      subtitle: 'Browse world-renowned universities and research centers certified across all scholarship tracks.',
      openFullBtn: 'Open Full Universities Directory',
      searchPlaceholder: 'Search by university or academic major...',
      allCountries: 'All Countries',
      rankPrefix: 'QS Rank',
      featuredMajors: 'Featured Accredited Majors',
      accreditedBadge: 'Accredited for Scholarship',
      websiteLink: 'University Website'
    },
    faq: {
      eyebrow: 'Frequently Asked Questions',
      title: 'Facts & Answers About the Scholarship Program',
      subtitle: 'Essential answers regarding admission rules, financial guarantees, visas, and the Safeer ecosystem.',
      searchPlaceholder: 'Search FAQs...',
      viewAllFaq: 'View All FAQ Articles',
      askAiAdvisor: 'Consult AI Advisor',
      catAll: 'All',
      catAdmission: 'Admission & AI',
      catTracks: 'Tracks & Criteria',
      catFinancial: 'Financial Guarantee',
      catDocuments: 'Documents & Tests',
      catSafeer: 'Safeer Portal',
      catGeneral: 'Nafath & General'
    },
    cta: {
      eyebrow: 'The Opportunity Awaits',
      title: 'Begin Your Journey Toward Global Academic Excellence Today',
      subtitle: 'Join the world’s most prestigious institutions backed by complete government sponsorship and support.',
      startApplication: 'Start New Application via Nafath',
      exploreTracks: 'Browse Scholarship Tracks Catalog',
      startBtn: 'Start New Application via Nafath',
      exploreBtn: 'Browse Scholarship Tracks Catalog',
      supportNote: 'Beneficiary Care Center is available 24/7 via toll-free number: 19996'
    },
    footer: {
      aboutTitle: 'About the Scholarship Program',
      aboutText: 'The Custodian of the Two Holy Mosques Scholarship Program is the premier national initiative stemming from the Human Capability Development Program to realize Saudi Vision 2030 by sending distinguished Saudi talents to the world’s top academic and research institutions.',
      govPlatformNote: 'Official unified digital government platform under the Ministry of Education',
      tracksTitle: 'Scholarship Tracks',
      trackPioneers: 'Pioneers Track (Top 30 Universities)',
      trackSupply: 'Imdad Track (Top 200 Universities)',
      trackRd: 'Research & Development Track',
      trackExcellence: 'Institutional Excellence Track',
      trackHealth: 'Healthcare & Medical Track',
      trackWaed: 'Waed Track (Strategic Industries)',
      systemsTitle: 'Portals & Services',
      portalsTitle: 'Digital Portals & E-Services',
      portalSafeer: 'Safeer Portal for Overseas Students',
      portalUnis: 'Universities & Majors Directory',
      portalAi: 'Smart Scholarship Matcher',
      portalFinancial: 'Verified Digital Guarantee',
      portalMissions: 'Saudi Cultural Missions Worldwide',
      safeerPortal: 'Safeer Portal for Overseas Students',
      uniDirectory: 'Accredited Universities & Majors Directory',
      smartCalc: 'Smart Scholarship Eligibility Matcher',
      financialGuarantee: 'Verified Digital Financial Guarantee',
      missionsLink: 'Saudi Cultural Missions Worldwide',
      supportTitle: 'Support & Contact',
      beneficiaryCare: 'Beneficiary Care Center',
      addressKsa: 'Riyadh, Kingdom of Saudi Arabia',
      careCenter: 'Beneficiary Care Center: 19996',
      email: 'scholarship@moe.gov.sa',
      location: 'Riyadh, Kingdom of Saudi Arabia',
      backToTop: 'Back to Top',
      rights: 'All rights reserved © {year} The Custodian of the Two Holy Mosques Scholarship Program • Ministry of Education, Kingdom of Saudi Arabia',
      copyright: 'All rights reserved © 2026 The Custodian of the Two Holy Mosques Scholarship Program • Ministry of Education, Kingdom of Saudi Arabia',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      accessibility: 'Accessibility (WCAG 2.2 AA)'
    },
    nafathModal: {
      title: 'Sign in via Unified National Nafath',
      subtitle: 'Official single sign-on system integrating your academic records and civil registry',
      nationalIdLabel: 'National ID or Iqama Number',
      placeholder: 'Enter 10-digit National ID',
      loginBtn: 'Request Verification via Nafath App',
      verificationStep: 'Verification via Nafath App',
      openAppInstruction: 'Open the Nafath mobile app on your smartphone and select the following number to confirm authentication:',
      verifying: 'Waiting for authentication in Nafath app...',
      demoBypass: 'Fast Authentication (Demo Mode)',
      cancel: 'Cancel'
    },
    aiChat: {
      title: 'Smart Scholarship Academic Advisor',
      subtitle: 'AI-powered advisor providing instant answers and personalized track recommendations',
      greeting: 'Welcome! I am your Smart Academic Advisor for the Custodian of the Two Holy Mosques Scholarship Program. How can I assist you today regarding track criteria, accredited universities, or financial guarantee issuance?',
      placeholder: 'Type your inquiry here (e.g., What are the Pioneers Track criteria? Is Oxford included?)...',
      send: 'Send',
      suggestedTitle: 'Suggested Inquiries:',
      q1: 'Which track matches GPA 4.6 in Artificial Intelligence?',
      q2: 'How is the financial guarantee issued for visa application?',
      q3: 'Is unconditional admission required for Imdad Track?',
      startAppAction: 'Start Application for this Track'
    },
    applicantPortal: {
      myApplications: 'Scholarship Applications & Decisions',
      safeerServices: 'Safeer Online Student Services',
      advisingAppointments: 'Academic Advising Appointments',
      startNewApp: 'Start New Scholarship Application',
      statusLabel: 'Application Status',
      appNumber: 'Application #',
      uniLabel: 'University',
      majorLabel: 'Major',
      trackLabel: 'Track',
      downloadGuarantee: 'Download Verified Guarantee',
      noApps: 'No scholarship applications recorded yet.'
    },
    common: {
      loading: 'Loading data...',
      error: 'An error occurred. Please try again later.',
      empty: 'No data currently available.',
      back: 'Back',
      next: 'Next',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      confirm: 'Confirm',
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      yes: 'Yes',
      no: 'No',
      active: 'Active',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      underReview: 'Under Review',
      decisionIssued: 'Decision Issued',
      returnToHome: 'Return to Home'
    }
  }
};
