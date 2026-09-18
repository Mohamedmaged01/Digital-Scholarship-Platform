import React, { useState } from 'react';
import { 
  Building, 
  Search, 
  Globe, 
  MapPin, 
  ExternalLink, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Map
} from 'lucide-react';
import { Track, University } from '../types';
import { UNIVERSITIES_DATABASE } from '../data/scholarshipCatalog';
import { useLanguage } from '../i18n/LanguageContext';

interface UniversityExplorerProps {
  tracks: Track[];
  onSelectUniversityForApplication?: (uni: University) => void;
}

export const UniversityExplorer: React.FC<UniversityExplorerProps> = ({
  tracks,
  onSelectUniversityForApplication
}) => {
  const { isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [selectedDegree, setSelectedDegree] = useState<string>('all');
  const [selectedRankTier, setSelectedRankTier] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');

  // Selected uni for detail drawer
  const [selectedUni, setSelectedUni] = useState<University | null>(null);

  const countries = [
    { code: 'all', labelAr: 'جميع الوجهات الدولية', labelEn: 'All Destinations' },
    { code: 'US', labelAr: '🇺🇸 الولايات المتحدة', labelEn: '🇺🇸 United States' },
    { code: 'GB', labelAr: '🇬🇧 المملكة المتحدة', labelEn: '🇬🇧 United Kingdom' },
    { code: 'CA', labelAr: '🇨🇦 كندا', labelEn: '🇨🇦 Canada' },
    { code: 'AU', labelAr: '🇦🇺 أستراليا', labelEn: '🇦🇺 Australia' },
    { code: 'CH', labelAr: '🇨🇭 سويسرا', labelEn: '🇨🇭 Switzerland' },
    { code: 'DE', labelAr: '🇩🇪 ألمانيا', labelEn: '🇩🇪 Germany' },
    { code: 'SG', labelAr: '🇸🇬 سنغافورة', labelEn: '🇸🇬 Singapore' },
    { code: 'JP', labelAr: '🇯🇵 اليابان', labelEn: '🇯🇵 Japan' },
    { code: 'FR', labelAr: '🇫🇷 فرنسا', labelEn: '🇫🇷 France' }
  ];

  const filteredUnis = UNIVERSITIES_DATABASE.filter((uni) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      uni.nameAr.toLowerCase().includes(q) ||
      uni.nameEn.toLowerCase().includes(q) ||
      uni.city.toLowerCase().includes(q) ||
      uni.topMajorsAr.some((m) => m.toLowerCase().includes(q)) ||
      uni.topMajorsEn.some((m) => m.toLowerCase().includes(q));

    const matchesCountry = selectedCountry === 'all' || uni.countryCode === selectedCountry;
    const matchesTrack = selectedTrack === 'all' || uni.accreditedTracks.includes(selectedTrack);
    const matchesDegree = selectedDegree === 'all' || uni.degreesAvailable.includes(selectedDegree as any);

    let matchesRank = true;
    if (selectedRankTier === 'top30') matchesRank = uni.qsRank <= 30;
    else if (selectedRankTier === 'top100') matchesRank = uni.qsRank <= 100;
    else if (selectedRankTier === 'top200') matchesRank = uni.qsRank <= 200;

    return matchesSearch && matchesCountry && matchesTrack && matchesDegree && matchesRank;
  });

  return (
    <div className={`space-y-8 animate-in fade-in ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-10 border border-slate-800 text-white shadow-xl overflow-hidden">
        <div className={`absolute top-0 ${isRtl ? 'right-0' : 'left-0'} w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none`}></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isRtl ? 'الدليل الرسمي للجامعات والمؤسسات التعليمية المعتمدة عالمياً' : 'Official Global Directory of Accredited Higher Education Institutions'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
            {isRtl ? 'استكشاف الجامعات والتخصصات المعتمدة' : 'Explore Accredited Universities & Majors'}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            {isRtl 
              ? 'ابحث في قائمة الجامعات العالمية المعتمدة لبرنامج خادم الحرمين الشريفين للابتعاث، واطلع على شروط القبول والتخصصات المستهدفة.'
              : 'Browse top international institutions recognized by the Custodian of the Two Holy Mosques Scholarship Program.'}
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Main Search Input */}
          <div className="relative w-full md:flex-1">
            <Search className={`w-5 h-5 text-slate-400 absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'ابحث باسم الجامعة، التخصص، أو المدينة (مثال: Harvard, ذكاء اصطناعي, Oxford)...' : 'Search by university name, major, or city (e.g., Harvard, MIT, AI)...'}
              className={`w-full ${isRtl ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'} py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-emerald-500 text-sm`}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">{isRtl ? 'شبكة' : 'Grid'}</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">{isRtl ? 'جدول' : 'List'}</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'map' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">{isRtl ? 'خريطة' : 'Map'}</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          
          {/* Country Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1.5">
              {isRtl ? 'الدولة والوجهة:' : 'Country Destination:'}
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500"
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>
                  {isRtl ? c.labelAr : c.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Track Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1.5">
              {isRtl ? 'مسار الابتعاث:' : 'Scholarship Track:'}
            </label>
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="all">{isRtl ? 'جميع المسارات' : 'All Tracks'}</option>
              {tracks.map(t => (
                <option key={t.id} value={t.id}>
                  {isRtl ? t.nameAr : (t.nameEn || t.nameAr)}
                </option>
              ))}
            </select>
          </div>

          {/* Degree Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1.5">
              {isRtl ? 'الدرجة العلمية:' : 'Degree Level:'}
            </label>
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="all">{isRtl ? 'جميع المراحل' : 'All Degrees'}</option>
              <option value="Bachelor">{isRtl ? 'بكالوريوس (Bachelor)' : 'Bachelor’s'}</option>
              <option value="Master">{isRtl ? 'ماجستير (Master)' : 'Master’s'}</option>
              <option value="PhD">{isRtl ? 'دكتوراه (PhD)' : 'PhD'}</option>
              <option value="Fellowship">{isRtl ? 'زمالة طبية (Fellowship)' : 'Fellowship'}</option>
            </select>
          </div>

          {/* Rank Tier Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1.5">
              {isRtl ? 'نطاق التصنيف العالمي:' : 'QS World Ranking Tier:'}
            </label>
            <select
              value={selectedRankTier}
              onChange={(e) => setSelectedRankTier(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="all">{isRtl ? 'كافة الجامعات المعتمدة' : 'All Ranked Universities'}</option>
              <option value="top30">{isRtl ? 'أفضل 30 جامعة عالمياً (الرواد)' : 'Top 30 Worldwide (Pioneers)'}</option>
              <option value="top100">{isRtl ? 'أفضل 100 جامعة عالمياً' : 'Top 100 Worldwide'}</option>
              <option value="top200">{isRtl ? 'أفضل 200 جامعة عالمياً (إمداد)' : 'Top 200 Worldwide (Supply)'}</option>
            </select>
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>
            {isRtl ? 'تم العثور على ' : 'Found '}
            <strong className="text-emerald-700 font-bold">{filteredUnis.length}</strong>
            {isRtl ? ' جامعة معتمدة مطابقة للبحث' : ' accredited universities'}
          </span>
          {(searchQuery || selectedCountry !== 'all' || selectedTrack !== 'all' || selectedDegree !== 'all' || selectedRankTier !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCountry('all');
                setSelectedTrack('all');
                setSelectedDegree('all');
                setSelectedRankTier('all');
              }}
              className="text-emerald-600 hover:text-emerald-800 font-bold cursor-pointer"
            >
              {isRtl ? 'إعادة تعيين المرشحات' : 'Reset Filters'}
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: GRID CARDS VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnis.map((uni) => (
            <div
              key={uni.id}
              onClick={() => setSelectedUni(uni)}
              className="group bg-white rounded-3xl border border-slate-200 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
            >
              {/* Card Header Banner with Image */}
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img
                  src={uni.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80'}
                  alt={isRtl ? uni.nameAr : uni.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                {/* Badges */}
                <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} flex items-center gap-2`}>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-lg font-mono">
                    #{uni.qsRank} QS
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 left-3 text-white">
                  <span className="text-xs text-emerald-300 font-semibold block">{uni.country}</span>
                  <h3 className="text-lg font-bold truncate">{isRtl ? uni.nameAr : uni.nameEn}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium">{isRtl ? uni.nameEn : uni.nameAr}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{uni.city}</span>
                  </div>

                  {/* Top Majors Chips */}
                  <div className="mt-4">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                      {isRtl ? 'أبرز التخصصات المعتمدة:' : 'Accredited Top Majors:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(isRtl ? uni.topMajorsAr : uni.topMajorsEn).slice(0, 3).map((m, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                          {m}
                        </span>
                      ))}
                      {uni.topMajorsAr.length > 3 && (
                        <span className="px-2 py-1 rounded-lg bg-slate-50 text-slate-500 text-xs">
                          +{uni.topMajorsAr.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Info */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{isRtl ? 'معدل القبول:' : 'Acceptance:'}</span>
                    <span className="font-bold text-slate-700 font-mono">{uni.acceptanceRate || '10%'}</span>
                  </div>
                  <span className="text-emerald-600 font-bold flex items-center gap-1 group-hover:translate-x-[-2px] transition">
                    <span>{isRtl ? 'التفاصيل والشروط' : 'View Details'}</span>
                    {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: LIST / TABLE VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className={`w-full ${isRtl ? 'text-right' : 'text-left'} text-xs sm:text-sm`}>
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="p-4">{isRtl ? 'المرتبة' : 'Rank'}</th>
                  <th className="p-4">{isRtl ? 'اسم الجامعة' : 'University'}</th>
                  <th className="p-4">{isRtl ? 'الدولة والمدينة' : 'Location'}</th>
                  <th className="p-4">{isRtl ? 'المسارات المتوافقة' : 'Eligible Tracks'}</th>
                  <th className="p-4">{isRtl ? 'المراحل المتاحة' : 'Degrees'}</th>
                  <th className="p-4">{isRtl ? 'شرط اللغة (IELTS)' : 'IELTS'}</th>
                  <th className={`p-4 ${isRtl ? 'text-left' : 'text-right'}`}>{isRtl ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredUnis.map((uni) => (
                  <tr 
                    key={uni.id} 
                    onClick={() => setSelectedUni(uni)}
                    className="hover:bg-emerald-50/50 cursor-pointer transition"
                  >
                    <td className="p-4 font-bold text-emerald-700">
                      <span className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center font-mono">
                        #{uni.qsRank}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">{isRtl ? uni.nameAr : uni.nameEn}</span>
                      <span className="text-xs text-slate-500">{isRtl ? uni.nameEn : uni.nameAr}</span>
                    </td>
                    <td className="p-4 text-slate-600">
                      {uni.city} ({uni.country})
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {uni.accreditedTracks.map(tId => {
                          const matchedT = tracks.find(t => t.id === tId);
                          const tName = isRtl 
                            ? (matchedT?.nameAr.replace('مسار ', '') || tId)
                            : (matchedT?.nameEn || tId);
                          return (
                            <span key={tId} className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              {tName}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      {uni.degreesAvailable.join(isRtl ? '، ' : ', ')}
                    </td>
                    <td className="p-4 font-bold text-amber-700 font-mono">
                      {uni.minIelts}
                    </td>
                    <td className={`p-4 ${isRtl ? 'text-left' : 'text-right'}`}>
                      <button className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white font-bold text-xs transition cursor-pointer">
                        {isRtl ? 'عرض التفاصيل' : 'Details'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: INTERACTIVE MAP OVERVIEW */}
      {viewMode === 'map' && (
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              <span>{isRtl ? 'توزيع الجامعات المعتمدة والملحقيات الثقافية حول العالم' : 'Global Distribution of Universities & Saudi Cultural Missions'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isRtl ? 'تنتشر الجامعات المعتمدة في أكثر من 15 دولة وتخضع للإشراف المباشر من الملحقيات الثقافية السعودية.' : 'Accredited institutions span 15+ countries under direct academic and welfare supervision of Saudi Cultural Missions.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {countries.filter(c => c.code !== 'all').map((c) => {
              const countInCountry = UNIVERSITIES_DATABASE.filter(u => u.countryCode === c.code).length;
              return (
                <div
                  key={c.code}
                  onClick={() => {
                    setSelectedCountry(c.code);
                    setViewMode('grid');
                  }}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500 hover:bg-white/10 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.labelAr.split(' ')[0]}</span>
                    <div>
                      <h4 className="font-bold text-sm text-white">
                        {isRtl ? c.labelAr.split(' ').slice(1).join(' ') : c.labelEn.split(' ').slice(1).join(' ')}
                      </h4>
                      <span className="text-xs text-emerald-400 font-semibold font-mono">
                        {countInCountry} {isRtl ? 'جامعة معتمدة' : 'universities'}
                      </span>
                    </div>
                  </div>
                  {isRtl ? <ChevronLeft className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* UNIVERSITY DETAIL MODAL */}
      {selectedUni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className={`bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 ${isRtl ? 'text-right' : 'text-left'}`}>
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shadow-md font-mono">
                  #{selectedUni.qsRank}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{isRtl ? selectedUni.nameAr : selectedUni.nameEn}</h3>
                  <p className="text-xs text-slate-500">{isRtl ? selectedUni.nameEn : selectedUni.nameAr}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUni(null)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 block mb-1">{isRtl ? 'الدولة والمدينة:' : 'Location:'}</span>
                <span className="font-bold text-slate-800">{selectedUni.city}, {selectedUni.country}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">{isRtl ? 'التصنيف العالمي (QS):' : 'QS World Rank:'}</span>
                <span className="font-bold text-emerald-600 font-mono">#{selectedUni.qsRank}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">{isRtl ? 'الحد الأدنى لـ IELTS:' : 'Minimum IELTS:'}</span>
                <span className="font-bold text-amber-600 font-mono">{selectedUni.minIelts}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">{isRtl ? 'نسبة القبول:' : 'Acceptance Rate:'}</span>
                <span className="font-bold text-slate-800 font-mono">{selectedUni.acceptanceRate || '10%'}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2">{isRtl ? 'أبرز التخصصات المعتمدة:' : 'Top Priority Majors:'}</h4>
              <div className="flex flex-wrap gap-2">
                {(isRtl ? selectedUni.topMajorsAr : selectedUni.topMajorsEn).map((m, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2">{isRtl ? 'المسارات المتوافقة في برنامج الابتعاث:' : 'Compatible Scholarship Tracks:'}</h4>
              <div className="flex flex-wrap gap-2">
                {selectedUni.accreditedTracks.map((tId) => {
                  const t = tracks.find(tr => tr.id === tId);
                  const trackName = isRtl ? (t?.nameAr || tId) : (t?.nameEn || tId);
                  return (
                    <span key={tId} className="px-3 py-1.5 rounded-xl bg-slate-900 text-emerald-400 text-xs font-bold">
                      {trackName}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <a
                href={selectedUni.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isRtl ? 'موقع الجامعة الرسمي' : 'Official Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  setSelectedUni(null);
                  if (onSelectUniversityForApplication) {
                    onSelectUniversityForApplication(selectedUni);
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/20 transition flex items-center gap-2 cursor-pointer"
              >
                <span>{isRtl ? 'تقديم طلب ابتعاث لهذه الجامعة' : 'Apply for this University'}</span>
                <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
