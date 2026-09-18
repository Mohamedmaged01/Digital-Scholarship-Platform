import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  Sparkles, 
  FileCheck,
  Compass,
  ListOrdered,
  Globe2,
  FileText,
  Award,
  Plane,
  Laptop,
  Bot,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { FAQ_DATABASE } from '../../data/scholarshipCatalog';
import { FaqCategory } from '../../types';

interface FaqHomeSectionProps {
  onOpenAiChat?: () => void;
  onOpenFullFaq?: () => void;
}

export const FaqHomeSection: React.FC<FaqHomeSectionProps> = ({ onOpenAiChat, onOpenFullFaq }) => {
  const { isRtl, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<FaqCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-adm-1');

  const categories: { id: FaqCategory | 'all'; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'all', labelAr: 'كافة الأسئلة', labelEn: 'All', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { id: 'admission', labelAr: 'القبول', labelEn: 'Admission', icon: <FileCheck className="w-3.5 h-3.5" /> },
    { id: 'tracks', labelAr: 'المسارات', labelEn: 'Tracks', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'requirements', labelAr: 'الشروط', labelEn: 'Requirements', icon: <ListOrdered className="w-3.5 h-3.5" /> },
    { id: 'universities', labelAr: 'الجامعات', labelEn: 'Universities', icon: <Globe2 className="w-3.5 h-3.5" /> },
    { id: 'documents', labelAr: 'المستندات', labelEn: 'Documents', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'nomination', labelAr: 'الترشيح', labelEn: 'Nomination', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'post_nomination', labelAr: 'ما بعد الترشيح', labelEn: 'Post-Nomination', icon: <Plane className="w-3.5 h-3.5" /> },
    { id: 'services', labelAr: 'الخدمات الإلكترونية', labelEn: 'E-Services', icon: <Laptop className="w-3.5 h-3.5" /> },
  ];

  const filteredFaqs = FAQ_DATABASE.filter(faq => {
    const matchesCat = activeCategory === 'all' || faq.category === activeCategory;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesCat;

    const q = (isRtl ? faq.questionAr : faq.questionEn).toLowerCase();
    const a = (isRtl ? faq.answerAr : faq.answerEn).toLowerCase();
    const matchesQuery = q.includes(term) || a.includes(term) || faq.tags.some(t => t.toLowerCase().includes(term));
    return matchesCat && matchesQuery;
  });

  return (
    <section id="faq-section" className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-2xs space-y-6 scroll-mt-24">
      
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005A36]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.faq.eyebrow}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t.faq.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            {t.faq.subtitle}
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-80">
          <Search className={`w-4 h-4 text-slate-400 absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            placeholder={t.faq.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${isRtl ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3 text-left'} py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#005A36]`}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#005A36] text-white shadow-2xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {cat.icon}
            <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
          </button>
        ))}
      </div>

      {/* Accordion FAQ Items */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            {isRtl ? 'لم يتم العثور على نتائج مطابقة لبحثك.' : 'No matching questions found.'}
          </div>
        ) : (
          filteredFaqs.slice(0, 8).map((faq) => {
            const isOpen = expandedId === faq.id;
            const qText = isRtl ? faq.questionAr : faq.questionEn;
            const aText = isRtl ? faq.answerAr : faq.answerEn;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isRtl ? 'text-right' : 'text-left'} ${
                  isOpen
                    ? 'bg-emerald-50/40 border-emerald-300 shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setExpandedId(isOpen ? null : faq.id)}
                  className={`w-full p-4 sm:p-5 flex items-center justify-between gap-4 ${isRtl ? 'text-right' : 'text-left'} cursor-pointer`}
                >
                  <span className={`text-sm font-bold leading-snug ${
                    isOpen ? 'text-[#005A36]' : 'text-slate-900'
                  }`}>
                    {qText}
                  </span>
                  
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                    isOpen ? 'bg-[#005A36] text-white rotate-180' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-emerald-200/50 animate-in fade-in whitespace-pre-line">
                    <p>{aText}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* "Talk to AI Assistant" Callout in HomePage FAQ */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#005A36] to-slate-900 text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-800/40 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white">
              {isRtl ? 'لم تجد إجابة لاستفسارك؟ تحدث مع المساعد الذكي' : 'Haven’t found your answer? Talk to the AI Assistant'}
            </h4>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              {isRtl 
                ? 'اطرح سؤالك مباشرة ليجيبك المساعد الذكي للابتعاث ويشرح لك شروط المسارات ومطابقة الجامعات.'
                : 'Ask directly and get instant personalized answers regarding tracks, universities, and documents.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenFullFaq && (
            <button
              onClick={onOpenFullFaq}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
            >
              {isRtl ? 'عرض كل الأسئلة' : 'View All FAQ'}
            </button>
          )}

          {onOpenAiChat && (
            <button
              onClick={onOpenAiChat}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>{isRtl ? 'تحدث مع المساعد الذكي' : 'Talk to AI'}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

    </section>
  );
};
