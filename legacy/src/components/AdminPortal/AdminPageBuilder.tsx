import React, { useState } from 'react';
import { 
  CmsPage, 
  PageBlock, 
  PageBlockType 
} from './adminTypes';
import { 
  Layers, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  CheckCircle2, 
  RotateCcw, 
  Settings, 
  History, 
  Globe, 
  FileText, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface AdminPageBuilderProps {
  pages: CmsPage[];
  onSavePage: (updatedPage: CmsPage, actionType: 'SAVE_DRAFT' | 'PUBLISH' | 'ROLLBACK') => void;
  canEdit: boolean;
  canPublish: boolean;
}

const AVAILABLE_BLOCKS: { type: PageBlockType; labelAr: string; iconDesc: string }[] = [
  { type: 'Hero', labelAr: 'بانر رئيسي (Hero)', iconDesc: '🖼️' },
  { type: 'Text', labelAr: 'محتوى نصي ومقروء', iconDesc: '📝' },
  { type: 'Image', labelAr: 'صورة توضيحية', iconDesc: '📸' },
  { type: 'Video', labelAr: 'فيديو تعريفي', iconDesc: '🎬' },
  { type: 'Cards', labelAr: 'بطاقات تعريفية (Cards)', iconDesc: '🗂️' },
  { type: 'Tracks', labelAr: 'شبكة مسارات الابتعاث', iconDesc: '🎯' },
  { type: 'Universities', labelAr: 'مستكشف الجامعات', iconDesc: '🏛️' },
  { type: 'FAQ', labelAr: 'الأسئلة الشائعة', iconDesc: '❓' },
  { type: 'Timeline', labelAr: 'خط زمني / مراحل', iconDesc: '⏳' },
  { type: 'Statistics', labelAr: 'أرقام وإحصائيات', iconDesc: '📊' },
  { type: 'CTA', labelAr: 'دعوة لاتخاذ إجراء (CTA)', iconDesc: '🚀' },
  { type: 'Gallery', labelAr: 'معرض صور رقمي', iconDesc: '🎨' },
  { type: 'Documents', labelAr: 'مستندات وأدلة تحميل', iconDesc: '📄' },
  { type: 'Links', labelAr: 'روابط هامة ومنصات', iconDesc: '🔗' }
];

export const AdminPageBuilder: React.FC<AdminPageBuilderProps> = ({
  pages,
  onSavePage,
  canEdit,
  canPublish
}) => {
  const { isRtl } = useLanguage();
  const [selectedPageId, setSelectedPageId] = useState<string>(pages[0]?.id || 'page-home');
  const [viewMode, viewModeSet] = useState<'editor' | 'preview' | 'versions'>('editor');
  const [selectedBlockForEdit, setSelectedBlockForEdit] = useState<PageBlock | null>(null);
  const [showAddBlockModal, setShowAddBlockModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const currentPage = pages.find(p => p.id === selectedPageId) || pages[0];

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (!canEdit) return;
    const newBlocks = [...currentPage.blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    // re-order indices
    newBlocks.forEach((b, i) => { b.order = i + 1; });

    const updated: CmsPage = {
      ...currentPage,
      blocks: newBlocks,
      status: 'draft',
      lastUpdated: new Date().toISOString()
    };
    onSavePage(updated, 'SAVE_DRAFT');
    triggerNotification(isRtl ? 'تم تحديث ترتيب البلوكات وحفظ المسودة' : 'Blocks reordered and draft saved');
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!canEdit) return;
    const updatedBlocks = currentPage.blocks.filter(b => b.id !== blockId);
    const updated: CmsPage = {
      ...currentPage,
      blocks: updatedBlocks,
      status: 'draft',
      lastUpdated: new Date().toISOString()
    };
    onSavePage(updated, 'SAVE_DRAFT');
    triggerNotification(isRtl ? 'تم حذف البلوك وحفظ المسودة' : 'Block deleted');
  };

  const handleAddBlock = (type: PageBlockType) => {
    if (!canEdit) return;
    const newBlock: PageBlock = {
      id: `blk-${Date.now()}`,
      type,
      title: `بلوك ${type} جديد`,
      content: `محتوى تجريبي للبلوك ${type}`,
      order: currentPage.blocks.length + 1,
      config: {},
      isVisible: true
    };

    const updated: CmsPage = {
      ...currentPage,
      blocks: [...currentPage.blocks, newBlock],
      status: 'draft',
      lastUpdated: new Date().toISOString()
    };
    onSavePage(updated, 'SAVE_DRAFT');
    setShowAddBlockModal(false);
    triggerNotification(isRtl ? `تمت إضافة بلوك (${type}) بنجاح` : `Block ${type} added`);
  };

  const handlePublish = () => {
    if (!canPublish) return;
    const newVersion = {
      versionId: `v${(currentPage.versions.length + 1.1).toFixed(1)}`,
      savedAt: new Date().toISOString(),
      savedBy: 'مدير المحتوى',
      comment: 'نشر التعديلات على البوابة العامة',
      blocks: JSON.parse(JSON.stringify(currentPage.blocks))
    };

    const updated: CmsPage = {
      ...currentPage,
      status: 'published',
      versions: [newVersion, ...currentPage.versions],
      lastUpdated: new Date().toISOString()
    };

    onSavePage(updated, 'PUBLISH');
    triggerNotification(isRtl ? 'تم نشر الصفحة للعامة بنجاح!' : 'Page published successfully!');
  };

  const handleRollback = (versionId: string) => {
    if (!canPublish) return;
    const targetVersion = currentPage.versions.find(v => v.versionId === versionId);
    if (!targetVersion) return;

    const updated: CmsPage = {
      ...currentPage,
      blocks: JSON.parse(JSON.stringify(targetVersion.blocks)),
      status: 'published',
      lastUpdated: new Date().toISOString()
    };

    onSavePage(updated, 'ROLLBACK');
    triggerNotification(isRtl ? `تم التراجع بنجاح إلى النسخة (${versionId})` : `Rolled back to ${versionId}`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-900 text-white font-bold text-sm shadow-2xl flex items-center gap-2 border border-emerald-500 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header & Page Selector */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#005A36]/10 text-[#005A36] flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isRtl ? 'منشئ ومحرر الصفحات الديناميكي (Page Builder)' : 'Dynamic Page Builder'}
            </h2>
            <p className="text-xs text-slate-500">
              {isRtl ? 'بناء صفحات المنصة عبر كتل رقمية قابلة لإعادة الترتيب والنشر والتراجع' : 'Construct pages with drag/drop blocks, versioning, and draft/publish workflow'}
            </p>
          </div>
        </div>

        {/* Page Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600">
            {isRtl ? 'الصفحة الحالية:' : 'Active Page:'}
          </label>
          <select
            value={selectedPageId}
            onChange={e => setSelectedPageId(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 text-slate-800"
          >
            {pages.map(p => (
              <option key={p.id} value={p.id}>
                {isRtl ? p.titleAr : p.titleEn} ({p.slug})
              </option>
            ))}
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => viewModeSet('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${viewMode === 'editor' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {isRtl ? 'المحرر (Blocks)' : 'Editor'}
            </button>
            <button
              onClick={() => viewModeSet('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${viewMode === 'preview' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {isRtl ? 'معاينة (Preview)' : 'Preview'}
              </span>
            </button>
            <button
              onClick={() => viewModeSet('versions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${viewMode === 'versions' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <span className="flex items-center gap-1">
                <History className="w-3.5 h-3.5" />
                {isRtl ? 'الإصدارات (Versions)' : 'Versions'}
              </span>
            </button>
          </div>

          {canPublish && (
            <button
              onClick={handlePublish}
              disabled={currentPage.status === 'published'}
              className="px-4 py-2 rounded-xl bg-[#005A36] hover:bg-[#004328] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isRtl ? 'نشر رسمي (Publish)' : 'Publish'}</span>
            </button>
          )}

          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${currentPage.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {currentPage.status === 'published' ? (isRtl ? 'منشور للعامة' : 'Published') : (isRtl ? 'مسودة Draft' : 'Draft')}
          </div>
        </div>
      </div>

      {/* 1. EDITOR VIEW */}
      {viewMode === 'editor' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isRtl ? `البلوكات المكونة للصفحة (${currentPage.blocks.length})` : `Page Blocks (${currentPage.blocks.length})`}
            </span>
            {canEdit && (
              <button
                onClick={() => setShowAddBlockModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إضافة Block جديد' : 'Add New Block'}</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {currentPage.blocks.map((block, idx) => (
              <div
                key={block.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4 hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 text-xs font-mono font-bold flex items-center justify-center">
                    {block.order}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#005A36] border border-emerald-200 text-[11px] font-bold">
                        {block.type}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{block.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 max-w-xl truncate">
                      {block.content}
                    </p>
                  </div>
                </div>

                {/* Block Controls */}
                <div className="flex items-center gap-1.5">
                  {canEdit && (
                    <>
                      <button
                        onClick={() => handleMoveBlock(idx, 'up')}
                        disabled={idx === 0}
                        title={isRtl ? 'تحريك للأعلى' : 'Move Up'}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveBlock(idx, 'down')}
                        disabled={idx === currentPage.blocks.length - 1}
                        title={isRtl ? 'تحريك للأسفل' : 'Move Down'}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedBlockForEdit(block)}
                        title={isRtl ? 'تعديل الإعدادات' : 'Edit Settings'}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlock(block.id)}
                        title={isRtl ? 'حذف البلوك' : 'Delete'}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PREVIEW VIEW */}
      {viewMode === 'preview' && (
        <div className="bg-slate-100 p-6 rounded-3xl border-2 border-dashed border-slate-300 space-y-6">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              {isRtl 
                ? 'وضع المعاينة الحية: يعرض الصفحة كما ستظهر للمستفيد النهائي قبل اعتماد النشر الرسمي.' 
                : 'Live Preview Mode: Displays the page as platform visitors will see it prior to publishing.'}
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 divide-y divide-slate-100">
            {currentPage.blocks.map(b => (
              <div key={b.id} className="p-8 text-center space-y-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                  Block: {b.type}
                </span>
                <h3 className="text-xl font-bold text-slate-900">{b.title}</h3>
                <p className="text-slate-600 text-sm max-w-xl mx-auto">{b.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. VERSIONS & ROLLBACK VIEW */}
      {viewMode === 'versions' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            {isRtl ? 'سجل إصدارات الصفحة والتراجع (Versioning & Rollback)' : 'Page Versions & Rollback History'}
          </h3>
          <p className="text-xs text-slate-500">
            {isRtl 
              ? 'يتم أرشفة كل عملية نشر كإصدار غير قابل للتعديل لتسهيل المقارنة والتراجع الفوري.' 
              : 'Every publish event generates an immutable snapshot for historical auditing and rollback.'}
          </p>

          <div className="space-y-3">
            {currentPage.versions.map(ver => (
              <div
                key={ver.versionId}
                className="p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-bold">
                      {ver.versionId}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{ver.comment}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    {new Date(ver.savedAt).toLocaleString()} • بواسطة: {ver.savedBy}
                  </span>
                </div>

                {canPublish && (
                  <button
                    onClick={() => handleRollback(ver.versionId)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'استعادة هذه النسخة (Rollback)' : 'Rollback'}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD BLOCK */}
      {showAddBlockModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {isRtl ? 'اختر نوع الـ Block لإضافته للصفحة' : 'Select Block Type'}
              </h3>
              <button
                onClick={() => setShowAddBlockModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto p-1">
              {AVAILABLE_BLOCKS.map(blk => (
                <button
                  key={blk.type}
                  onClick={() => handleAddBlock(blk.type)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-[#005A36] hover:bg-emerald-50/40 text-right transition group cursor-pointer"
                >
                  <span className="text-xl block mb-1">{blk.iconDesc}</span>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-[#005A36] block">
                    {blk.labelAr}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{blk.type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT BLOCK SETTINGS */}
      {selectedBlockForEdit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {isRtl ? `تعديل إعدادات بلوك (${selectedBlockForEdit.type})` : `Edit Block (${selectedBlockForEdit.type})`}
              </h3>
              <button
                onClick={() => setSelectedBlockForEdit(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRtl ? 'عنوان البلوك:' : 'Title:'}
                </label>
                <input
                  type="text"
                  value={selectedBlockForEdit.title}
                  onChange={e => setSelectedBlockForEdit({ ...selectedBlockForEdit, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRtl ? 'المحتوى أو الوصف:' : 'Content:'}
                </label>
                <textarea
                  rows={4}
                  value={selectedBlockForEdit.content}
                  onChange={e => setSelectedBlockForEdit({ ...selectedBlockForEdit, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedBlockForEdit(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  const updatedBlocks = currentPage.blocks.map(b => b.id === selectedBlockForEdit.id ? selectedBlockForEdit : b);
                  onSavePage({
                    ...currentPage,
                    blocks: updatedBlocks,
                    status: 'draft',
                    lastUpdated: new Date().toISOString()
                  }, 'SAVE_DRAFT');
                  setSelectedBlockForEdit(null);
                  triggerNotification(isRtl ? 'تم حفظ تعديلات البلوك' : 'Block settings saved');
                }}
                className="px-4 py-2 rounded-xl bg-[#005A36] text-white text-xs font-bold hover:bg-[#004328] cursor-pointer"
              >
                {isRtl ? 'حفظ التعديلات' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
