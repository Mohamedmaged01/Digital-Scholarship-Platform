import React from 'react';
import { 
  Compass, 
  CheckCircle2, 
  Globe2, 
  ArrowRight, 
  HelpCircle, 
  Bot,
  Sparkles,
  Newspaper
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface QuickServicesProps {
  onSelectService: (serviceKey: string) => void;
}

export const QuickServices: React.FC<QuickServicesProps> = ({ onSelectService }) => {
  const { isRtl, t } = useLanguage();

  const services = [
    {
      id: 'tracks_catalog',
      title: t.services.serviceTracksTitle,
      description: t.services.serviceTracksDesc,
      icon: <Compass className="w-5 h-5 text-[#005A36]" />,
      badge: isRtl ? '6 مسارات' : '6 Tracks'
    },
    {
      id: 'eligibility_check',
      title: t.services.serviceCheckTitle,
      description: t.services.serviceCheckDesc,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      badge: isRtl ? '8 محطات' : '8 Steps'
    },
    {
      id: 'universities',
      title: t.services.serviceUnisTitle,
      description: t.services.serviceUnisDesc,
      icon: <Globe2 className="w-5 h-5 text-teal-600" />,
      badge: isRtl ? 'دليل عالمي' : 'Global Hubs'
    },
    {
      id: 'news',
      title: isRtl ? 'الأخبار والإعلانات' : 'News & Announcements',
      description: isRtl ? 'متابعة أحدث القرارات، الشراكات ومواعيد القبول' : 'Latest scholarship news, admissions and partnerships',
      icon: <Newspaper className="w-5 h-5 text-amber-600" />,
      badge: isRtl ? 'تحديثات حية' : 'Live News',
      highlight: true
    },
    {
      id: 'faq',
      title: t.services.serviceFaqTitle,
      description: t.services.serviceFaqDesc,
      icon: <HelpCircle className="w-5 h-5 text-blue-600" />,
      badge: isRtl ? 'إجابات شاملة' : 'Inquiries'
    },
    {
      id: 'ai_assistant',
      title: t.services.serviceAiTitle,
      description: t.services.serviceAiDesc,
      icon: <Bot className="w-5 h-5 text-purple-600" />,
      badge: 'AI 24/7',
      aiBadge: true
    }
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005A36] mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.services.eyebrow}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t.services.title}
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:block">
          {t.services.subtitle}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelectService(service.id)}
            className={`${isRtl ? 'text-right' : 'text-left'} rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between gap-3 group relative overflow-hidden cursor-pointer ${
              service.highlight
                ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 border-emerald-300 hover:border-emerald-500 shadow-2xs hover:shadow-md'
                : 'bg-white hover:bg-slate-50/80 border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between gap-3 w-full">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                service.highlight ? 'bg-[#005A36] text-white shadow-2xs' : 'bg-slate-100 group-hover:bg-emerald-50'
              }`}>
                {service.highlight ? <ArrowRight className={`w-5 h-5 text-white ${isRtl ? 'rotate-180' : ''}`} /> : service.icon}
              </div>

              <span className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border ${
                service.aiBadge 
                  ? 'bg-purple-50 text-purple-700 border-purple-200' 
                  : service.highlight 
                  ? 'bg-emerald-100 text-[#005A36] border-emerald-300' 
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {service.badge}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005A36] transition-colors flex items-center gap-1.5">
                <span>{service.title}</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {service.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
