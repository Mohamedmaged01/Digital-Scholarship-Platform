import React from 'react';
import { Layers, Globe2, BookOpen, Laptop } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface HeroInfoStripProps {
  onExploreTracks: () => void;
  onExploreUniversities: () => void;
}

export const HeroInfoStrip: React.FC<HeroInfoStripProps> = ({
  onExploreTracks,
  onExploreUniversities
}) => {
  const { isRtl } = useLanguage();

  const items = [
    {
      icon: <Layers className="w-5 h-5 text-[#005A36]" />,
      title: isRtl ? 'مسارات الابتعاث' : 'Scholarship Tracks',
      value: isRtl ? '6 مسارات استراتيجية' : '6 Strategic Tracks',
      description: isRtl 
        ? 'موجهة للأولويات الوطنية ومستقبل الصناعات' 
        : 'Aligned with national priorities and future industries',
      action: onExploreTracks
    },
    {
      icon: <Globe2 className="w-5 h-5 text-teal-700" />,
      title: isRtl ? 'جامعات عالمية' : 'Global Universities',
      value: isRtl ? 'اكتشف الفرص الأكاديمية' : 'Top Academic Hubs',
      description: isRtl 
        ? 'أفضل الجامعات والمراكز البحثية العالمية' 
        : 'World-ranked universities and elite research centers',
      action: onExploreUniversities
    },
    {
      icon: <BookOpen className="w-5 h-5 text-amber-700" />,
      title: isRtl ? 'تخصصات نوعية' : 'Strategic Majors',
      value: isRtl ? 'مجالات المستقبل والابتكار' : 'Future & Innovation Sectors',
      description: isRtl 
        ? 'الذكاء الاصطناعي، الفضاء، الصحة، والصناعات المتقدمة' 
        : 'AI, Space, Medicine, and Advanced Manufacturing',
      action: onExploreTracks
    },
    {
      icon: <Laptop className="w-5 h-5 text-emerald-700" />,
      title: isRtl ? 'خدمات رقمية' : 'Digital Services',
      value: isRtl ? 'منصة موحدة ومتكاملة' : 'Unified Digital Platform',
      description: isRtl 
        ? 'فرز فوري ذكي، متابعة مباشرة، وضمان مالي إلكتروني' 
        : 'Smart AI verification, live tracking, and digital guarantee',
      action: onExploreTracks
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          onClick={item.action}
          className={`bg-white hover:bg-slate-50/90 rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${isRtl ? 'text-right' : 'text-left'} group`}
        >
          <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-emerald-50 border border-slate-200/80 group-hover:border-emerald-200 flex items-center justify-center shrink-0 transition-colors">
            {item.icon}
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
              {item.title}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {item.value}
            </h3>
            <p className="text-[11.5px] text-slate-500 leading-snug line-clamp-1">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
