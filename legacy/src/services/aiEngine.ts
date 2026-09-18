import { ExtractedAIData, TrackRecommendation, AIProcessingLog, Track } from '../types';
import { INITIAL_TRACKS, SAMPLE_ADMISSION_LETTERS } from '../data/initialData';

export class AIScholarshipEngine {
  /**
   * Simulate AI OCR (AWS Textract + BERT NLP Entity Extractor)
   */
  public static async scanAdmissionDocument(
    rawTextOrSampleId: string,
    applicantName: string = 'سارة محمد القحطاني'
  ): Promise<{
    ocrRawText: string;
    extractedData: ExtractedAIData;
    recommendation: TrackRecommendation;
    processingTimeMs: number;
    confidenceScore: number;
  }> {
    const startTime = performance.now();

    // Check if it's one of the built-in known sample templates
    const foundSample = SAMPLE_ADMISSION_LETTERS.find(
      s => s.id === rawTextOrSampleId || rawTextOrSampleId.includes(s.universityName) || s.rawText === rawTextOrSampleId
    );

    let ocrRawText = rawTextOrSampleId;
    let extractedData: ExtractedAIData;

    if (foundSample) {
      ocrRawText = foundSample.rawText;
      extractedData = {
        universityName: foundSample.universityName,
        universityCountry: foundSample.universityCountry,
        universityRank: foundSample.universityRank,
        major: foundSample.major,
        degreeLevel: foundSample.degreeLevel,
        admissionType: foundSample.admissionType,
        startDate: foundSample.startDate,
        durationMonths: foundSample.durationMonths,
        estimatedAnnualTuitionUsd: foundSample.annualTuitionUsd,
        languageScoreDetected: foundSample.languageScoreDetected,
        rawConfidence: 0.988
      };
    } else {
      // Intelligent heuristic & pattern extractor for custom pasted or uploaded text
      extractedData = this.parseGenericAdmissionText(rawTextOrSampleId);
    }

    // Run rules engine against candidate profile
    const defaultProfile = {
      gpa: 4.85,
      gpaScale: 5.0,
      age: 26,
      userIelts: extractedData.languageScoreDetected?.score || 7.5,
      userToefl: 108
    };

    const recommendation = this.evaluateRulesEngine(extractedData, defaultProfile);
    const processingTimeMs = Math.round(performance.now() - startTime + (Math.random() * 200 + 350));
    const confidenceScore = Math.round(extractedData.rawConfidence * 1000) / 10;

    return {
      ocrRawText,
      extractedData,
      recommendation,
      processingTimeMs,
      confidenceScore
    };
  }

