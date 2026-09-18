import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { USER_GUIDE_STEPS } from '../data/scholarshipCatalog';
import { useLanguage } from '../i18n/LanguageContext';

interface UserGuideProps {
  onStartApplication: () => void;
}

export const UserGuide: React.FC<UserGuideProps> = ({ onStartApplication }) => {
  const { isRtl } = useLanguage();
  const [activeSystem, setActiveSystem] = useState<'qabool' | 'safeer'>('qabool');
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const steps = activeSystem === 'qabool' ? USER_GUIDE_STEPS.qabool : USER_GUIDE_STEPS.safeer;

  return (
    <div className={`space-y-8 animate-in fade-in ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-10 border border-slate-800 text-white shadow-xl overflow-hidden">
        <div className={`absolute top-0 ${isRtl ? 'right-0' : 'left-0'} w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none`}></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isRtl ? 'مركز التوجيه والإرشاد الرقمي للطلاب المبتعثين' : 'Digital Guidance & Orientation Center for Scholarship Students'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
            {isRtl ? 'دليل المستخدم والإجراءات الموحدة' : 'User Guide & Unified Procedures'}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            {isRtl 
              ? 'دليل إرشادي تفصيلي يوضح كافة خطوات رحلة الابتعاث عبر منظومتي "قبول" للفرز والتقديم و"سفير" للخدمات الأكاديمية والمالية.'
              : 'Detailed step-by-step orientation through Qubool (admissions & AI matching) and Safeer (academic & financial services).'}
          </p>
        </div>
      </div>

      {/* System Switcher Tabs */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs max-w-md">
        <button
          onClick={() => {
            setActiveSystem('qabool');
            setExpandedStep(1);
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSystem === 'qabool'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isRtl ? 'منصة قبول (التقديم والفرز)' : 'Qubool (Application & AI Matching)'}</span>
        </button>

        <button
          onClick={() => {
            setActiveSystem('safeer');
            setExpandedStep(1);
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSystem === 'safeer'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{isRtl ? 'منصة سفير (خدمات المبتعثين)' : 'Safeer (Scholar Services)'}</span>
        </button>
      </div>

      {/* Guide Steps Flow */}
      <div className="space-y-4">
        {steps.map((step) => {
          const isExpanded = expandedStep === step.stepNumber;
          return (
            <div
              key={step.stepNumber}
              className={`rounded-3xl border transition-all duration-300 bg-white overflow-hidden ${
                isExpanded ? 'border-emerald-500 shadow-lg ring-1 ring-emerald-500/20' : 'border-slate-200 shadow-2xs hover:border-slate-300'
              }`}
            >
              <div
                onClick={() => setExpandedStep(isExpanded ? null : step.stepNumber)}
                className="p-6 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base font-mono ${
                    isExpanded ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    0{step.stepNumber}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {isRtl ? step.titleAr : (step.titleEn || step.titleAr)}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isRtl ? step.descriptionAr : (step.descriptionEn || step.descriptionAr)}
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 text-slate-400">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-700 mb-2">
                      {isRtl ? 'أهم المتطلبات والضوابط في هذه الخطوة:' : 'Key requirements and compliance points for this step:'}
                    </h4>
                    <div className="space-y-2">
                      {(isRtl ? step.keyPoints : (step.keyPointsEn || step.keyPoints)).map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(isRtl ? step.tipsAr : (step.tipsEn || step.tipsAr)) && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        <strong>{isRtl ? 'تلميح ذكي:' : 'Smart Tip:'}</strong> {isRtl ? step.tipsAr : (step.tipsEn || step.tipsAr)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Downloadable Resources Card */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
        <div className={`space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
          <h3 className="text-lg font-bold text-white">
            {isRtl ? 'هل تحتاج إلى الدليل الإرشادي الرسمي بصيغة PDF؟' : 'Need the official Comprehensive PDF Handbook?'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {isRtl 
              ? 'حمّل الكتيب الشامل لبرنامج خادم الحرمين الشريفين للابتعاث الخارجي شاملاً كافة المسارات، القوائم، وتفاصيل الملحقيات.'
              : 'Download the comprehensive manual covering all scholarship tracks, accredited university lists, and Cultural Mission workflows.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => alert(isRtl ? 'جاري تجهيز وتنزيل دليل الابتعاث الرسمي (PDF)...' : 'Preparing and downloading official KASP Guide (PDF)...')}
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isRtl ? 'تحميل الدليل (PDF)' : 'Download Guide (PDF)'}</span>
          </button>

          <button
            onClick={onStartApplication}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg transition flex items-center gap-2 cursor-pointer"
          >
            <span>{isRtl ? 'ابدأ تقديم طلبك الآن' : 'Start Application Now'}</span>
            <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
