import React, { useState } from 'react';
import { 
  INITIAL_APPLICATIONS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_TRACKS, 
  INITIAL_USERS,
  INITIAL_UNIVERSITIES 
} from './data/initialData';
import { Application, Appointment, NotificationItem, Track, User, UserRole, University } from './types';
import { Navbar } from './components/Navbar';
import { HomePageView } from './components/HomePage/HomePageView';
import { UniversityExplorer } from './components/UniversityExplorer';
import { UserGuide } from './components/UserGuide';
import { CulturalMissionsDirectory } from './components/CulturalMissionsDirectory';
import { FaqSection } from './components/FaqSection';
import { AdminDashboard } from './components/AdminPortal/AdminDashboard';
import { AdminLogin } from './components/AdminPortal/AdminLogin';
import { AdminAuthService, AdminAuthUser } from './services/adminAuthService';
import { AIAssistantChatbot } from './components/AIAssistantChatbot';
import { FloatingAiButton } from './components/FloatingAiButton';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { HelpCenter } from './components/HelpCenter';
import { Footer } from './components/Footer';
import { useLanguage } from './i18n/LanguageContext';

export function App() {
  const { language, isRtl, toggleLanguage } = useLanguage();

  // App state
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Default to Ministry Administrator
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [universities] = useState<University[]>(INITIAL_UNIVERSITIES);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Navigation state: 'overview' | 'universities' | 'guide' | 'missions' | 'faq' | 'admin' | 'help-center'
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Authenticated Admin User session
  const [adminUser, setAdminUser] = useState<AdminAuthUser | null>(() => AdminAuthService.getCurrentUser());

  // UI preferences
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Modals state
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);

  // Handlers
  const handleSelectRole = (role: UserRole) => {
    const matchedUser = users.find(u => u.role === role) || users[0];
    setCurrentUser(matchedUser);

    if (role === 'admin' || role === 'donor') {
      setActiveTab('admin');
    } else {
      setActiveTab('overview');
    }
  };

  const handleStartApplication = (_trackId?: string) => {
    window.open('https://kasp.moe.gov.sa', '_blank');
  };

  const handleBookAppointment = (newApt: Appointment) => {
    setAppointments(prev => [newApt, ...prev]);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'تم تأكيد حجز الموعد الاستشاري 📅',
      content: `موعدك مع ${newApt.assignedSupervisorName || 'المستشار الأكاديمي'} مؤكد.`,
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div 
      className={`min-h-screen bg-[#F8FAF9] flex flex-col ${isRtl ? 'font-arabic' : 'font-latin'} text-slate-900 selection:bg-emerald-100 selection:text-emerald-900`} 
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      
      {/* ================= STICKY GOVERNMENT HEADER ================= */}
      <Navbar
        currentUser={currentUser}
        onSelectRole={handleSelectRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        onOpenNafathModal={() => window.open('https://kasp.moe.gov.sa', '_blank')}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onStartApplication={() => handleStartApplication()}
        currentLang={language}
        onToggleLang={toggleLanguage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
        onOpenSearch={() => {
          setActiveTab('universities');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => {
          setActiveTab('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* ================= MAIN CONTENT VIEWPORT ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* ================= VIEW 1: REVAMPED 10-SECTION HOMEPAGE ================= */}
        {activeTab === 'overview' && (
          <HomePageView
            tracks={tracks}
            universities={universities}
            onStartApplication={() => handleStartApplication()}
            onSelectTrackForApplication={(trackId) => handleStartApplication(trackId)}
            onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
            onOpenFullUniversitiesDirectory={() => {
              setActiveTab('universities');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* ================= VIEW 2: UNIVERSITIES & MAJORS EXPLORER ================= */}
        {activeTab === 'universities' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isRtl ? 'دليل الجامعات والتخصصات العالمية' : 'Global Universities & Majors Directory'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isRtl ? 'استكشف الجامعات المصنفة عالمياً والمعتمدة في مسارات الابتعاث' : 'Explore world-ranked institutions and approved scholarship majors'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                {isRtl ? 'العودة للرئيسية' : 'Back to Home'}
              </button>
            </div>
            <UniversityExplorer
              tracks={tracks}
              onSelectUniversityForApplication={(_uni) => {
                window.open('https://kasp.moe.gov.sa', '_blank');
              }}
            />
          </div>
        )}

        {/* ================= VIEW 3: USER GUIDE ================= */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isRtl ? 'دليل المستخدم والأنظمة الموحدة' : 'User Guide & Unified Systems'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isRtl ? 'إرشادات التقديم، الربط مع النفاذ الوطني، وخدمات سفير' : 'Application guidelines, National Single Sign-On (Nafath), and Safeer services'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                {isRtl ? 'العودة للرئيسية' : 'Back to Home'}
              </button>
            </div>
            <UserGuide
              onStartApplication={() => handleStartApplication()}
            />
          </div>
        )}

        {/* ================= VIEW 4: CULTURAL MISSIONS DIRECTORY ================= */}
        {activeTab === 'missions' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isRtl ? 'الملحقيات الثقافية حول العالم' : 'Cultural Missions Worldwide'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isRtl ? 'دليل الملحقيات الثقافية وساعات العمل وأرقام الطوارئ للطلاب' : 'Directory of cultural attachés, operating hours, and emergency student contacts'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                {isRtl ? 'العودة للرئيسية' : 'Back to Home'}
              </button>
            </div>
            <CulturalMissionsDirectory />
          </div>
        )}

        {/* ================= VIEW 5: FAQ VIEW ================= */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isRtl ? 'مركز الأسئلة الشائعة والاستفسارات' : 'Frequently Asked Questions & Inquiries'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isRtl ? 'إجابات تفصيلية عن شروط الابتعاث والضمان المالي والتأشيرة' : 'Detailed answers on scholarship criteria, financial guarantees, and visas'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                {isRtl ? 'العودة للرئيسية' : 'Back to Home'}
              </button>
            </div>
            <FaqSection
              onOpenAiChat={() => setIsAiAssistantOpen(true)}
            />
          </div>
        )}

        {/* ================= VIEW 6: HELP & SUPPORT CENTER ================= */}
        {activeTab === 'help-center' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isRtl ? 'مركز المساعدة والدعم الأكاديمي الموحد' : 'Unified Help & Academic Support Center'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isRtl ? 'دليل المستخدم، الفيديوهات التثقيفية، حجز الاستشارات، وقنوات الدعم الفني' : 'User guide, educational videos, advisor appointments, and technical support'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                {isRtl ? 'العودة للرئيسية' : 'Back to Home'}
              </button>
            </div>
            <HelpCenter
              onStartApplication={() => handleStartApplication()}
              onOpenAiChat={() => setIsAiAssistantOpen(true)}
              currentUser={currentUser}
              onBookAppointment={handleBookAppointment}
            />
          </div>
        )}

        {/* ================= VIEW 6: ADMIN & CONTENT MANAGEMENT PORTAL ================= */}
        {activeTab === 'admin' && (
          adminUser ? (
            <AdminDashboard
              currentUser={currentUser}
              adminUser={adminUser}
              onLogout={() => {
                AdminAuthService.logout();
                setAdminUser(null);
              }}
              tracks={tracks}
              universities={universities}
              onPreviewTrack={(_trackId) => {
                setActiveTab('overview');
              }}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={(loggedInUser) => {
                setAdminUser(loggedInUser);
              }}
              onBackToHome={() => {
                setActiveTab('overview');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )
        )}

      </main>

      {/* ================= OFFICIAL INSTITUTIONAL FOOTER ================= */}
      <Footer onNavigateTab={(tab) => setActiveTab(tab)} />

      {/* ================= AI SCHOLARSHIP CHATBOT ================= */}
      <AIAssistantChatbot
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        tracks={tracks}
        onSelectTrackForApplication={(trackId) => handleStartApplication(trackId)}
      />

      {/* ================= FLOATING AI BUTTON ================= */}
      <FloatingAiButton
        isOpen={isAiAssistantOpen}
        onClick={() => setIsAiAssistantOpen(true)}
      />

      {/* ================= SCROLL TO TOP BUTTON (ON THE RIGHT) ================= */}
      <ScrollToTopButton />

    </div>
  );
}

export default App;
