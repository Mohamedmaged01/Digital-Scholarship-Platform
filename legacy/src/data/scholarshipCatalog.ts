import { CountryInfo, CulturalMission, FaqItem, Track, University, UserGuideStep } from '../types';

export const ALL_SIX_TRACKS: Track[] = [
  {
    id: 'track-pioneers',
    code: 'PIONEERS',
    nameAr: 'مسار الرواد',
    nameEn: 'Pioneers Track',
    descriptionAr: 'ابتعاث الطلاب إلى أفضل 30 جامعة ومؤسسة تعليمية على مستوى العالم لدراسة برامج البكالوريوس والماجستير والدكتوراه.',
    descriptionEn: 'Scholarships to the top 30 ranked global universities for Bachelor, Master, and PhD degrees with direct unconditional admission.',
    badgeColor: 'emerald',
    minGpa: 4.5,
    maxAge: 35,
    requiredDegree: ['Bachelor', 'Master', 'PhD'],
    requiredIelts: 7.0,
    requiredToefl: 100,
    topUniversitiesRankLimit: 30,
    targetSectors: ['الذكاء الاصطناعي', 'التقنيات المتقدمة', 'السياسات العامة', 'الطب الحيوي', 'الفضاء والفيزياء'],
    allocatedSeats: 2500,
    filledSeats: 1840,
    isActive: true,
    features: [
      'قبول غير مشروط من أفضل 30 جامعة عالمياً',
      'تغطية مالية شاملة مع مخصصات تميز شهرية',
      'مسار سريع لإصدار الضمان المالي الفوري',
      'إشراف أكاديمي وبحثي مباشر من الملحقية'
    ]
  },
  {
    id: 'track-supply',
    code: 'IMDAD',
    nameAr: 'مسار إمداد',
    nameEn: 'Supply Track (Imdad)',
    descriptionAr: 'تلبية احتياجات سوق العمل الوطني في التخصصات الواعدة والحرجة بأفضل 200 جامعة عالمياً للمرحلتين البكالوريوس والماجستير.',
    descriptionEn: 'Fulfilling national labor market demands in strategic and high-growth sectors across top 200 international universities.',
    badgeColor: 'blue',
    minGpa: 3.5,
    maxAge: 40,
    requiredDegree: ['Bachelor', 'Master'],
    requiredIelts: 6.5,
    requiredToefl: 90,
    topUniversitiesRankLimit: 200,
    targetSectors: ['سلاسل الإمداد واللوجستيات', 'الأمن السيبراني', 'الطاقة المتجددة', 'الضيافة والسياحة', 'التمويل الرقمي'],
    allocatedSeats: 5000,
    filledSeats: 3920,
    isActive: true,
    features: [
      'قائمة واسعة تضم أفضل 200 جامعة عالمية',
      'ربط مباشر مع الشركاء وجهات التوظيف الوطنية',
      'دعم برامج التدريب الصيفي العملي التعاوني',
      'فرص تدريب مهني مع كبرى الشركات العالمية'
    ]
  },
  {
    id: 'track-rd',
    code: 'RD',
    nameAr: 'مسار البحث والتطوير',
    nameEn: 'R&D Track',
    descriptionAr: 'تأهيل الباحثين والعلماء في مجالات الأولويات الوطنية للبحث والتطوير والابتكار في درجات الماجستير والدكتوراه.',
    descriptionEn: 'Cultivating top researchers and scientists in national R&D priority areas for graduate research degrees.',
    badgeColor: 'purple',
    minGpa: 4.0,
    maxAge: 45,
    requiredDegree: ['Master', 'PhD'],
    requiredIelts: 7.5,
    requiredToefl: 105,
    topUniversitiesRankLimit: 100,
    targetSectors: ['الصحة والحياة', 'استدامة البيئة والاحتياجات الأساسية', 'الريادة في الطاقة والصناعة', 'اقتصاديات المستقبل'],
    allocatedSeats: 1500,
    filledSeats: 970,
    isActive: true,
    features: [
      'تمويل أبحاث وميزانية مخصصة للمختبرات والمؤتمرات',
      'شراكات بحثية مع مدينة الملك عبد العزيز وجامعة كاوست',
      'أولوية التعيين في مراكز الابتكار الوطنية',
      'برامج ما بعد الدكتوراه وزمالات الأبحاث المتقدمة'
    ]
  },
  {
    id: 'track-excellence',
    code: 'EXCELLENCE',
    nameAr: 'مسار التميز',
    nameEn: 'Excellence Track',
    descriptionAr: 'الابتعاث في تخصصات نوعية محددة تدعم مشاريع رؤية المملكة 2030 الكبرى في أفضل 70 جامعة دولية.',
    descriptionEn: 'Scholarships in specialized disciplines powering Saudi Vision 2030 megaprojects in top 70 universities.',
    badgeColor: 'amber',
    minGpa: 4.8,
    maxAge: 30,
    requiredDegree: ['Bachelor', 'Master'],
    requiredIelts: 8.0,
    requiredToefl: 110,
    topUniversitiesRankLimit: 70,
    targetSectors: ['فنون الطهي والضيافة الفاخرة', 'الإنتاج السينمائي والوسائط الرقمية', 'التصميم الحضري والعمارة', 'علوم المحيطات والبيئة البحرية'],
    allocatedSeats: 2000,
    filledSeats: 1460,
    isActive: true,
    features: [
      'تخصصات إبداعية ونوعية تدعم نيوم والقدية والبحر الأحمر',
      'برامج توجيه قيادي مع خبراء دوليين',
      'مكافأة تميز للمتفوقين أكاديمياً',
      'مسار مهني مباشر مع المشاريع الكبرى'
    ]
  },
  {
    id: 'track-health',
    code: 'HEALTH',
    nameAr: 'المسار الصحي',
    nameEn: 'Healthcare & Medical Track',
    descriptionAr: 'تأهيل الكوادر الطبية والصحية الوطنية في برامج الإقامة الطبية والزمالات الدقيقة والتخصصات الصحية النادرة في أرقى المستشفيات الجامعية.',
    descriptionEn: 'Specialized healthcare and clinical fellowships, medical residencies, and nursing specializations at top global academic medical centers.',
    badgeColor: 'rose',
    minGpa: 4.2,
    maxAge: 40,
    requiredDegree: ['Bachelor', 'Master', 'PhD', 'Fellowship'],
    requiredIelts: 7.5,
    requiredToefl: 100,
    topUniversitiesRankLimit: 50,
    targetSectors: ['جراحة الأورام الدقيقة', 'طب الطوارئ والكوارث', 'علم الجينوم الطبي', 'التمريض المتقدم', 'الصحة الرقمية والذكاء الاصطناعي الطبي'],
    allocatedSeats: 1800,
    filledSeats: 1210,
    isActive: true,
    features: [
      'ابتعاث للزمالات الطبية والبورد الأمريكي والكندي والأوروبي',
      'تغطية رسوم التدريب السريري والتأمين الطبي المهني الكامل',
      'شراكة مع الهيئة السعودية للتخصصات الصحية (SCFHS)',
      'أولوية التعيين في المدن والمستشفيات التخصصية الكبرى'
    ]
  },
  {
    id: 'track-waed',
    code: 'WAED',
    nameAr: 'مسار واعد',
    nameEn: 'Wa\'ed Track (Promising Sectors)',
    descriptionAr: 'ابتعاث الطلاب في قطاعات الابتكار والتقنيات الناشئة والصناعات الاستراتيجية المتقدمة وفق اتفاقيات الرعاية مع كبرى الشركات الوطنية.',
    descriptionEn: 'Scholarships in promising future industries and emerging technologies co-sponsored with Saudi national champions and sovereign entities.',
    badgeColor: 'teal',
    minGpa: 3.8,
    maxAge: 32,
    requiredDegree: ['Bachelor', 'Master'],
    requiredIelts: 6.5,
    requiredToefl: 90,
    topUniversitiesRankLimit: 150,
    targetSectors: ['صناعة الفضاء والأقمار الاصطناعية', 'الهيدروجين الأخضر والطاقة النظيفة', 'أشباه الموصلات والرقائق', 'الروبوتات والأتمتة الصناعية', 'التعدين المتقدم'],
    allocatedSeats: 2200,
    filledSeats: 1530,
    isActive: true,
    features: [
      'عقود تدريب وتوظيف مسبق مع الشركاء الصناعيين',
      'مشاريع تخرج تطبيقية مرتبطة بالصناعات الوطنية',
      'فرص حضور المعارض والمؤتمرات التقنية العالمية',
      'حوافز ابتكار وبراءات اختراع مدفوعة'
    ]
  }
];

