import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  GraduationCap, 
  Building, 
  BookOpen, 
  Award, 
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Zap,
  Bot
} from 'lucide-react';
import { Track } from '../../types';
import { ALL_SIX_TRACKS } from '../../data/scholarshipCatalog';

interface SmartPathWizardProps {
  onSelectTrack: (trackId: string) => void;
  onStartApplicationWithTrack: (trackId: string) => void;
}

export const SmartPathWizard: React.FC<SmartPathWizardProps> = ({
  onSelectTrack,
  onStartApplicationWithTrack
}) => {
  const [step, setStep] = useState<number>(1);
  const [degree, setDegree] = useState<string>('Master');
  const [field, setField] = useState<string>('ai_tech');
  const [ielts, setIelts] = useState<string>('high');
  const [gpa, setGpa] = useState<string>('high');
  const [hasAdmission, setHasAdmission] = useState<string>('top30');

  const [recommendedTrack, setRecommendedTrack] = useState<Track | null>(null);
  const [matchScore, setMatchScore] = useState<number>(98);
  const [matchReasons, setMatchReasons] = useState<string[]>([]);

  const calculateRecommendation = () => {
    let bestTrackId = 'track-pioneers';
    let score = 96;
    let reasons: string[] = [];

    if (hasAdmission === 'top30' || (gpa === 'high' && ielts === 'high' && (degree === 'PhD' || field === 'ai_tech'))) {
      bestTrackId = 'track-pioneers';
      score = 98;
      reasons = [
        'معدلك الأكاديمي ودرجة اللغة يؤهلانك لأفضل 30 جامعة عالمياً.',
        'تخصصك يقع ضمن الأولويات الوطنية المتقدمة لمسار الرواد.',
        'مخصصات تميز مالية وتغطية شاملة فورية.'
      ];
    } else if (field === 'health') {
      bestTrackId = 'track-health';
      score = 95;
      reasons = [
        'تخصصك في العلوم الصحية والتمريض يؤهلك لمسار التخصصات الصحية.',
        'دعم برامج الإقامة الطبية والزمالات الإكلينيكية بأرقى المستشفيات العالمية.'
      ];
    } else if (field === 'research' || degree === 'PhD') {
      bestTrackId = 'track-rd';
      score = 94;
      reasons = [
        'اهتمامك بالبحث الأكاديمي والابتكار يتطابق تماماً مع أولويات مسار البحث والتطوير (R&D).',
        'ميزانية بحثية مخصصة وشراكات مع مراكز الابتكار الوطنية.'
      ];
    } else if (field === 'tourism_arts') {
      bestTrackId = 'track-excellence';
      score = 96;
      reasons = [
        'تخصصك في الضيافة والسياحة والثقافة يدعم مشاريع رؤية 2030 الكبرى (نيوم، البحر الأحمر، العلا).',
        'مسار التميز يوفر رعاية مباشرة وشراكات مهنية نوعية.'
      ];
    } else {
      bestTrackId = 'track-supply';
      score = 92;
      reasons = [
        'تخصصك مطلوب في سوق العمل الوطني الاستراتيجي ضمن مسار إمداد.',
        'قائمة واسعة تضم أفضل 200 جامعة عالمية وفرص تدريب مهني تعاوني.'
      ];
    }

    const matched = ALL_SIX_TRACKS.find(t => t.id === bestTrackId) || ALL_SIX_TRACKS[0];
    setRecommendedTrack(matched);
    setMatchScore(score);
    setMatchReasons(reasons);
    setStep(5); // Go to results step
  };

  const handleReset = () => {
    setStep(1);
    setDegree('Master');
    setField('ai_tech');
    setIelts('high');
    setGpa('high');
    setHasAdmission('top30');
    setRecommendedTrack(null);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 rounded-3xl p-6 sm:p-10 border border-slate-800 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        
        {/* Wizard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">الموجه الذكي لاكتشاف مسارك الأنسب</h2>
              <p className="text-xs text-slate-300 mt-0.5">أجب عن 4 أسئلة سريعة لنرشح لك المسار الأكثر توافقاً وفرص قبول أعلى</p>
            </div>
          </div>

          {step < 5 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">الخطوة {step} من 4</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`w-6 h-1.5 rounded-full transition ${
                      s <= step ? 'bg-emerald-400' : 'bg-white/20'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* STEP 1: DEGREE LEVEL */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              ما هي المرحلة الدراسية المستهدفة للابتعاث؟
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: 'Bachelor', label: 'بكالوريوس', desc: 'خريجو الثانوية العامة' },
                { id: 'Master', label: 'ماجستير', desc: 'خريجو البكالوريوس' },
                { id: 'PhD', label: 'دكتوراه', desc: 'أبحاث ودراسات عليا' },
                { id: 'Fellowship', label: 'زمالة وإقامة طبية', desc: 'الكوادر الصحية والأطباء' }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setDegree(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    degree === opt.id
                      ? 'bg-emerald-600/30 border-emerald-400 ring-2 ring-emerald-400/40 text-white'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="font-bold text-sm block mb-1">{opt.label}</span>
                  <span className="text-xs text-slate-400">{opt.desc}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2"
              >
                <span>التالي: المجال والتخصص</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: FIELD OF STUDY */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              ما هو مجال دراستك أو التخصص المستهدف؟
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 'ai_tech', label: 'الذكاء الاصطناعي والتقنيات المتقدمة', desc: 'علوم الحاسب، الروبوتات، الأمن السيبراني' },
                { id: 'health', label: 'العلوم الصحية والطبية', desc: 'الطب البشري، التمريض، الصيدلة الإكلينيكية' },
                { id: 'tourism_arts', label: 'السياحة والثقافة والفنون', desc: 'فنون الطهي، إدارة التراث، التصميم والسينما' },
                { id: 'energy_industry', label: 'الطاقة والصناعة وسلاسل الإمداد', desc: 'الهندسة، الطاقة المتجددة، اللوجستيات' },
                { id: 'research', label: 'العلوم الأساسية والأبحاث', desc: 'الفيزياء، علوم الفضاء، الاقتصاد والسياسات' },
                { id: 'business', label: 'إدارة الأعمال والتمويل الرقمي', desc: 'الابتكار المالي، التسويق، المحاسبة' }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setField(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    field === opt.id
                      ? 'bg-emerald-600/30 border-emerald-400 ring-2 ring-emerald-400/40 text-white'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="font-bold text-sm block mb-1">{opt.label}</span>
                  <span className="text-xs text-slate-400">{opt.desc}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition flex items-center gap-1"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2"
              >
                <span>التالي: المؤهل واللغة</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LANGUAGE & GPA */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              ما هو مستواك في اختبار اللغة الإنجليزية (IELTS / TOEFL) والمعدل التراكمي؟
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-300 block font-bold">درجة اختبار اللغة الإنجليزية:</label>
                <div className="space-y-2">
                  {[
                    { id: 'high', label: 'IELTS 7.0 فأعلى (أو TOEFL 100+)' },
                    { id: 'med', label: 'IELTS 6.0 - 6.5 (أو TOEFL 80 - 90)' },
                    { id: 'low', label: 'أقل من 6.0 / لم أختبر بعد' }
                  ].map((l) => (
                    <div
                      key={l.id}
                      onClick={() => setIelts(l.id)}
                      className={`p-3 rounded-xl border cursor-pointer text-xs font-semibold ${
                        ielts === l.id ? 'bg-emerald-600/30 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-slate-300'
                      }`}
                    >
                      {l.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-300 block font-bold">المعدل الأكاديمي التراكمي:</label>
                <div className="space-y-2">
                  {[
                    { id: 'high', label: 'ممتاز مرتفع (4.50 من 5 أو 3.75 من 4 فأعلى)' },
                    { id: 'med', label: 'جيد جداً (3.75 - 4.49 من 5)' },
                    { id: 'low', label: 'جيد (2.75 - 3.74 من 5)' }
                  ].map((g) => (
                    <div
                      key={g.id}
                      onClick={() => setGpa(g.id)}
                      className={`p-3 rounded-xl border cursor-pointer text-xs font-semibold ${
                        gpa === g.id ? 'bg-emerald-600/30 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-slate-300'
                      }`}
                    >
                      {g.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition flex items-center gap-1"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2"
              >
                <span>التالي: القبول الجامعي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ADMISSION STATUS */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-400" />
              هل لديك قبول جامعي مباشر غير مشروط حالياً؟
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'top30', label: 'نعم، لدي قبول من أفضل 30 جامعة عالمياً', desc: 'مثل Harvard, Oxford, MIT, Cambridge' },
                { id: 'top200', label: 'نعم، لدي قبول من جامعة ضمن أفضل 200', desc: 'جامعة معتمدة دولياً في قائمة البرنامج' },
                { id: 'none', label: 'لا، ما زلت في مرحلة التقديم على الجامعات', desc: 'أرغب بمعرفة المسار وشروط التقديم أولاً' }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setHasAdmission(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    hasAdmission === opt.id
                      ? 'bg-emerald-600/30 border-emerald-400 ring-2 ring-emerald-400/40 text-white'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="font-bold text-sm block mb-1">{opt.label}</span>
                  <span className="text-xs text-slate-400">{opt.desc}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition flex items-center gap-1"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </button>
              <button
                onClick={calculateRecommendation}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-400 hover:to-orange-500 shadow-xl transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>تحليل واكتشاف المسار الآن</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: RECOMMENDATION RESULT */}
        {step === 5 && recommendedTrack && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            
            <div className="bg-white/10 rounded-3xl p-6 sm:p-8 border border-white/20 backdrop-blur-md space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
                      نسبة التطابق الذكي: {matchScore}%
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold">موصى به لملفك الأكاديمي</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {recommendedTrack.nameAr}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">{recommendedTrack.nameEn}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>إعادة التقييم</span>
                  </button>
                </div>
              </div>

              {/* Reasons */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2">لماذا هذا المسار هو الأنسب لك؟</h4>
                <div className="space-y-2">
                  {matchReasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Track Quick Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/20 p-4 rounded-2xl border border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">الحد الأدنى للمعدل:</span>
                  <span className="font-bold text-emerald-400">{recommendedTrack.minGpa} من 5.0</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">درجة الآيلتس المطلوبة:</span>
                  <span className="font-bold text-amber-300">{recommendedTrack.requiredIelts} درجات</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">تصنيف الجامعات:</span>
                  <span className="font-bold text-teal-300">أفضل {recommendedTrack.topUniversitiesRankLimit} جامعة</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">المقاعد المتاحة:</span>
                  <span className="font-bold text-white">{recommendedTrack.allocatedSeats.toLocaleString()} مقعد</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  onClick={() => onSelectTrack(recommendedTrack.id)}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition"
                >
                  اطّلع على شروط وتفاصيل المسار كاملة
                </button>

                <button
                  onClick={() => onStartApplicationWithTrack(recommendedTrack.id)}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl transition flex items-center gap-2"
                >
                  <span>التقديم عبر المنصة الرسمية لهذا المسار</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </div>

              {/* Mandatory Advisory Disclaimer */}
              <p className="text-[11px] text-center text-emerald-200/70 pt-2 border-t border-white/10 font-medium">
                تنويه: النتيجة إرشادية ولا تمثل قرارًا رسميًا بالاستحقاق أو القبول.
              </p>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