  /**
   * Generic NLP Parser for user uploaded / typed letters
   */
  private static parseGenericAdmissionText(text: string): ExtractedAIData {
    const lower = text.toLowerCase();
    
    // University detection
    let universityName = 'Massachusetts Institute of Technology (MIT)';
    let universityCountry = 'الولايات المتحدة الأمريكية';
    let universityRank = 1;

    if (lower.includes('oxford')) {
      universityName = 'University of Oxford';
      universityCountry = 'المملكة المتحدة';
      universityRank = 3;
    } else if (lower.includes('stanford')) {
      universityName = 'Stanford University';
      universityCountry = 'الولايات المتحدة الأمريكية';
      universityRank = 2;
    } else if (lower.includes('harvard')) {
      universityName = 'Harvard University';
      universityCountry = 'الولايات المتحدة الأمريكية';
      universityRank = 4;
    } else if (lower.includes('cambridge')) {
      universityName = 'University of Cambridge';
      universityCountry = 'المملكة المتحدة';
      universityRank = 5;
    } else if (lower.includes('imperial')) {
      universityName = 'Imperial College London';
      universityCountry = 'المملكة المتحدة';
      universityRank = 6;
    } else if (lower.includes('ucl') || lower.includes('london')) {
      universityName = 'University College London (UCL)';
      universityCountry = 'المملكة المتحدة';
      universityRank = 9;
    } else if (lower.includes('toronto')) {
      universityName = 'University of Toronto';
      universityCountry = 'كندا';
      universityRank = 18;
    } else if (lower.includes('melbourne') || lower.includes('sydney')) {
      universityName = 'University of Melbourne';
      universityCountry = 'أستراليا';
      universityRank = 14;
    } else {
      // Try to extract university name pattern
      const uniMatch = text.match(/(?:university of [a-zA-Z\s]+|[a-zA-Z\s]+ university|institute of [a-zA-Z\s]+)/i);
      if (uniMatch) {
        universityName = uniMatch[0].trim();
        universityRank = 25;
      }
    }

    // Degree level
    let degreeLevel: 'Bachelor' | 'Master' | 'PhD' | 'Fellowship' = 'Master';
    if (lower.includes('phd') || lower.includes('doctor of philosophy') || lower.includes('dphil')) {
      degreeLevel = 'PhD';
    } else if (lower.includes('bachelor') || lower.includes('undergraduate') || lower.includes('b.s.') || lower.includes('b.a.')) {
      degreeLevel = 'Bachelor';
    } else if (lower.includes('master') || lower.includes('m.s.') || lower.includes('m.a.') || lower.includes('msc')) {
      degreeLevel = 'Master';
    }

    // Major detection
    let major = 'Artificial Intelligence & Data Science';
    if (lower.includes('cyber') || lower.includes('security')) {
      major = 'Cybersecurity and Information Assurance';
    } else if (lower.includes('bio') || lower.includes('medicine') || lower.includes('health')) {
      major = 'Biotechnology & Genomic Medicine';
    } else if (lower.includes('energy') || lower.includes('sustainable') || lower.includes('renewable')) {
      major = 'Renewable Energy & Sustainable Systems';
    } else if (lower.includes('economy') || lower.includes('finance') || lower.includes('business')) {
      major = 'Financial Technology & Quantitative Economics';
    } else if (lower.includes('computer') || lower.includes('software')) {
      major = 'Computer Science & Cloud Architecture';
    }

    // Admission condition
    const isConditional = lower.includes('conditional offer') && !lower.includes('unconditional');
    const admissionType = isConditional ? 'conditional_language' : 'unconditional';

    // Language score
    let testType: 'IELTS' | 'TOEFL' | 'Duolingo' = 'IELTS';
    let score = 7.5;
    if (lower.includes('toefl')) {
      testType = 'TOEFL';
      score = 105;
    }

    return {
      universityName,
      universityCountry,
      universityRank,
      major,
      degreeLevel,
      admissionType,
      startDate: '2026-09-15',
      durationMonths: degreeLevel === 'Bachelor' ? 36 : degreeLevel === 'PhD' ? 48 : 24,
      estimatedAnnualTuitionUsd: 52000,
      languageScoreDetected: {
        testType,
        score,
        meetsRequirement: true
      },
      rawConfidence: 0.965
    };
  }