export const UNIVERSITIES_DATABASE: University[] = [
  {
    id: 'uni-mit',
    nameAr: 'معهد ماساتشوستس للتكنولوجيا',
    nameEn: 'Massachusetts Institute of Technology (MIT)',
    country: 'الولايات المتحدة الأمريكية',
    countryEn: 'United States',
    countryCode: 'US',
    city: 'كامبريدج، ماساتشوستس',
    qsRank: 1,
    theRank: 2,
    accreditedTracks: ['track-pioneers', 'track-rd', 'track-waed'],
    topMajorsAr: ['الذكاء الاصطناعي وتعلم الآلة', 'علوم وهندسة الحاسب', 'هندسة الطيران والفضاء', 'الهندسة الميكانيكية', 'الفيزياء الكمية'],
    topMajorsEn: ['Artificial Intelligence & ML', 'Computer Science & Engineering', 'Aerospace Engineering', 'Mechanical Engineering', 'Quantum Physics'],
    degreesAvailable: ['Bachelor', 'Master', 'PhD'],
    minIelts: 7.5,
    minToefl: 100,
    isTop30: true,
    isTop100: true,
    isTop200: true,
    websiteUrl: 'https://www.mit.edu',
    acceptanceRate: '3.9%',
    culturalMissionId: 'sacm-us',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni-stanford',
    nameAr: 'جامعة ستانفورد',
    nameEn: 'Stanford University',
    country: 'الولايات المتحدة الأمريكية',
    countryEn: 'United States',
    countryCode: 'US',
    city: 'ستانفورد، كاليفورنيا',
    qsRank: 2,
    theRank: 3,
    accreditedTracks: ['track-pioneers', 'track-rd', 'track-excellence', 'track-waed'],
    topMajorsAr: ['علوم البيانات والذكاء الاصطناعي', 'إدارة الأعمال والتقنية', 'الهندسة الكهربائية', 'العلوم البيولوجية', 'السياسات العامة'],
    topMajorsEn: ['Data Science & AI', 'Business & Tech Management', 'Electrical Engineering', 'Biological Sciences', 'Public Policy'],
    degreesAvailable: ['Bachelor', 'Master', 'PhD'],
    minIelts: 7.5,
    minToefl: 102,
    isTop30: true,
    isTop100: true,
    isTop200: true,
    websiteUrl: 'https://www.stanford.edu',
    acceptanceRate: '3.7%',
    culturalMissionId: 'sacm-us',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni-oxford',
    nameAr: 'جامعة أكسفورد',
    nameEn: 'University of Oxford',
    country: 'المملكة المتحدة',
    countryEn: 'United Kingdom',
    countryCode: 'GB',
    city: 'أكسفورد',
    qsRank: 3,
    theRank: 1,
    accreditedTracks: ['track-pioneers', 'track-rd', 'track-excellence', 'track-health'],
    topMajorsAr: ['الفلسفة والسياسة والاقتصاد (PPE)', 'العلوم الطبية وعلم الجينات', 'القانون الدولي', 'علوم الحاسب', 'الفيزياء التطبيقية'],
    topMajorsEn: ['PPE (Politics, Philosophy & Economics)', 'Medical Sciences & Genomics', 'International Law', 'Computer Science', 'Applied Physics'],
    degreesAvailable: ['Bachelor', 'Master', 'PhD', 'Fellowship'],
    minIelts: 7.5,
    minToefl: 110,
    isTop30: true,
    isTop100: true,
    isTop200: true,
    websiteUrl: 'https://www.ox.ac.uk',
    acceptanceRate: '14.2%',
    culturalMissionId: 'sacm-uk',
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni-harvard',
    nameAr: 'جامعة هارفارد',
    nameEn: 'Harvard University',
    country: 'الولايات المتحدة الأمريكية',
    countryEn: 'United States',
    countryCode: 'US',
    city: 'كامبريدج، ماساتشوستس',
    qsRank: 4,
    theRank: 4,
    accreditedTracks: ['track-pioneers', 'track-health', 'track-excellence', 'track-rd'],
    topMajorsAr: ['الطب البشري وجراحة القلب', 'الصحة العامة العالمية', 'السياسات الحكومية والقانون', 'إدارة الأعمال', 'العلوم العصبية'],
    topMajorsEn: ['Medicine & Cardiac Surgery', 'Global Public Health', 'Government & Law', 'Business Administration', 'Neuroscience'],
    degreesAvailable: ['Bachelor', 'Master', 'PhD', 'Fellowship'],
    minIelts: 8.0,
    minToefl: 108,
    isTop30: true,
    isTop100: true,
    isTop200: true,
    websiteUrl: 'https://www.harvard.edu',
    acceptanceRate: '3.4%',
    culturalMissionId: 'sacm-us',
    imageUrl: 'https://images.unsplash.com/photo-1559135197-8a45ea74d56d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni-cambridge',
    nameAr: 'جامعة كامبريدج',
    nameEn: 'University of Cambridge',
    country: 'المملكة المتحدة',
    countryEn: 'United Kingdom',
    countryCode: 'GB',
    city: 'كامبريدج',
    qsRank: 5,
    theRank: 5,
    accreditedTracks: ['track-pioneers', 'track-rd', 'track-excellence', 'track-waed'],
    topMajorsAr: ['الرياضيات البحتة والتطبيقية', 'هندسة المواد والمقاييس', 'العلوم الطبيعية', 'العمارة والتصميم المستدام', 'علم الوراثة'],
    topMajorsEn: ['Pure & Applied Mathematics', 'Materials Engineering', 'Natural Sciences', 'Architecture & Sustainable Design', 'Genetics'],
    degreesAvailable: ['Bachelor', 'Master', 'PhD'],
    minIelts: 7.5,
    minToefl: 110,
    isTop30: true,
    isTop100: true,
    isTop200: true,
    websiteUrl: 'https://www.cam.ac.uk',
    acceptanceRate: '15.7%',
    culturalMissionId: 'sacm-uk',
    imageUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni-imperial',
    nameAr: 'إمبريال كوليدج لندن',
    nameEn: 'Imperial College London',
    country: 'المملكة المتحدة',
    countryEn: 'United Kingdom',
    countryCode: 'GB',
    city: 'لندن',
    qsRank: 6,
    theRank: 8,
    accreditedTracks: ['track-pioneers', 'track-supply', 'track-rd', 'track-health', 'track-waed'],
    topMajorsAr: ['الأمن السيبراني والشبكات', 'هندسة البترول والطاقة المتجددة', 'الطب الحيوي والهندسة الطبية', 'تحليلات البيانات المالية', 'الروبوتات'],
    topMajorsEn: ['Cybersecurity & Networks', 'Petroleum & Renewable Energy', 'Biomedical Engineering', 'Financial Data Analytics', 'Robotics'],
    degreesAvailable: ['Bachelor', 'Master', 'PhD'],
    minIelts: 7.0,
    minToefl: 100,
    isTop30: true,
    isTop100: true,
    isTop200: true,
    websiteUrl: 'https://www.imperial.ac.uk',
    acceptanceRate: '11.8%',
    culturalMissionId: 'sacm-uk',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni-eth-zurich',
    nameAr: 'المعهد الفيدرالي السويسري للتكنولوجيا (ETH Zurich)',
    nameEn: 'ETH Zurich - Swiss Federal Institute of Technology',
    country: 'سويسرا',
    countryEn: 'Switzerland',
    countryCode: 'CH',
    city: 'زيورخ',
    qsRank: 7,
    theRank: 11,
    accreditedTracks: ['track-pioneers', 'track-rd', 'track-waed'],
    topMajorsAr: ['الهندسة الميكانيكية والمعالجات', 'فيزياء الطاقة العالية', 'الروبوتات المستقلة', 'علوم الأرض والاستدامة', 'العلوم الحاسوبية'],
    topMajorsEn: ['Mechanical Engineering & Process', 'High Energy Physics', 'Autonomous Robotics', 'Earth Sciences & Sustainability', 'Computational Sciences'],
    degreesAvailable: ['Bachelor', 'Master', 'PhD'],
    minIelts: 7.0,
    minToefl: 100,
    isTop30: true,
    isTop100: true,
    isTop200: true,
    websiteUrl: 'https://ethz.ch',
    acceptanceRate: '27.0%',
    culturalMissionId: 'sacm-de',
    imageUrl: 'https://images.unsplash.com/photo-1527891751199-722e234c7ca6?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni-nus',
    nameAr: 'جامعة سنغافورة الوطنية (NUS)',
    nameEn: 'National University of Singapore (NUS)',
    country: 'سنغافورة',
    countryEn: 'Singapore',
    countryCode: 'SG',
    city: 'سنغافورة',
    qsRank: 8,
    theRank: 19,
    accreditedTracks: ['track-pioneers', 'track-supply', 'track-rd', 'track-waed'],
    topMajorsAr: ['سلاسل الإمداد وإدارة اللوجستيات', 'الذكاء الاصطناعي وأنظمة المعلومات', 'الهندسة الكيميائية والبيئية', 'التمويل الكمي', 'التكنولوجيا الحيوية'],
    topMajorsEn: ['Supply Chain & Logistics', 'AI & Information Systems', 'Chemical & Environmental Engineering', 'Quantitative Finance', 'Biotechnology'],
    degreesAvailable: ['Bachelor', 'Master', 'PhD'],
    minIelts: 7.0,
    minToefl: 95,
    isTop30: true,
    isTop100: true,
    isTop200: true,
    websiteUrl: 'https://nus.edu.sg',
    acceptanceRate: '5.0%',
    culturalMissionId: 'sacm-cn',
    imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni-ucl',
    nameAr: 'كلية لندن الجامعية (UCL)',
    nameEn: 'University College London (UCL)',
    country: 'المملكة المتحدة',
    countryEn: 'United Kingdom',
    countryCode: 'GB',
    city: 'لندن',
    qsRank: 9,
    theRank: 22,
    accreditedTracks: ['track-pioneers', 'track-supply', 'track-excellence', 'track-health'],
    topMajorsAr: ['التخطيط العمراني وتصميم المدن الذكية', 'العلوم العصبية والطب الدقيق', 'التعليم وتطوير السياسات', 'الهندسة المدنية المستدامة'],
    topMajorsEn: ['Urban Planning & Smart Cities', 'Neuroscience & Precision Medicine', 'Education & Policy', 'Sustainable Civil Engineering'],
    degreesAvailable: ['Bachelor', 'Master', 'PhD'],
    minIelts: 7.0,
    minToefl: 100,
    isTop30: true,
    isTop100: true,
    isTop200: true,
    websiteUrl: 'https://www.ucl.ac.uk',
    acceptanceRate: '12.0%',
    culturalMissionId: 'sacm-uk',
    imageUrl: 'https://images.unsplash.com/photo-1548625361-195fe578cb26?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni-caltech',
    nameAr: 'معهد كاليفورنيا للتقنية (Caltech)',
    nameEn: 'California Institute of Technology (Caltech)',
    country: 'الولايات المتحدة الأمريكية',
    countryEn: 'United States',
    countryCode: 'US',
    city: 'باسادينا، كاليفورنيا',
    qsRank: 10,
    theRank: 7,
    accreditedTracks: ['track-pioneers', 'track-rd', 'track-waed'],
    topMajorsAr: ['فيزياء الفلك وعلوم الفضاء', 'الهندسة الكيميائية النانوية', 'الحوسبة الكمية', 'علوم الزلازل والجيوفيزياء'],
    topMajorsEn: ['Astrophysics & Space Science', 'Nano Chemical Engineering', 'Quantum Computing', 'Seismology & Geophysics'],
    degreesAvailable: ['Bachelor', 'Master', 'PhD'],
    minIelts: 7.5,
    minToefl: 105,
    isTop30: true,
    isTop100: true,
    isTop200: true,
    websiteUrl: 'https://www.caltech.edu',
    acceptanceRate: '2.7%',
    culturalMissionId: 'sacm-us',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni-jhu',
    nameAr: 'جامعة جونز هوبكنز',
    nameEn: 'Johns Hopkins University (JHU)',
    country: 'الولايات المتحدة الأمريكية',
    countryEn: 'United States',
    countryCode: 'US',
    city: 'بالتيمور، ميريلاند',
    qsRank: 28,
    theRank: 15,
    accreditedTracks: ['track-pioneers', 'track-health', 'track-rd'],
    topMajorsAr: ['الطب السريري والزمالات الجراحية', 'الصحة العامة والأوبئة', 'الهندسة الطبية الحيوية', 'إدارة النظم الصحية', 'علم المناعة واللقاحات'],
    topMajorsEn: ['Clinical Medicine & Surgical Fellowships', 'Public Health & Epidemiology', 'Biomedical Engineering', 'Health Systems Management', 'Immunology & Vaccines'],
    degreesAvailable: ['Master', 'PhD', 'Fellowship'],
    minIelts: 7.5,
    minToefl: 105,
    isTop30: true,
    isTop100: true,
    isTop200: true,
    websiteUrl: 'https://www.jhu.edu',
    acceptanceRate: '7.5%',
    culturalMissionId: 'sacm-us',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni-toronto',
    nameAr: 'جامعة تورنتو',
    nameEn: 'University of Toronto',
    country: 'كندا',
    countryEn: 'Canada',
    countryCode: 'CA',
    city: 'تورنتو، أونتاريو',
    qsRank: 21,
    theRank: 18,
    accreditedTracks: ['track-pioneers', 'track-supply', 'track-health', 'track-rd'],
    topMajorsAr: ['علم الأعصاب الحسابي', 'الطب المخبري', 'التمويل والمحاسبة الدولية', 'الذكاء الاصطناعي وهندسة البرمجيات'],
    topMajorsEn: ['Computational Neuroscience', 'Laboratory Medicine', 'International Finance', 'AI & Software Engineering'],
    degreesAvailable: ['Bachelor', 'Master', 'PhD', 'Fellowship'],
    minIelts: 7.0,
    minToefl: 100,
    isTop30: true,
    isTop100: true,
    isTop200: true,
    websiteUrl: 'https://www.utoronto.ca',
    acceptanceRate: '43.0%',
    culturalMissionId: 'sacm-ca',
    imageUrl: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni-melbourne',
    nameAr: 'جامعة ملبورن',
    nameEn: 'University of Melbourne',
    country: 'أستراليا',
    countryEn: 'Australia',
    countryCode: 'AU',
    city: 'ملبورن، فيكتوريا',
    qsRank: 14,
    theRank: 37,
    accreditedTracks: ['track-pioneers', 'track-supply', 'track-rd', 'track-waed'],
    topMajorsAr: ['علوم البيئة والتنوع الحيوي', 'الهندسة المدنية والإنشائية', 'القانون التجاري الدولي', 'التمريض المتقدم'],
    topMajorsEn: ['Environmental Science', 'Civil & Structural Engineering', 'International Commercial Law', 'Advanced Nursing'],
    degreesAvailable: ['Bachelor', 'Master', 'PhD'],
    minIelts: 6.5,
    minToefl: 90,
    isTop30: true,
    isTop100: true,
    isTop200: true,
    websiteUrl: 'https://www.unimelb.edu.au',
    acceptanceRate: '70.0%',
    culturalMissionId: 'sacm-au',
    imageUrl: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni-tokyo',
    nameAr: 'جامعة طوكيو',
    nameEn: 'The University of Tokyo',
    country: 'اليابان',
    countryEn: 'Japan',
    countryCode: 'JP',
    city: 'طوكيو',
    qsRank: 28,
    theRank: 29,
    accreditedTracks: ['track-pioneers', 'track-rd', 'track-waed'],
    topMajorsAr: ['الروبوتات المتقدمة والأتمتة', 'هندسة أشباه الموصلات', 'العلوم الفيزيائية والنووية', 'هندسة المواد الدقيقة'],
    topMajorsEn: ['Advanced Robotics & Automation', 'Semiconductor Engineering', 'Physical & Nuclear Sciences', 'Micro Materials Engineering'],
    degreesAvailable: ['Master', 'PhD'],
    minIelts: 7.0,
    minToefl: 95,
    isTop30: true,
    isTop100: true,
    isTop200: true,
    websiteUrl: 'https://www.u-tokyo.ac.jp',
    acceptanceRate: '34.0%',
    culturalMissionId: 'sacm-jp',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni-tum',
    nameAr: 'جامعة ميونخ التقنية (TUM)',
    nameEn: 'Technical University of Munich (TUM)',
    country: 'ألمانيا',
    countryEn: 'Germany',
    countryCode: 'DE',
    city: 'ميونخ، بافاريا',
    qsRank: 37,
    theRank: 30,
    accreditedTracks: ['track-supply', 'track-rd', 'track-waed'],
    topMajorsAr: ['هندسة السيارات الكهربائية وأنظمة الدفع', 'الذكاء الاصطناعي الصناعي', 'المعلوماتية الطبية', 'الهندسة الكيميائية الصناعية'],
    topMajorsEn: ['EV Engineering & Powertrains', 'Industrial AI', 'Medical Informatics', 'Industrial Chemical Engineering'],
    degreesAvailable: ['Bachelor', 'Master', 'PhD'],
    minIelts: 6.5,
    minToefl: 88,
    isTop30: false,
    isTop100: true,
    isTop200: true,
    websiteUrl: 'https://www.tum.de',
    acceptanceRate: '24.0%',
    culturalMissionId: 'sacm-de',
    imageUrl: 'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni-sorbonne',
    nameAr: 'جامعة السوربون',
    nameEn: 'Sorbonne University',
    country: 'فرنسا',
    countryEn: 'France',
    countryCode: 'FR',
    city: 'باريس',
    qsRank: 59,
    theRank: 75,
    accreditedTracks: ['track-excellence', 'track-rd', 'track-health'],
    topMajorsAr: ['علم المحيطات والبيئة البحرية', 'الطب وعلم الأعصاب', 'فلسفة وتاريخ العلوم', 'الرياضيات المتقدمة'],
    topMajorsEn: ['Oceanography & Marine Environment', 'Medicine & Neuroscience', 'Philosophy of Science', 'Advanced Mathematics'],
    degreesAvailable: ['Bachelor', 'Master', 'PhD', 'Fellowship'],
    minIelts: 6.5,
    minToefl: 90,
    isTop30: false,
    isTop100: true,
    isTop200: true,
    websiteUrl: 'https://www.sorbonne-universite.fr',
    acceptanceRate: '29.0%',
    culturalMissionId: 'sacm-fr',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80'
  }
];

