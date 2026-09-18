import React, { useState } from 'react';
import { Track } from '../../types';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ArrowUp, 
  ArrowDown, 
  Award, 
  Users, 
  GraduationCap, 
  Eye, 
  X 
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface AdminTracksManagerProps {
  tracks: Track[];
  onUpdateTracks: (newTracks: Track[]) => void;
  canEdit: boolean;
  onPreviewTrack: (trackId: string) => void;
}

export const AdminTracksManager: React.FC<AdminTracksManagerProps> = ({
  tracks,
  onUpdateTracks,
  canEdit,
  onPreviewTrack
}) => {
  const { isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTrackData, setNewTrackData] = useState<Partial<Track>>({
    nameAr: '',
    nameEn: '',
    taglineAr: '',
    descriptionAr: '',
    allocatedSeats: 1000,
    isActive: true,
    minGpa: 3.5,
    minIeltsScore: 6.5,
    universityRankLimit: 100,
    unconditionalOfferRequired: true
  });

  const filteredTracks = tracks.filter(t => 
    t.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = (trackId: string) => {
    if (!canEdit) return;
    const updated = tracks.map(t => t.id === trackId ? { ...t, isActive: !t.isActive } : t);
    onUpdateTracks(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (!canEdit) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tracks.length) return;

    const copy = [...tracks];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    onUpdateTracks(copy);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack || !canEdit) return;
    const updated = tracks.map(t => t.id === editingTrack.id ? editingTrack : t);
    onUpdateTracks(updated);
    setEditingTrack(null);
  };

  const handleCreateTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackData.nameAr || !canEdit) return;

    const id = `track-${Date.now()}`;
    const fullTrack: Track = {
      id,
      code: ((newTrackData.nameEn || 'TRACK').toUpperCase().replace(/\s+/g, '_').slice(0, 8) as any),
      nameAr: newTrackData.nameAr || 'مسار جديد',
      nameEn: newTrackData.nameEn || 'New Track',
      taglineAr: newTrackData.taglineAr || '',
      taglineEn: newTrackData.nameEn || '',
      descriptionAr: newTrackData.descriptionAr || '',
      descriptionEn: newTrackData.descriptionAr || '',
      badgeColor: '#005A36',
      primaryColor: '#005A36',
      accentColor: '#10B981',
      allocatedSeats: Number(newTrackData.allocatedSeats) || 500,
      occupiedSeats: 0,
      isActive: true,
      minGpa: Number(newTrackData.minGpa) || 3.0,
      maxAge: 35,
      requiredIelts: Number(newTrackData.minIeltsScore) || 6.0,
      requiredToefl: 80,
      topUniversitiesRankLimit: Number(newTrackData.universityRankLimit) || 100,
      targetSectors: ['التقنيات المتقدمة', 'الصناعة والتعدين', 'الطاقة المستدامة'],
      features: ['تغطية شاملة للرسوم والمصروفات', 'فرص تدريب دولية'],
      gpaScale: 5.0,
      minIeltsScore: Number(newTrackData.minIeltsScore) || 6.0,
      universityRankLimit: Number(newTrackData.universityRankLimit) || 100,
      unconditionalOfferRequired: !!newTrackData.unconditionalOfferRequired,
      targetDegrees: ['Bachelor', 'Master', 'PhD'],
      targetSectorsAr: ['التقنيات المتقدمة', 'الصناعة والتعدين', 'الطاقة المستدامة'],
      targetSectorsEn: ['Advanced Tech', 'Industry', 'Clean Energy'],
      prioritySpecializationsAr: ['الذكاء الاصطناعي', 'علوم البيانات', 'الأمن السيبراني'],
      eligibleNationalities: ['Saudi']
    };

    onUpdateTracks([...tracks, fullTrack]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {isRtl ? 'إدارة مسارات الابتعاث الاستراتيجية (Tracks Management)' : 'Strategic Tracks Management'}
          </h2>
          <p className="text-xs text-slate-500">
            {isRtl ? 'التحكم في شروط القبول، المقاعد المخصصة، المعايير الأكاديمية، وحالة التفعيل' : 'Manage tracks eligibility, quotas, admission rules, and active status'}
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004328] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة مسار ابتعاث جديد' : 'Add New Track'}</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={isRtl ? 'بحث باسم المسار أو الرمز...' : 'Search track name or code...'}
          className={`w-full py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#005A36] ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
        />
      </div>

      {/* Tracks Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">{isRtl ? 'المسار' : 'Track'}</th>
                <th className="p-3.5">{isRtl ? 'المقاعد المخصصة' : 'Quota'}</th>
                <th className="p-3.5">{isRtl ? 'سقف تصنيف الجامعات' : 'Max Rank'}</th>
                <th className="p-3.5">{isRtl ? 'الحد الأدنى للمعدل والآيلتس' : 'GPA / IELTS'}</th>
                <th className="p-3.5">{isRtl ? 'الحالة' : 'Status'}</th>
                <th className="p-3.5 text-center">{isRtl ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTracks.map((trk, idx) => (
                <tr key={trk.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5">
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">{trk.nameAr}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{trk.nameEn} • {trk.code}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-slate-800">
                    {trk.allocatedSeats.toLocaleString()} {isRtl ? 'مقعد' : 'seats'}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-[#005A36]">
                    Top {trk.universityRankLimit}
                  </td>
                  <td className="p-3.5 text-slate-600">
                    <span>{trk.minGpa} / {trk.gpaScale}</span> • <span className="font-bold text-indigo-700">IELTS {trk.minIeltsScore}</span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${trk.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                      {trk.isActive ? (isRtl ? 'مفعّل' : 'Active') : (isRtl ? 'معطل' : 'Inactive')}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onPreviewTrack(trk.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
                        title={isRtl ? 'معاينة في الموقع' : 'Preview on public UI'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {canEdit && (
                        <>
                          <button
                            onClick={() => handleMove(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-500 cursor-pointer"
                            title={isRtl ? 'رفع الترتيب' : 'Move Up'}
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMove(idx, 'down')}
                            disabled={idx === tracks.length - 1}
                            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-500 cursor-pointer"
                            title={isRtl ? 'خفض الترتيب' : 'Move Down'}
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingTrack(trk)}
                            className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 cursor-pointer"
                            title={isRtl ? 'تعديل الشروط' : 'Edit Requirements'}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(trk.id)}
                            className={`p-1.5 rounded-lg cursor-pointer ${trk.isActive ? 'hover:bg-amber-50 text-amber-600' : 'hover:bg-emerald-50 text-emerald-600'}`}
                            title={trk.isActive ? (isRtl ? 'تعطيل المسار' : 'Deactivate') : (isRtl ? 'تفعيل المسار' : 'Activate')}
                          >
                            {trk.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: EDIT TRACK */}
      {editingTrack && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {isRtl ? `تعديل شروط مسار (${editingTrack.nameAr})` : `Edit Track (${editingTrack.nameEn})`}
              </h3>
              <button
                onClick={() => setEditingTrack(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">اسم المسار (عربي):</label>
                  <input
                    type="text"
                    value={editingTrack.nameAr}
                    onChange={e => setEditingTrack({ ...editingTrack, nameAr: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">اسم المسار (إنجليزي):</label>
                  <input
                    type="text"
                    value={editingTrack.nameEn}
                    onChange={e => setEditingTrack({ ...editingTrack, nameEn: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">سقف التصنيف:</label>
                  <input
                    type="number"
                    value={editingTrack.universityRankLimit}
                    onChange={e => setEditingTrack({ ...editingTrack, universityRankLimit: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">المقاعد المخصصة:</label>
                  <input
                    type="number"
                    value={editingTrack.allocatedSeats}
                    onChange={e => setEditingTrack({ ...editingTrack, allocatedSeats: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">أدنى درجة آيلتس:</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingTrack.minIeltsScore}
                    onChange={e => setEditingTrack({ ...editingTrack, minIeltsScore: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">وصف المسار الاستراتيجي:</label>
                <textarea
                  rows={3}
                  value={editingTrack.descriptionAr}
                  onChange={e => setEditingTrack({ ...editingTrack, descriptionAr: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="uncond"
                  checked={editingTrack.unconditionalOfferRequired}
                  onChange={e => setEditingTrack({ ...editingTrack, unconditionalOfferRequired: e.target.checked })}
                  className="w-4 h-4 rounded text-[#005A36]"
                />
                <label htmlFor="uncond" className="font-bold text-slate-800">
                  يشترط قبول نهائي غير مشروط (Unconditional Offer)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingTrack(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#005A36] text-white font-bold hover:bg-[#004328] cursor-pointer"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TRACK */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {isRtl ? 'إضافة مسار ابتعاث جديد' : 'Add New Scholarship Track'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTrack} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">اسم المسار بالعربية:</label>
                  <input
                    type="text"
                    required
                    value={newTrackData.nameAr || ''}
                    onChange={e => setNewTrackData({ ...newTrackData, nameAr: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300"
                    placeholder="مثال: مسار الذكاء الاصطناعي والفضاء"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">اسم المسار بالإنجليزية:</label>
                  <input
                    type="text"
                    required
                    value={newTrackData.nameEn || ''}
                    onChange={e => setNewTrackData({ ...newTrackData, nameEn: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300"
                    placeholder="e.g. AI & Space Track"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">سقف التصنيف:</label>
                  <input
                    type="number"
                    value={newTrackData.universityRankLimit || 50}
                    onChange={e => setNewTrackData({ ...newTrackData, universityRankLimit: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">المقاعد المخصصة:</label>
                  <input
                    type="number"
                    value={newTrackData.allocatedSeats || 1000}
                    onChange={e => setNewTrackData({ ...newTrackData, allocatedSeats: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">أدنى آيلتس:</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newTrackData.minIeltsScore || 6.5}
                    onChange={e => setNewTrackData({ ...newTrackData, minIeltsScore: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">نبذة عن المسار:</label>
                <textarea
                  rows={3}
                  value={newTrackData.descriptionAr || ''}
                  onChange={e => setNewTrackData({ ...newTrackData, descriptionAr: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300"
                  placeholder="وصف أهداف المسار ومخرجاته الوطنية..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
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
                  إضافة المسار
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