  /**
   * Evaluate Scholarship Rules Engine against all 4 tracks
   */
  public static evaluateRulesEngine(
    data: ExtractedAIData,
    profile: { gpa: number; gpaScale: number; age: number; userIelts: number; userToefl?: number }
  ): TrackRecommendation {
    const rank = data.universityRank || 50;
    const gpaOn5 = profile.gpaScale === 4.0 ? (profile.gpa / 4.0) * 5.0 : profile.gpa;
    const isUnconditional = data.admissionType === 'unconditional';

    // 1. Check Pioneers Track (مسار الرواد)
    if (rank <= 30 && isUnconditional && gpaOn5 >= 4.2 && profile.userIelts >= 7.0 && profile.age <= 35) {
      return {
        trackId: 'track-pioneers',
        trackName: 'مسار الرواد',
        trackNameEn: 'Pioneers Track',
        confidence: 0.99,
        eligibility: true,
        criteriaChecks: [
          { rule: 'تصنيف الجامعة الدولي (أفضل 30)', required: 'المرتبة 1 - 30 عالمياً', provided: `المرتبة ${rank} عالمياً`, passed: true },
          { rule: 'نوع القبول الأكاديمي', required: 'غير مشروط (Unconditional)', provided: 'قبول نهائي غير مشروط', passed: true },
          { rule: 'المعدل التراكمي للدرجة السابقة', required: '>= 4.5 / 5.0', provided: `${profile.gpa.toFixed(2)} / ${profile.gpaScale}`, passed: gpaOn5 >= 4.5 },
          { rule: 'كفاءة اللغة الإنجليزية (IELTS)', required: '>= 7.0', provided: `${profile.userIelts}`, passed: profile.userIelts >= 7.0 },
          { rule: 'السن النظامي للتقديم', required: '<= 35 عاماً', provided: `${profile.age} عاماً`, passed: profile.age <= 35 }
        ],
        reasoning: `تمت مطابقة معايير "مسار الرواد" للجامعة (${data.universityName}) المصنفة ضمن أفضل 30 جامعة عالمياً مع قبول غير مشروط وتفوق أكاديمي معتمد.`
      };
    }

    // 2. Check R&D Track (مسار البحث والتطوير)
    if ((data.degreeLevel === 'PhD' || data.degreeLevel === 'Master') && rank <= 100 && gpaOn5 >= 3.8 && profile.userIelts >= 7.0) {
      return {
        trackId: 'track-rd',
        trackName: 'مسار البحث والتطوير',
        trackNameEn: 'R&D Track',
        confidence: 0.96,
        eligibility: true,
        criteriaChecks: [
          { rule: 'الدرجة العلمية المستهدفة', required: 'ماجستير بحثي أو دكتوراه', provided: data.degreeLevel, passed: true },
          { rule: 'تصنيف الجامعة في الأبحاث', required: 'أفضل 100 جامعة عالمياً', provided: `المرتبة ${rank}`, passed: rank <= 100 },
          { rule: 'المعدل التراكمي', required: '>= 4.0 / 5.0', provided: `${profile.gpa.toFixed(2)}`, passed: gpaOn5 >= 4.0 },
          { rule: 'درجة اللغة الإنجليزية', required: '>= 7.5', provided: `${profile.userIelts}`, passed: profile.userIelts >= 7.0 }
        ],
        reasoning: `الطلب ملائم لـ "مسار البحث والتطوير" لدرجة ${data.degreeLevel} في التخصصات ذات الأولوية الوطنية للابتكار.`
      };
    }

    // 3. Check Excellence Track (مسار التميز)
    if (rank <= 70 && gpaOn5 >= 4.7 && profile.userIelts >= 7.5 && profile.age <= 30) {
      return {
        trackId: 'track-excellence',
        trackName: 'مسار التميز',
        trackNameEn: 'Excellence Track',
        confidence: 0.97,
        eligibility: true,
        criteriaChecks: [
          { rule: 'تصنيف الجامعة', required: 'أفضل 70 جامعة', provided: `المرتبة ${rank}`, passed: rank <= 70 },
          { rule: 'معدل التميز الأكاديمي', required: '>= 4.8 / 5.0', provided: `${profile.gpa.toFixed(2)}`, passed: gpaOn5 >= 4.7 },
          { rule: 'السن الأقصى', required: '<= 30 عاماً', provided: `${profile.age} عاماً`, passed: profile.age <= 30 }
        ],
        reasoning: `مطابقة عالية لـ "مسار التميز" في التخصصات الإبداعية والنوعية الداعمة للمشاريع الوطنية الكبرى.`
      };
    }

    // 4. Default to Supply Track (مسار إمداد)
    const passedGpa = gpaOn5 >= 3.5;
    const passedIelts = profile.userIelts >= 6.5;
    const passedRank = rank <= 200;

    return {
      trackId: 'track-supply',
      trackName: 'مسار إمداد',
      trackNameEn: 'Supply Track (Imdad)',
      confidence: 0.94,
      eligibility: passedGpa && passedIelts && passedRank,
      criteriaChecks: [
        { rule: 'تصنيف الجامعة الدولي', required: 'أفضل 200 جامعة عالمياً', provided: `المرتبة ${rank}`, passed: passedRank },
        { rule: 'الحد الأدنى للمعدل', required: '>= 3.5 / 5.0', provided: `${profile.gpa.toFixed(2)}`, passed: passedGpa },
        { rule: 'درجة الآيلتس', required: '>= 6.5', provided: `${profile.userIelts}`, passed: passedIelts },
        { rule: 'العمر الأقصى', required: '<= 40 عاماً', provided: `${profile.age} عاماً`, passed: profile.age <= 40 }
      ],
      reasoning: `الطلب يغطي متطلبات "مسار إمداد" لتلبية احتياجات سوق العمل الاستراتيجي وتمكين الكوادر الوطنية.`
    };
  }

