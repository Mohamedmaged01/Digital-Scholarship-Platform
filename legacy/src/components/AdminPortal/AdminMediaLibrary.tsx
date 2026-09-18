import React, { useState } from 'react';
import { MediaFile } from './adminTypes';
import { 
  UploadCloud, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  FileText, 
  Image as ImageIcon, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2,
  ExternalLink,
  Edit2
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface AdminMediaLibraryProps {
  mediaList: MediaFile[];
  onAddMedia: (media: MediaFile) => void;
  onDeleteMedia: (mediaId: string) => void;
  onUpdateMedia: (media: MediaFile) => void;
  canEdit: boolean;
}

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
const BLOCKED_EXTENSIONS = ['exe', 'bat', 'sh', 'js', 'cmd', 'vbs', 'msi', 'php', 'py'];

export const AdminMediaLibrary: React.FC<AdminMediaLibraryProps> = ({
  mediaList,
  onAddMedia,
  onDeleteMedia,
  onUpdateMedia,
  canEdit
}) => {
  const { isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'pdf'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingMedia, setEditingMedia] = useState<MediaFile | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const filteredMedia = mediaList.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.altTextAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.altTextEn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = 
      typeFilter === 'all' || 
      (typeFilter === 'image' && item.fileType.startsWith('image/')) ||
      (typeFilter === 'pdf' && item.fileType === 'application/pdf');

    return matchesSearch && matchesType;
  });

  const handleCopyUrl = (item: MediaFile) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setUploadSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    // Security Check: Malicious extensions
    if (BLOCKED_EXTENSIONS.includes(ext)) {
      setUploadError(
        isRtl 
          ? `عفواً! تم حظر رفع هذا الملف (${ext}.) لدواعي الحماية والأمان السيبراني. لا يسمح برفع الملفات التنفيذية أو البرمجية.` 
          : `Security Alert! Upload of (.${ext}) files is strictly blocked by cybersecurity policies.`
      );
      e.target.value = '';
      return;
    }

    // Validation Check: Allowed extensions only
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setUploadError(
        isRtl 
          ? `امتداد الملف غير مدعوم. الامتدادات المصرح بها فقط: JPG, PNG, WebP, PDF.` 
          : `Unsupported file extension. Permitted formats: JPG, PNG, WebP, PDF.`
      );
      e.target.value = '';
      return;
    }

    // Success: Create media item
    const isPdf = ext === 'pdf';
    const newMedia: MediaFile = {
      id: `med-${Date.now()}`,
      name: file.name,
      url: isPdf ? 'https://kasp.moe.gov.sa/docs/' + file.name : URL.createObjectURL(file),
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      fileType: isPdf ? 'application/pdf' : (file.type as any || 'image/jpeg'),
      extension: (ext === 'jpeg' ? 'jpg' : ext) as any,
      altTextAr: file.name.replace(/\.[^/.]+$/, ''),
      altTextEn: file.name.replace(/\.[^/.]+$/, ''),
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: 'مدير الوسائط الرقمية',
      dimensions: isPdf ? undefined : '1920x1080'
    };

    onAddMedia(newMedia);
    setUploadSuccess(
      isRtl 
        ? `تم رفع وتدقيق الملف (${file.name}) بنجاح وفحصه ضد البرمجيات الضارة.` 
        : `File (${file.name}) uploaded and security verified.`
    );
    e.target.value = '';
    setTimeout(() => setUploadSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {isRtl ? 'مكتبة الوسائط الرقمية (Media Library)' : 'Digital Media Library'}
          </h2>
          <p className="text-xs text-slate-500">
            {isRtl ? 'إدارة ورفع الصور والمستندات الرسمية مع الفحص الأمني التلقائي' : 'Manage images and PDF guides with automated security filtering'}
          </p>
        </div>

        {/* Upload Trigger */}
        {canEdit && (
          <label className="px-4 py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004328] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-950/20 transition">
            <UploadCloud className="w-4 h-4" />
            <span>{isRtl ? 'رفع ملف وسائط جديد' : 'Upload File'}</span>
            <input
              type="file"
              onChange={handleSimulatedFileUpload}
              accept=".jpg,.jpeg,.png,.webp,.pdf,.exe,.bat,.sh"
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Security Feedback Banners */}
      {uploadError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#005A36] text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'بحث باسم الملف أو النص البديل...' : 'Search media by file name or alt text...'}
            className={`w-full py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-[#005A36] ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
          />
        </div>

        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${typeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
          >
            {isRtl ? 'الكل' : 'All'}
          </button>
          <button
            onClick={() => setTypeFilter('image')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${typeFilter === 'image' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
          >
            {isRtl ? 'الصور (JPG, PNG, WebP)' : 'Images'}
          </button>
          <button
            onClick={() => setTypeFilter('pdf')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${typeFilter === 'pdf' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
          >
            {isRtl ? 'المستندات (PDF)' : 'Documents (PDF)'}
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map(item => {
          const isPdf = item.fileType === 'application/pdf';

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col group hover:border-slate-300 transition"
            >
              {/* Preview Thumbnail */}
              <div className="h-36 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                {isPdf ? (
                  <div className="flex flex-col items-center gap-1.5 text-rose-600">
                    <FileText className="w-10 h-10" />
                    <span className="text-[10px] font-bold font-mono uppercase bg-rose-100 px-2 py-0.5 rounded">PDF DOCUMENT</span>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.altTextAr}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                )}

                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white font-mono text-[10px] font-bold uppercase">
                  {item.extension}
                </span>
              </div>

              {/* Info & Alt Text */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {isRtl ? `النص البديل: ${item.altTextAr}` : `Alt: ${item.altTextEn}`}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pt-1">
                    <span>{item.fileSize}</span>
                    <span>•</span>
                    <span>{item.uploadedAt}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                  <button
                    onClick={() => handleCopyUrl(item)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title={isRtl ? 'نسخ رابط الملف' : 'Copy URL'}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[10px] text-emerald-600">{isRtl ? 'تم النسخ' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{isRtl ? 'نسخ الرابط' : 'Copy'}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    {canEdit && (
                      <button
                        onClick={() => setEditingMedia(item)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
                        title={isRtl ? 'تعديل النص البديل' : 'Edit Alt Text'}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {canEdit && (
                      <button
                        onClick={() => onDeleteMedia(item.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title={isRtl ? 'حذف الملف' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: EDIT ALT TEXT */}
      {editingMedia && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              {isRtl ? 'تعديل النص البديل والوصولية (Alt Text)' : 'Edit Alt Text & Accessibility'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRtl ? 'النص البديل بالعربية (Alt Text AR):' : 'Alt Text (AR):'}
                </label>
                <input
                  type="text"
                  value={editingMedia.altTextAr}
                  onChange={e => setEditingMedia({ ...editingMedia, altTextAr: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRtl ? 'النص البديل بالإنجليزية (Alt Text EN):' : 'Alt Text (EN):'}
                </label>
                <input
                  type="text"
                  value={editingMedia.altTextEn}
                  onChange={e => setEditingMedia({ ...editingMedia, altTextEn: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingMedia(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  onUpdateMedia(editingMedia);
                  setEditingMedia(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#005A36] text-white text-xs font-bold hover:bg-[#004328] cursor-pointer"
              >
                {isRtl ? 'حفظ' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
