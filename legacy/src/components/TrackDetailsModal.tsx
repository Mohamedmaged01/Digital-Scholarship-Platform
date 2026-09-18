import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Award, 
  ArrowRight
} from 'lucide-react';
import { Track } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface TrackDetailsModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyTrack: (trackId: string) => void;
}

export const TrackDetailsModal: React.FC<TrackDetailsModalProps> = ({
  track,
  isOpen,
  onClose,
  onApplyTrack
}) => {
  const { isRtl, t } = useLanguage();

  if (!isOpen || !track) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className={`bg-white rounded-3xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 ${isRtl ? 'text-right' : 'text-left'} flex flex-col`}>
        
        {/* Modal Header Banner */}
        <div className="bg-gradient-to-r from-[#004026] to-[#005A36] text-white p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition cursor-pointer`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide block">
              {isRtl ? 'برنامج الابتعاث' : 'The Scholarship Program'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {isRtl ? track.nameAr : (track.nameEn || track.nameAr)}
            </h3>
            <p className="text-xs text-emerald-100">
              {isRtl ? track.nameEn : track.nameAr}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-slate-800">
          
          {/* Track Description */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-400">
              {isRtl ? 'الهدف الاستراتيجي من المسار:' : 'Strategic Track Objective:'}
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {isRtl ? track.descriptionAr : (track.descriptionEn || track.descriptionAr)}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] text-slate-500 font-bold block">
                {isRtl ? 'الدرجة المستهدفة:' : 'Target Degrees:'}
              </span>
              <span className="text-xs font-bold text-[#005A36] mt-0.5 block">
                {track.requiredDegree.join(isRtl ? '، ' : ', ')}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] text-slate-500 font-bold block">
                {isRtl ? 'الحد الأدنى للمعدل:' : 'Minimum GPA:'}
              </span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block font-mono">
                {track.minGpa} / 5.0
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 font-bold block">
                {isRtl ? 'نطاق التصنيف:' : 'University Ranking:'}
              </span>
              <span className="text-xs font-bold text-amber-700 mt-0.5 block">
                {isRtl ? `أفضل ${track.topUniversitiesRankLimit} عالمياً` : `Top ${track.topUniversitiesRankLimit} Global`}
              </span>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#005A36]" />
              <span>{isRtl ? 'شروط الأهلية والقبول الخاصة بالمسار:' : 'Eligibility & Admission Criteria:'}</span>
            </h4>
            <div className="space-y-1.5">
              {track.eligibilityCriteria.map((crit, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#005A36] shrink-0 mt-0.5" />
                  <span>{crit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Target Sectors & Future Fields */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#005A36]" />
              <span>{isRtl ? 'القطاعات الحيوية ومجالات التخصص:' : 'Target Priority Sectors & Fields:'}</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {track.targetSectors.map((sector, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/70"
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
          >
            {isRtl ? 'إغلاق' : 'Close'}
          </button>

          <button
            onClick={() => {
              onClose();
              onApplyTrack(track.id);
            }}
            className="px-6 py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004328] text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>{isRtl ? 'بدء التقديم على هذا المسار' : 'Apply For This Track'}</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

      </div>
    </div>
  );
};