  /**
   * AI Scholarship Counselor responses
   */
  public static async generateAssistantResponse(query: string, currentTrack?: Track): Promise<string> {
    const q = query.toLowerCase();

    // 1. Path/Track Selection ("ما المسار المناسب لي؟" or path guidance)
    if (q.includes('مناسب لي') || q.includes('اختيار المسار') || q.includes('أي مسار') || q.includes('right track') || q.includes('which track')) {
      return `🎯 **دليل اختيار المسار المناسب لطموحك ومؤهلك**:

يقدم **برنامج الابتعاث** 6 مسارات استراتيجية رئيسية، اختر الأنسب لك بناءً على أهدافك:

1. 🌟 **مسار الرواد (Pioneers)**:
   - يناسبك إذا كنت حاصلاً على قبول من **أفضل 30 جامعة عالمياً** (مثل MIT, Oxford, Stanford).
   - متاح لكافة الدرجات (بكالوريوس، ماجستير، دكتوراه).

2. 💼 **مسار إمداد (Supply)**:
   - يناسبك إذا كان تخصصك ضمن **القطاعات ذات الأولوية لسوق العمل** (سلاسل الإمداد، الأمن السيبراني، الذكاء الاصطناعي، السياحة، الطاقة).
   - يشمل أفضل 200 جامعة دولية لدرجتي البكالوريوس والماجستير.

3. 🔬 **مسار البحث والتطوير (R&D)**:
   - مخصص للباحثين وطلاب **الدكتوراه وما بعد الدكتوراه** لتعزيز منظومة الابتكار الوطنية.

4. 🏆 **مسار التميز (Excellence)**:
   - يركز على تخصصات نوعية كإدارة الأعمال الدولية، الاقتصاد، والسياسات العامة في أفضل 70 جامعة.

5. 🏥 **المسار الصحي (Health)**:
   - مخصص للزمالات والتخصصات الطبية الدقيقة والتمريض المتقدم.

6. 🚀 **مسار واعد (Waed)**:
   - يركز على الصناعات الوطنية والواعدة وتوطين التدريب في قطاعات المستقبل.

💡 *نصيحة: يمكنك استخدام حاسبة الأهلية الذكية أو رفع خطاب قبولك لفحصه ومطابقته فورياً!*`;
    }

    // 2. Pioneers Track Requirements ("ما شروط مسار الرواد؟")
    if (q.includes('الرواد') || q.includes('pioneer')) {
      return `🌟 **شروط ومعايير مسار الرواد (Pioneers Track)**:

- **نطاق الجامعات**: الحصول على قبول نهائي غير مشروط من إحدى **أفضل 30 جامعة ومؤسسة تعليمية في العالم** (وفق تصنيفات QS / THE / ARWU).
- **الدرجات العلمية**: متاح لدراسة البكالوريوس، الماجستير، والدكتوراه.
- **شرط القبول**: قبول مباشر غير مشروط بدراسة لغة (Direct Unconditional Admission).
- **المعدل الأكاديمي**: 
  - للبكالوريوس: معدل ثانوية عامة 90% فأعلى + قدرات/تحصيلي لا يقل عن 80.
  - للدراسات العليا: معدل جامعي لا يقل عن 4.5 من 5.0 (أو 3.5 من 4.0).
- **كفاءة اللغة**: تحقيق الحد الأدنى المشروط للجامعة (عادة IELTS 7.0+ أو TOEFL 100+).
- **المزايا الاستثنائية**: 
  - إصدار فوري للضمان المالي الرقمي.
  - مكافآت تميز مالية إضافية شهرية.
  - إشراف مباشر ودعم ورعاية مهنية نوعية.`;
    }

    // 3. Application Steps ("كيف أقدم على الابتعاث؟")
    if (q.includes('كيف أقدم') || q.includes('خطوات التقديم') || q.includes('طريقة التقديم') || q.includes('how to apply') || q.includes('how do i apply')) {
      return `📝 **خطوات التقديم المعتمدة على برنامج الابتعاث**:

1. 🔐 **تسجيل الدخول الموحد**:
   - الدخول عبر بوابة النفاذ الوطني الموحد (نفاذ/يقين) بدون الحاجة لإنشاء حساب جديد.
2. 📄 **الحصول على القبول الجامعي**:
   - تأمين قبول نهائي غير مشروط من جامعة مصنفة ضمن مسارك المختار.
3. 📤 **رفع المستندات وفحص الذكاء الاصطناعي**:
   - رفع خطاب القبول بصيغة PDF؛ حيث يقوم نظامنا الذكي باستخراج اسم الجامعة، التخصص، والدرجة العلمية والتحقق منها تلقائياً.
4. 📋 **تعبئة البيانات الأكاديمية والشخصية**:
   - اختيار المسار وتأكيد المؤهلات الأكاديمية واختبار اللغة.
5. ⚖️ **المراجعة والاعتماد**:
   - تدقيق الملف من لجان الابتعاث والملحقية الثقافية المختصة.
6. 📜 **إصدار الضمان المالي الرقمي وتأشيرة السفر**:
   - توليد الضمان المالي المعتمد برمز QR فور صدور القرار، ثم التقديم على التأشيرة عبر السفارة وحجز التذاكر عبر سفير.`;
    }

    // 4. Universities Search & Directory ("ما الجامعات المتاحة؟")
    if (q.includes('جامعات') || q.includes('الجامعات المتاحة') || q.includes('قائمة الجامعات') || q.includes('universities') || q.includes('available universities')) {
      return `🏛️ **الجامعات المعتمدة وتصنيفاتها في برنامج الابتعاث**:

تعتمد المنصة تصنيفات دولية موحدة (QS World Rankings, THE, Shanghai ARWU) موزعة كالتالي:

- 🇺🇸 **الولايات المتحدة**: MIT (المرتبة 1), Harvard, Stanford, Princeton, UC Berkeley, Columbia, Yale.
- 🇬🇧 **المملكة المتحدة**: University of Oxford, University of Cambridge, Imperial College London, UCL, Edinburgh.
- 🇨🇭 **سويسرا**: ETH Zurich.
- 🇸🇬 **سنغافورة**: National University of Singapore (NUS), NTU.
- 🇯🇵 **اليابان**: University of Tokyo.
- 🇫🇷 **فرنسا**: Sorbonne University, PSL Research University.
- 🇩🇪 **ألمانيا**: Technical University of Munich (TUM).
- 🇦🇺 **أستراليا**: University of Melbourne, University of Sydney.

💡 *يمكنك تصفح دليل الجامعات التفاعلي بالكامل من تبويب "الجامعات" والفرز بحسب الدولة والمسار والتخصص!*`;
    }

    // 5. Required Documents ("ما المستندات المطلوبة؟")
    if (q.includes('مستندات') || q.includes('أوراق') || q.includes('المستندات المطلوبة') || q.includes('documents') || q.includes('required documents')) {
      return `📁 **قائمة المستندات والوثائق الرسمية المطلوبة للتقديم**:

1. 📜 **خطاب القبول الجامعي الرسمي (Offer Letter)**:
   - يجب أن يكون نهائياً وغير مشروط ويوضح التخصص وتاريخ بدء الدراسة والدرجة العلمية.
2. 🎓 **وثيقة التخرج والسجل الأكاديمي الرسمي**:
   - للشهادة السابقة (مصدقة من وزارة التعليم)، بالإضافة لمعادلة الشهادة إن كانت صادرة من خارج المملكة.
3. 🗣️ **شهادة كفاءة اللغة الإنجليزية**:
   - اختبار رسمي ساري المفعول (IELTS Academic بدرجة لا تقل عن 6.5 - 7.0 أو TOEFL iBT بدرجة 80 - 100).
4. 🛂 **صورة جواز السفر**:
   - ساري المفعول لمدة لا تقل عن 6 أشهر من تاريخ بدء الدراسة.
5. 🆔 **البيانات الشخصية**:
   - يتم استيرادها تلقائياً وبشكل موثق عبر النفاذ الوطني ويقين.`;
    }

    // 6. Supply Track Details
    if (q.includes('إمداد') || q.includes('imdad') || q.includes('سلاسل')) {
      return `💼 **مسار إمداد (Supply Track)**:
- **الهدف**: تلبية احتياجات سوق العمل في القطاعات ذات الأولوية الاستراتيجية (سلاسل الإمداد، الأمن السيبراني، السياحة والضيافة، الطاقة المتجددة، الذكاء الاصطناعي).
- **الجامعات المعتمدة**: أفضل 200 جامعة دولية.
- **الشروط**: معدل تراكمي 3.5 من 5.0 فأعلى، ودرجة آيلتس 6.5 فأعلى.
- **الدرجات**: البكالوريوس والماجستير.`;
    }

    // 7. Digital Financial Guarantee
    if (q.includes('ضمان مالي') || q.includes('financial guarantee')) {
      return `📜 **إصدار الضمان المالي الرقمي الفوري عبر سفير**:
1. يتم إصدار الضمان المالي الرقمي تلقائياً فور ترشيح الطلب واعتماد قرار الابتعاث.
2. يحتوي الضمان على رمز استجابة سريعة (QR Code) مشفر وختم رقمي موثق معترف به دولياً.
3. يقدم مباشرة للسفارات العالمية لاستخراج تأشيرة الطالب الدراسية (مثل F-1 للولايات المتحدة أو CAS للـ UK Student Visa)، وللجامعة لإعفائك من دفع الرسوم مباشرة.`;
    }

    // 8. Electronic Services Guidance
    if (q.includes('خدمة') || q.includes('الخدمات') || q.includes('services') || q.includes('سفير') || q.includes('قبول')) {
      return `⚡ **دليل الخدمات الرقمية المتاحة في المنصة**:
- 📝 **منصة قبول**: التقديم على الابتعاث، فحص القبول بالذكاء الاصطناعي، ومطابقة المسارات.
- 🌐 **دليل الجامعات الذكي**: استكشاف أكثر من 200 جامعة عالمية معتمدة وشروطها وتخصصاتها.
- 🏢 **الملحقيات الثقافية**: الإشراف الأكاديمي والتواصل المباشر مع المشرف الدراسي في بلد الابتعاث.
- ✈️ **منصة سفير**: إصدار الضمانات المالية، أوامر الإركاب والتذاكر السنوية، صرف المخصصات وبدل السكن، وتأمين الرعاية الطبية.
- 📞 **مركز المساعدة والدعم**: حجز استشارة أكاديمية، الدليل الإرشادي، والتواصل عبر 19996.`;
    }

    // Default Fallback Response
    return `أهلاً بك في **المساعد الذكي للابتعاث** 🇸🇦!
أنا مستشارك الذكي المعتمد لبرنامج الابتعاث. يمكنني إرشادك في:
- 🎯 **اختيار المسار المناسب** لك وفق مؤهلاتك وتطلعاتك المهنية.
- 📜 **توضيح شروط المسارات** (الرواد، إمداد، البحث والتطوير، التميز، الصحي، واعد).
- 🏛️ **البحث عن الجامعات المعتمدة** وتصنيفاتها الأكاديمية.
- 📝 **خطوات التقديم الإلكتروني** ورفع المستندات.
- 📁 **قائمة المستندات المطلوبة** ومتطلبات اختبارات اللغة (IELTS/TOEFL).
- ⚡ **توجيهك للخدمة المناسبة** وإصدار الضمان المالي.

يمكنك الضغط على أحد الأسئلة المقترحة أو كتابة استفسارك بحرية!`;
  }
}