export const FAQ_DATABASE: FaqItem[] = [
  // 1. Admission Category (القبول والتسجيل)
  {
    id: 'faq-adm-1',
    category: 'admission',
    tags: ['القبول', 'الذكاء الاصطناعي', 'التدقيق'],
    questionAr: 'كيف يعمل نظام فحص وتدقيق القبول بالذكاء الاصطناعي في منصة قبول؟',
    questionEn: 'How does the AI smart admission verification work in the platform?',
    answerAr: 'يقوم النظام فور رفع خطاب القبول الجامعي (PDF) بتشغيل محرك OCR متقدم وتحليل لغوي BERT لاستخراج اسم الجامعة، التخصص، نوع القبول (مشروط/غير مشروط)، الدرجة العلمية، والتحقق التلقائي مع قوائم الجامعات المعتمدة وتحديد المسار المطابق بدقة تتجاوز 98%.',
    answerEn: 'Upon uploading your university acceptance letter, our advanced OCR and NLP engine extracts key entities (institution, major, unconditional status, degree level) and matches them instantly against approved lists.'
  },
  {
    id: 'faq-adm-2',
    category: 'admission',
    tags: ['قبول مشروط', 'لغة إنجليزية', 'Direct Entry'],
    questionAr: 'هل يمكن التقديم بقبول مشروط بدراسة مرحلة اللغة الإنجليزية؟',
    questionEn: 'Can I apply with a conditional offer requiring an English language preparation year?',
    answerAr: 'المسارات الاستراتيجية (كالرواد وإمداد والبحث والتطوير) تتطلب قبولاً أكاديمياً نهائياً ومباشراً غير مشروط لدراسة الدرجة العلمية (Direct Entry). ويجب استيفاء شرط اللغة قبل صدور قرار الابتعاث.',
    answerEn: 'Strategic tracks strictly require direct unconditional admission into the academic degree (Direct Entry). Language qualifications must be met prior to scholarship decree issuance.'
  },

  // 2. Tracks Category (المسارات)
  {
    id: 'faq-trk-1',
    category: 'tracks',
    tags: ['المسارات', 'شروط', 'الرواد', 'إمداد'],
    questionAr: 'ما هو الفرق الجوهري بين مسار الرواد ومسار إمداد؟',
    questionEn: 'What is the key difference between Pioneers Track and Supply (Imdad) Track?',
    answerAr: 'مسار الرواد مخصص للابتعاث إلى أفضل 30 جامعة ومؤسسة تعليمية على مستوى العالم في أي تخصص نوعي بقبول غير مشروط وبمزايا استثنائية. بينما يركز مسار إمداد على سد الاحتياج الوطني في مجالات استراتيجية محددة في أفضل 200 جامعة عالمية.',
    answerEn: 'Pioneers Track targets top 30 global universities for direct unconditional admissions across all disciplines with exceptional stipends. Imdad Track focuses on national priority labor market sectors across top 200 universities.'
  },
  {
    id: 'faq-trk-2',
    category: 'tracks',
    tags: ['مسار البحث والتطوير', 'دكتوراه', 'ابتكار'],
    questionAr: 'من هي الفئة المستهدفة في مسار البحث والتطوير (R&D)؟',
    questionEn: 'Who is eligible for the Research & Development (R&D) track?',
    answerAr: 'يستهدف المسار الباحثين وطلاب الدراسات العليا الراغبين بدراسة الدكتوراه أو أبحاث ما بعد الدكتوراه في مجالات الأولويات الوطنية للبحث والتطوير والابتكار (الصحة والبيئة والذكاء الاصطناعي واقتصاديات المستقبل).',
    answerEn: 'Targets researchers and graduate scholars pursuing doctoral or post-doctoral studies aligned with national R&D and innovation priorities.'
  },

  // 3. Requirements Category (الشروط والمعايير)
  {
    id: 'faq-req-1',
    category: 'requirements',
    tags: ['شروط', 'المعدل', 'العمر', 'الأهلية'],
    questionAr: 'ما هي الشروط العامة الأساسية للقبول في برنامج الابتعاث؟',
    questionEn: 'What are the core general criteria for scholarship admission?',
    answerAr: '1. أن يكون المتقدم سعودي الجنسية وحسن السيرة والسلوك.\n2. الحصول على قبول مباشر غير مشروط من مؤسسة تعليمية مدرجة ضمن قائمة الجامعات المعتمدة للمسار.\n3. أن يكون التخصص والدرجة متوافقين مع المسار المحدد.\n4. الانتظام الكلي والتفرغ التام للدراسة والإقامة في بلد الابتعاث.\n5. تحقيق شروط المعدل الأكاديمي واللغة الخاصة بكل مسار.',
    answerEn: '1. Saudi citizenship and good conduct.\n2. Direct unconditional offer from an approved university.\n3. Major and degree alignment with the designated track.\n4. Full-time study dedication and residency in host country.\n5. Fulfilling specific track GPA and language thresholds.'
  },
  {
    id: 'faq-req-2',
    category: 'requirements',
    tags: ['العمر', 'المعدل التراكمي', 'الآيلتس'],
    questionAr: 'ما هو الحد الأدنى للغة الإنجليزية والمعدل التراكمي المطلوب؟',
    questionEn: 'What are the minimum required English test scores and GPA?',
    answerAr: 'لمسار الرواد: معدل لا يقل عن 4.5 من 5.0 (أو 3.5 من 4.0) ودرجة آيلتس 7.0 فأعلى. لمسار إمداد وباقي المسارات: معدل لا يقل عن 3.5 من 5.0 (أو 2.75 من 4.0) ودرجة آيلتس 6.5 فأعلى (أو ما يعادلها في TOEFL iBT).',
    answerEn: 'For Pioneers: GPA >= 4.5/5.0 and IELTS >= 7.0. For Supply & other tracks: GPA >= 3.5/5.0 and IELTS >= 6.5 or equivalent TOEFL iBT score.'
  },

  // 4. Universities Category (الجامعات المعتمدة)
  {
    id: 'faq-uni-1',
    category: 'universities',
    tags: ['الجامعات', 'التصنيف الدولي', 'QS', 'THE'],
    questionAr: 'كيف يتم تصنيف واعتماد الجامعات العالمية في البرنامج؟',
    questionEn: 'How are international universities ranked and accredited in the program?',
    answerAr: 'يعتمد البرنامج التصنيفات الأكاديمية العالمية المعتبرة (QS World University Rankings و THE و Shanghai ARWU). تنقسم الجامعات بحسب المسار: أفضل 30 جامعة عالمية لمسار الرواد، وأفضل 70 لمسار التميز، وأفضل 200 لمسار إمداد والبحث والتطوير.',
    answerEn: 'The program relies on QS, THE, and Shanghai ARWU rankings. Ranked into Top 30 (Pioneers), Top 70 (Excellence), and Top 200 (Supply & R&D).'
  },
  {
    id: 'faq-uni-2',
    category: 'universities',
    tags: ['قائمة الجامعات', 'تخصصات', 'تحديث القوائم'],
    questionAr: 'هل تتغير قائمة الجامعات المعتمدة سنوياً؟',
    questionEn: 'Are accredited university lists updated annually?',
    answerAr: 'نعم، تتم مراجعة وتحديث قوائم الجامعات المعتمدة دورياً وفق أحدث نسخ التصنيفات الدولية السنوية لضمان أعلى معايير الجودة الأكاديمية للمبتعثين.',
    answerEn: 'Yes, university lists are regularly reviewed and refreshed in alignment with current global ranking releases.'
  },

  // 5. Documents Category (المستندات المطلوبة)
  {
    id: 'faq-doc-1',
    category: 'documents',
    tags: ['المستندات', 'الأوراق', 'خطاب القبول', 'الجواز'],
    questionAr: 'ما هي المستندات الرسمية الإلزامية المطلوب رفعها في المنصة؟',
    questionEn: 'What are the mandatory documents required for submission?',
    answerAr: '1. خطاب القبول الجامعي الرسمي غير المشروط (Unconditional Offer).\n2. وثيقة التخرج والسجل الأكاديمي الرسمي السابق (مصدقاً ومعادلاً إن لزم).\n3. شهادة اختبار اللغة الإنجليزية (IELTS Academic أو TOEFL iBT) سارية المفعول.\n4. صورة واضحة من جواز السفر ساري المفعول لمدة لا تقل عن 6 أشهر.\n5. السيرة الذاتية وخطة البحث (للمتقدمين على مسار البحث والتطوير والدكتوراه).',
    answerEn: '1. Official Unconditional Acceptance Letter.\n2. Graduation diploma and certified academic transcripts.\n3. Valid IELTS Academic or TOEFL iBT certificate.\n4. Valid passport copy (minimum 6 months validity).\n5. CV and research proposal (for R&D and PhD applicants).'
  },
  {
    id: 'faq-doc-2',
    category: 'documents',
    tags: ['معادلة الشهادة', 'وزارة التعليم'],
    questionAr: 'هل يلزم تقديم معادلة الشهادة للدرجة السابقة؟',
    questionEn: 'Is academic equivalency required for degrees obtained abroad?',
    answerAr: 'إذا كانت شهادتك السابقة صادرة من جامعة خارج المملكة العربية السعودية، فيلزم تقديم قرار معادلة المؤهل الصادر رسمياً من وزارة التعليم بالمملكة.',
    answerEn: 'Yes, if your prior degree was granted by an institution outside the Kingdom, a formal certificate equivalency from the Ministry of Education is required.'
  },

  // 6. Nomination Category (الترشيح والفرز)
  {
    id: 'faq-nom-1',
    category: 'nomination',
    tags: ['الترشيح', 'المفاضلة', 'المقابلة', 'لجنة الابتعاث'],
    questionAr: 'كيف تتم عملية المفاضلة والترشيح بين المتقدمين؟',
    questionEn: 'How are candidates shortlisted and evaluated during nomination?',
    answerAr: 'تتم المفاضلة إلكترونياً وبشفافية تامة وفق معايير موزونة تشمل: ترتيب تصنيف الجامعة العالمي، نوع التخصص وأولويته الوطنية، والمعدل التراكمي، ودرجة اختبار اللغة، مع إعطاء الأولوية للقبولات المباشرة في أفضل الجامعات العالمية.',
    answerEn: 'Evaluation is conducted algorithmically based on objective weights: global university rank, priority field, cumulative GPA, and English proficiency test scores.'
  },
  {
    id: 'faq-nom-2',
    category: 'nomination',
    tags: ['مدة المراجعة', 'النتائج', 'حالة الطلب'],
    questionAr: 'كم تستغرق دراسة الطلب وإعلان نتيجة الترشيح؟',
    questionEn: 'How long does application review and nomination notification take?',
    answerAr: 'يستغرق الفحص الآلي بالذكاء الاصطناعي دقائق معدودة فور الرفع، بينما تستغرق المراجعة الأكاديمية والاعتماد النهائي من لجان الابتعاث والملحقيات الثقافية ما بين 7 إلى 14 يوم عمل، مع إشعار المتقدم لحظياً عبر الرسائل النصية والبريد.',
    answerEn: 'Automated AI checks conclude within minutes, while formal academic committee review takes 7-14 business days, with real-time SMS and email status updates.'
  },

  // 7. Post-Nomination Category (ما بعد الترشيح)
  {
    id: 'faq-post-1',
    category: 'post_nomination',
    tags: ['ما بعد الترشيح', 'الضمان المالي', 'الفيزا', 'التأشيرة'],
    questionAr: 'ما هي الإجراءات الواجب اتباعها فور صدور قرار الترشيح للابتعاث؟',
    questionEn: 'What steps must be followed immediately after nomination decree issuance?',
    answerAr: '1. تحميل الضمان المالي الرقمي المعتمد من المنصة.\n2. التقديم على تأشيرة الدراسة لدى سفارة دولة الابتعاث (تقديم I-20 أو CAS والضمان المالي).\n3. حجز موعد الكشف الطبي الإلزامي وإكماله.\n4. إصدار تذاكر السفر الحكومية وبدء رحلة الابتعاث عبر بوابة سفير.',
    answerEn: '1. Download the digital Financial Guarantee.\n2. Apply for student visa at relevant embassy using I-20/CAS and the guarantee.\n3. Complete mandatory pre-departure medical screening.\n4. Issue official flight tickets via Safeer portal.'
  },
  {
    id: 'faq-post-2',
    category: 'post_nomination',
    tags: ['الضمان المالي', 'سفير', 'QR Code'],
    questionAr: 'كيف ومتى يتم إصدار الضمان المالي الرقمي وما هي استخداماته؟',
    questionEn: 'How and when is the digital Financial Guarantee issued and how is it used?',
    answerAr: 'يتم توليد الضمان المالي الرقمي فور اعتماد القرار، مزوداً برمز QR مشفر وخاتم رسمي. يستخدم لتقديمه للجامعة لإنهاء إجراءات التسجيل الأكاديمي، وللسفارة لإثبات التغطية المالية الكاملة للرسوم والمعيشة.',
    answerEn: 'Automatically generated upon decree approval, equipped with encrypted QR code. Presented to universities for registration and to embassies for proof of full financial sponsorship.'
  },

  // 8. E-Services Category (الخدمات الإلكترونية)
  {
    id: 'faq-srv-1',
    category: 'services',
    tags: ['الخدمات الإلكترونية', 'سفير', 'التذاكر', 'المكافآت'],
    questionAr: 'ما هي الخدمات الإلكترونية المتاحة للطالب عبر منظومة "سفير"؟',
    questionEn: 'What electronic services are provided to scholars through Safeer platform?',
    answerAr: 'توفر منظومة سفير أكثر من 60 خدمة رقمية تشمل: طلب أوامر الإركاب والتذاكر، صرف المخصصات الشهرية وبدل السكن، صرف مكافأة التميز، طلبات تمديد البعثة أو ترقية الدرجة العلمية، إضافة المرافقين، والتواصل المباشر مع المشرف الدراسي.',
    answerEn: 'Safeer provides over 60 digital services including flight tickets, monthly living allowances, academic excellence bonuses, scholarship extension, dependent registration, and supervisor direct messaging.'
  },
  {
    id: 'faq-srv-2',
    category: 'services',
    tags: ['المساعد الذكي', 'الاستشارات', 'الدعم الفني'],
    questionAr: 'كيف يمكنني الاستفادة من المساعد الذكي وخدمات الدعم الفوري؟',
    questionEn: 'How can I leverage the AI Assistant and immediate support services?',
    answerAr: 'المساعد الذكي متاح على مدار الساعة عبر الزر العائم للإجابة على كافة التساؤلات وشرح الشروط والبحث عن الجامعات. كما يمكنك حجز موعد استشاري أكاديمي مباشر مع مشرف الابتعاث أو التواصل مع مركز رعاية المستفيدين على الرقم الموحد 19996.',
    answerEn: 'The AI Assistant is accessible 24/7 via the floating assistant to clarify tracks, search universities, and guide applications. You can also book 1-on-1 supervisor appointments or call support at 19996.'
  }
];

