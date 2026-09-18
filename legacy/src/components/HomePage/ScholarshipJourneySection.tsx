import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  CheckCircle2, 
  FileText, 
  UploadCloud, 
  Clock, 
  Award, 
  PlaneTakeoff, 
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const ScholarshipJourneySection: React.FC = () => {
  const { isRtl, t } = useLanguage();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const steps = [
    {
      num: '01',
      title: isRtl ? 'استكشف' : 'Explore',
      desc: isRtl 
        ? 'استكشف مسارات الابتعاث الستة والجامعات والتخصصات العالمية ذات الأولوية الوطنية.'
        : 'Explore the 6 strategic tracks, global universities, and national priority majors.',
      icon: <Compass className="w-5 h-5" />,
      detail: isRtl
        ? 'اطّلع على قائمة أفضل الجامعات المعتمدة بحسب كل مسار واعرف التخصصات الحرجة والمستهدفة.'
        : 'Review top accredited universities by track and identified priority fields.'
    },
    {
      num: '02',
      title: isRtl ? 'اختر المسار' : 'Select Track',
      desc: isRtl
        ? 'حدد المسار الأنسب لمؤهلك (الرواد، إمداد، البحث والتطوير، التميز، الصحي، واعد).'
        : 'Choose the most suitable track (Pioneers, Supply, R&D, Excellence, Health, Waed).',
      icon: <Layers className="w-5 h-5" />,
      detail: isRtl
        ? 'استخدم حاسبة المطابقة الذكية أو المساعد الذكي لمساعدتك في اتخاذ القرار المناسب.'
        : 'Use the AI Track Recommender or matching calculator for personalized guidance.'
    },
    {
      num: '03',
      title: isRtl ? 'تحقق من الشروط' : 'Check Criteria',
      desc: isRtl
        ? 'تأكد من استيفاء المعدل، واختبارات اللغة، والحصول على قبول جامعي غير مشروط.'
        : 'Verify GPA, English test scores (IELTS/TOEFL), and unconditional admission offer.',
      icon: <CheckCircle2 className="w-5 h-5" />,
      detail: isRtl
        ? 'يشترط خطاب قبول نهائي غير مشروط (Unconditional Offer) من جامعة ضمن التصنيف المحدد للمسار.'
        : 'An official Unconditional Offer from a recognized ranked institution is mandatory.'
    },
    {
      num: '04',
      title: isRtl ? 'قدم طلبك' : 'Apply Online',
      desc: isRtl
        ? 'التقديم عبر بوابة الابتعاث الموحدة الرسمية (kasp.moe.gov.sa) وتعبئة البيانات.'
        : 'Apply through the official scholarship portal at kasp.moe.gov.sa and fill details.',
      icon: <FileText className="w-5 h-5" />,
      detail: isRtl
        ? 'يتم ربط بيانات طلبك مباشرة مع المنظومة المركزية للابتعاث بوزارة التعليم.'
        : 'Application records are routed directly through the Ministry of Education central system.'
    },
    {
      num: '05',
      title: isRtl ? 'ارفع المستندات' : 'Upload Docs',
      desc: isRtl
        ? 'ارفع خطاب القبول، السجل الأكاديمي، شهادة اللغة، وجواز السفر للتدقيق الآلي.'
        : 'Upload your admission letter, transcripts, language certificate, and passport.',
      icon: <UploadCloud className="w-5 h-5" />,
      detail: isRtl
        ? 'يقوم نظام الذكاء الاصطناعي (OCR) بقراءة وتدقيق خطاب القبول ومطابقة التخصص في ثوانٍ.'
        : 'AI OCR extracts and validates acceptance criteria and university rank instantly.'
    },
    {
      num: '06',
      title: isRtl ? 'متابعة الطلب' : 'Track Status',
      desc: isRtl
        ? 'تابع مرحلة التدقيق الأكاديمي من الملحقية الثقافية ولجنة الفرز المركزية.'
        : 'Follow academic auditing by Cultural Missions and central ministerial committee.',
      icon: <Clock className="w-5 h-5" />,
      detail: isRtl
        ? 'إشعارات لحظية عبر الرسائل القصيرة والمنصة عند انتقال طلبك لأي مرحلة جديدة.'
        : 'Instant SMS & platform notifications at every status transition.'
    },
    {
      num: '07',
      title: isRtl ? 'الترشيح والاعتماد' : 'Decision & Financial',
      desc: isRtl
        ? 'صدور قرار الابتعاث الرسمي وإصدار الضمان المالي الرقمي المعتمد فوراً.'
        : 'Official scholarship decree issuance and certified instant digital financial guarantee.',
      icon: <Award className="w-5 h-5" />,
      detail: isRtl
        ? 'يمكنك تحميل وطباعة الضمان المالي الرقمي فور اعتماده لاستكمال إجراءات التأشيرة والتسجيل.'
        : 'Download and print your QR-authenticated financial guarantee for visa and enrollment.'
    },
    {
      num: '08',
      title: isRtl ? 'بدء الرحلة' : 'Begin Studies',
      desc: isRtl
        ? 'التواصل مع الملحقية الثقافية، إصدار التذاكر، والسفر لبدء الدراسة الجامعية.'
        : 'Coordinate with Cultural Mission, ticket issuance, and travel to start classes.',
      icon: <PlaneTakeoff className="w-5 h-5" />,
      detail: isRtl
        ? 'متابعة أكاديمية ومالية ورعاية مستمرة طوال فترة دراستك عبر منصة سفير والملحقية.'
        : 'Continuous academic monitoring, monthly stipends, and medical insurance via Safeer.'
    }
  ];

  const currentStep = steps[activeStepIndex];

  return (
    <section id="journey-section" className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-2xs space-y-8 scroll-mt-24">
      
      {/* Header */}
      <div className={`space-y-1 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005A36]">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{t.journey.eyebrow}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {t.journey.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
          {t.journey.subtitle}
        </p>
      </div>

      {/* Desktop Horizontal Interactive Timeline */}
      <div className="hidden lg:block space-y-6">
        <div className="relative">
          {/* Connector Line */}
          <div className="absolute top-7 inset-x-8 h-1 bg-slate-100 -z-0">
            <div 
              className={`h-full ${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#005A36] to-emerald-400 transition-all duration-500`}
              style={{ width: `${(activeStepIndex / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>

          {/* Stepper Dots */}
          <div className="grid grid-cols-8 gap-2 relative z-10">
            {steps.map((step, idx) => {
              const isPassed = idx <= activeStepIndex;
              const isCurrent = idx === activeStepIndex;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveStepIndex(idx)}
                  className="flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
                    isCurrent
                      ? 'bg-[#005A36] text-white border-amber-400 shadow-lg scale-110'
                      : isPassed
                      ? 'bg-emerald-50 text-[#005A36] border-emerald-300'
                      : 'bg-white text-slate-400 border-slate-200 group-hover:border-slate-300'
                  }`}>
                    {step.icon}
                  </div>

                  <span className={`text-[11px] font-mono font-bold mt-2 ${
                    isCurrent ? 'text-[#005A36]' : 'text-slate-400'
                  }`}>
                    {step.num}
                  </span>

                  <span className={`text-xs font-bold mt-0.5 leading-tight ${
                    isCurrent ? 'text-slate-900 font-extrabold' : 'text-slate-600'
                  }`}>
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Step Showcase Card */}
        <div className={`bg-gradient-to-r from-emerald-50/60 via-slate-50 to-amber-50/40 rounded-2xl border border-emerald-200/70 p-6 flex items-center justify-between gap-6 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#005A36] text-white text-xs font-mono font-bold">
                {t.journey.stepPrefix} {currentStep.num}
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {currentStep.title}
              </h3>
            </div>
            <p className="text-sm text-slate-700 font-medium">
              {currentStep.desc}
            </p>
            <p className="text-xs text-slate-500">
              {currentStep.detail}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
              disabled={activeStepIndex === 0}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
            >
              {t.journey.prevStep}
            </button>
            <button
              onClick={() => setActiveStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={activeStepIndex === steps.length - 1}
              className="px-4 py-2 rounded-xl bg-[#005A36] text-white text-xs font-bold disabled:opacity-40 hover:bg-[#004328] flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t.journey.nextStep}</span>
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Vertical Stepper */}
      <div className="lg:hidden space-y-4">
        {steps.map((step, idx) => (
          <div 
            key={idx}
            className={`flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 ${isRtl ? 'text-right' : 'text-left'}`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#005A36] text-white flex items-center justify-center shrink-0 font-bold">
              {step.icon}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  {step.num}
                </span>
                <h4 className="font-bold text-sm text-slate-900">{step.title}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              <p className="text-[11px] text-slate-500">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
