import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Calendar, 
  Clock, 
  Building2, 
  ArrowRight, 
  PlusCircle, 
  Sparkles, 
  Tag, 
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { NewsArticle } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { NewsService } from '../../services/newsService';
import { UploadNewsModal } from './UploadNewsModal';
import { NewsDetailModal } from './NewsDetailModal';

export const NewsAndAnnouncementsSection: React.FC = () => {
  const { isRtl } = useLanguage();

  const [articles, setArticles] = useState<NewsArticle[]>(() => NewsService.getNews());
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync with server in background
  useEffect(() => {
    NewsService.fetchFromServer().then((updatedList) => {
      setArticles(updatedList);
    }).catch(() => {});
  }, []);

  const handleSaveArticle = async (newArticleData: Omit<NewsArticle, 'id' | 'slug' | 'publishDate'>) => {
    const saved = await NewsService.addNews(newArticleData);
    setArticles((prev) => [saved, ...prev]);
    setNotification(isRtl ? 'تم رفع ونشر الخبر بنجاح وعرضه في الصفحة الرئيسية' : 'News published successfully on the homepage');
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const filteredArticles = activeCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

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
        return { label: isRtl ? 'أخبار عامة' : 'General News', color: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300' };
    }
  };

  return (
    <section id="news-section" className="space-y-6 pt-4">
      {/* Success Notification Banner */}
      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer"
          >
            {isRtl ? 'إغلاق' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Section Header with Action Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1 border-b border-slate-200 dark:border-slate-800">
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005A36] dark:text-emerald-400 mb-1">
            <Newspaper className="w-4 h-4 text-amber-500" />
            <span>{isRtl ? 'المركز الإعلامي والمستجدات' : 'Media Center & Updates'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isRtl ? 'الأخبار والإعلانات الرسمية' : 'Official News & Announcements'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {isRtl 
              ? 'متابعة حية لقرارات الابتعاث، مواعيد فتح المسارات، وتحديثات القوائم الأكاديمية والشراكات الدولية'
              : 'Live updates on scholarship guidelines, track intake deadlines, and global academic partnerships'}
          </p>
        </div>

        {/* Upload / Add News Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#005A36] hover:bg-[#00482B] active:bg-[#003822] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/20 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            title={isRtl ? 'رفع وإضافة خبر أو إعلان جديد إلى الصفحة الرئيسية' : 'Upload or post new announcement to homepage'}
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>{isRtl ? 'رفع وإضافة خبر جديد' : 'Upload News / Post'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: isRtl ? 'جميع الأخبار والإعلانات' : 'All News' },
          { id: 'announcement', label: isRtl ? 'إعلانات رسمية' : 'Official Announcements' },
          { id: 'admission', label: isRtl ? 'مواعيد القبول والجامعات' : 'Admissions' },
          { id: 'event', label: isRtl ? 'ملتقيات الملحقيات' : 'Webinars & Events' },
          { id: 'strategy', label: isRtl ? 'شراكات استراتيجية' : 'Strategic Alliances' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-[#005A36] text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredArticles.map((article, index) => {
          const badge = getCategoryBadge(article.category);
          const isPrimary = index === 0 && activeCategory === 'all';

          return (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className={`group relative bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1 ${
                isPrimary ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
            >
              {/* Image Banner */}
              <div className={`relative w-full overflow-hidden bg-slate-900 ${isPrimary ? 'h-56 sm:h-72' : 'h-48'}`}>
                <img
                  src={article.imageUrl}
                  alt={isRtl ? article.titleAr : article.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                {/* Badges on Top */}
                <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-xs ${badge.color}`}>
                    {badge.label}
                  </span>

                  {article.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      <span>{isRtl ? 'خبر مثبت' : 'Featured'}</span>
                    </span>
                  )}
                </div>

                {/* Metadata on bottom of image for Primary */}
                <div className="absolute bottom-3 inset-x-3.5 flex items-center gap-3 text-white text-[11px]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    <span>{article.publishDate}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-amber-300" />
                    <span className="truncate max-w-[160px]">{isRtl ? article.authorAr : article.authorEn}</span>
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className={`font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-[#005A36] dark:group-hover:text-emerald-400 transition ${
                    isPrimary ? 'text-lg sm:text-xl' : 'text-base'
                  }`}>
                    {isRtl ? article.titleAr : article.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {isRtl ? article.summaryAr : article.summaryEn}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{article.readTimeMinutes} {isRtl ? 'دقائق قراءة' : 'min read'}</span>
                  </span>

                  <span className="font-bold text-[#005A36] dark:text-emerald-400 flex items-center gap-1 group-hover:underline">
                    <span>{isRtl ? 'التفاصيل الكاملة' : 'Read Article'}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Upload Modal */}
      <UploadNewsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSave={handleSaveArticle}
      />

      {/* Detail Modal */}
      <NewsDetailModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </section>
  );
};