export const USER_GUIDE_STEPS: {
  qabool: UserGuideStep[];
  safeer: UserGuideStep[];
} = {
  qabool: [
    {
      stepNumber: 1,
      titleAr: 'الحصول على القبول الجامعي المعتمد',
      descriptionAr: 'احصل على خطاب قبول رسمي (غير مشروط أو مشروط حسب ضوابط المسار) من إحدى الجامعات المعتمدة في القوائم الرسمية للبرنامج.',
      iconName: 'GraduationCap',
      keyPoints: [
        'التأكد من تصنيف الجامعة ضمن الحد المسموح للمسار',
        'وضوح التخصص، الدرجة العلمية، وتاريخ بدء الدراسة',
        'تطابق الاسم مع جواز السفر والهوية الوطنية'
      ],
      tipsAr: 'احرص على أن تكون صيغة الملف PDF واضحة لتسهيل الفرز الفوري بالذكاء الاصطناعي.'
    },
    {
      stepNumber: 2,
      titleAr: 'تسجيل الدخول عبر النفاذ الوطني ورفع الخطاب',
      descriptionAr: 'سجل دخولك برقم الهوية عبر تطبيق نفاذ، ثم انتقل لرحلة التقديم وارفع خطاب القبول لتبدأ عملية القراءة الآلية الذكية.',
      iconName: 'ShieldCheck',
      keyPoints: [
        'توثيق الدخول السريع عبر النفاذ الموحد',
        'قراءة فورية للنصوص والبيانات الأكاديمية عبر الذكاء الاصطناعي',
        'مراجعة وتأكيد البيانات المستخرجة وتعديلها عند الحاجة'
      ]
    },
    {
      stepNumber: 3,
      titleAr: 'مطابقة الشروط واختيار المسار المناسب',
      descriptionAr: 'يقوم المحرك الذكي باقتراح أفضل مسار يناسب ملفك الأكاديمي مع التحقق من معدل التخرج ودرجات اللغة والعمر.',
      iconName: 'Sparkles',
      keyPoints: [
        'استعراض بطاقة الأهلية التفصيلية لكل معيار',
        'اختيار المسار الأنسب (الرواد، إمداد، البحث والتطوير، التميز، الصحي، واعد)',
        'رفع المستندات المساندة (الهوية، الجواز، كشف الدرجات، الآيلتس)'
      ]
    },
    {
      stepNumber: 4,
      titleAr: 'التدقيق من الملحقية الثقافية وإصدار القرار',
      descriptionAr: 'يُحال الطلب مباشرة للمشرف الأكاديمي المختص في الملحقية الثقافية ببلد الابتعاث للمراجعة النهائية وإصدار قرار الابتعاث والضمان المالي الرقمي.',
      iconName: 'Award',
      keyPoints: [
        'متابعة حالة الطلب لحظياً عبر الخط الزمني الذكي',
        'استلام الإشعارات عند أي تحديث أو طلب استكمال',
        'تنزيل الضمان المالي الرقمي المعتمد بباركود رسمي'
      ]
    }
  ],
  safeer: [
    {
      stepNumber: 1,
      titleAr: 'تفعيل ملف المبتعث وفتح الملف الدراسي',
      descriptionAr: 'بعد صدور قرار الابتعاث، يتم تفعيل بوابة سفير تلقائياً وربطك بالمشرف الدراسي المعين في الملحقية الثقافية.',
      iconName: 'UserCheck',
      keyPoints: [
        'استعراض خطتك الدراسية والمخصص المالي الشهري',
        'معرفة بيانات المشرف الأكاديمي وقنوات التواصل المباشر',
        'تأكيد الوصول لبلد الابتعاث وتحديث العنوان المحلي'
      ]
    },
    {
      stepNumber: 2,
      titleAr: 'طلب الضمانات المالية وتذاكر السفر',
      descriptionAr: 'قدّم طلباتك الخدمية الدورية بنقرة زر واحدة دون الحاجة لمراجعة الملحقية أو الانتظار الطويل.',
      iconName: 'FileCheck',
      keyPoints: [
        'إصدار فوري لضمان مالي مخصص لجامعة أو مستشفى أو سفارة',
        'طلب أوامر الإركاب والتذاكر السنوية للمبتعث والمرافقين',
        'التقديم على التأمين الطبي الدولي الشامل'
      ]
    },
    {
      stepNumber: 3,
      titleAr: 'رفع التقارير الدراسية وصرف مكافأة التميز',
      descriptionAr: 'ارفع كشف الدرجات الفصلي لمتابعة سيرك الأكاديمي والحصول على مكافأة التميز الأكاديمي عند تحقيق المعدل المشرف.',
      iconName: 'Award',
      keyPoints: [
        'رفع وتوثيق كشوف الدرجات الفصلية',
        'صرف آلي لمكافآت التميز ونشر الأبحاث العلمية',
        'حجز جلسات استشارية مرئية مع المشرف الدراسي'
      ]
    }
  ]
};

