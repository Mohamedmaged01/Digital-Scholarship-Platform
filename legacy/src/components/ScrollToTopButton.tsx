import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const ScrollToTopButton: React.FC = () => {
  const { isRtl } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button once the user scrolls down at least 250px
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div
      className={`fixed z-40 right-5 sm:right-7 bottom-6 sm:bottom-7 transition-all duration-300 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-hidden={!isVisible}
    >
      <button
        onClick={scrollToTop}
        id="scroll-to-top-btn"
        aria-label={isRtl ? 'الصعود لأعلى الصفحة' : 'Scroll to top of page'}
        title={isRtl ? 'الصعود لأعلى الصفحة' : 'Scroll to top'}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#005A36] text-white shadow-xl shadow-[#005A36]/30 border border-emerald-400/40 hover:bg-[#004328] hover:border-emerald-300 hover:shadow-2xl hover:shadow-[#005A36]/50 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        {/* Subtle hover background ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/20 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>

        {/* Up arrow icon */}
        <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:-translate-y-0.5 transition-transform duration-200" />
      </button>
    </div>
  );
};
