import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Globe2, 
  Menu, 
  X,
  Bot,
  Lock
} from 'lucide-react';
import { ProgramMainLogo } from './BrandLogos';
import { useLanguage } from '../i18n/LanguageContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onStartApplication: () => void;
  onOpenSearch?: () => void;
  onOpenAiAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onStartApplication,
  onOpenSearch,
  onOpenAiAssistant
}) => {
  const { isRtl, toggleLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (activeTab !== 'overview') {
      setActiveTab('overview');
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5' 
        : 'bg-white border-b border-slate-100 py-3.5'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 lg:gap-3 xl:gap-4 flex-nowrap">
          
          {/* ================= START: OFFICIAL PROGRAM LOGO ================= */}
          <div 
            className="flex items-center cursor-pointer shrink-0" 
            onClick={() => {
              setActiveTab('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <ProgramMainLogo className={isScrolled ? 'scale-95 transition-transform' : ''} />
          </div>

          {/* ================= CENTER: MAIN PUBLIC NAVIGATION MENU ================= */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 flex-nowrap shrink-0 whitespace-nowrap">
            <button
              onClick={() => {
                setActiveTab('overview');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-[#005A36] bg-[#005A36]/8 font-extrabold'
                  : 'text-slate-700 hover:text-[#005A36] hover:bg-slate-50'
              }`}
            >
              {isRtl ? 'الرئيسية' : 'Home'}
            </button>

            <button
              onClick={() => scrollToSection('strategy-section')}
              className="px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap shrink-0 text-slate-700 hover:text-[#005A36] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {isRtl ? 'نبذة عن البرنامج' : 'About Program'}
            </button>

            <button
              onClick={() => scrollToSection('tracks-catalog-section')}
              className="px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap shrink-0 text-slate-700 hover:text-[#005A36] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {isRtl ? 'مسارات الابتعاث' : 'Scholarship Tracks'}
            </button>

            <button
              onClick={() => scrollToSection('universities-section')}
              className="px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap shrink-0 text-slate-700 hover:text-[#005A36] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {isRtl ? 'الجامعات والتخصصات' : 'Universities & Majors'}
            </button>

            <button
              onClick={() => scrollToSection('journey-section')}
              className="px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap shrink-0 text-slate-700 hover:text-[#005A36] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {isRtl ? 'دليل ومحطات الابتعاث' : 'Scholarship Guide'}
            </button>

            <button
              onClick={() => {
                setActiveTab('cultural-missions');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'cultural-missions'
                  ? 'text-[#005A36] bg-[#005A36]/8 font-extrabold'
                  : 'text-slate-700 hover:text-[#005A36] hover:bg-slate-50'
              }`}
            >
              {isRtl ? 'الملحقيات الثقافية' : 'Cultural Missions'}
            </button>

            <button
              onClick={() => scrollToSection('faq-section')}
              className="px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap shrink-0 text-slate-700 hover:text-[#005A36] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {isRtl ? 'الأسئلة الشائعة' : 'FAQ'}
            </button>
          </nav>

          {/* ================= END: PUBLIC ACTIONS & OFFICIAL CTA ================= */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 flex-nowrap">
            
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch || (() => scrollToSection('universities-section'))}
              title={isRtl ? 'بحث في المسارات والجامعات' : 'Search tracks & universities'}
              aria-label="Search"
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-[#005A36] hover:bg-slate-100 border border-slate-200/80 transition cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* AI Advisor Button (Icon Only) */}
            <button
              onClick={onOpenAiAssistant}
              title={isRtl ? 'المستشار الذكي للابتعاث' : 'AI Scholarship Advisor'}
              aria-label={isRtl ? 'المستشار الذكي للابتعاث' : 'AI Scholarship Advisor'}
              className="p-2 sm:p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition cursor-pointer flex items-center justify-center"
            >
              <Bot className="w-4 h-4 text-purple-600" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title={isRtl ? 'Switch to English' : 'التحويل للغة العربية'}
              aria-label="Toggle language"
              className="px-2.5 py-2 rounded-xl text-slate-700 hover:text-[#005A36] hover:bg-slate-100 border border-slate-200/80 transition flex items-center gap-1.5 cursor-pointer text-xs font-bold"
            >
              <Globe2 className="w-4 h-4 text-[#005A36]" />
              <span className="font-semibold">{isRtl ? 'EN' : 'عربي'}</span>
            </button>

            {/* Admin Control Panel Link with Lock Icon (Icon Only) */}
            <button
              onClick={() => {
                setActiveTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title={isRtl ? 'الدخول إلى لوحة التحكم' : 'Open Control Panel'}
              aria-label={isRtl ? 'الدخول إلى لوحة التحكم' : 'Control Panel'}
              className={`p-2 sm:p-2.5 rounded-xl border transition flex items-center justify-center cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#005A36] text-white border-[#005A36] shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:text-[#005A36] hover:bg-emerald-50/70 border-slate-200/90'
              }`}
            >
              <Lock className={`w-4 h-4 ${activeTab === 'admin' ? 'text-white' : 'text-[#005A36]'}`} />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-100 space-y-2 pb-3 animate-in fade-in slide-in-from-top-2">
            <button
              onClick={() => {
                setActiveTab('overview');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {isRtl ? 'الرئيسية' : 'Home'}
            </button>

            <button
              onClick={() => scrollToSection('strategy-section')}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {isRtl ? 'نبذة عن البرنامج' : 'About Program'}
            </button>

            <button
              onClick={() => scrollToSection('tracks-catalog-section')}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {isRtl ? 'مسارات الابتعاث' : 'Scholarship Tracks'}
            </button>

            <button
              onClick={() => scrollToSection('universities-section')}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {isRtl ? 'الجامعات والتخصصات' : 'Universities & Majors'}
            </button>

            <button
              onClick={() => scrollToSection('journey-section')}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {isRtl ? 'دليل ومحطات الابتعاث' : 'Scholarship Guide'}
            </button>

            <button
              onClick={() => {
                setActiveTab('cultural-missions');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {isRtl ? 'الملحقيات الثقافية' : 'Cultural Missions'}
            </button>

            <button
              onClick={() => scrollToSection('faq-section')}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {isRtl ? 'الأسئلة الشائعة' : 'FAQ'}
            </button>

            {/* Mobile AI Advisor Button */}
            <button
              onClick={() => {
                if (onOpenAiAssistant) onOpenAiAssistant();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-50 text-purple-900 font-bold text-xs flex items-center justify-center gap-2 border border-purple-200"
            >
              <Bot className="w-4 h-4 text-purple-600" />
              <span>{isRtl ? 'المستشار الذكي للابتعاث' : 'AI Scholarship Advisor'}</span>
            </button>

            {/* Mobile Control Panel Link with Lock Icon */}
            <button
              onClick={() => {
                setActiveTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#005A36] text-white border-[#005A36]'
                  : 'bg-slate-100 hover:bg-emerald-50 text-slate-800 border-slate-200'
              }`}
            >
              <Lock className="w-4 h-4 text-[#005A36]" />
              <span>{isRtl ? 'الدخول إلى لوحة التحكم' : 'Open Control Panel'}</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