export const CULTURAL_MISSIONS_DIRECTORY: CulturalMission[] = [
  {
    id: 'sacm-us',
    countryAr: 'الولايات المتحدة الأمريكية',
    countryEn: 'United States of America',
    cityAr: 'واشنطن العاصمة',
    cityEn: 'Washington, D.C.',
    code: 'SACM-USA',
    titleAr: 'الملحقية الثقافية السعودية في واشنطن',
    titleEn: 'Saudi Arabian Cultural Mission in the USA (SACM)',
    attachéNameAr: 'د. فوزي بن عبد الغني بخاري',
    email: 'help@sacm.org',
    phone: '+1 (703) 573-7226',
    emergencyPhone: '+1 (202) 746-9944',
    workingHoursAr: 'الإثنين - الجمعة: 9:00 ص - 5:00 م (توقيت واشنطن EST)',
    addressAr: '8500 Hilltop Rd, Fairfax, VA 22031, United States',
    activeStudentsCount: 14280,
    lat: 38.868,
    lng: -77.243
  },
  {
    id: 'sacm-uk',
    countryAr: 'المملكة المتحدة وإيرلندا',
    countryEn: 'United Kingdom & Ireland',
    cityAr: 'لندن',
    cityEn: 'London',
    code: 'SACM-UK',
    titleAr: 'الملحقية الثقافية السعودية في لندن',
    titleEn: 'Saudi Cultural Bureau in London',
    attachéNameAr: 'د. عبد العزيز بن فهد الردادي',
    email: 'uk@uksacb.org',
    phone: '+44 (20) 7814-1000',
    emergencyPhone: '+44 7785 994400',
    workingHoursAr: 'الإثنين - الجمعة: 9:00 ص - 4:00 م (توقيت لندن GMT)',
    addressAr: '630 Chiswick High Rd, Chiswick, London W4 5RY, United Kingdom',
    activeStudentsCount: 8940,
    lat: 51.492,
    lng: -0.276
  },
  {
    id: 'sacm-ca',
    countryAr: 'كندا',
    countryEn: 'Canada',
    cityAr: 'أوتاوا',
    cityEn: 'Ottawa',
    code: 'SACM-CAN',
    titleAr: 'الملحقية الثقافية السعودية في كندا',
    titleEn: 'Saudi Arabian Cultural Bureau in Canada',
    attachéNameAr: 'د. فايز بن عبد الله الشهري',
    email: 'info@saudibureau.org',
    phone: '+1 (613) 238-5555',
    emergencyPhone: '+1 (613) 299-1212',
    workingHoursAr: 'الإثنين - الجمعة: 9:00 ص - 4:30 م (توقيت أوتاوا EST)',
    addressAr: '209-211 Wurtemburg St, Ottawa, ON K1N 8Z4, Canada',
    activeStudentsCount: 3120,
    lat: 45.435,
    lng: -75.681
  },
  {
    id: 'sacm-au',
    countryAr: 'أستراليا ونيوزيلندا',
    countryEn: 'Australia & New Zealand',
    cityAr: 'كانبرا',
    cityEn: 'Canberra',
    code: 'SACM-AUS',
    titleAr: 'الملحقية الثقافية السعودية في أستراليا',
    titleEn: 'Saudi Cultural Mission in Australia',
    attachéNameAr: 'د. هشام بن عبد الرحمن خداوردي',
    email: 'help@sacm.org.au',
    phone: '+61 (2) 6269-3200',
    emergencyPhone: '+61 412 889 900',
    workingHoursAr: 'الإثنين - الجمعة: 9:00 ص - 5:00 م (توقيت كانبرا AEST)',
    addressAr: '38 Culgoa Circuit, O\'Malley ACT 2606, Australia',
    activeStudentsCount: 2850,
    lat: -35.347,
    lng: 149.106
  },
  {
    id: 'sacm-de',
    countryAr: 'ألمانيا والدول الاسكندنافية',
    countryEn: 'Germany & Northern Europe',
    cityAr: 'برلين',
    cityEn: 'Berlin',
    code: 'SACM-DEU',
    titleAr: 'الملحقية الثقافية السعودية في ألمانيا',
    titleEn: 'Saudi Cultural Mission in Germany',
    attachéNameAr: 'د. باسل بن عبد الله النجدي',
    email: 'info@de.sacm.org',
    phone: '+49 (30) 889-2500',
    emergencyPhone: '+49 171 223 3445',
    workingHoursAr: 'الإثنين - الجمعة: 9:00 ص - 4:00 م (توقيت برلين CET)',
    addressAr: 'Tiergartenstraße 33-34, 10785 Berlin, Germany',
    activeStudentsCount: 1680,
    lat: 52.511,
    lng: 13.364
  },
  {
    id: 'sacm-fr',
    countryAr: 'فرنسا وسويسرا وإسبانيا',
    countryEn: 'France, Switzerland & Spain',
    cityAr: 'باريس',
    cityEn: 'Paris',
    code: 'SACM-FRA',
    titleAr: 'الملحقية الثقافية السعودية في باريس',
    titleEn: 'Saudi Cultural Bureau in France',
    attachéNameAr: 'د. عبد الله بن منصور الثنيان',
    email: 'contact@sacm-paris.org',
    phone: '+33 (1) 45 61 68 00',
    emergencyPhone: '+33 6 12 34 56 78',
    workingHoursAr: 'الإثنين - الجمعة: 9:00 ص - 4:30 م (توقيت باريس CET)',
    addressAr: '29 Rue de Courcelles, 75008 Paris, France',
    activeStudentsCount: 1450,
    lat: 48.875,
    lng: 2.308
  },
  {
    id: 'sacm-cn',
    countryAr: 'جمهورية الصين الشعبية وآسيا',
    countryEn: 'China & East Asia',
    cityAr: 'بكين',
    cityEn: 'Beijing',
    code: 'SACM-CHN',
    titleAr: 'الملحقية الثقافية السعودية في بكين',
    titleEn: 'Saudi Arabian Cultural Mission in China',
    attachéNameAr: 'د. فهد بن مسفر الشريف',
    email: 'china@sacm.org.sa',
    phone: '+86 (10) 6532-4411',
    emergencyPhone: '+86 138 1234 5678',
    workingHoursAr: 'الإثنين - الجمعة: 9:00 ص - 5:00 م (توقيت بكين CST)',
    addressAr: 'Chaoyang District, Beijing, China',
    activeStudentsCount: 1120,
    lat: 39.904,
    lng: 116.407
  },
  {
    id: 'sacm-jp',
    countryAr: 'اليابان وكوريا الجنوبية',
    countryEn: 'Japan & South Korea',
    cityAr: 'طوكيو',
    cityEn: 'Tokyo',
    code: 'SACM-JPN',
    titleAr: 'الملحقية الثقافية السعودية في طوكيو',
    titleEn: 'Saudi Cultural Bureau in Japan',
    attachéNameAr: 'د. طارق بن محمد الريس',
    email: 'info@sacm.jp',
    phone: '+81 (3) 3589-5221',
    emergencyPhone: '+81 90 1234 5678',
    workingHoursAr: 'الإثنين - الجمعة: 9:00 ص - 5:00 م (توقيت طوكيو JST)',
    addressAr: 'Minato City, Roppongi, Tokyo, Japan',
    activeStudentsCount: 780,
    lat: 35.662,
    lng: 139.731
  }
];

