import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Building2, 
  Share2, 
  Tag, 
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { NewsArticle } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface NewsDetailModalProps {
  article: NewsArticle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ article, isOpen, onClose }) => {
  const { isRtl } = useLanguage();

  if (!isOpen || !article) return null;

  const getCategoryBadge = (category: NewsArticle['category']) => {
    switch (category) {
      case 'announcement':
        return { label: isRtl ? 'إعلان رسمي' : 'Official Announcement', color: 'bg-emerald-100 text-[#005A36] border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300' };
      case 'admission':
        return { label: isRtl ? 'القبول والتسجيل' : 'Admissions', color: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300' };
      case 'event':
        return { label: isRtl ? 'فعاليات وملتقيات' : 'Events & Seminars', color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300' };
      case 'strategy':
        return { label: isRtl ? 'شراكات استراتيجية' : 'Strategic Alliances', color: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300' };
      default:
        return { label: isRtl ? 'أخبار الابتعاث' : 'Scholarship News', color: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300' };
    }
  };

  const badge = getCategoryBadge(article.category);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: isRtl ? article.titleAr : article.titleEn,
        text: isRtl ? article.summaryAr : article.summaryEn,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(isRtl ? 'تم نسخ رابط الصفحة إلى الحافظة' : 'Link copied to clipboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Cover Image & Close button */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img 
            src={article.imageUrl} 
            alt={isRtl ? article.titleAr : article.titleEn}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

          {/* Close & Share buttons */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${badge.color}`}>
              {badge.label}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                title={isRtl ? 'مشاركة الخبر' : 'Share'}
                className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition backdrop-blur-md cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition backdrop-blur-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Title on Image bottom */}
          <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 text-white">
            <h2 className="text-xl sm:text-2xl font-bold leading-snug drop-shadow-md">
              {isRtl ? article.titleAr : article.titleEn}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200 mt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{article.publishDate}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRtl ? article.authorAr : article.authorEn}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>{article.readTimeMinutes} {isRtl ? 'دقائق قراءة' : 'min read'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-5 max-h-[50vh] overflow-y-auto">
          {/* Summary Callout */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-200 leading-relaxed">
                {isRtl ? article.summaryAr : article.summaryEn}
              </p>
            </div>
          </div>

          {/* Full Text Paragraphs */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 space-y-4">
            {(isRtl ? article.contentAr : article.contentEn).split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Official Verification Note */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>{isRtl ? 'مصدر الخبر: الإدارة العامة للابتعاث - وزارة التعليم' : 'Source: General Directorate of Scholarships - Ministry of Education'}</span>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold transition cursor-pointer"
            >
              {isRtl ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
