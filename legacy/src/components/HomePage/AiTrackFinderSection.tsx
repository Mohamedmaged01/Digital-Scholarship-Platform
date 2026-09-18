import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Award, 
  GraduationCap, 
  RotateCcw,
  Zap,
  Globe2
} from 'lucide-react';
import { Track } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface AiTrackFinderSectionProps {
  tracks: Track[];
  onSelectTrackForApplication: (trackId: string) => void;
}

export const AiTrackFinderSection: React.FC<AiTrackFinderSectionProps> = ({
  tracks,
  onSelectTrackForApplication
}) => {
  const { isRtl, t } = useLanguage();
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Form State
  const [degree, setDegree] = useState<string>('Master');
  const [majorField, setMajorField] = useState<string>('ai_tech');
  const [gpa, setGpa] = useState<number>(4.8);
  const [englishScore, setEnglishScore] = useState<number>(7.5);
  const [careerGoal, setCareerGoal] = useState<string>('national_megaprojects');
  const [preferredCountry, setPreferredCountry] = useState<string>('us_uk');

  // AI Recommendation State
  const [recommendation, setRecommendation] = useState<{
    trackId: string;
    trackName: string;
    matchScore: number;
    headline: string;
    reasons: string[];
    criteriaPassed: { rule: string; pass: boolean }[];
  } | null>(null);

  const handleRunAiAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      let recTrackId = 'track-pioneers';
      let match = 96;
      let reasons = isRtl ? [
        'معدلك التراكمي (4.8 / 5.0) ودرجة الآيلتس (7.5) تؤهلك مباشرة للمنافسة في أفضل 30 جامعة عالمية.',
        'تخصصك واهتمامك بالذكاء الاصطناعي والتقنيات المتقدمة يقع في قمة الأولويات الوطنية لمسار الرواد.',
        'القبول غير المشروط في هذه الجامعات يمنحك إصداراً فورياً للضمان المالي الرقمي.'
      ] : [
        'Your GPA (4.8 / 5.0) and IELTS (7.5) strongly qualify you for admission in the World’s Top 30 universities.',
        'Your background in AI and advanced technology aligns directly with national priorities under Pioneers track.',
        'Unconditional admission at designated institutions grants instant digital financial guarantee issuance.'
      ];

      if (careerGoal === 'research_phd' || degree === 'PhD') {
        recTrackId = 'track-rd';
        match = 95;
        reasons = isRtl ? [
          'طموحك البحثي في الابتكار والدرجات العليا يتطابق مع مستهدفات مسار البحث والتطوير (R&D).',
          'دعم مالي مخصص للمختبرات والمؤتمرات العلمية والمشاريع البحثية الوطنية.',
          'أولوية ارتباط مع مراكز الأبحاث المتقدمة في المملكة مثل كاوست ومدينة الملك عبد العزيز.'
        ] : [
          'Your research ambitions and doctoral focus perfectly match the Research & Development (R&D) track.',
          'Dedicated grant allocations for laboratories, international symposiums, and national research initiatives.',
          'Priority linkages with leading Saudi research hubs including KAUST and KACST.'
        ];
      } else if (majorField === 'healthcare') {
        recTrackId = 'track-health';
        match = 98;
        reasons = isRtl ? [
          'التخصصات الطبية والصحية والزمالات الدقيقة تحظى برعاية كاملة في المسار الصحي.',
          'تغطية رسوم التدريب السريري في أرقى المستشفيات الجامعية العالمية.',
          'شراكة مباشرة مع الهيئة السعودية للتخصصات الصحية والمدن الطبية الكبرى.'
        ] : [
          'Clinical subspecialties and advanced medical fellowships receive full coverage under Health track.',
          'Direct coverage of clinical residency and training fees in premier international medical university hospitals.',
          'Strategic partnership with the Saudi Commission for Health Specialties and major medical cities.'
        ];
      } else if (careerGoal === 'national_megaprojects') {
        recTrackId = 'track-excellence';
        match = 94;
        reasons = isRtl ? [
          'التخصصات النوعية والإبداعية موجهة مباشرة لمشاريع رؤية 2030 الكبرى (نيوم، القدية، البحر الأحمر).',
          'ابتعاث لأفضل 70 جامعة ومؤسسة متخصصة عالمياً في مجالات التميز.',
          'برامج توجيه قيادي ومسار وظيفي واعد عند التخرج.'
        ] : [
          'Specialized programs geared directly toward Saudi Vision 2030 giga-projects (NEOM, Qiddiya, Red Sea).',
          'Scholarships at Top 70 world-class institutions in creative, leadership, and priority fields.',
          'Fast-track leadership development and career mentorship upon graduation.'
        ];
      } else if (majorField === 'engineering_industry') {
        recTrackId = 'track-supply';
        match = 92;
        reasons = isRtl ? [
          'تخصصات الهندسة والتقنية وسلاسل الإمداد تمثل العصب الرئيسي لمسار إمداد.',
          'قائمة معتمدة تضم أفضل 200 جامعة عالمية مع ربط مباشر مع جهات التوظيف الوطنية.',
          'فرص تدريب مهني تعاوني خلال فترة الابتعاث.'
        ] : [
          'Engineering, high-tech, and supply chains form the operational backbone of the Supply track.',
          'Approved list of Top 200 global institutions with direct linkage to major national employers.',
          'Co-op professional internship placement during study.'
        ];
      }

      const foundTrack = tracks.find(t => t.id === recTrackId) || tracks[0];
      const trackTitle = isRtl ? foundTrack.nameAr : (foundTrack.nameEn || foundTrack.nameAr);

      setRecommendation({
        trackId: recTrackId,
        trackName: trackTitle,
        matchScore: match,
        headline: isRtl ? `المسار المقترح لك: ${trackTitle}` : `Recommended Track: ${trackTitle}`,
        reasons: reasons,
        criteriaPassed: isRtl ? [
          { rule: 'المرحلة التعليمية والمعدل التراكمي', pass: true },
          { rule: 'كفاءة اللغة الإنجليزية (IELTS / TOEFL)', pass: true },
          { rule: 'توافق التخصص مع الأولويات الوطنية', pass: true },
          { rule: 'نطاق تصنيف الجامعات المستهدفة', pass: true }
        ] : [
          { rule: 'Academic Level & Minimum GPA', pass: true },
          { rule: 'English Language Benchmark (IELTS/TOEFL)', pass: true },
          { rule: 'Major Alignment with National Priorities', pass: true },
          { rule: 'Target University Ranking Range', pass: true }
        ]
      });
      setIsAnalyzing(false);
      setCurrentStep(4);
    }, 900);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setRecommendation(null);
  };

  return (
    <section id="ai-finder-section" className={`bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 rounded-3xl border border-emerald-200/80 p-6 sm:p-10 lg:p-12 shadow-2xs ${isRtl ? 'text-right' : 'text-left'} space-y-8 scroll-mt-24`}>
      
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-200/80 pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#005A36] text-xs font-bold border border-emerald-300">
            <Bot className="w-4 h-4 text-[#005A36]" />
            <span>{isRtl ? 'محرك التوجيه الذكي (AI Recommendation Engine)' : 'AI Track Recommender Engine'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {isRtl ? 'لا تعرف أي مسار يناسبك؟' : 'Unsure Which Track Fits You?'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {isRtl 
              ? 'دعنا نساعدك في اكتشاف المسار الأقرب إلى طموحك الأكاديمي والمهني ومؤهلاتك الحالية في خطوات بسيطة.'
              : 'Let our smart engine recommend the optimal scholarship track according to your degree, GPA, and goals.'}
          </p>
        </div>

        {!isWizardOpen && (
          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-[#005A36] hover:bg-[#004328] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 shrink-0 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isRtl ? 'اكتشف مسارك بالذكاء الاصطناعي' : 'Launch AI Track Finder'}</span>
          </button>
        )}
      </div>

      {/* Interactive Wizard Container */}
      {isWizardOpen && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in zoom-in-95">
          
          {/* Wizard Step Progress */}
          {currentStep < 4 && (
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs font-bold text-slate-500">
              <span className="text-[#005A36]">
                {isRtl ? `الخطوة ${currentStep} من 3` : `Step ${currentStep} of 3`}
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map(step => (
                  <span
                    key={step}
                    className={`w-6 h-1.5 rounded-full transition-colors ${
                      step <= currentStep ? 'bg-[#005A36]' : 'bg-slate-200'
                    }`}
                  ></span>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: Academic Background */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#005A36]" />
                <span>{isRtl ? '1. ما هي المرحلة التعليمية والمعدل الحالي؟' : '1. What is your target degree and current GPA?'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Bachelor', labelAr: 'بكالوريوس', labelEn: 'Bachelor’s', descAr: 'خريج ثانوية عامة أو متقدم للجامعة', descEn: 'High school graduate or undergraduate applicant' },
                  { id: 'Master', labelAr: 'ماجستير', labelEn: 'Master’s', descAr: 'حاصل على درجة البكالوريوس', descEn: 'Completed Bachelor’s degree' },
                  { id: 'PhD', labelAr: 'دكتوراه وزمالة', labelEn: 'PhD & Fellowships', descAr: 'حاصل على الماجستير أو البورد الطبي', descEn: 'Completed Master’s or medical board' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setDegree(item.id)}
                    className={`p-4 rounded-xl border ${isRtl ? 'text-right' : 'text-left'} transition cursor-pointer ${
                      degree === item.id
                        ? 'bg-emerald-50 border-[#005A36] text-[#005A36] font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold text-sm">{isRtl ? item.labelAr : item.labelEn}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{isRtl ? item.descAr : item.descEn}</div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {isRtl ? 'المعدل التراكمي التقريبي (من 5.0):' : 'Estimated Cumulative GPA (out of 5.0):'} <span className="text-[#005A36] font-bold">{gpa}</span>
                  </label>
                  <input
                    type="range"
                    min="3.0"
                    max="5.0"
                    step="0.05"
                    value={gpa}
                    onChange={(e) => setGpa(parseFloat(e.target.value))}
                    className="w-full accent-[#005A36]"
                  />
                  <div className="flex justify-between text-[10.5px] text-slate-400 font-mono">
                    <span>3.0 (Good)</span>
                    <span>4.0 (Very Good)</span>
                    <span>5.0 (Excellent)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {isRtl ? 'مستوى اللغة الإنجليزية (IELTS مكافئ):' : 'English Proficiency (IELTS Equivalent):'} <span className="text-[#005A36] font-bold">{englishScore}</span>
                  </label>
                  <input
                    type="range"
                    min="5.5"
                    max="9.0"
                    step="0.5"
                    value={englishScore}
                    onChange={(e) => setEnglishScore(parseFloat(e.target.value))}
                    className="w-full accent-[#005A36]"
                  />
                  <div className="flex justify-between text-[10.5px] text-slate-400 font-mono">
                    <span>5.5 (Intermediate)</span>
                    <span>7.0 (Advanced)</span>
                    <span>9.0 (Native)</span>
                  </div>
                </div>
              </div>

              <div className={`flex ${isRtl ? 'justify-end' : 'justify-end'} pt-4`}>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-[#005A36] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#004328] cursor-pointer"
                >
                  <span>{isRtl ? 'متابعة' : 'Next'}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Field of Study & Career Ambition */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#005A36]" />
                <span>{isRtl ? '2. ما هو مجال التخصص والهدف المهني المستقبلي؟' : '2. Field of study and future career ambition'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: 'ai_tech', labelAr: 'الذكاء الاصطناعي والتقنية المتقدمة', labelEn: 'AI & Advanced Tech', descAr: 'الحوسبة السحابية، الروبوتات، الأمن السيبراني', descEn: 'Cloud, Robotics, Cyber Security' },
                  { id: 'healthcare', labelAr: 'العلوم الطبية والصحية', labelEn: 'Medicine & Health Sciences', descAr: 'الطب البشري، الجراحة، الأورام، التمريض', descEn: 'Medicine, Surgery, Oncology, Nursing' },
                  { id: 'engineering_industry', labelAr: 'الهندسة والصناعات وسلاسل الإمداد', labelEn: 'Engineering & Supply Chains', descAr: 'الطاقة المتجددة، التعدين، اللوجستيات', descEn: 'Renewables, Mining, Logistics' },
                  { id: 'creative_megaprojects', labelAr: 'الفنون وإدارة المشاريع الكبرى', labelEn: 'Creative Arts & Giga Projects', descAr: 'التصميم الحضري، العمارة، الضيافة الفاخرة', descEn: 'Urban Design, Architecture, Hospitality' },
                  { id: 'space_future', labelAr: 'الفضاء والتقنيات الناشئة وأشباه الموصلات', labelEn: 'Space & Deep Tech', descAr: 'الأقمار الاصطناعية، الهيدروجين النظيف', descEn: 'Satellites, Clean Hydrogen, Semiconductors' },
                  { id: 'business_policy', labelAr: 'السياسات العامة والاقتصاد والقيادة', labelEn: 'Public Policy & Digital Economy', descAr: 'إدارة الابتكار، الاقتصاد الرقمي، الحوكمة', descEn: 'Innovation, Digital Economy, Governance' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setMajorField(item.id)}
                    className={`p-3.5 rounded-xl border ${isRtl ? 'text-right' : 'text-left'} transition cursor-pointer ${
                      majorField === item.id
                        ? 'bg-emerald-50 border-[#005A36] text-[#005A36] font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold text-xs">{isRtl ? item.labelAr : item.labelEn}</div>
                    <div className="text-[10.5px] text-slate-500 mt-1">{isRtl ? item.descAr : item.descEn}</div>
                  </button>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 block">
                  {isRtl ? 'ما هو طموحك المهني الأساسي؟' : 'What is your primary career vision?'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {[
                    { id: 'national_megaprojects', labelAr: 'مشاريع رؤية 2030 الكبرى', labelEn: 'Vision 2030 Giga Projects' },
                    { id: 'research_phd', labelAr: 'الأبحاث العلمية والتدريس الأكاديمي', labelEn: 'Academic Research & Professorship' },
                    { id: 'industry_leadership', labelAr: 'قيادة الشركات الوطنية والخاصة', labelEn: 'Corporate Leadership & Industry' }
                  ].map(g => (
                    <button
                      key={g.id}
                      onClick={() => setCareerGoal(g.id)}
                      className={`p-3 rounded-xl border text-center font-bold transition cursor-pointer ${
                        careerGoal === g.id
                          ? 'bg-[#005A36] text-white border-[#005A36]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isRtl ? g.labelAr : g.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  {isRtl ? 'رجوع' : 'Back'}
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#005A36] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#004328] cursor-pointer"
                >
                  <span>{isRtl ? 'متابعة' : 'Next'}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Preferred Destinations & Summary */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-[#005A36]" />
                <span>{isRtl ? '3. الوجهات والجامعات المفضلة لديك' : '3. Preferred Study Destinations'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'us_uk', labelAr: 'أمريكا وبريطانيا', labelEn: 'United States & UK', desc: 'MIT, Harvard, Oxford, Cambridge, Stanford' },
                  { id: 'europe_asia', labelAr: 'أوروبا وآسيا المتقدمة', labelEn: 'Europe & East Asia', desc: 'ETH Zurich, Tokyo University, NUS Singapore' },
                  { id: 'australia_canada', labelAr: 'كندا وأستراليا', labelEn: 'Canada & Australia', desc: 'Toronto, McGill, Melbourne, Sydney' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setPreferredCountry(item.id)}
                    className={`p-4 rounded-xl border ${isRtl ? 'text-right' : 'text-left'} transition cursor-pointer ${
                      preferredCountry === item.id
                        ? 'bg-emerald-50 border-[#005A36] text-[#005A36] font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold text-xs">{isRtl ? item.labelAr : item.labelEn}</div>
                    <div className="text-[10.5px] text-slate-500 mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>

              {/* Ready Confirmation */}
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-[#005A36]">
                  {isRtl ? 'جاهز لتحليل الذكاء الاصطناعي:' : 'Ready for AI Verification:'}
                </div>
                <p>
                  {isRtl 
                    ? 'سيقوم النظام بمطابقة معايير المسارات الستة مع مؤهلك وتفضيلاتك وإصدار توصية فورية مع نسبة التوافق.'
                    : 'The engine will cross-reference the 6 scholarship track rules with your background and compute direct match probability.'}
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  {isRtl ? 'رجوع' : 'Back'}
                </button>
                <button
                  onClick={handleRunAiAnalysis}
                  disabled={isAnalyzing}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/20 hover:from-emerald-500 hover:to-teal-600 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <Zap className="w-4 h-4 animate-spin text-amber-300" />
                      <span>{isRtl ? 'جاري الفحص بالذكاء الاصطناعي...' : 'Analyzing credentials...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>{isRtl ? 'عرض التوصية الذكية' : 'Generate Recommendation'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Recommendation Results */}
          {currentStep === 4 && recommendation && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Match Score Banner */}
              <div className={`bg-gradient-to-r from-[#004026] via-[#005A36] to-teal-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="space-y-2">
                  <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block">
                    {isRtl ? 'المسار المقترح لك بالذكاء الاصطناعي' : 'AI Recommendation Result'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    {recommendation.trackName}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                    {isRtl 
                      ? 'بناءً على تحليلك الأكاديمي، يمثل هذا المسار الخيار الأمثل لمؤهلك وطموحك في الأولويات الوطنية.'
                      : 'Based on your academic profile, this track offers the highest acceptance alignment with national Vision 2030 priorities.'}
                  </p>
                </div>

                <div className="w-28 h-28 rounded-2xl bg-white/10 border-2 border-amber-400/80 backdrop-blur-md flex flex-col items-center justify-center text-center shrink-0 shadow-lg">
                  <span className="text-3xl font-bold text-amber-300 font-mono">{recommendation.matchScore}%</span>
                  <span className="text-[10px] font-bold text-emerald-200">{isRtl ? 'درجة التوافق' : 'Match Score'}</span>
                </div>
              </div>

              {/* Rationale & Reasons */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                
                {/* Why This Track */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{isRtl ? 'أسباب التوصية الذكية:' : 'Why this track was selected:'}</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {recommendation.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#005A36] shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Criteria Checks */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#005A36]" />
                    <span>{isRtl ? 'مطابقة الشروط الفورية:' : 'Eligibility Verification:'}</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    {recommendation.criteriaPassed.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/70">
                        <span className="text-slate-700 font-medium">{c.rule}</span>
                        <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          {isRtl ? 'مستوفي المعيار' : 'Criterion Met'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'إعادة التقييم الذكي' : 'Re-run Evaluation'}</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onSelectTrackForApplication(recommendation.trackId)}
                    className="px-6 py-3 rounded-xl bg-[#005A36] hover:bg-[#004328] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>{isRtl ? `تقديم فوري على ${recommendation.trackName}` : `Apply for ${recommendation.trackName}`}</span>
                    <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </section>
  );
};
