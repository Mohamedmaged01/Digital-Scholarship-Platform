import React, { useState } from 'react';
import { 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  ShieldAlert, 
  Search, 
  Send, 
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { CulturalMission } from '../types';
import { CULTURAL_MISSIONS_DIRECTORY } from '../data/scholarshipCatalog';
import { useLanguage } from '../i18n/LanguageContext';

export const CulturalMissionsDirectory: React.FC = () => {
  const { isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMission, setSelectedMission] = useState<CulturalMission | null>(null);
  
  // Contact Form State
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [contactSubject, setContactSubject] = useState<string>('');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [isSentSuccess, setIsSentSuccess] = useState<boolean>(false);

  const filteredMissions = CULTURAL_MISSIONS_DIRECTORY.filter(m => {
    const q = searchQuery.toLowerCase();
    return (
      m.countryAr.toLowerCase().includes(q) ||
      m.cityAr.toLowerCase().includes(q) ||
      m.titleAr.toLowerCase().includes(q) ||
      m.titleEn.toLowerCase().includes(q)
    );
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSentSuccess(true);
    setTimeout(() => {
      setIsSentSuccess(false);
      setIsContactModalOpen(false);
      setContactSubject('');
      setContactMessage('');
    }, 2000);
  };

  return (
    <div className={`space-y-8 animate-in fade-in ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-10 border border-slate-800 text-white shadow-xl overflow-hidden">
        <div className={`absolute top-0 ${isRtl ? 'right-0' : 'left-0'} w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none`}></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isRtl ? 'شبكة التمثيل الثقافي والأكاديمي للمملكة حول العالم' : 'Saudi Arabia Global Cultural & Academic Representation Network'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
            {isRtl ? 'دليل الملحقيات الثقافية السعودية' : 'Directory of Saudi Cultural Missions'}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            {isRtl 
              ? 'قنوات التواصل المباشرة، خطوط الطوارئ على مدار 24 ساعة، والعناوين الرسمية للملحقيات الثقافية المشرفة على المبتعثين.'
              : 'Direct communication channels, 24/7 emergency hotlines, and official addresses of Saudi Cultural Missions worldwide.'}
          </p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className={`w-5 h-5 text-slate-400 absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'ابحث باسم الدولة، المدينة، أو الملحقية (مثال: واشنطن، لندن، كندا، ألمانيا)...' : 'Search by country, city, or mission name (e.g., Washington, London, Canada)...'}
            className={`w-full ${isRtl ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'} py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-emerald-500 text-sm`}
          />
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMissions.map((mission) => (
          <div
            key={mission.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                    🏛️
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{isRtl ? mission.titleAr : mission.titleEn}</h3>
                    <p className="text-xs text-slate-500">{isRtl ? mission.titleEn : mission.titleAr}</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  {isRtl ? mission.cityAr : mission.cityEn}
                </span>
              </div>

              {/* Mission Details Info */}
              <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{isRtl ? 'الملحق الثقافي:' : 'Cultural Attaché:'}</span>
                  <span className="font-bold text-slate-900">{isRtl ? mission.attachéNameAr : (mission.attachéNameEn || mission.attachéNameAr)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <a href={`mailto:${mission.email}`} className="text-emerald-700 hover:underline font-semibold font-mono">
                    {mission.email}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                  <span dir="ltr" className="font-mono">{mission.phone}</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    <strong>{isRtl ? 'طوارئ المبتعثين (24/7):' : 'Emergency Hotline (24/7):'}</strong>{' '}
                    <span dir="ltr" className="font-mono font-bold mr-1">{mission.emergencyPhone}</span>
                  </span>
                </div>

                <div className="flex items-start gap-2 text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{isRtl ? mission.workingHoursAr : (mission.workingHoursEn || mission.workingHoursAr)}</span>
                </div>

                <div className="flex items-start gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{isRtl ? mission.addressAr : (mission.addressEn || mission.addressAr)}</span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>
                  {isRtl ? 'المبتعثون النشطون: ' : 'Active Scholars: '}
                  <strong className="text-slate-800 font-bold font-mono">{mission.activeStudentsCount.toLocaleString()}</strong>
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedMission(mission);
                  setIsContactModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isRtl ? 'مراسلة الملحقية' : 'Message Mission'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DIRECT CONTACT MODAL */}
      {isContactModalOpen && selectedMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className={`bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isRtl ? `مراسلة ${selectedMission.titleAr}` : `Inquiry to ${selectedMission.titleEn}`}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isRtl ? 'سيتم توجيه الاستفسار للمشرف الأكاديمي المختص' : 'Inquiry will be directly routed to the assigned academic supervisor'}
                </p>
              </div>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {isSentSuccess ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold">
                  {isRtl ? 'تم إرسال استفسارك بنجاح!' : 'Inquiry Sent Successfully!'}
                </h4>
                <p className="text-xs text-emerald-700">
                  {isRtl ? 'سيتم الرد عليك عبر البريد الإلكتروني والإشعار خلال 24 ساعة عمل.' : 'A response will be sent via email and portal notification within 24 working hours.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isRtl ? 'موضوع الاستفسار:' : 'Subject:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder={isRtl ? 'مثال: استفسار حول إجراءات تجديد الفيزا الدراسية...' : 'e.g., Student visa renewal or tuition fee invoice query...'}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isRtl ? 'تفاصيل الرسالة:' : 'Message Content:'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder={isRtl ? 'اكتب تفاصيل استفسارك الأكاديمي أو الإداري هنا...' : 'Provide details regarding your inquiry...'}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 resize-none ${isRtl ? 'text-right' : 'text-left'}`}
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Send className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    <span>{isRtl ? 'إرسال الاستفسار الآن' : 'Send Inquiry Now'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
