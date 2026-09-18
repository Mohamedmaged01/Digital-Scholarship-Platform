import React, { useState } from 'react';
import { 
  Crown, 
  Layers, 
  Microscope, 
  Award, 
  Stethoscope, 
  Rocket, 
  ArrowRight, 
  Sparkles,
  Info
} from 'lucide-react';
import { Track } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import saudiScholarResearcherImage from '../../assets/images/saudi_scholar_researcher_1788373659041.jpg';
import saudiYouthImdadImage from '../../assets/images/saudi_youth_imdad_1788975340846.jpg';
import saudiYouthExcellenceImage from '../../assets/images/saudi_youth_excellence_1788975358321.jpg';

interface ScholarshipTracksSectionProps {
  tracks: Track[];
  onSelectTrackForApplication: (trackId: string) => void;
  onOpenTrackDetails: (track: Track) => void;
}

export const ScholarshipTracksSection: React.FC<ScholarshipTracksSectionProps> = ({
  tracks,
  onSelectTrackForApplication,
  onOpenTrackDetails
}) => {
  const { isRtl, t } = useLanguage();
  const [filterDegree, setFilterDegree] = useState<string>('all');

  const trackVisuals: Record<string, {
    number: string;
    icon: React.ReactNode;
    themeTagAr: string;
    themeTagEn: string;
    targetSubtitle: string;
    imageUrl: string;
    accentColor: string;
  }> = {
    'track-pioneers': {
      number: '01',
      icon: <Crown className="w-5 h-5 text-amber-500" />,
      themeTagAr: 'أفضل 30 جامعة عالمياً',
      themeTagEn: 'Top 30 Global Universities',
      targetSubtitle: 'Leadership • Innovation • Global Universities',
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
      accentColor: 'border-emerald-500/40 text-[#005A36]'
    },
    'track-supply': {
      number: '02',
      icon: <Layers className="w-5 h-5 text-blue-500" />,
      themeTagAr: 'أفضل 200 جامعة عالمياً',
      themeTagEn: 'Top 200 Global Universities',
      targetSubtitle: 'Engineering • Technology • Supply & Workforce',
      imageUrl: saudiYouthImdadImage,
      accentColor: 'border-blue-500/40 text-blue-700'
    },
    'track-rd': {
      number: '03',
      icon: <Microscope className="w-5 h-5 text-purple-500" />,
      themeTagAr: 'أولويات البحث والابتكار',
      themeTagEn: 'National R&D Priorities',
      targetSubtitle: 'Scientific Research • AI • Laboratories • Innovation',
      imageUrl: saudiScholarResearcherImage,
      accentColor: 'border-purple-500/40 text-purple-700'
    },
    'track-excellence': {
      number: '04',
      icon: <Award className="w-5 h-5 text-amber-600" />,
      themeTagAr: 'أفضل 70 مؤسسة دولية',
      themeTagEn: 'Top 70 International Hubs',
      targetSubtitle: 'Academic Excellence • High Achievement • Top Universities',
      imageUrl: saudiYouthExcellenceImage,
      accentColor: 'border-amber-500/40 text-amber-700'
    },
    'track-health': {
      number: '05',
      icon: <Stethoscope className="w-5 h-5 text-rose-500" />,
      themeTagAr: 'الزمالات والتخصصات النادرة',
      themeTagEn: 'Clinical Fellowships & Medicine',
      targetSubtitle: 'Medicine • Healthcare • Medical Research',
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
      accentColor: 'border-rose-500/40 text-rose-700'
    },
    'track-waed': {
      number: '06',
      icon: <Rocket className="w-5 h-5 text-teal-600" />,
      themeTagAr: 'الصناعات الواعدة والشراكات',
      themeTagEn: 'Promising Sectors & Industry',
      targetSubtitle: 'Future Skills • Technology • Digital Transformation',
      imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80',
      accentColor: 'border-teal-500/40 text-teal-700'
    }
  };

  const filteredTracks = tracks.filter(trk => {
    if (filterDegree === 'all') return true;
    return trk.requiredDegree.includes(filterDegree);
  });

  const filterTabs = [
    { id: 'all', label: isRtl ? 'كافة المراحل' : 'All Levels' },
    { id: 'Bachelor', label: isRtl ? 'بكالوريوس' : 'Bachelor’s' },
    { id: 'Master', label: isRtl ? 'ماجستير' : 'Master’s' },
    { id: 'PhD', label: isRtl ? 'دكتوراه' : 'PhD / Doctorate' }
  ];

  return (
    <section id="tracks-catalog-section" className="space-y-6 scroll-mt-24">
      
      {/* Section Header */}
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005A36]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.tracks.eyebrow}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t.tracks.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            {t.tracks.subtitle}
          </p>
        </div>

        {/* Quick Degree Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterDegree(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterDegree === tab.id
                  ? 'bg-white text-[#005A36] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Premium Track Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTracks.map((track) => {
          const visual = trackVisuals[track.id] || {
            number: '00',
            icon: <Award className="w-5 h-5 text-emerald-600" />,
            themeTagAr: 'مسار معتمد',
            themeTagEn: 'Accredited Track',
            targetSubtitle: 'Academic Growth',
            imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
            accentColor: 'border-emerald-500/40 text-[#005A36]'
          };

          const trackName = isRtl ? track.nameAr : (track.nameEn || track.nameAr);
          const trackDesc = isRtl ? track.descriptionAr : (track.descriptionEn || track.descriptionAr);
          const themeTag = isRtl ? visual.themeTagAr : visual.themeTagEn;

          return (
            <div
              key={track.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-emerald-400/80 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1"
            >
              {/* Image Header with Overlay */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={visual.imageUrl}
                  alt={trackName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>

                {/* Track Sequence Number Badge */}
                <div className={`absolute top-3.5 ${isRtl ? 'right-3.5' : 'left-3.5'} flex items-center gap-2`}>
                  <span className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/20 text-white font-mono font-bold text-xs shadow-md">
                    {visual.number}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-950/80 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[10.5px] font-bold">
                    {themeTag}
                  </span>
                </div>

                {/* In-Image Track Header */}
                <div className={`absolute bottom-3 inset-x-3.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                      {visual.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white leading-tight drop-shadow-sm truncate">
                      {trackName}
                    </h3>
                  </div>
                  <p className="text-[10.5px] text-emerald-200/90 font-medium tracking-wide truncate">
                    {visual.targetSubtitle}
                  </p>
                </div>
              </div>

              {/* Card Body Content */}
              <div className={`p-5 space-y-4 ${isRtl ? 'text-right' : 'text-left'} flex-1 flex flex-col justify-between`}>
                
                {/* Short Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {trackDesc}
                </p>

                {/* Core Criteria Tags */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl">
                    <span className="text-slate-500 font-medium">{t.tracks.minGpaLabel}:</span>
                    <span className="font-bold text-slate-900">{track.minGpa} {t.tracks.outOfFive}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl">
                    <span className="text-slate-500 font-medium">{t.tracks.rankLimitLabel}:</span>
                    <span className="font-bold text-[#005A36]">
                      {t.tracks.topLabel} {track.topUniversitiesRankLimit} {isRtl ? 'عالمياً' : 'globally'}
                    </span>
                  </div>

                  {/* Sectors Pills */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {track.targetSectors.slice(0, 3).map((sector, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10.5px] font-medium bg-emerald-50 text-[#005A36] px-2 py-0.5 rounded-md border border-emerald-100"
                      >
                        {sector}
                      </span>
                    ))}
                    {track.targetSectors.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{track.targetSectors.length - 3} {isRtl ? 'أخرى' : 'more'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectTrackForApplication(track.id)}
                    className="flex-1 py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004328] active:bg-[#022c22] text-white font-bold text-xs shadow-2xs transition flex items-center justify-center gap-1.5 group/btn cursor-pointer"
                  >
                    <span>{t.tracks.applyBtn}</span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isRtl ? 'rotate-180 group-hover/btn:-translate-x-0.5' : 'group-hover/btn:translate-x-0.5'}`} />
                  </button>

                  <button
                    onClick={() => onOpenTrackDetails(track)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center cursor-pointer"
                    title={t.tracks.detailsBtn}
                    aria-label={t.tracks.detailsBtn}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
