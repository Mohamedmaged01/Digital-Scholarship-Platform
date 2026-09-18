import React, { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  Globe2, 
  Cpu, 
  Microscope, 
  ArrowRight,
  Award
} from 'lucide-react';
import { Vision2030Logo, HumanCapabilityProgramLogo } from '../BrandLogos';
import { useLanguage } from '../../i18n/LanguageContext';

export const ProgramStrategySection: React.FC = () => {
  const { isRtl, t } = useLanguage();
  const [selectedPillar, setSelectedPillar] = useState<number>(0);

  const pillars = [
    {
      title: isRtl ? 'رفع التنافسية العالمية' : 'Global Competitiveness',
      subtitle: 'Global Competitiveness',
      desc: isRtl 
        ? 'تمكين الكفاءات السعودية من المنافسة الأكاديمية والمهنية دولياً في أعرق الصروح التعليمية.'
        : 'Empowering Saudi talents to compete academically and professionally in world-renowned universities.',
      icon: <Globe2 className="w-6 h-6 text-emerald-600" />,
      tag: isRtl ? 'المنافسة الدولية' : 'Global Rankings',
      stat: isRtl ? 'أفضل 30 جامعة' : 'Top 30 Unis'
    },
    {
      title: isRtl ? 'المواءمة مع رؤية 2030' : 'Vision 2030 Alignment',
      subtitle: 'Vision 2030 Alignment',
      desc: isRtl
        ? 'توجيه مسارات ومقاعد الابتعاث نحو متطلبات المشاريع الكبرى وسلاسل الإمداد الوطنية والصناعات المستقبلية.'
        : 'Aligning tracks with giga-projects, national supply chains, and future strategic industries.',
      icon: <Target className="w-6 h-6 text-amber-600" />,
      tag: isRtl ? 'الأولويات الوطنية' : 'National Priorities',
      stat: isRtl ? 'المشاريع الكبرى' : 'Giga Projects'
    },
    {
      title: isRtl ? 'تعزيز البحث والابتكار' : 'R&D & Knowledge Economy',
      subtitle: 'R&D & Knowledge Economy',
      desc: isRtl
        ? 'بناء جيل من العلماء والباحثين في مجالات الذكاء الاصطناعي، التقنية الحيوية، والفضاء.'
        : 'Cultivating top researchers in AI, biotechnology, clean energy, and space exploration.',
      icon: <Microscope className="w-6 h-6 text-purple-600" />,
      tag: isRtl ? 'اقتصاد المعرفة' : 'Knowledge Economy',
      stat: isRtl ? 'أولويات RDI' : 'RDI Priorities'
    },
    {
      title: isRtl ? 'تنمية المهارات المستقبلية' : 'Future Skills & Emerging Tech',
      subtitle: 'Future Skills & Emerging Tech',
      desc: isRtl
        ? 'تأهيل الشباب للوظائف والمهارات النوعية والتقنيات الرقمية المتقدمة لسوق العمل المستقبلي.'
        : 'Qualifying Saudi youth for future specialized careers and cutting-edge technologies.',
      icon: <Cpu className="w-6 h-6 text-teal-600" />,
      tag: isRtl ? 'مهارات المستقبل' : 'Future Skills',
      stat: isRtl ? 'شراكات رعاية' : 'Corporate Sponsors'
    }
  ];

  return (
    <section id="strategy-section" className="bg-gradient-to-br from-slate-900 via-[#003822] to-slate-950 rounded-3xl border border-slate-800 text-white p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden scroll-mt-24">
      {/* Background glow */}
      <div className={`absolute top-0 ${isRtl ? 'right-1/4' : 'left-1/4'} w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none`}></div>
      <div className={`absolute bottom-0 ${isRtl ? 'left-1/4' : 'right-1/4'} w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none`}></div>

      <div className="relative z-10 space-y-8">
        
        {/* Header with Logos Integration */}
        <div className={`flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 border-b border-white/10 pb-6 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.strategy.eyebrow}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              {t.strategy.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.strategy.subtitle}
            </p>
          </div>

          {/* Institutional Partner Logos */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs self-start lg:self-auto shrink-0">
            <HumanCapabilityProgramLogo variant="white" className="h-9" />
            <div className="w-[1px] h-8 bg-white/20"></div>
            <Vision2030Logo variant="white" className="h-9" />
          </div>
        </div>

        {/* Infographic Visual Flow (4 Strategy Pillars) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar, idx) => {
            const isSelected = selectedPillar === idx;

            return (
              <div
                key={idx}
                onClick={() => setSelectedPillar(idx)}
                className={`p-5 rounded-2xl border transition-all duration-300 ${isRtl ? 'text-right' : 'text-left'} cursor-pointer flex flex-col justify-between gap-4 group ${
                  isSelected
                    ? 'bg-white/15 border-amber-400/70 shadow-lg shadow-emerald-950/60 scale-[1.02]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                    isSelected ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-white/10 text-white'
                  }`}>
                    {pillar.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-emerald-300">
                    {pillar.stat}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wide block font-sans-en">
                    {pillar.subtitle}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-300">
                  <span className="font-semibold">{pillar.tag}</span>
                  <ArrowRight className={`w-3.5 h-3.5 text-amber-400 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Strategy Highlights Strip */}
        <div className={`bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-200 font-semibold">
              {isRtl 
                ? 'مخرجات تعليمية متوافقة مباشرة مع احتياجات سوق العمل والمشاريع الوطنية الكبرى'
                : 'Educational outcomes directly tailored to the national labor market and Saudi giga-projects'}
            </span>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('tracks-catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>{isRtl ? 'تعرف على الاستراتيجية والمسارات' : 'Explore Strategy & Tracks'}</span>
            <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

      </div>
    </section>
  );
};
