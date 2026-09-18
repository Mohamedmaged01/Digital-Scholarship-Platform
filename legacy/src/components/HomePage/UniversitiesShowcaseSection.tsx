import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Award, 
  ArrowRight, 
  ExternalLink, 
  Sparkles
} from 'lucide-react';
import { University } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface UniversitiesShowcaseSectionProps {
  universities: University[];
  onOpenFullDirectory: () => void;
}

export const UniversitiesShowcaseSection: React.FC<UniversitiesShowcaseSectionProps> = ({
  universities,
  onOpenFullDirectory
}) => {
  const { isRtl, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  const countries = [
    { id: 'all', nameAr: 'كافة الدول', nameEn: 'All Countries' },
    { id: 'United States', nameAr: 'الولايات المتحدة', nameEn: 'United States' },
    { id: 'United Kingdom', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom' },
    { id: 'Switzerland', nameAr: 'سويسرا', nameEn: 'Switzerland' },
    { id: 'Singapore', nameAr: 'سنغافورة', nameEn: 'Singapore' },
    { id: 'Japan', nameAr: 'اليابان', nameEn: 'Japan' }
  ];

  const filteredUnis = universities.filter(u => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      u.nameEn.toLowerCase().includes(term) || 
      u.nameAr.includes(searchTerm) ||
      u.topMajorsAr.some(s => s.toLowerCase().includes(term)) ||
      u.topMajorsEn.some(s => s.toLowerCase().includes(term));
    const matchesCountry = selectedCountry === 'all' || u.countryEn === selectedCountry || u.country === selectedCountry;
    return matchesSearch && matchesCountry;
  }).slice(0, 6);

  return (
    <section id="universities-section" className="space-y-6 scroll-mt-24">
      
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005A36]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.unis.eyebrow}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t.unis.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            {t.unis.subtitle}
          </p>
        </div>

        <button
          onClick={onOpenFullDirectory}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-2 self-start md:self-auto shrink-0 cursor-pointer"
        >
          <span>{t.unis.openFullBtn}</span>
          <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className={`w-4 h-4 text-slate-400 absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            placeholder={t.unis.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#005A36] focus:bg-white`}
          />
        </div>

        {/* Country Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {countries.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCountry(c.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCountry === c.id
                  ? 'bg-[#005A36] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isRtl ? c.nameAr : c.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Top Universities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredUnis.map((uni) => {
          const primaryName = isRtl ? uni.nameAr : uni.nameEn;
          const secondaryName = isRtl ? uni.nameEn : uni.nameAr;
          const countryName = isRtl ? uni.country : uni.countryEn;
          const majorsList = isRtl ? uni.topMajorsAr : uni.topMajorsEn;

          return (
            <div
              key={uni.id}
              className={`bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4 ${isRtl ? 'text-right' : 'text-left'} group`}
            >
              <div className="space-y-3">
                
                {/* Top Meta */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold font-mono flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      {t.unis.rankPrefix} #{uni.qsRank} {isRtl ? 'عالمياً' : 'Worldwide'}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {countryName}
                  </span>
                </div>

                {/* University Title */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005A36] transition-colors leading-snug">
                    {primaryName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {secondaryName}
                  </p>
                </div>

                {/* Specialties / Majors Tags */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10.5px] text-slate-400 font-semibold block">
                    {t.unis.featuredMajors}:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {majorsList.slice(0, 3).map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60"
                      >
                        {spec}
                      </span>
                    ))}
                    {majorsList.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{majorsList.length - 3} {isRtl ? 'أخرى' : 'more'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md">
                  {t.unis.accreditedBadge}
                </span>
                
                <a
                  href={uni.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 hover:text-[#005A36] flex items-center gap-1 font-bold transition"
                >
                  <span>{t.unis.websiteLink}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
