import React, { useState } from 'react';
import { FaqItem } from '../../types';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  HelpCircle, 
  CheckCircle2, 
  XCircle,
  Tag
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface AdminFaqManagerProps {
  faqs: FaqItem[];
  onUpdateFaqs: (newFaqs: FaqItem[]) => void;
  canEdit: boolean;
}

export const AdminFaqManager: React.FC<AdminFaqManagerProps> = ({
  faqs,
  onUpdateFaqs,
  canEdit
}) => {
  const { isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newQuestionAr, setNewQuestionAr] = useState<string>('');
  const [newQuestionEn, setNewQuestionEn] = useState<string>('');
  const [newAnswerAr, setNewAnswerAr] = useState<string>('');
  const [newAnswerEn, setNewAnswerEn] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('admission');

  const categories = [
    { key: 'all', labelAr: 'جميع التصنيفات' },
    { key: 'admission', labelAr: 'القبول وشروط المسارات' },
    { key: 'safeer', labelAr: 'الخدمات الإلكترونية والضمان المالي' },
    { key: 'regulations', labelAr: 'اللوائح والأنظمة ومكافآت الابتعاث' },
    { key: 'visa_travel', labelAr: 'التأشيرات والسفر وأوامر الإركاب' }
  ];

  const filteredFaqs = faqs.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.questionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answerAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.questionEn.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleDelete = (id: string) => {
    if (!canEdit) return;
    onUpdateFaqs(faqs.filter(f => f.id !== id));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionAr || !newAnswerAr || !canEdit) return;

    const newItem: FaqItem = {
      id: `faq-${Date.now()}`,
      category: newCategory as any,
      questionAr: newQuestionAr,
      questionEn: newQuestionEn || newQuestionAr,
      answerAr: newAnswerAr,
      answerEn: newAnswerEn || newAnswerAr,
      isFeatured: false,
      isPublished: true,
      tags: []
    };

    onUpdateFaqs([newItem, ...faqs]);
    setShowAddModal(false);
    setNewQuestionAr('');
    setNewAnswerAr('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {isRtl ? 'إدارة الأسئلة الشائعة والاستفسارات (FAQ Management)' : 'FAQ & Knowledge Base Management'}
          </h2>
          <p className="text-xs text-slate-500">
            {isRtl ? 'تحديث وتصنيف الإجابات الرسمية المعتمدة للمتقدمين والمبتعثين' : 'Maintain and categorize verified official scholarship answers'}
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004328] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة سؤال جديد' : 'Add FAQ'}</span>
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
            placeholder={isRtl ? 'بحث في الأسئلة أو الإجابات...' : 'Search questions or answers...'}
            className={`w-full py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-[#005A36] ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">{isRtl ? 'التصنيف:' : 'Category:'}</span>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
          >
            {categories.map(c => (
              <option key={c.key} value={c.key}>{c.labelAr}</option>
            ))}
          </select>
        </div>
      </div>

      {/* FAQ Cards */}
      <div className="space-y-3">
        {filteredFaqs.map(item => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-slate-300 transition"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#005A36] text-[11px] font-bold">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{item.questionAr}</h3>
              </div>

              {canEdit && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingFaq(item)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
                    title={isRtl ? 'تعديل السؤال' : 'Edit'}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title={isRtl ? 'حذف السؤال' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pr-1">
              {item.answerAr}
            </p>
          </div>
        ))}
      </div>

      {/* MODAL: ADD FAQ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {isRtl ? 'إضافة سؤال شائع جديد' : 'Add New FAQ'}
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
                <label className="font-bold text-slate-700 block mb-1">التصنيف:</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                >
                  <option value="admission">القبول وشروط المسارات</option>
                  <option value="safeer">الخدمات الإلكترونية والضمان المالي</option>
                  <option value="regulations">اللوائح والأنظمة ومكافآت الابتعاث</option>
                  <option value="visa_travel">التأشيرات والسفر وأوامر الإركاب</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">نص السؤال (عربي):</label>
                <input
                  type="text"
                  required
                  value={newQuestionAr}
                  onChange={e => setNewQuestionAr(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                  placeholder="مثال: هل يشترط اختبار الآيلتس لمسار إمداد؟"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">نص الإجابة الرسمية (عربي):</label>
                <textarea
                  rows={4}
                  required
                  value={newAnswerAr}
                  onChange={e => setNewAnswerAr(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                  placeholder="صياغة الإجابة المعتمدة رسمياً..."
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
                  حفظ ونشر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT FAQ */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {isRtl ? 'تعديل السؤال الشائع' : 'Edit FAQ'}
              </h3>
              <button
                onClick={() => setEditingFaq(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">نص السؤال:</label>
                <input
                  type="text"
                  value={editingFaq.questionAr}
                  onChange={e => setEditingFaq({ ...editingFaq, questionAr: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">نص الإجابة:</label>
                <textarea
                  rows={4}
                  value={editingFaq.answerAr}
                  onChange={e => setEditingFaq({ ...editingFaq, answerAr: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateFaqs(faqs.map(f => f.id === editingFaq.id ? editingFaq : f));
                    setEditingFaq(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#005A36] text-white font-bold hover:bg-[#004328] cursor-pointer"
                >
                  حفظ التعديل
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
