import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  Sparkles, 
  FileQuestion, 
  Bot,
  FileCheck,
  Compass,
  ListOrdered,
  Globe2,
  FileText,
  Award,
  Plane,
  Laptop,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { FAQ_DATABASE } from '../data/scholarshipCatalog';
import { useLanguage } from '../i18n/LanguageContext';
import { FaqCategory } from '../types';

interface FaqSectionProps {
  onOpenAiChat: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenAiChat }) => {
  const { isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | 'all'>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-adm-1');

  // Categories requested by the user:
  // (القبول، المسارات، الشروط، الجامعات، المستندات، الترشيح، ما بعد الترشيح، الخدمات الإلكترونية)
  const categories: { id: FaqCategory; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    { 
      id: 'all', 
      labelAr: 'كافة الأسئلة', 
      labelEn: 'All Questions',
      icon: <HelpCircle className="w-4 h-4" />
    },
    { 
      id: 'admission', 
      labelAr: 'القبول', 
      labelEn: 'Admission',
      icon: <FileCheck className="w-4 h-4" />
    },
    { 
      id: 'tracks', 
      labelAr: 'المسارات', 
      labelEn: 'Tracks',
      icon: <Compass className="w-4 h-4" />
    },
    { 
      id: 'requirements', 
      labelAr: 'الشروط', 
      labelEn: 'Requirements',
      icon: <ListOrdered className="w-4 h-4" />
    },
    { 
      id: 'universities', 
      labelAr: 'الجامعات', 
      labelEn: 'Universities',
      icon: <Globe2 className="w-4 h-4" />
    },
    { 
      id: 'documents', 
      labelAr: 'المستندات', 
      labelEn: 'Documents',
      icon: <FileText className="w-4 h-4" />
    },
    { 
      id: 'nomination', 
      labelAr: 'الترشيح', 
      labelEn: 'Nomination',
      icon: <Award className="w-4 h-4" />
    },
    { 
      id: 'post_nomination', 
      labelAr: 'ما بعد الترشيح', 
      labelEn: 'Post-Nomination',
      icon: <Plane className="w-4 h-4" />
    },
    { 
      id: 'services', 
      labelAr: 'الخدمات الإلكترونية', 
      labelEn: 'E-Services',
      icon: <Laptop className="w-4 h-4" />
    }
  ];

  const filteredFaqs = FAQ_DATABASE.filter((faq) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      faq.questionAr.toLowerCase().includes(q) ||
      faq.questionEn.toLowerCase().includes(q) ||
      faq.answerAr.toLowerCase().includes(q) ||
      faq.answerEn.toLowerCase().includes(q) ||
      faq.tags.some(t => t.toLowerCase().includes(q));

    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`space-y-8 animate-in fade-in ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-10 border border-slate-800 text-white shadow-xl overflow-hidden">
        <div className={`absolute top-0 ${isRtl ? 'right-0' : 'left-0'} w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none`}></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/70 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold mb-4 shadow-inner">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isRtl ? 'مركز الاستفسارات وقاعدة المعرفة المعتمدة' : 'Official Knowledge Base & Inquiries'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {isRtl ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {isRtl 
              ? 'إجابات رسمية ومحدثة تغطي كافة مراحل التقديم، المسارات، معايير القبول، الجامعات المعتمدة، المستندات، وإجراءات ما بعد الترشيح والخدمات الإلكترونية.'
              : 'Official and up-to-date answers covering admission, scholarship tracks, eligibility requirements, accredited universities, documents, nomination, and e-services.'}
          </p>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
        {/* Search Field */}
        <div className="relative">
          <Search className={`w-5 h-5 text-slate-400 absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'ابحث في الأسئلة الشائعة (مثال: شروط الرواد، الضمان المالي، التأشيرة، المستندات)...' : 'Search FAQ (e.g., Pioneers requirements, Financial guarantee, Visa, Documents)...'}
            className={`w-full ${isRtl ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'} py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-[#005A36] focus:ring-1 focus:ring-[#005A36] text-xs sm:text-sm text-slate-800 transition shadow-inner`}
          />
        </div>

        {/* 8 Categories Requested by User */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((c) => {
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#005A36] text-white shadow-md shadow-emerald-950/20 ring-1 ring-emerald-600'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {c.icon}
                <span>{isRtl ? c.labelAr : c.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modern Accordion FAQ List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedFaqId === faq.id;
          const qText = isRtl ? faq.questionAr : faq.questionEn;
          const aText = isRtl ? faq.answerAr : faq.answerEn;

          return (
            <div
              key={faq.id}
              className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-200 overflow-hidden ${
                isExpanded 
                  ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20 bg-emerald-50/20' 
                  : 'border-slate-200/90 shadow-2xs hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                className={`w-full p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer ${isRtl ? 'text-right' : 'text-left'}`}
              >
                <div className="flex items-start gap-3.5 sm:gap-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                    isExpanded ? 'bg-[#005A36] text-white' : 'bg-emerald-100/70 text-[#005A36]'
                  }`}>
                    ?
                  </div>
                  <div>
                    <h3 className={`text-sm sm:text-base font-bold leading-snug ${
                      isExpanded ? 'text-[#005A36]' : 'text-slate-900'
                    }`}>
                      {qText}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {faq.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                  isExpanded ? 'bg-[#005A36] text-white rotate-180' : 'bg-slate-100 text-slate-500'
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isExpanded && (
                <div className={`px-5 sm:px-6 pb-6 pt-1 border-t border-emerald-100 text-slate-700 text-xs sm:text-sm leading-relaxed animate-in fade-in`}>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-inner whitespace-pre-line">
                    {aText}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
            <FileQuestion className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">
              {isRtl ? 'لم يتم العثور على نتائج مطابقة للبحث' : 'No matching results found'}
            </h4>
            <p className="text-xs max-w-md mx-auto">
              {isRtl 
                ? 'جرب البحث بكلمات أخرى أو تواصل مباشرة مع المساعد الذكي للحصول على إجابة فورية.' 
                : 'Try adjusting your search keywords or ask the AI Assistant directly for an immediate answer.'}
            </p>
          </div>
        )}
      </div>

      {/* "لم تجد إجابتك؟ تحدث مع المساعد الذكي" CTA Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#005A36] to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800/50 shadow-xl relative overflow-hidden">
        <div className={`absolute top-0 ${isRtl ? 'right-0' : 'left-0'} w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none`}></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-inner">
            <Bot className="w-7 h-7 text-emerald-300" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? 'دعم ذكي وتوجيه فوري 24/7' : 'Instant 24/7 Smart Guidance'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {isRtl ? 'لم تجد إجابتك؟ تحدث مع المساعد الذكي' : 'Haven’t found your answer? Talk to the AI Assistant'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
              {isRtl 
                ? 'يقوم المساعد الذكي بفحص استفسارك الخاص، شرح مسارات الابتعاث والشروط، توجيهك للمستندات المطلوبة، ومساعدتك في اختيار الجامعة المناسبة.'
                : 'The AI Assistant answers custom inquiries, clarifies tracks and criteria, guides documents, and assists in university selection.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAiChat}
          className="relative z-10 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-950/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2.5 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{isRtl ? 'تحدث مع المساعد الذكي الآن' : 'Talk to AI Assistant Now'}</span>
          <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};
