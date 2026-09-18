import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  TrendingUp, 
  Award, 
  Search, 
  SlidersHorizontal,
  ArrowRight,
  HelpCircle,
  Building,
  Languages,
  BookOpen,
  Calendar,
  AlertCircle,
  Eye,
  FileText
} from 'lucide-react';
import { Track } from '../types';
import { LandingHero } from './HomePage/LandingHero';
import { QuickServices } from './HomePage/QuickServices';
import { SmartPathWizard } from './HomePage/SmartPathWizard';
import { TrackDetailsModal } from './TrackDetailsModal';

interface TrackCatalogProps {
  tracks: Track[];
  onSelectTrackForApplication: (trackId: string) => void;
  onOpenAiAssistant: () => void;
  onSelectQuickService: (serviceKey: string) => void;
}

export const TrackCatalog: React.FC<TrackCatalogProps> = ({
  tracks,
  onSelectTrackForApplication,
  onOpenAiAssistant,
  onSelectQuickService
}) => {
  const [selectedDegree, setSelectedDegree] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Quick eligibility checker state
  const [testGpa, setTestGpa] = useState<number>(4.8);
  const [testIelts, setTestIelts] = useState<number>(7.5);
  const [testAge, setTestAge] = useState<number>(26);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);

  // Track Details Modal State
  const [selectedTrackForModal, setSelectedTrackForModal] = useState<Track | null>(null);

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = 
      track.nameAr.includes(searchQuery) || 
      track.descriptionAr.includes(searchQuery) ||
      track.targetSectors.some(s => s.includes(searchQuery));
    
    const matchesDegree = 
      selectedDegree === 'all' || 
      track.requiredDegree.includes(selectedDegree);

    return matchesSearch && matchesDegree;
  });

  const checkTrackMatch = (track: Track) => {
    const passedGpa = testGpa >= (track.minGpa - 0.3);
    const passedIelts = testIelts >= track.requiredIelts;
    const passedAge = testAge <= track.maxAge;
    const score = (passedGpa ? 35 : 10) + (passedIelts ? 35 : 10) + (passedAge ? 30 : 0);
    return {
      percentage: score,
      isFullyEligible: score >= 90,
      passedGpa,
      passedIelts,
      passedAge
    };
  };

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'from-emerald-700 via-emerald-800 to-slate-900 border-emerald-400/40 text-emerald-100';
      case 'blue':
        return 'from-blue-700 via-blue-800 to-slate-900 border-blue-400/40 text-blue-100';
      case 'purple':
        return 'from-purple-700 via-purple-800 to-slate-900 border-purple-400/40 text-purple-100';
      case 'amber':
        return 'from-amber-700 via-amber-800 to-slate-900 border-amber-400/40 text-amber-100';
      case 'rose':
        return 'from-rose-700 via-rose-800 to-slate-900 border-rose-400/40 text-rose-100';
      case 'indigo':
        return 'from-indigo-700 via-indigo-800 to-slate-900 border-indigo-400/40 text-indigo-100';
      default:
        return 'from-slate-700 via-slate-800 to-slate-900 border-slate-600 text-slate-100';
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in">
      
      {/* 1. HERO BANNER */}
      <LandingHero
        onStartApplication={() => onSelectTrackForApplication('track-pioneers')}
        onExploreTracks={() => {
          const el = document.getElementById('tracks-catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAiAssistant={onOpenAiAssistant}
      />

      {/* 2. QUICK SERVICES (WHAT DO YOU WANT TO DO TODAY?) */}
      <QuickServices onSelectService={onSelectQuickService} />

      {/* 3. SMART PATH RECOMMENDATION WIZARD */}
      <SmartPathWizard
        onSelectTrack={(trackId) => {
          const t = tracks.find(item => item.id === trackId);
          if (t) setSelectedTrackForModal(t);
        }}
        onStartApplicationWithTrack={onSelectTrackForApplication}
      />

      {/* 4. TRACKS CATALOG SECTION */}
      <div id="tracks-catalog-section" className="space-y-6 scroll-mt-24">
        
        {/* Section Heading & Quick Eligibility Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-black text-slate-900">
                مسارات الابتعاث الستة (برنامج خادم الحرمين الشريفين)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              اختر المسار المناسب لمؤهلك وطموحك للاطلاع على الشروط والجامعات المعتمدة، وبدء التقديم المباشر.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs shadow-sm transition flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>{showCalculator ? 'إخفاء حاسبة الأهلية' : 'حاسبة المطابقة الذكية'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Quick Eligibility Calculator Drawer */}
        {showCalculator && (
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-800">حاسبة المطابقة الذكية للمسارات</h3>
              </div>
              <span className="text-xs text-slate-500">عدّل بياناتك لمعاينة نسبة مطابقتك مع كل مسار فورياً</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المعدل التراكمي (GPA من 5.0): <span className="text-emerald-700 font-mono">{testGpa.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="2.5"
                  max="5.0"
                  step="0.05"
                  value={testGpa}
                  onChange={e => setTestGpa(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>2.50</span>
                  <span>3.75</span>
                  <span>5.00</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  درجة اختبار الآيلتس (IELTS): <span className="text-emerald-700 font-mono">{testIelts.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="5.0"
                  max="9.0"
                  step="0.5"
                  value={testIelts}
                  onChange={e => setTestIelts(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>5.0</span>
                  <span>7.0</span>
                  <span>9.0</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  العمر الحالي: <span className="text-emerald-700 font-mono">{testAge} عاماً</span>
                </label>
                <input
                  type="range"
                  min="18"
                  max="50"
                  step="1"
                  value={testAge}
                  onChange={e => setTestAge(parseInt(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>18</span>
                  <span>35</span>
                  <span>50</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، التخصص أو القطاع..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          </div>

          {/* Degree Filter */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 shrink-0">المرحلة الدراسية:</span>
            {[
              { key: 'all', label: 'جميع المراحل' },
              { key: 'Bachelor', label: 'بكالوريوس' },
              { key: 'Master', label: 'ماجستير' },
              { key: 'PhD', label: 'دكتوراه' }
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setSelectedDegree(item.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                  selectedDegree === item.key
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map(track => {
            const matchResult = checkTrackMatch(track);

            return (
              <div
                key={track.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Header with Distinct Track Gradient */}
                <div className={`p-6 bg-gradient-to-br ${getBadgeColor(track.badgeColor)} border-b text-white`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">
                          {track.nameAr}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">{track.nameEn}</p>
                    </div>

                    <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 text-white font-mono font-bold">
                      {track.code}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-200 leading-relaxed line-clamp-2">
                    {track.descriptionAr}
                  </p>
                </div>

                {/* Card Body with Requirements & Criteria */}
                <div className="p-6 space-y-4 flex-1">
                  
                  {/* Real-time match score badge if calculator is open */}
                  {showCalculator && (
                    <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-bold ${
                      matchResult.isFullyEligible
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-amber-50 border-amber-300 text-amber-900'
                    }`}>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={`w-4 h-4 ${matchResult.isFullyEligible ? 'text-emerald-600' : 'text-amber-600'}`} />
                        <span>نسبة توافق ملفك:</span>
                      </div>
                      <span className="text-sm font-black font-mono">{matchResult.percentage}%</span>
                    </div>
                  )}

                  {/* Criteria Pillars */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <Building className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                      <span className="text-[10px] text-slate-500 block">تصنيف الجامعات</span>
                      <span className="text-xs font-bold text-slate-800">أفضل {track.topUniversitiesRankLimit}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <Award className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                      <span className="text-[10px] text-slate-500 block">المعدل الأدنى</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">{track.minGpa} / 5.0</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <Languages className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                      <span className="text-[10px] text-slate-500 block">الآيلتس الأدنى</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">IELTS {track.requiredIelts}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <Calendar className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                      <span className="text-[10px] text-slate-500 block">المقاعد المتاحة</span>
                      <span className="text-xs font-bold text-slate-800">{track.allocatedSeats.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Target Sectors */}
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-1.5">القطاعات ذات الأولوية:</span>
                    <div className="flex flex-wrap gap-1">
                      {track.targetSectors.slice(0, 3).map((sec, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                        >
                          {sec}
                        </span>
                      ))}
                      {track.targetSectors.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[10px]">
                          +{track.targetSectors.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer CTAs */}
                <div className="p-6 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedTrackForModal(track)}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تفاصيل المسار (8 أقسام)</span>
                    </button>

                    <button
                      onClick={() => onSelectTrackForApplication(track.id)}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <span>تقديم طلب</span>
                      <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 8-Tab Track Details Modal */}
      <TrackDetailsModal
        track={selectedTrackForModal}
        isOpen={!!selectedTrackForModal}
        onClose={() => setSelectedTrackForModal(null)}
        onApply={(trackId) => {
          setSelectedTrackForModal(null);
          onSelectTrackForApplication(trackId);
        }}
      />

    </div>
  );
};
