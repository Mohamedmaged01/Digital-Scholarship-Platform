import React, { useState } from 'react';
import { NewsArticle } from './adminTypes';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Archive, 
  Eye, 
  X, 
  Newspaper 
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface AdminNewsManagerProps {
  articles: NewsArticle[];
  onUpdateArticles: (newArticles: NewsArticle[]) => void;
  canEdit: boolean;
  canPublish: boolean;
}

export const AdminNewsManager: React.FC<AdminNewsManagerProps> = ({
  articles,
  onUpdateArticles,
  canEdit,
  canPublish
}) => {
  const { isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  const [newTitleAr, setNewTitleAr] = useState<string>('');
  const [newTitleEn, setNewTitleEn] = useState<string>('');
  const [newExcerptAr, setNewExcerptAr] = useState<string>('');
  const [newCategory, setNewCategory] = useState<NewsArticle['category']>('announcement');
  const [newImageUrl, setNewImageUrl] = useState<string>('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80');

  const filteredArticles = articles.filter(item => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch = 
      item.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerptAr.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleAr || !canEdit) return;

    const newArt: NewsArticle = {
      id: `news-${Date.now()}`,
      titleAr: newTitleAr,
      titleEn: newTitleEn || newTitleAr,
      excerptAr: newExcerptAr,
      category: newCategory,
      status: canPublish ? 'published' : 'draft',
      publishedAt: new Date().toISOString().split('T')[0],
      author: 'إدارة الإعلام والاتصال المؤسسي',
      imageUrl: newImageUrl
    };

    onUpdateArticles([newArt, ...articles]);
    setShowAddModal(false);
    setNewTitleAr('');
    setNewExcerptAr('');
  };

  const handleToggleStatus = (id: string, newStatus: NewsArticle['status']) => {
    if (!canPublish && newStatus === 'published') return;
    onUpdateArticles(articles.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const handleDelete = (id: string) => {
    if (!canEdit) return;
    onUpdateArticles(articles.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {isRtl ? 'إدارة الأخبار والبيانات الرسمية (News & Press)' : 'Official News & Press Management'}
          </h2>
          <p className="text-xs text-slate-500">
            {isRtl ? 'تحرير ونشر الإعلانات الصحفية ومستجدات دورات الابتعاث والشراكات' : 'Publish official press statements, admission cycle alerts, and partnerships'}
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004328] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? 'إنشاء خبر / إعلان جديد' : 'New Article'}</span>
          </button>
        )}
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'بحث في الأخبار والإعلانات...' : 'Search news titles...'}
            className={`w-full py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-[#005A36] ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
          />
        </div>

        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          {(['all', 'published', 'draft', 'archived'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${statusFilter === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              {st === 'all' ? (isRtl ? 'الكل' : 'All') : st === 'published' ? (isRtl ? 'المنشورة' : 'Published') : st === 'draft' ? (isRtl ? 'المسودات' : 'Drafts') : (isRtl ? 'المؤرشفة' : 'Archived')}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map(art => (
          <div
            key={art.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition"
          >
            <div className="h-40 relative bg-slate-100 overflow-hidden">
              <img src={art.imageUrl} alt={art.titleAr} className="w-full h-full object-cover" />
              <span className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${art.status === 'published' ? 'bg-emerald-600 text-white' : art.status === 'draft' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-white'}`}>
                {art.status === 'published' ? 'منشور' : art.status === 'draft' ? 'مسودة' : 'مؤرشف'}
              </span>
            </div>

            <div className="p-4 flex-1 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 block">{art.publishedAt} • {art.author}</span>
              <h3 className="text-xs font-bold text-slate-900 line-clamp-2">{art.titleAr}</h3>
              <p className="text-[11px] text-slate-500 line-clamp-2">{art.excerptAr}</p>
            </div>

            <div className="p-3 border-t border-slate-100 flex items-center justify-between">
              {canPublish && (
                <div className="flex items-center gap-1">
                  {art.status !== 'published' ? (
                    <button
                      onClick={() => handleToggleStatus(art.id, 'published')}
                      className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-1 rounded-md"
                    >
                      نشر الآن
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleStatus(art.id, 'archived')}
                      className="text-[10px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-2 py-1 rounded-md"
                    >
                      أرشفة
                    </button>
                  )}
                </div>
              )}

              {canEdit && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(art.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title={isRtl ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD NEWS */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {isRtl ? 'إنشاء خبر رسمي أو إعلان جديد' : 'Create New Press Release'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">عنوان الخبر (عربي):</label>
                <input
                  type="text"
                  required
                  value={newTitleAr}
                  onChange={e => setNewTitleAr(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                  placeholder="مثال: بدء استقبال استفسارات مسار الرواد..."
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">الموجز الصحفي (Excerpt):</label>
                <textarea
                  rows={3}
                  required
                  value={newExcerptAr}
                  onChange={e => setNewExcerptAr(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                  placeholder="ملخص الخبر في سطرين..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#005A36] text-white font-bold hover:bg-[#004328] cursor-pointer"
                >
                  {canPublish ? 'حفظ ونشر رسمي' : 'حفظ كمسودة (Draft)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