export const TRACK_DETAILS_CONTENT: Record<string, {
  overview: {
    heroTitle: string;
    summary: string;
    targetAudience: string;
    keyBenefits: string[];
    quotaStats: { seats: number; filled: number; acceptanceRatio: string };
  };
  rules: {
    title: string;
    items: { label: string; desc: string; isStrict: boolean }[];
  };
  approvedUniversitiesCount: number;
  topSectors: { name: string; icon: string; demandLevel: 'high' | 'very_high' | 'critical' }[];
  destinations: { country: string; flag: string; unisCount: number }[];
  institutes: string[];
  documents: { name: string; isMandatory: boolean; format: string }[];
  faqs: { q: string; a: string }[];
}> = {
  'track-pioneers': {
    overview: {
      heroTitle: 'مسار الرواد – الابتعاث لنخبة جامعات العالم',
      summary: 'يستهدف مسار الرواد ابتعاث الكفاءات الوطنية المتفوقة إلى أفضل 30 جامعة ومؤسسة تعليمية على مستوى العالم لدراسة برامج البكالوريوس والماجستير والدكتوراه في كافة المجالات الحيوية ذات الأولوية.',
      targetAudience: 'الطلاب المتميزون الحاصلون على قبول مباشر غير مشروط من أفضل 30 جامعة عالمية.',
      keyBenefits: [
        'قبول غير مشروط ومباشر من أفضل 30 جامعة وفق تصنيفات QS / THE / Shanghai',
        'مخصص شهري مضاعف مع بدل تميز أكاديمي لكافة المراحل',
        'أولوية إصدار الضمان المالي الفوري وتأشيرة الدراسة',
        'إشراف أكاديمي مباشر وشبكة علاقات بحثية عالمية'
      ],
      quotaStats: { seats: 2500, filled: 1840, acceptanceRatio: '94%' }
    },
    rules: {
      title: 'الشروط والضوابط الخاصة بمسار الرواد',
      items: [
        { label: 'القبول المباشر', desc: 'أن يكون القبول من إحدى أفضل 30 جامعة عالمياً، وأن يكون غير مشروط (Unconditional Admission).', isStrict: true },
        { label: 'الانتظام الكلي', desc: 'أن تكون الدراسة بنظام التفرغ والانتظام الكامل في مقر الجامعة ببلد الابتعاث.', isStrict: true },
        { label: 'المعدل واللغة', desc: 'الحصول على درجة 7.0 في IELTS أو 100 في TOEFL كحد أدنى للمرحلة الجامعية والدراسات العليا.', isStrict: true },
        { label: 'المعادلة والتصديق', desc: 'معادلة المؤهل السابق من وزارة التعليم في المملكة العربية السعودية.', isStrict: false }
      ]
    },
    approvedUniversitiesCount: 30,
    topSectors: [
      { name: 'الذكاء الاصطناعي وتعلم الآلة', icon: 'Cpu', demandLevel: 'critical' },
      { name: 'السياسات العامة والقيادة الحكومية', icon: 'Shield', demandLevel: 'high' },
      { name: 'العلوم الطبية الحيوية والجينات', icon: 'Activity', demandLevel: 'critical' },
      { name: 'فيزياء الكم وهندسة الفضاء', icon: 'Globe', demandLevel: 'high' }
    ],
    destinations: [
      { country: 'الولايات المتحدة الأمريكية', flag: '🇺🇸', unisCount: 16 },
      { country: 'المملكة المتحدة', flag: '🇬🇧', unisCount: 6 },
      { country: 'سويسرا', flag: '🇨🇭', unisCount: 2 },
      { country: 'سنغافورة', flag: '🇸🇬', unisCount: 2 },
      { country: 'اليابان', flag: '🇯🇵', unisCount: 1 },
      { country: 'كندا', flag: '🇨🇦', unisCount: 2 },
      { country: 'أستراليا', flag: '🇦🇺', unisCount: 1 }
    ],
    institutes: [
      'معهد ماساتشوستس للتكنولوجيا (MIT)',
      'معهد كاليفورنيا للتقنية (Caltech)',
      'المعهد الفيدرالي السويسري للتكنولوجيا (ETH Zurich)',
      'معهد كارولينسكا الطبي (السويد)'
    ],
    documents: [
      { name: 'خطاب القبول النهائي غير المشروط (Unconditional Offer Letter)', isMandatory: true, format: 'PDF' },
      { name: 'الهوية الوطنية / الإقامة وجواز السفر ساري المفعول', isMandatory: true, format: 'PDF/PNG' },
      { name: 'وثيقة التخرج للمؤهل السابق مصدقة', isMandatory: true, format: 'PDF' },
      { name: 'السجل الأكاديمي الرسمي المترجم باللغة الإنجليزية', isMandatory: true, format: 'PDF' },
      { name: 'شهادة إتقان اللغة الإنجليزية (IELTS 7.0+ أو TOEFL 100+)', isMandatory: true, format: 'PDF' }
    ],
    faqs: [
      { q: 'هل يشترط مسار الرواد عمر معين للمتقدم؟', a: 'الحد الأقصى للعمر هو 35 عاماً لبرامج البكالوريوس والماجستير، و40 عاماً لبرامج الدكتوراه والزمالات.' },
      { q: 'هل يمكن التقديم بقبول مشروط بدراسة اللغة؟', a: 'لا، مسار الرواد يشترط قبولاً نهائياً غير مشروط نظراً لأن الجامعات المصنفة ضمن أفضل 30 تتطلب إتقاناً تاماً للغة قبل بدء البرنامج.' }
    ]
  },
  'track-supply': {
    overview: {
      heroTitle: 'مسار إمداد – تمكين سوق العمل بالمهارات الحيوية',
      summary: 'يهدف مسار إمداد إلى تلبية احتياجات سوق العمل المتسارعة من خلال ابتعاث الطلاب في تخصصات محددة بأفضل 200 جامعة على مستوى العالم لمرحلتي البكالوريوس والماجستير.',
      targetAudience: 'المتقدمون الراغبون في دراسة التخصصات الاستراتيجية المرتبطة بالقطاعات التنموية الوطنية.',
      keyBenefits: [
        'قائمة تضم أفضل 200 جامعة عالمية معتمدة',
        'شراكة مباشرة مع جهات التوظيف الوطنية والقطاع الخاص',
        'دعم برامج التدريب الصيفي التعاوني في كبرى الشركات العالمية',
        'تغطية تكاليف الدراسة والمعيشة والتأمين الصحي الشامل'
      ],
      quotaStats: { seats: 5000, filled: 3920, acceptanceRatio: '89%' }
    },
    rules: {
      title: 'الشروط والضوابط الخاصة بمسار إمداد',
      items: [
        { label: 'الجامعة والتخصص', desc: 'أن تكون الجامعة ضمن أفضل 200 جامعة عالمية في التخصص المستهدف وفق تصنيف الوزارة.', isStrict: true },
        { label: 'درجة اللغة', desc: 'الحصول على درجة 6.5 في IELTS أو 90 في TOEFL كحد أدنى.', isStrict: true },
        { label: 'المعدل التراكمي', desc: 'ألا يقل المعدل في المؤهل السابق عن (3.5 من 5.0) أو ما يعادله.', isStrict: true },
        { label: 'العمر', desc: 'ألا يتجاوز عمر المتقدم 40 عاماً وقت التقديم.', isStrict: false }
      ]
    },
    approvedUniversitiesCount: 200,
    topSectors: [
      { name: 'سلاسل الإمداد وإدارة اللوجستيات', icon: 'Truck', demandLevel: 'critical' },
      { name: 'الأمن السيبراني والشبكات المتقدمة', icon: 'Lock', demandLevel: 'critical' },
      { name: 'الطاقة المتجددة والهيدروجين الأخضر', icon: 'Zap', demandLevel: 'high' },
      { name: 'السياحة والضيافة وإدارة الفعاليات', icon: 'Compass', demandLevel: 'high' }
    ],
    destinations: [
      { country: 'الولايات المتحدة الأمريكية', flag: '🇺🇸', unisCount: 65 },
      { country: 'المملكة المتحدة', flag: '🇬🇧', unisCount: 38 },
      { country: 'أستراليا', flag: '🇦🇺', unisCount: 24 },
      { country: 'كندا', flag: '🇨🇦', unisCount: 18 },
      { country: 'ألمانيا', flag: '🇩🇪', unisCount: 15 },
      { country: 'سنغافورة', flag: '🇸🇬', unisCount: 4 }
    ],
    institutes: [
      'جامعة مانشستر (المملكة المتحدة)',
      'جامعة ميشيغان (الولايات المتحدة)',
      'جامعة سيدني (أستراليا)',
      'جامعة بريتيش كولومبيا (كندا)'
    ],
    documents: [
      { name: 'خطاب القبول الجامعي المعتمد', isMandatory: true, format: 'PDF' },
      { name: 'وثيقة التخرج والسجل الأكاديمي', isMandatory: true, format: 'PDF' },
      { name: 'شهادة الآيلتس أو التوفل', isMandatory: true, format: 'PDF' },
      { name: 'جواز السفر والهوية الوطنية', isMandatory: true, format: 'PDF' }
    ],
    faqs: [
      { q: 'هل يسمح مسار إمداد بدراسة الماجستير في تخصص مختلف عن البكالوريوس؟', a: 'نعم، بشرط أن يكون التخصص المطلوب ضمن التخصصات الاستراتيجية المعتمدة وأن توافق الجامعة على قبول الطالب.' }
    ]
  },
  'track-rd': {
    overview: {
      heroTitle: 'مسار البحث والتطوير – صناعة علماء المستقبل',
      summary: 'يركز مسار البحث والتطوير على تأهيل الباحثين والعلماء في مجالات الأولويات الوطنية للبحث والتطوير والابتكار في درجات الماجستير والدكتوراه بأفضل 100 جامعة عالمياً.',
      targetAudience: 'الباحثون والعلماء وحملة البكالوريوس والماجستير ذوو الشغف البحثي في الأولويات الوطنية الأربع.',
      keyBenefits: [
        'ميزانية بحثية مخصصة لحضور المؤتمرات ونشر الأوراق العلمية',
        'شراكات بحثية مع مدينة الملك عبد العزيز للعلوم والتقنية وكاوست',
        'أولوية التعيين في مراكز الابتكار ومختبرات البحث والتطوير الوطنية',
        'فرص برامج ما بعد الدكتوراه (Postdoc) المدعومة'
      ],
      quotaStats: { seats: 1500, filled: 970, acceptanceRatio: '92%' }
    },
    rules: {
      title: 'الشروط والضوابط الخاصة بمسار البحث والتطوير',
      items: [
        { label: 'الدرجة العلمية', desc: 'الابتعاث مخصص لدرجات الماجستير البحثي (Master by Research) والدكتوراه (PhD).', isStrict: true },
        { label: 'المقترح البحثي', desc: 'تقديم مقترح بحثي متوافق مع الأولويات الوطنية للبحث والتطوير والابتكار (صحة الإنسان، استدامة البيئة، الطاقة والصناعة، اقتصاديات المستقبل).', isStrict: true },
        { label: 'الجامعة والمعدل', desc: 'القبول من أفضل 100 جامعة، بمعدل تراكمي لا يقل عن 4.0 من 5.0.', isStrict: true }
      ]
    },
    approvedUniversitiesCount: 100,
    topSectors: [
      { name: 'صحة الإنسان والطب التجديدي', icon: 'Heart', demandLevel: 'critical' },
      { name: 'استدامة البيئة والاحتياجات الأساسية', icon: 'Leaf', demandLevel: 'critical' },
      { name: 'الريادة في الطاقة والصناعة', icon: 'Sun', demandLevel: 'high' },
      { name: 'اقتصاديات المستقبل والتقنيات العميقة', icon: 'TrendingUp', demandLevel: 'high' }
    ],
    destinations: [
      { country: 'الولايات المتحدة', flag: '🇺🇸', unisCount: 42 },
      { country: 'المملكة المتحدة', flag: '🇬🇧', unisCount: 22 },
      { country: 'اليابان', flag: '🇯🇵', unisCount: 8 },
      { country: 'ألمانيا', flag: '🇩🇪', unisCount: 10 },
      { country: 'سويسرا', flag: '🇨🇭', unisCount: 4 }
    ],
    institutes: [
      'جامعة كوليدج لندن (UCL)',
      'جامعة كيوتو (اليابان)',
      'جامعة ميونخ للعلوم التطبيقية (TUM)',
      'جامعة برنستون (الولايات المتحدة)'
    ],
    documents: [
      { name: 'خطاب القبول للدراسات العليا البحثية', isMandatory: true, format: 'PDF' },
      { name: 'المقترح البحثي المعتمد (Research Proposal)', isMandatory: true, format: 'PDF' },
      { name: 'خطابات توصية أكاديمية (عدد 2 على الأقل)', isMandatory: true, format: 'PDF' },
      { name: 'السيرة الذاتية وقائمة المنشورات العلمية إن وجدت', isMandatory: false, format: 'PDF' }
    ],
    faqs: [
      { q: 'هل يشمل التمويل تكاليف التجارب المعملية والمختبرات؟', a: 'نعم، يقدم البرنامج مخصصاً مالياً سنوياً لدعم الأبحاث المعملية ورسوم النشر في المجلات العلمية المصنفة Q1/Q2.' }
    ]
  },
  'track-excellence': {
    overview: {
      heroTitle: 'مسار التميز – قيادة مشاريع رؤية 2030 الكبرى',
      summary: 'صُمم مسار التميز لابتعاث الطلاب الموهوبين في تخصصات نوعية تدعم مشاريع رؤية المملكة 2030 الكبرى (نيوم، القدية، البحر الأحمر، الدرعية، السودة) بأفضل 70 جامعة عالمية.',
      targetAudience: 'المبدعون والمتفوقون في الفنون، العمارة، الضيافة الفاخرة، والوسائط الرقمية.',
      keyBenefits: [
        'تخصصات نوعية مصممة خصيصاً للمشاريع الكبرى',
        'برامج توجيه قيادي مع خبراء دوليين ورؤساء تنفيذيين',
        'مكافأة تفوق أكاديمي سنوية',
        'مسار توظيف وتدريب مهني مباشر مع شركات المشاريع الكبرى'
      ],
      quotaStats: { seats: 2000, filled: 1460, acceptanceRatio: '88%' }
    },
    rules: {
      title: 'الشروط والضوابط لمسار التميز',
      items: [
        { label: 'القبول والتصنيف', desc: 'الحصول على قبول غير مشروط في أحد التخصصات النوعية المعتمدة بأفضل 70 جامعة عالمية.', isStrict: true },
        { label: 'معرض الأعمال / المقابلة', desc: 'إرفاق ملف أعمال إبداعي (Portfolio) لبعض التخصصات كالعمارة والتصميم والإنتاج السينمائي.', isStrict: false },
        { label: 'المعدل واللغة', desc: 'معدل لا يقل عن 4.8 من 5.0 واختبار IELTS بدرجة 8.0 كحد أدنى.', isStrict: true }
      ]
    },
    approvedUniversitiesCount: 70,
    topSectors: [
      { name: 'فنون الطهي والضيافة الفاخرة وإدارة المنتجعات', icon: 'Coffee', demandLevel: 'critical' },
      { name: 'الإنتاج السينمائي والوسائط المتعددة', icon: 'Film', demandLevel: 'high' },
      { name: 'التصميم الحضري والعمارة المستدامة', icon: 'Home', demandLevel: 'critical' },
      { name: 'علوم المحيطات والبيئة الساحلية البحرية', icon: 'Anchor', demandLevel: 'high' }
    ],
    destinations: [
      { country: 'الولايات المتحدة', flag: '🇺🇸', unisCount: 28 },
      { country: 'المملكة المتحدة', flag: '🇬🇧', unisCount: 16 },
      { country: 'فرنسا', flag: '🇫🇷', unisCount: 8 },
      { country: 'إيطاليا', flag: '🇮🇹', unisCount: 6 },
      { country: 'أستراليا', flag: '🇦🇺', unisCount: 5 }
    ],
    institutes: [
      'معهد كوليناري أوف أمريكا (CIA)',
      'جامعة الفنون في لندن (UAL)',
      'جامعة بوليتكنيكو دي ميلانو (إيطاليا)',
      'معهد بارسونز للتصميم (الولايات المتحدة)'
    ],
    documents: [
      { name: 'خطاب القبول النهائي', isMandatory: true, format: 'PDF' },
      { name: 'ملف الأعمال الإبداعي (Portfolio)', isMandatory: false, format: 'PDF/Link' },
      { name: 'شهادة إتقان اللغة والسجل الأكاديمي', isMandatory: true, format: 'PDF' }
    ],
    faqs: [
      { q: 'هل يشمل المسار برامج الزمالة المهنية والدورات التنفيذية المتقدمة؟', a: 'يشمل المسار برامج البكالوريوس والماجستير التنفيذي المعتمدة لدى الجامعات الشريكة.' }
    ]
  },
  'track-health': {
    overview: {
      heroTitle: 'المسار الصحي – زمالات البورد والتخصصات الطبية النادرة',
      summary: 'تأهيل الكوادر الطبية والتمريضية الوطنية في برامج الإقامة الطبية (Residency) والزمالات السريرية الدقيقة (Clinical Fellowships) في أرقى المراكز الطبية الجامعية عالمياً.',
      targetAudience: 'الأطباء، أطباء الأسنان، أخصائيو التمريض، والكوادر الصحية المرخصة من الهيئة السعودية للتخصصات الصحية.',
      keyBenefits: [
        'تغطية رسوم التدريب السريري ورسوم امتحانات البورد الأمريكي والكندي والأوروبي',
        'تأمين طبي مهني ضد الأخطاء الطبية وتأمين صحي عائلي شامل',
        'شراكة مباشرة واعتماد مسبق من الهيئة السعودية للتخصصات الصحية (SCFHS)',
        'أولوية التعيين في المدن الطبية والمستشفيات التخصصية ومراكز الأبحاث'
      ],
      quotaStats: { seats: 1800, filled: 1210, acceptanceRatio: '85%' }
    },
    rules: {
      title: 'الشروط والضوابط الخاصة بالمسار الصحي',
      items: [
        { label: 'الرخصة المهنية', desc: 'الحصول على رخصة الممارسة المهنية سارية المفعول من الهيئة السعودية للتخصصات الصحية.', isStrict: true },
        { label: 'القبول السريري', desc: 'الحصول على قبول رسمي في برنامج إقامة طبية أو زمالة سريرية معتمدة من المجلس الطبي في بلد الابتعاث.', isStrict: true },
        { label: 'اختبارات المعادلة', desc: 'اجتياز اختبارات المعادلة المطلوبة مثل USMLE للولايات المتحدة أو MCCQE لكندا أو PLAB لبريطانيا.', isStrict: true }
      ]
    },
    approvedUniversitiesCount: 50,
    topSectors: [
      { name: 'جراحة الأورام الدقيقة وزراعة الأعضاء', icon: 'Activity', demandLevel: 'critical' },
      { name: 'طب الطوارئ والكوارث والعناية المركزة', icon: 'AlertTriangle', demandLevel: 'critical' },
      { name: 'علم الجينوم والعلاج المناعي الدقيق', icon: 'Dna', demandLevel: 'high' },
      { name: 'التمريض السريري المتقدم والذكاء الاصطناعي الطبي', icon: 'HeartHandshake', demandLevel: 'high' }
    ],
    destinations: [
      { country: 'الولايات المتحدة الأمريكية', flag: '🇺🇸', unisCount: 22 },
      { country: 'كندا', flag: '🇨🇦', unisCount: 12 },
      { country: 'المملكة المتحدة', flag: '🇬🇧', unisCount: 8 },
      { country: 'فرنسا', flag: '🇫🇷', unisCount: 5 },
      { country: 'ألمانيا', flag: '🇩🇪', unisCount: 3 }
    ],
    institutes: [
      'جامعة جونز هوبكنز للطب (JHU)',
      'مايو كلينك كلية الطب والعلوم (Mayo Clinic)',
      'جامعة تورنتو - كلية تيميرتي للطب (كندا)',
      'جامعة ماكجيل للطب والعلوم الصحية (كندا)'
    ],
    documents: [
      { name: 'خطاب القبول في برنامج الإقامة الطبية أو الزمالة (Offer Letter)', isMandatory: true, format: 'PDF' },
      { name: 'شهادة التصنيف والتسجيل المهني من SCFHS', isMandatory: true, format: 'PDF' },
      { name: 'شهادة اجتياز اختبارات المعادلة (USMLE / MCCQE)', isMandatory: true, format: 'PDF' },
      { name: 'شهادة البكالوريوس في الطب والعلوم الصحية', isMandatory: true, format: 'PDF' }
    ],
    faqs: [
      { q: 'هل يشمل المسار الصحي برامج التمريض والعلوم الطبية التطبيقية؟', a: 'نعم، يشمل برامج الماجستير والدكتوراه والزمالات السريرية في التمريض المتقدم، العلاج الطبيعي، الأشعة التداخلية، والمعلوماتية الصحية.' }
    ]
  },
  'track-waed': {
    overview: {
      heroTitle: 'مسار واعد – شراكة الابتكار والصناعات الاستراتيجية',
      summary: 'يستهدف مسار واعد ابتعاث الطلاب في قطاعات الابتكار والتقنيات الناشئة والصناعات الاستراتيجية الواعدة وفق عقود رعاية وتدريب وتوظيف مسبق مع كبرى الشركات الوطنية.',
      targetAudience: 'المتميزون في الهندسة المتقدمة، الفضاء، التعدين، والطاقة المستقبلية.',
      keyBenefits: [
        'عقود رعاية وتدريب وتوظيف مسبق مع الشركاء الصناعيين الوطنيين',
        'مشاريع تخرج تطبيقية مرتبطة بتحديات الصناعة الوطنية الحقيقية',
        'حوافز ابتكار وبراءات اختراع مدفوعة خلال فترة الابتعاث',
        'تغطية شاملة ومخصصات إضافية للدورات المهنية المعتمدة'
      ],
      quotaStats: { seats: 2200, filled: 1530, acceptanceRatio: '91%' }
    },
    rules: {
      title: 'الشروط والضوابط لمسار واعد',
      items: [
        { label: 'القبول والتخصص', desc: 'الحصول على قبول بأفضل 150 جامعة عالمية في أحد التخصصات الصناعية أو التقنية الواعدة.', isStrict: true },
        { label: 'الرعاية الصناعية', desc: 'اجتياز معايير المطابقة مع الشركاء الصناعيين للبرنامج (أرامكو، سابك، معادن، نيوم، هيئة الفضاء).', isStrict: false },
        { label: 'المعدل واللغة', desc: 'معدل تراكمي 3.8 من 5.0 ودرجة IELTS 6.5 على الأقل.', isStrict: true }
      ]
    },
    approvedUniversitiesCount: 150,
    topSectors: [
      { name: 'صناعة الفضاء والأقمار الاصطناعية والاستشعار', icon: 'Compass', demandLevel: 'critical' },
      { name: 'الهيدروجين الأخضر والاحتجاز الكربوني', icon: 'Zap', demandLevel: 'critical' },
      { name: 'أشباه الموصلات والرقائق الإلكترونية المتقدمة', icon: 'Cpu', demandLevel: 'critical' },
      { name: 'الروبوتات والأتمتة الصناعية المتقدمة', icon: 'Sliders', demandLevel: 'high' }
    ],
    destinations: [
      { country: 'الولايات المتحدة', flag: '🇺🇸', unisCount: 50 },
      { country: 'اليابان', flag: '🇯🇵', unisCount: 15 },
      { country: 'ألمانيا', flag: '🇩🇪', unisCount: 20 },
      { country: 'كوريا الجنوبية', flag: '🇰🇷', unisCount: 12 },
      { country: 'سنغافورة', flag: '🇸🇬', unisCount: 6 }
    ],
    institutes: [
      'جامعة بوردو (الولايات المتحدة)',
      'معهد طوكيو للتكنولوجيا (Tokyo Tech)',
      'جامعة دلفت للتكنولوجيا (هولندا)',
      'المعهد الكوري المتقدم للعلوم والتقنية (KAIST)'
    ],
    documents: [
      { name: 'خطاب القبول الجامعي المعتمد', isMandatory: true, format: 'PDF' },
      { name: 'وثيقة التخرج والسجل الأكاديمي', isMandatory: true, format: 'PDF' },
      { name: 'شهادة اختبار اللغة الإنجليزية', isMandatory: true, format: 'PDF' },
      { name: 'خطاب الرغبة والاهتمام بالصناعات الواعدة', isMandatory: false, format: 'PDF' }
    ],
    faqs: [
      { q: 'هل يضمن مسار واعد فرصة عمل فور التخرج؟', a: 'يتم ربط الطالب بالشركاء الصناعيين منذ بداية البعثة وتوفير فرص تدريبية صيفية تضمن الأولوية القصوى في التوظيف فور التخرج.' }
    ]
  }
};

