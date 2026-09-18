import React from 'react';
import { ArrowRight, Compass, Sparkles, ShieldCheck, Award, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface FinalCtaSectionProps {
  onStartApplication: () => void;
  onExploreTracks: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onStartApplication,
  onExploreTracks
}) => {
  const { isRtl, t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#004026] via-[#005A36] to-slate-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 text-center shadow-2xl border border-emerald-600/30">
      {/* Visual Accent Lights */}
      <div className={`absolute -top-24 ${isRtl ? '-right-24' : '-left-24'} w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none`}></div>
      <div className={`absolute -bottom-24 ${isRtl ? '-left-24' : '-right-24'} w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none`}></div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-6 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-xs font-bold shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{t.cta.eyebrow}</span>
        </div>

        {/* Big Headline */}
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            {t.cta.title}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-emerald-100/90 leading-relaxed font-medium">
            {t.cta.subtitle}
          </p>
        </div>

        {/* Dual Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="https://kasp.moe.gov.sa"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-950/30 transition-all flex items-center gap-2.5 transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
          >
            <span>{isRtl ? 'التقديم عبر المنصة الرسمية' : 'Apply via Official Portal'}</span>
            <ExternalLink className="w-4 h-4 shrink-0 text-slate-950" />
          </a>

          <button
            onClick={onExploreTracks}
            className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm sm:text-base transition backdrop-blur-xs flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-5 h-5 text-emerald-300" />
            <span>{t.cta.exploreBtn}</span>
          </button>
        </div>

        {/* Security & Authenticity Footnote */}
        <div className="pt-6 border-t border-emerald-800/60 flex flex-wrap items-center justify-center gap-6 text-xs text-emerald-200/80">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isRtl ? 'المنصة الرسمية المعتمدة لبرنامج خادم الحرمين الشريفين للابتعاث' : 'Official Ministry of Education Scholarship Platform'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-300" />
            <span>{isRtl ? 'إصدار فوري للضمان المالي الرقمي' : 'Certified Instant Digital Financial Guarantee'}</span>
          </div>
        </div>

      </div>
    </section>
  );
};
