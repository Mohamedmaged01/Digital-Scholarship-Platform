import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Tag, 
  Building2,
  FileText,
  Calendar
} from 'lucide-react';
import { NewsArticle } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface UploadNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Omit<NewsArticle, 'id' | 'slug' | 'publishDate'>) => void;
}

const PRESET_IMAGES = [
  {
    label: 'صرح جامعي وطلبة',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'
  },
  {
    label: 'مختبرات وذكاء اصطناعي',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80'
  },
  {
    label: 'مؤتمر دولي وملتقى إرشادي',
    url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80'
  },
  {
    label: 'شراكات صناعية وتقنية',
    url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=80'
  },
  {
    label: 'مكتبة أبحاث وتطوير',
    url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80'
  }
];

export const UploadNewsModal: React.FC<UploadNewsModalProps> = ({ isOpen, onClose, onSave }) => {
  const { isRtl } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState<NewsArticle['category']>('announcement');
  const [summaryAr, setSummaryAr] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [authorAr, setAuthorAr] = useState('الإدارة العامة للابتعاث');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [isFeatured, setIsFeatured] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg(isRtl ? 'يرجى اختيار ملف صورة صالح (PNG, JPG, WebP)' : 'Please select a valid image file');
      return;
    }
    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim()) {
      setErrorMsg(isRtl ? 'يرجى كتابة عنوان الخبر' : 'Please enter the news title');
      return;
    }
    if (!summaryAr.trim()) {
      setErrorMsg(isRtl ? 'يرجى كتابة موجز أو ملخص للخبر' : 'Please enter a summary');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      onSave({
        titleAr: titleAr.trim(),
        titleEn: titleEn.trim() || titleAr.trim(),
        summaryAr: summaryAr.trim(),
        summaryEn: summaryAr.trim(),
        contentAr: contentAr.trim() || summaryAr.trim(),
        contentEn: contentAr.trim() || summaryAr.trim(),
        category,
        authorAr: authorAr.trim() || 'الإدارة العامة للابتعاث',
        authorEn: 'Scholarship General Directorate',
        imageUrl: imageUrl || PRESET_IMAGES[0].url,
        isFeatured,
        status: 'published',
        readTimeMinutes: Math.max(1, Math.ceil(((contentAr || summaryAr).length) / 300))
      });

      onClose();
    } catch {
      setErrorMsg(isRtl ? 'حدث خطأ أثناء حفظ الخبر' : 'Error saving news article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003822] via-[#005A36] to-[#043d27] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Upload className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">
                {isRtl ? 'رفع وإضافة خبر أو إعلان جديد' : 'Upload & Publish News'}
              </h3>
              <p className="text-xs text-emerald-200 mt-0.5">
                {isRtl ? 'سيتم نشر الخبر وعرضه مباشرة في قسم الأخبار بالصفحة الرئيسية' : 'The news will be displayed directly on the homepage'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#005A36]" />
              <span>{isRtl ? 'عنوان الخبر أو الإعلان (بالعربية) *' : 'News Title (Arabic) *'}</span>
            </label>
            <input
              type="text"
              required
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder={isRtl ? 'مثال: فتح باب التسجيل لمسار واعد وتحديث شروط الابتعاث...' : 'e.g., Opening Applications for Waed Track...'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Category & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#005A36]" />
                <span>{isRtl ? 'تصنيف الخبر *' : 'Category *'}</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="announcement">{isRtl ? 'إعلان رسمي' : 'Official Announcement'}</option>
                <option value="admission">{isRtl ? 'مواعيد وقبول جامعي' : 'Admissions & Deadlines'}</option>
                <option value="event">{isRtl ? 'فعاليات وملتقيات' : 'Events & Seminars'}</option>
                <option value="strategy">{isRtl ? 'استراتيجية وشراكات' : 'Strategy & Alliances'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#005A36]" />
                <span>{isRtl ? 'الجهة الناشرة' : 'Publisher'}</span>
              </label>
              <input
                type="text"
                value={authorAr}
                onChange={(e) => setAuthorAr(e.target.value)}
                placeholder={isRtl ? 'الإدارة العامة للابتعاث' : 'General Directorate of Scholarships'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isRtl ? 'ملخص وموجز الخبر *' : 'Summary / Excerpt *'}
            </label>
            <textarea
              rows={2}
              required
              value={summaryAr}
              onChange={(e) => setSummaryAr(e.target.value)}
              placeholder={isRtl ? 'موجز سريع يظهر في بطاقة الخبر على الصفحة الرئيسية...' : 'Brief summary shown on homepage news card...'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Full Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isRtl ? 'تفاصيل ونص الخبر الكامل' : 'Full Content'}
            </label>
            <textarea
              rows={4}
              value={contentAr}
              onChange={(e) => setContentAr(e.target.value)}
              placeholder={isRtl ? 'اكتب التفاصيل الكاملة للخبر، الشروط والضوابط، الروابط الهامة...' : 'Full announcement details...'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Image Upload / Dropzone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#005A36]" />
              <span>{isRtl ? 'صورة الخبر المرفقة *' : 'News Cover Image *'}</span>
            </label>

            {/* Dropzone Area */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition ${
                dragActive 
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' 
                  : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400 bg-slate-50 dark:bg-slate-800/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
              
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-[#005A36] dark:text-emerald-300 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isRtl ? 'اسحب وأفلت صورة الخبر هنا، أو اضغط للتصفح' : 'Drag & drop cover image, or click to browse'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {isRtl ? 'يدعم PNG, JPG, WebP حتى 5 ميجابايت' : 'PNG, JPG, WebP up to 5MB'}
                </p>
              </div>
            </div>

            {/* Presets & Preview */}
            <div className="mt-3">
              <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                {isRtl ? 'أو اختر صورة جاهزة من مكتبة المنصة:' : 'Or choose from platform library:'}
              </span>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(img.url)}
                    className={`relative rounded-xl overflow-hidden aspect-video border-2 transition ${
                      imageUrl === img.url 
                        ? 'border-emerald-600 ring-2 ring-emerald-500/40 shadow-sm' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img.url} 
                      alt={img.label} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Current Selected Image Preview */}
            {imageUrl && (
              <div className="mt-3 relative rounded-2xl overflow-hidden aspect-21/9 max-h-40 border border-slate-200 dark:border-slate-700">
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-2 right-2 bg-emerald-700/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{isRtl ? 'الصورة المعتمدة' : 'Selected'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Featured checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
            />
            <label htmlFor="isFeatured" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isRtl ? 'تثبيت كخبر رئيسي بارز في مقدمة الأخبار' : 'Pin as Featured Announcement'}</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#005A36] hover:bg-[#00482B] text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isRtl ? 'نشر الخبر في الصفحة الرئيسية' : 'Publish to Homepage'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