export const COUNTRIES_DIRECTORY: CountryInfo[] = [
  {
    code: 'US',
    nameAr: 'الولايات المتحدة الأمريكية',
    nameEn: 'United States',
    flagEmoji: '🇺🇸',
    regionAr: 'أمريكا الشمالية',
    regionEn: 'North America',
    approvedUniversitiesCount: 142,
    primaryLanguage: 'الإنجليزية',
    visaOverviewAr: 'تأشيرة F-1 الطلابية الأكاديمية مع اشتراط وثيقة I-20 المعتمدة.',
    visaOverviewEn: 'F-1 Student Visa requiring official I-20 form.',
    culturalMissionCityAr: 'واشنطن العاصمة',
    culturalMissionCityEn: 'Washington, D.C.',
    imageUrl: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=800&q=80',
    isPopular: true
  },
  {
    code: 'GB',
    nameAr: 'المملكة المتحدة',
    nameEn: 'United Kingdom',
    flagEmoji: '🇬🇧',
    regionAr: 'أوروبا',
    regionEn: 'Europe',
    approvedUniversitiesCount: 88,
    primaryLanguage: 'الإنجليزية',
    visaOverviewAr: 'تأشيرة Student Visa تتطلب رقم التأكيد الأكاديمي CAS.',
    visaOverviewEn: 'UK Student Visa with CAS confirmation.',
    culturalMissionCityAr: 'لندن',
    culturalMissionCityEn: 'London',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    isPopular: true
  },
  {
    code: 'CA',
    nameAr: 'كندا',
    nameEn: 'Canada',
    flagEmoji: '🇨🇦',
    regionAr: 'أمريكا الشمالية',
    regionEn: 'North America',
    approvedUniversitiesCount: 36,
    primaryLanguage: 'الإنجليزية / الفرنسية',
    visaOverviewAr: 'تصريح دراسة Study Permit بعد استلام خطاب القبول الرسمي LOA.',
    visaOverviewEn: 'Canada Study Permit with official LOA letter.',
    culturalMissionCityAr: 'أوتاوا',
    culturalMissionCityEn: 'Ottawa',
    imageUrl: 'https://images.unsplash.com/photo-1517935703635-271709ddc21f?auto=format&fit=crop&w=800&q=80',
    isPopular: true
  },
  {
    code: 'AU',
    nameAr: 'أستراليا',
    nameEn: 'Australia',
    flagEmoji: '🇦🇺',
    regionAr: 'أوقيانوسيا',
    regionEn: 'Oceania',
    approvedUniversitiesCount: 32,
    primaryLanguage: 'الإنجليزية',
    visaOverviewAr: 'تأشيرة الطالب Subclass 500 مع وثيقة التأكيد الإلكتروني CoE.',
    visaOverviewEn: 'Subclass 500 Visa with electronic Confirmation of Enrolment (CoE).',
    culturalMissionCityAr: 'كانبرا',
    culturalMissionCityEn: 'Canberra',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    isPopular: true
  },
  {
    code: 'JP',
    nameAr: 'اليابان',
    nameEn: 'Japan',
    flagEmoji: '🇯🇵',
    regionAr: 'آسيا',
    regionEn: 'Asia',
    approvedUniversitiesCount: 24,
    primaryLanguage: 'اليابانية / الإنجليزية',
    visaOverviewAr: 'تأشيرة دراسية عبر شهادة الأهلية للقبول (COE) اليابانية.',
    visaOverviewEn: 'College Student Visa via Certificate of Eligibility (COE).',
    culturalMissionCityAr: 'طوكيو',
    culturalMissionCityEn: 'Tokyo',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    isPopular: true
  },
  {
    code: 'CH',
    nameAr: 'سويسرا',
    nameEn: 'Switzerland',
    flagEmoji: '🇨🇭',
    regionAr: 'أوروبا',
    regionEn: 'Europe',
    approvedUniversitiesCount: 12,
    primaryLanguage: 'الألمانية / الفرنسية / الإنجليزية',
    visaOverviewAr: 'تأشيرة إقامة طويلة National Visa D للدارسين والباحثين.',
    visaOverviewEn: 'National Visa D for academic studies.',
    culturalMissionCityAr: 'برن / جنيف',
    culturalMissionCityEn: 'Bern / Geneva',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    isPopular: false
  },
  {
    code: 'DE',
    nameAr: 'ألمانيا',
    nameEn: 'Germany',
    flagEmoji: '🇩🇪',
    regionAr: 'أوروبا',
    regionEn: 'Europe',
    approvedUniversitiesCount: 45,
    primaryLanguage: 'الألمانية / الإنجليزية',
    visaOverviewAr: 'تأشيرة فيزا الطالب الألمانية مع إثبات المقعد الدراسي.',
    visaOverviewEn: 'German Student Visa with verified admission.',
    culturalMissionCityAr: 'برلين',
    culturalMissionCityEn: 'Berlin',
    imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80',
    isPopular: false
  },
  {
    code: 'FR',
    nameAr: 'فرنسا',
    nameEn: 'France',
    flagEmoji: '🇫🇷',
    regionAr: 'أوروبا',
    regionEn: 'Europe',
    approvedUniversitiesCount: 38,
    primaryLanguage: 'الفرنسية / الإنجليزية',
    visaOverviewAr: 'تأشيرة إقامة طويلة VLS-TS عبر منصة Campus France.',
    visaOverviewEn: 'Long Stay Student Visa (VLS-TS) via Campus France.',
    culturalMissionCityAr: 'باريس',
    culturalMissionCityEn: 'Paris',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    isPopular: false
  }
];

