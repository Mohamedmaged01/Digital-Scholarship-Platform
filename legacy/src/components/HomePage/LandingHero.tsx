import React from 'react';
import { 
  ArrowRight, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  Globe2, 
  CheckCircle2, 
  Bot,
  Award,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import saudiScholarsHeroImage from '../../assets/images/saudi_scholars_hero_1788373628111.jpg';

interface LandingHeroProps {
  onStartApplication?: () => void;
  onExploreTracks: () => void;
  onOpenAiAssistant: () => void;
  onOpenAiFinder?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartApplication,
  onExploreTracks,
  onOpenAiAssistant,
  onOpenAiFinder
}) => {
  const { isRtl, t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-[#004026] to-[#00301c] text-white rounded-3xl border border-emerald-900/60 shadow-2xl p-6 sm:p-10 lg:p-14">
      {/* Subtle Background Lighting & Geometric Aura */}
      <div className={`absolute top-0 ${isRtl ? 'right-0' : 'left-0'} w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none`}></div>
      <div className={`absolute bottom-0 ${isRtl ? 'left-0' : 'right-0'} w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none`}></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* ================= TEXT CONTENT & CTAS ================= */}
        <div className={`lg:col-span-7 space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
          
          {/* Institutional Eyebrow */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.hero.eyebrow}</span>
          </div>

          {/* Main Visual Headline */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.2] text-white">
              {t.hero.titlePart1}
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-amber-200">
              {t.hero.titleHighlight}
            </p>
          </div>

          {/* Subtitle Description */}
          <p className="text-sm sm:text-base lg:text-lg text-emerald-100/90 leading-relaxed max-w-2xl font-normal">
            {t.hero.subtitle}
          </p>

          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={onExploreTracks}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-950/40 transition-all flex items-center gap-2.5 transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <Compass className="w-5 h-5 text-slate-950" />
              <span>{t.hero.ctaExploreTracks}</span>
              <ArrowRight className={`w-4 h-4 shrink-0 text-slate-950 ${isRtl ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={onOpenAiFinder || onOpenAiAssistant}
              className="px-5 py-3.5 sm:py-4 rounded-2xl bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/20 text-white font-bold text-sm sm:text-base transition-all flex items-center gap-2 backdrop-blur-xs cursor-pointer"
            >
              <Bot className="w-5 h-5 text-amber-300" />
              <span>{t.hero.ctaAiFinder}</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="pt-6 border-t border-emerald-800/60 flex flex-wrap items-center gap-6 text-xs text-emerald-200/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isRtl ? 'البوابة الرسمية المعتمدة - وزارة التعليم' : 'Official Ministry of Education Portal'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isRtl ? 'أفضل الجامعات والمراكز العالمية' : 'Top Accredited Global Universities'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{isRtl ? 'إشراف مباشر من الملحقيات الثقافية' : 'Supervision by Saudi Cultural Missions'}</span>
            </div>
          </div>

        </div>

        {/* ================= SCHOLARS COMPOSITION ================= */}
        <div className="lg:col-span-5 relative">
          
          <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl bg-slate-900 group">
            <div className="aspect-[4/3] sm:aspect-[16/11] relative overflow-hidden">
              <img 
                src={saudiScholarsHeroImage} 
                alt={isRtl ? 'طلاب وطالبات سعوديون في بيئة جامعية عالمية حديثة' : 'Saudi scholarship students in modern world-class university'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/30 to-transparent"></div>
            </div>

            {/* Inset Floating Stat Badges */}
            <div className={`absolute top-3 ${isRtl ? 'right-3 text-right' : 'left-3 text-left'} bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 rounded-2xl px-3 py-2 shadow-lg`}>
              <span className="text-[10px] text-emerald-300 font-semibold block">
                {isRtl ? 'المسارات المتاحة' : 'Available Tracks'}
              </span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-300" />
                {isRtl ? '6 مسارات استراتيجية' : '6 Strategic Tracks'}
              </span>
            </div>

            <div className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} bg-slate-900/90 backdrop-blur-md border border-amber-400/30 rounded-2xl px-3 py-2 text-center shadow-lg`}>
              <span className="text-[10px] text-amber-300 font-semibold block">
                {isRtl ? 'الدعم الأكاديمي' : 'Target'}
              </span>
              <span className="text-xs font-bold text-white">Vision 2030</span>
            </div>

            {/* Bottom Inset Quick Highlights */}
            <div className={`absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-emerald-950 via-emerald-950/90 to-transparent ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-emerald-300 text-[11px] block font-semibold">
                    {isRtl ? 'بوابة الابتعاث الموحدة' : 'Unified Scholarship Portal'}
                  </span>
                  <h4 className="text-white font-bold text-sm">
                    {isRtl ? 'تمكين الكفاءات الوطنية في أرقى الصروح' : 'Empowering Top National Talents Globally'}
                  </h4>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
              </div>
            </div>

          </div>

          {/* Secondary Floating Mini Card */}
          <div className={`hidden sm:flex items-center gap-3 absolute -bottom-5 ${isRtl ? '-right-5 text-right' : '-left-5 text-left'} bg-white text-slate-900 rounded-2xl p-3.5 shadow-2xl border border-slate-200`}>
            <div className="w-10 h-10 rounded-xl bg-[#005A36] text-white flex items-center justify-center font-bold text-lg shrink-0">
              🇸🇦
            </div>
            <div>
              <span className="text-[10.5px] text-slate-500 font-bold block">
                {isRtl ? 'برنامج تنمية القدرات البشرية' : 'Human Capability Development'}
              </span>
              <span className="text-xs font-bold text-[#005A36]">
                {isRtl ? 'طاقات وطنية تنافس عالمياً' : 'Global Saudi Competitiveness'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
