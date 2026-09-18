import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  Upload, 
  ExternalLink, 
  CheckCircle2,
  Globe,
  Award
} from 'lucide-react';
import { University, Track } from '../../types';

interface AdminUniversitiesManagerProps {
  universities: University[];
  tracks: Track[];
  onUpdateUniversity: (uni: University) => void;
  onCreateUniversity: (uni: University) => void;
  onDeleteUniversity: (id: string) => void;
}

export const AdminUniversitiesManager: React.FC<AdminUniversitiesManagerProps> = ({
  universities,
  tracks,
  onUpdateUniversity,
  onCreateUniversity,
  onDeleteUniversity
}) => {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [editingUni, setEditingUni] = useState<University | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Filtering
  const filteredList = universities.filter(u => {
    const matchSearch = search.trim() === '' || 
      u.nameAr.toLowerCase().includes(search.toLowerCase()) ||
      u.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase()) ||
      u.topMajorsAr.some(m => m.toLowerCase().includes(search.toLowerCase()));

    const matchCountry = selectedCountry === 'all' || u.countryCode.toLowerCase() === selectedCountry.toLowerCase();

    return matchSearch && matchCountry;
  });

  const countries = Array.from(new Set(universities.map(u => u.countryCode).filter(Boolean))) as string[];

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(universities, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kasp-universities-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUni) return;

    if (isCreating) {
      onCreateUniversity(editingUni);
      setFeedback(`تمت إضافة جامعة (${editingUni.nameAr}) بنجاح`);
    } else {
      onUpdateUniversity(editingUni);
      setFeedback(`تم حفظ تعديل جامعة (${editingUni.nameAr})`);
    }

    setEditingUni(null);
    setIsCreating(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  const startCreate = () => {
    const newUni: University = {
      id: `uni-${Date.now()}`,
      nameAr: '',
      nameEn: '',
      country: 'الولايات المتحدة الأمريكية',
      countryEn: 'United States',
      countryCode: 'US',
      city: 'واشنطن',
      cityEn: 'Washington',
      qsRank: 50,
      accreditedTracks: ['track-pioneers', 'track-supply'],
      topMajorsAr: ['علوم الحاسب', 'الذكاء الاصطناعي', 'الهندسة'],
      topMajorsEn: ['Computer Science', 'Artificial Intelligence', 'Engineering'],
      degreesAvailable: ['Bachelor', 'Master', 'PhD'],
      minIelts: 7.0,
      minToefl: 95,
      websiteUrl: 'https://',
      acceptanceRate: '15%'
    };
    setEditingUni(newUni);
    setIsCreating(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-700" />
            دليل الجامعات والمعاهد البحثية الموصى بها
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            إدارة الجامعات المعتمدة، تصنيف QS الدولي، التخصصات المتاحة، وروابط المواقع الرسمية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
          >
            <Download className="w-4 h-4" /> تصدير JSON
          </button>
          <button
            onClick={startCreate}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> إضافة جامعة
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {feedback}
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث باسم الجامعة أو التخصص..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pr-9 pl-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-slate-500 whitespace-nowrap">الدولة:</label>
          <select
            value={selectedCountry}
            onChange={e => setSelectedCountry(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white"
          >
            <option value="all">كافة الدول ({universities.length})</option>
            {countries.map(code => (
              <option key={code} value={code}>{code.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Universities Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4">المرتبة</th>
                <th className="py-3 px-4">اسم الجامعة</th>
                <th className="py-3 px-4">الدولة والمدينة</th>
                <th className="py-3 px-4">المسارات المعتمدة</th>
                <th className="py-3 px-4">الموقع الإلكتروني</th>
                <th className="py-3 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.slice(0, 50).map(uni => (
                <tr key={uni.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 font-bold font-mono">
                      #{uni.qsRank}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{uni.nameAr}</div>
                    <div className="text-[11px] text-slate-400 font-sans">{uni.nameEn}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div>{uni.country}</div>
                    <div className="text-[11px] text-slate-400">{uni.city}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {uni.accreditedTracks.map(tid => {
                        const tr = tracks.find(t => t.id === tid);
                        return (
                          <span key={tid} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            {tr ? tr.code : tid}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={uni.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline flex items-center gap-1 font-sans text-[11px]"
                    >
                      زيارة الموقع <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingUni(uni);
                          setIsCreating(false);
                        }}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        title="تعديل الجامعة"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`هل أنت متأكد من حذف جامعة (${uni.nameAr})؟`)) {
                            onDeleteUniversity(uni.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                        title="حذف الجامعة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {editingUni && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {isCreating ? 'إضافة جامعة جديدة' : `تعديل بيانات: ${editingUni.nameAr}`}
              </h3>
              <button 
                onClick={() => setEditingUni(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم الجامعة بالعربية</label>
                  <input
                    type="text"
                    value={editingUni.nameAr}
                    onChange={e => setEditingUni({ ...editingUni, nameAr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم الجامعة بالإنجليزية</label>
                  <input
                    type="text"
                    value={editingUni.nameEn}
                    onChange={e => setEditingUni({ ...editingUni, nameEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-sans"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">تصنيف QS</label>
                  <input
                    type="number"
                    value={editingUni.qsRank}
                    onChange={e => setEditingUni({ ...editingUni, qsRank: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">رمز الدولة</label>
                  <input
                    type="text"
                    value={editingUni.countryCode}
                    onChange={e => setEditingUni({ ...editingUni, countryCode: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المدينة</label>
                  <input
                    type="text"
                    value={editingUni.city}
                    onChange={e => setEditingUni({ ...editingUni, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رابط الموقع الإلكتروني</label>
                <input
                  type="url"
                  value={editingUni.websiteUrl}
                  onChange={e => setEditingUni({ ...editingUni, websiteUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-sans"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUni(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow-xs"
                >
                  حفظ الجامعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
