import React, { useState } from 'react';
import { 
  LifeBuoy, 
  BookOpen, 
  HelpCircle, 
  Video, 
  ListOrdered, 
  Headphones, 
  Phone, 
  Calendar, 
  Sparkles, 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Play, 
  Mail, 
  Globe2, 
  FileText, 
  MessageSquare,
  Clock,
  ShieldCheck,
  Search,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { USER_GUIDE_STEPS, FAQ_DATABASE } from '../data/scholarshipCatalog';
import { Appointment, User } from '../types';

interface HelpCenterProps {
  onStartApplication: () => void;
  onOpenAiChat: () => void;
  currentUser?: User;
  onBookAppointment?: (appointment: Appointment) => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({
  onStartApplication,
  onOpenAiChat,
  currentUser,
  onBookAppointment
}) => {
  const { isRtl } = useLanguage();
  const [activeSection, setActiveSection] = useState<
    'overview' | 'user_guide' | 'faq' | 'videos' | 'application_steps' | 'support' | 'appointment'
  >('overview');

  // Appointment form state
  const [appointmentType, setAppointmentType] = useState<Appointment['type']>('scholarship_contract');
  const [appointmentSubject, setAppointmentSubject] = useState<string>('');
  const [appointmentDesc, setAppointmentDesc] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState<string>('2026-09-15');
  const [appointmentTime, setAppointmentTime] = useState<string>('10:30');
  const [isAppointmentBooked, setIsAppointmentBooked] = useState<boolean>(false);

  // User Guide system tab
  const [guideSystem, setGuideSystem] = useState<'qabool' | 'safeer'>('qabool');
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  // FAQ search in Help Center
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-adm-1');

  // Technical support ticket form
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketCategory, setTicketCategory] = useState<string>('technical');
  const [ticketMessage, setTicketMessage] = useState<string>('');
  const [ticketSent, setTicketSent] = useState<boolean>(false);

  // Video guides mock data
  const educationalVideos = [
    {
      id: 'v1',
      titleAr: 'طريقة التقديم الذكي على برنامج الابتعاث ورفع القبول',
      titleEn: 'How to Smart Apply and Upload Admission Letter',
      duration: '4:25',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
      categoryAr: 'التقديم والقبول',
      categoryEn: 'Admission & Application',
      descriptionAr: 'شرح عملي خطوة بخطوة لكيفية استعراض شروط المسارات والتقديم عبر بوابة الابتعاث الموحدة.',
      descriptionEn: 'Step-by-step walkthrough of exploring track criteria and applying via official scholarship portal.'
    },
    {
      id: 'v2',
      titleAr: 'كيف تختار المسار والجامعة المتوافقة مع أهدافك؟',
      titleEn: 'How to Choose Your Track and University',
      duration: '5:10',
      thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
      categoryAr: 'المسارات والجامعات',
      categoryEn: 'Tracks & Universities',
      descriptionAr: 'جولة شاملة في المسارات الستة (الرواد، إمداد، البحث والتطوير، التميز، الصحي، واعد) وكيفية التحقق من تصنيف الجامعات.',
      descriptionEn: 'Comprehensive overview of the 6 tracks and accredited university rankings.'
    },
    {
      id: 'v3',
      titleAr: 'إصدار الضمان المالي الرقمي والتأشيرة عبر سفير',
      titleEn: 'Digital Financial Guarantee & Visa via Safeer',
      duration: '3:45',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
      categoryAr: 'سفير والضمان المالي',
      categoryEn: 'Safeer & Financial Guarantee',
      descriptionAr: 'شرح طريقة تحميل الضمان المالي المعتمد برمز QR وتقديمه للسفارات والجامعات الأجنبية.',
      descriptionEn: 'Guide on downloading verified QR financial guarantees and embassy visa submissions.'
    },
    {
      id: 'v4',
      titleAr: 'الخدمات الطلابية في بلد الابتعاث ودور الملحقية',
      titleEn: 'Student Services Abroad & Cultural Mission Role',
      duration: '6:15',
      thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80',
      categoryAr: 'الملحقيات وسفير',
      categoryEn: 'Cultural Missions & Safeer',
      descriptionAr: 'كل ما تحتاج معرفته عن أوامر الإركاب السنوية، صرف المخصصات وبدل السكن، والتواصل مع مشرفك الأكاديمي.',
      descriptionEn: 'Everything about flight bookings, monthly living allowances, and academic supervision.'
    }
  ];

  const handleBookAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentSubject) return;

    if (onBookAppointment) {
      const newApt: Appointment = {
        id: `apt-${Date.now()}`,
        userId: currentUser?.id || 'guest',
        userName: currentUser?.fullName || (isRtl ? 'مستفيد المنصة' : 'Platform Visitor'),
        userNationalId: currentUser?.nationalId || 'GUEST',
        type: appointmentType,
        subject: appointmentSubject,
        description: appointmentDesc,
        preferredDate: appointmentDate,
        preferredTime: appointmentTime,
        status: 'confirmed',
        assignedSupervisorId: 'usr-supervisor-01',
        assignedSupervisorName: isRtl ? 'د. فهد بن عبدالله الدوسري (مستشار التوجيه الأكاديمي)' : 'Dr. Fahad Al-Dossari (Senior Academic Advisor)',
        meetingLink: 'https://meet.moe.gov.sa/scholarship-advisory-room',
        location: isRtl ? 'جلسة إرشاد مرئية مشفرة' : 'Encrypted Virtual Video Session',
        createdAt: new Date().toISOString()
      };
      onBookAppointment(newApt);
    }
    setIsAppointmentBooked(true);
  };

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setTicketSent(true);
  };

  return (
    <div className={`space-y-8 animate-in fade-in ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. HERO HEADER */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-[#005A36] to-slate-900 p-6 sm:p-10 border border-emerald-800/40 text-white shadow-2xl overflow-hidden">
        <div className={`absolute top-0 ${isRtl ? 'right-0' : 'left-0'} w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none`}></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-4">
            <LifeBuoy className="w-4 h-4 text-emerald-400" />
            <span>{isRtl ? 'المنظومة الموحدة للدعم والإرشاد الأكاديمي' : 'Unified Academic Support & Guidance Center'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {isRtl ? 'مركز المساعدة والدعم' : 'Help & Support Center'}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            {isRtl 
              ? 'بوابتك الشاملة للإرشاد والتوجيه: دليل المستخدم، الأسئلة الشائعة، الفيديوهات التثقيفية، حجز مواعيد الاستشارة الأكاديمية، والدعم الفني المباشر.'
              : 'Your complete hub for academic orientation: User Guide, FAQs, Educational Videos, Application Steps, Technical Support, and Advisor Appointments.'}
          </p>

          {/* Quick AI Advisor CTA Inside Header */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAiChat}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-slate-950" />
              <span>{isRtl ? 'اسأل المساعد الذكي للابتعاث' : 'Ask AI Admission Assistant'}</span>
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            </button>

            <button
              onClick={() => setActiveSection('appointment')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-emerald-300" />
              <span>{isRtl ? 'حجز موعد استشارة أكاديمية' : 'Book Advisor Appointment'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION SUB-TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        {[
          { id: 'overview', labelAr: 'نظرة عامة', labelEn: 'Overview', icon: <LifeBuoy className="w-4 h-4" /> },
          { id: 'user_guide', labelAr: 'دليل المستخدم', labelEn: 'User Guide', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'faq', labelAr: 'الأسئلة الشائعة', labelEn: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
          { id: 'videos', labelAr: 'الفيديوهات التثقيفية', labelEn: 'Educational Videos', icon: <Video className="w-4 h-4" /> },
          { id: 'application_steps', labelAr: 'خطوات التقديم', labelEn: 'Application Steps', icon: <ListOrdered className="w-4 h-4" /> },
          { id: 'support', labelAr: 'الدعم الفني والتواصل', labelEn: 'Support & Contact', icon: <Headphones className="w-4 h-4" /> },
          { id: 'appointment', labelAr: 'حجز موعد استشاري', labelEn: 'Book Appointment', icon: <Calendar className="w-4 h-4" /> },
        ].map(item => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#005A36] text-white shadow-md shadow-emerald-950/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {item.icon}
              <span>{isRtl ? item.labelAr : item.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* 3. SECTION CONTENT */}

      {/* --- TAB 1: OVERVIEW HUB --- */}
      {activeSection === 'overview' && (
        <div className="space-y-8">
          {/* 6 Core Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Card 1: User Guide */}
            <div 
              onClick={() => setActiveSection('user_guide')}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-200 cursor-pointer group space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#005A36] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005A36] transition-colors">
                  {isRtl ? 'دليل المستخدم والإجراءات' : 'User Guide & Procedures'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isRtl 
                    ? 'شرح مفصل لمنظومتي "قبول" للفرز والتقديم و"سفير" للخدمات الأكاديمية والمالية بعد صدور القرار.'
                    : 'Detailed documentation for Qubool (application & matching) and Safeer (scholar services).'}
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1 text-xs font-bold text-[#005A36]">
                <span>{isRtl ? 'استعراض الدليل' : 'Explore Guide'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Card 2: FAQ */}
            <div 
              onClick={() => setActiveSection('faq')}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-200 cursor-pointer group space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {isRtl ? 'قاعدة الأسئلة الشائعة' : 'Frequently Asked Questions'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isRtl 
                    ? 'إجابات مصنفة على 8 مجالات تشمل القبول، الشروط، الجامعات، والوثائق والخدمات.'
                    : 'Categorized answers across admission, criteria, universities, documents, and safeer services.'}
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1 text-xs font-bold text-blue-600">
                <span>{isRtl ? 'تصفح الأسئلة' : 'Browse FAQ'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Card 3: Educational Videos */}
            <div 
              onClick={() => setActiveSection('videos')}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-200 cursor-pointer group space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  {isRtl ? 'الفيديوهات الإرشادية والتثقيفية' : 'Educational Videos'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isRtl 
                    ? 'مقاطع فيديو مرئية تشرح كيفية التقديم واختيار الجامعات وإصدار الضمان المالي الرقمي.'
                    : 'Visual walk-through videos explaining how to apply, select institutions, and issue guarantees.'}
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1 text-xs font-bold text-purple-600">
                <span>{isRtl ? 'مشاهدة المقاطع' : 'Watch Videos'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Card 4: Application Steps */}
            <div 
              onClick={() => setActiveSection('application_steps')}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-200 cursor-pointer group space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ListOrdered className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  {isRtl ? 'خطوات رحلة التقديم' : 'Application Steps'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isRtl 
                    ? 'خارطة طريق واضحة تبدأ بالنفاذ الوطني وتمر بفحص الذكاء الاصطناعي وحتى تذاكر السفر.'
                    : 'A clear roadmap starting from Nafath SSO to AI verification, financial guarantee, and travel.'}
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1 text-xs font-bold text-amber-600">
                <span>{isRtl ? 'عرض الخطوات' : 'View Steps'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Card 5: Book Appointment */}
            <div 
              onClick={() => setActiveSection('appointment')}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-200 cursor-pointer group space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#005A36] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005A36] transition-colors">
                  {isRtl ? 'حجز موعد استشارة أكاديمية' : 'Book Advisor Appointment'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isRtl 
                    ? 'جلسة استشارية مرئية مباشرة مع مشرف أكاديمي متخصص لمراجعة ملفك واختيار المسار.'
                    : '1-on-1 virtual advisory session with an academic supervisor to review files and select tracks.'}
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1 text-xs font-bold text-[#005A36]">
                <span>{isRtl ? 'احجز جلستك الآن' : 'Book Session'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Card 6: Technical Support & Contact */}
            <div 
              onClick={() => setActiveSection('support')}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-200 cursor-pointer group space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                  {isRtl ? 'الدعم الفني ومركز الاتصال' : 'Technical Support & Contact'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isRtl 
                    ? 'تواصل هاتفي مباشر عبر 19996 أو فتح تذكرة دعم فني إلكترونية لمتابعة أي استفسار تقني.'
                    : 'Direct telephone assistance via 19996 or opening an electronic technical support ticket.'}
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1 text-xs font-bold text-rose-600">
                <span>{isRtl ? 'قنوات التواصل' : 'Contact Channels'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </div>
            </div>

          </div>

          {/* AI Floating Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-[#005A36] to-slate-900 text-white rounded-3xl p-7 border border-emerald-800/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                <Bot className="w-7 h-7 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {isRtl ? 'المساعد الذكي للابتعاث متاح دائماً' : 'AI Admission Assistant is Always Ready'}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
                  {isRtl 
                    ? 'هل تحتاج لإجابة سريعة أو شرح لأحد الشروط؟ المساعد الذكي يجيبك باللغة العربية والإنجليزية على مدار 24 ساعة.'
                    : 'Need quick answers or track explanations? Our AI Advisor is ready 24/7 in Arabic and English.'}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenAiChat}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{isRtl ? 'تحدث مع المساعد الذكي' : 'Talk with AI Assistant'}</span>
            </button>
          </div>
        </div>
      )}

      {/* --- TAB 2: USER GUIDE --- */}
      {activeSection === 'user_guide' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs max-w-md">
            <button
              onClick={() => {
                setGuideSystem('qabool');
                setExpandedStep(1);
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                guideSystem === 'qabool'
                  ? 'bg-[#005A36] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isRtl ? 'منصة قبول (التقديم والفرز)' : 'Qubool (Application)'}</span>
            </button>

            <button
              onClick={() => {
                setGuideSystem('safeer');
                setExpandedStep(1);
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                guideSystem === 'safeer'
                  ? 'bg-[#005A36] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isRtl ? 'منصة سفير (خدمات المبتعثين)' : 'Safeer (Scholar Services)'}</span>
            </button>
          </div>

          {/* Guide Steps */}
          <div className="space-y-4">
            {(guideSystem === 'qabool' ? USER_GUIDE_STEPS.qabool : USER_GUIDE_STEPS.safeer).map(step => {
              const isStepOpen = expandedStep === step.stepNumber;
              return (
                <div 
                  key={step.stepNumber}
                  className={`bg-white rounded-2xl sm:rounded-3xl border transition-all ${
                    isStepOpen ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20' : 'border-slate-200 shadow-2xs'
                  }`}
                >
                  <button
                    onClick={() => setExpandedStep(isStepOpen ? null : step.stepNumber)}
                    className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#005A36] font-bold text-sm flex items-center justify-center shrink-0">
                        {step.stepNumber}
                      </div>
                      <div className={isRtl ? 'text-right' : 'text-left'}>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          {isRtl ? step.titleAr : (step.titleEn || step.titleAr)}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {isRtl ? step.descriptionAr : (step.descriptionEn || step.descriptionAr)}
                        </p>
                      </div>
                    </div>

                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                      isStepOpen ? 'bg-[#005A36] text-white rotate-180' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isStepOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <span className="text-xs font-bold text-slate-700 block mb-2">
                          {isRtl ? 'النقاط الأساسية:' : 'Key Points:'}
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {(isRtl ? step.keyPoints : (step.keyPointsEn || step.keyPoints)).map((pt, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {step.tipsAr && (
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{isRtl ? step.tipsAr : (step.tipsEn || step.tipsAr)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 3: FAQ EMBEDDED --- */}
      {activeSection === 'faq' && (
        <div className="space-y-6">
          <div className="relative max-w-xl">
            <Search className={`w-5 h-5 text-slate-400 absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2`} />
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder={isRtl ? 'ابحث في كافة أسئلة وإجابات الابتعاث...' : 'Search all scholarship FAQ...'}
              className={`w-full ${isRtl ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'} py-3 rounded-2xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#005A36] text-xs sm:text-sm`}
            />
          </div>

          <div className="space-y-3">
            {FAQ_DATABASE
              .filter(f => {
                const q = faqSearch.toLowerCase().trim();
                if (!q) return true;
                return f.questionAr.toLowerCase().includes(q) || f.questionEn.toLowerCase().includes(q) || f.answerAr.toLowerCase().includes(q);
              })
              .map(faq => {
                const isOpen = expandedFaq === faq.id;
                return (
                  <div 
                    key={faq.id}
                    className={`bg-white rounded-2xl border transition-all ${
                      isOpen ? 'border-emerald-400 shadow-2xs bg-emerald-50/20' : 'border-slate-200'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                      className={`w-full p-4 sm:p-5 flex items-center justify-between gap-4 ${isRtl ? 'text-right' : 'text-left'} cursor-pointer`}
                    >
                      <span className={`text-sm font-bold ${isOpen ? 'text-[#005A36]' : 'text-slate-900'}`}>
                        {isRtl ? faq.questionAr : faq.questionEn}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#005A36]' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-emerald-100 whitespace-pre-line">
                        {isRtl ? faq.answerAr : faq.answerEn}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* --- TAB 4: EDUCATIONAL VIDEOS --- */}
      {activeSection === 'videos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {educationalVideos.map(vid => (
              <div key={vid.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all space-y-4 p-4">
                <div className="relative rounded-2xl overflow-hidden aspect-video group">
                  <img 
                    src={vid.thumbnail} 
                    alt={isRtl ? vid.titleAr : vid.titleEn} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-white/90 text-[#005A36] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform cursor-pointer">
                      <Play className={`w-6 h-6 ${isRtl ? 'translate-x-0.5' : '-translate-x-0.5'} fill-current`} />
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/70 text-white text-[10px] font-mono font-bold">
                    {vid.duration}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#005A36] text-[10px] font-bold">
                    {isRtl ? vid.categoryAr : vid.categoryEn}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {isRtl ? vid.titleAr : vid.titleEn}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {isRtl ? vid.descriptionAr : vid.descriptionEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 5: APPLICATION STEPS --- */}
      {activeSection === 'application_steps' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900">
              {isRtl ? 'رحلة التقديم الموحدة خطوة بخطوة' : 'Step-by-Step Unified Application Roadmap'}
            </h3>

            <div className="space-y-4">
              {[
                {
                  step: 1,
                  titleAr: 'الحصول على القبول الجامعي غير المشروط',
                  titleEn: 'Secure Unconditional Admission Offer',
                  descAr: 'التقديم المباشر على إحدى الجامعات المعتمدة ضمن مسارك المختار (مثل أفضل 30 لمسار الرواد أو أفضل 200 لمسار إمداد).'
                },
                {
                  step: 2,
                  titleAr: 'تسجيل الدخول عبر النفاذ الوطني الموحد',
                  titleEn: 'Single Sign-On via Nafath',
                  descAr: 'الدخول للمنصة بدون تسجيل حساب مسبق؛ يتم التحقق الآلي وسحب السجل المدني وبيانات المؤهل السابق من يقين.'
                },
                {
                  step: 3,
                  titleAr: 'رفع المستندات والتحقق بالذكاء الاصطناعي',
                  titleEn: 'Upload Documents & AI Verification',
                  descAr: 'يقوم النظام فوراً بقراءة خطاب القبول، مطابقة تصنيف الجامعة مع المسار، وتأكيد الأهلية خلال دقائق.'
                },
                {
                  step: 4,
                  titleAr: 'المراجعة والاعتماد من لجان الابتعاث',
                  titleEn: 'Review & Committee Approval',
                  descAr: 'تدقيق الأوراق من الملحقية الثقافية ولجنة الابتعاث وإصدار قرار الترشيح النهائي.'
                },
                {
                  step: 5,
                  titleAr: 'إصدار الضمان المالي الرقمي الفوري',
                  titleEn: 'Digital Financial Guarantee Issuance',
                  descAr: 'توليد وثيقة الضمان المالي الرسمية بختم رقمي وكود QR لاستخدامها لدى السفارة لطلب التأشيرة وللجامعة.'
                },
                {
                  step: 6,
                  titleAr: 'إصدار التذاكر وبدء الدراسة عبر سفير',
                  titleEn: 'Flight Booking & Academic Services in Safeer',
                  descAr: 'حجز تذاكر الطيران، صرف مكافأة الإعاشة وبدل السكن، وتعيين المشرف الدراسي المرافق لك في بلد الابتعاث.'
                }
              ].map(st => (
                <div key={st.step} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-9 h-9 rounded-xl bg-[#005A36] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {st.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {isRtl ? st.titleAr : st.titleEn}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {st.descAr}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500">
                {isRtl ? 'جاهز للبدء؟ يمكنك رفع قبولك الآن.' : 'Ready to begin? Upload your offer now.'}
              </span>
              <button
                onClick={onStartApplication}
                className="px-5 py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004328] text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>{isRtl ? 'التقديم الآن' : 'Apply Now'}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 6: TECHNICAL SUPPORT & CONTACT --- */}
      {activeSection === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Direct Support Channels */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                {isRtl ? 'قنوات التواصل المباشرة' : 'Direct Support Channels'}
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Phone className="w-4 h-4 text-[#005A36]" />
                    <span>{isRtl ? 'مركز رعاية المستفيدين (الرقم الموحد):' : 'Beneficiary Care Call Center:'}</span>
                  </div>
                  <p className="text-sm font-mono font-bold text-[#005A36] px-6">19996</p>
                  <p className="text-[11px] text-slate-500 px-6">
                    {isRtl ? 'متاح من الأحد إلى الخميس، 8 ص - 8 م' : 'Sunday - Thursday, 8 AM - 8 PM'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Mail className="w-4 h-4 text-[#005A36]" />
                    <span>{isRtl ? 'البريد الإلكتروني الرسمي:' : 'Official Support Email:'}</span>
                  </div>
                  <p className="text-xs font-mono font-bold text-slate-800 px-6">scholarship@moe.gov.sa</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Bot className="w-4 h-4 text-[#005A36]" />
                    <span>{isRtl ? 'المساعد الذكي للابتعاث:' : 'AI Scholarship Assistant:'}</span>
                  </div>
                  <p className="text-xs text-slate-600 px-6">
                    {isRtl ? 'متاح على مدار الساعة للإجابة الفورية' : 'Available 24/7 for instant answers'}
                  </p>
                  <div className="px-6 pt-1">
                    <button
                      onClick={onOpenAiChat}
                      className="text-xs text-[#005A36] font-bold hover:underline"
                    >
                      {isRtl ? 'فتح المحادثة الذكية ←' : 'Open AI Chat →'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Ticket Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
              <h3 className="text-base font-bold text-slate-900">
                {isRtl ? 'فتح تذكرة دعم فني إلكترونية' : 'Open a Support Ticket'}
              </h3>
              <p className="text-xs text-slate-500">
                {isRtl 
                  ? 'إذا واجهتك مشكلة تقنية في رفع الملفات، تسجيل الدخول عبر النفاذ، أو الاستفسارات الخاصة بالقبول.'
                  : 'Submit a technical inquiry or issue regarding documents, login, or admissions.'}
              </p>

              {ticketSent ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2 text-center">
                  <CheckCircle2 className="w-8 h-8 text-[#005A36] mx-auto" />
                  <h4 className="text-sm font-bold">
                    {isRtl ? 'تم استلام تذكرتك بنجاح!' : 'Support ticket submitted successfully!'}
                  </h4>
                  <p className="text-xs">
                    {isRtl 
                      ? 'رقم التذكرة: #TK-' + Math.floor(100000 + Math.random() * 900000) + ' - سيتم الرد عليك خلال 24 ساعة عبر البريد المسجل.'
                      : 'Ticket #TK-' + Math.floor(100000 + Math.random() * 900000) + ' - You will receive a response within 24 hours.'}
                  </p>
                  <button
                    onClick={() => setTicketSent(false)}
                    className="mt-3 px-4 py-2 rounded-xl bg-[#005A36] text-white text-xs font-bold cursor-pointer"
                  >
                    {isRtl ? 'إرسال تذكرة أخرى' : 'Send Another Ticket'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendTicket} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        {isRtl ? 'تصنيف المشكلة' : 'Issue Category'}
                      </label>
                      <select
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value)}
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-hidden focus:border-[#005A36]"
                      >
                        <option value="technical">{isRtl ? 'مشكلة تقنية في الموقع' : 'Website technical issue'}</option>
                        <option value="nafath">{isRtl ? 'تسجيل الدخول بالنفاذ' : 'Nafath login'}</option>
                        <option value="documents">{isRtl ? 'رفع المستندات وفحص الـ AI' : 'Document upload & AI check'}</option>
                        <option value="admission">{isRtl ? 'استفسار عن القبول والمسارات' : 'Track and admission inquiry'}</option>
                        <option value="financial">{isRtl ? 'الضمان المالي والمخصصات' : 'Financial guarantee'}</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        {isRtl ? 'عنوان التذكرة' : 'Ticket Subject'}
                      </label>
                      <input
                        type="text"
                        required
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        placeholder={isRtl ? 'مثال: تعذر رفع السجل الأكاديمي' : 'e.g., Unable to upload transcripts'}
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-hidden focus:border-[#005A36]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {isRtl ? 'تفاصيل الاستفسار أو المشكلة' : 'Description'}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder={isRtl ? 'يرجى كتابة التفاصيل وأي رسائل خطأ ظهرت لك...' : 'Please describe details and any error messages...'}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-hidden focus:border-[#005A36]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004328] text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-md"
                  >
                    {isRtl ? 'إرسال التذكرة' : 'Submit Ticket'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 7: APPOINTMENT BOOKING --- */}
      {activeSection === 'appointment' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#005A36] flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {isRtl ? 'حجز موعد استشارة أكاديمية مرئية' : 'Book a Virtual Academic Advisory Session'}
              </h3>
              <p className="text-xs text-slate-500">
                {isRtl 
                  ? 'جلسة استشارية مباشرة (30 دقيقة) عبر الاتصال المرئي مع مستشاري الابتعاث والملحقيات.'
                  : 'Direct 30-minute encrypted video session with our scholarship and attaché counselors.'}
              </p>
            </div>
          </div>

          {isAppointmentBooked ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-3 text-center">
              <CheckCircle2 className="w-10 h-10 text-[#005A36] mx-auto" />
              <h4 className="text-base font-bold">
                {isRtl ? 'تم تأكيد حجز موعدك الاستشاري بنجاح!' : 'Your advisory session is successfully booked!'}
              </h4>
              <div className="bg-white p-4 rounded-xl border border-emerald-200 text-xs space-y-1.5 text-slate-700 text-right">
                <p><strong>{isRtl ? 'الموضوع:' : 'Subject:'}</strong> {appointmentSubject}</p>
                <p><strong>{isRtl ? 'التاريخ والوقت:' : 'Date & Time:'}</strong> {appointmentDate} - {appointmentTime}</p>
                <p><strong>{isRtl ? 'المستشار:' : 'Advisor:'}</strong> د. فهد بن عبدالله الدوسري (الملحقية الثقافية)</p>
                <p><strong>{isRtl ? 'رابط الاتصال:' : 'Meeting link:'}</strong> https://meet.moe.gov.sa/advisory-room</p>
              </div>
              <button
                onClick={() => {
                  setIsAppointmentBooked(false);
                  setAppointmentSubject('');
                  setAppointmentDesc('');
                }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#005A36] text-white text-xs font-bold cursor-pointer"
              >
                {isRtl ? 'حجز موعد آخر' : 'Book Another Session'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookAppointmentSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {isRtl ? 'نوع الجلسة الاستشارية' : 'Consultation Type'}
                </label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value as any)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-hidden focus:border-[#005A36]"
                >
                  <option value="scholarship_contract">{isRtl ? 'مطابقة المسارات وشروط القبول الجامعي' : 'Track matching & admission criteria'}</option>
                  <option value="cultural_mission_interview">{isRtl ? 'استفسارات الملحقية الثقافية والتأشيرة' : 'Cultural mission & visa inquiries'}</option>
                  <option value="academic_supervision">{isRtl ? 'المتابعة الأكاديمية والضمان المالي' : 'Academic supervision & financial guarantee'}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {isRtl ? 'موضوع الاستشارة الأكاديمية' : 'Consultation Subject'}
                </label>
                <input
                  type="text"
                  required
                  value={appointmentSubject}
                  onChange={(e) => setAppointmentSubject(e.target.value)}
                  placeholder={isRtl ? 'مثال: استفسار حول مطابقة تخصص الذكاء الاصطناعي مع مسار إمداد' : 'e.g., Checking AI major eligibility for Supply track'}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-hidden focus:border-[#005A36]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {isRtl ? 'التاريخ المفضل' : 'Preferred Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-hidden focus:border-[#005A36]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {isRtl ? 'الوقت المفضل' : 'Preferred Time'}
                  </label>
                  <input
                    type="time"
                    required
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-hidden focus:border-[#005A36]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {isRtl ? 'ملاحظات إضافية أو أسئلة محددة للمستشار' : 'Notes / Questions for Advisor'}
                </label>
                <textarea
                  rows={3}
                  value={appointmentDesc}
                  onChange={(e) => setAppointmentDesc(e.target.value)}
                  placeholder={isRtl ? 'أي تفاصيل تساعد المستشار في تحضير ملفك مسبقاً...' : 'Any details to help the advisor prepare...'}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-hidden focus:border-[#005A36]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#005A36] hover:bg-[#004328] text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-md"
              >
                {isRtl ? 'تأكيد حجز الموعد الاستشاري' : 'Confirm Advisory Appointment'}
              </button>
            </form>
          )}
        </div>
      )}

    </div>
  );
};
