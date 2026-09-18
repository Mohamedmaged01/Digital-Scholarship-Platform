import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface FloatingAiButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const FloatingAiButton: React.FC<FloatingAiButtonProps> = ({ onClick, isOpen }) => {
  const { isRtl } = useLanguage();

  if (isOpen) {
    // When the chat is opened, hide the floating button to keep the view clean and prevent overlapping
    return null;
  }

  return (
    <aside
      aria-label={isRtl ? 'المساعد الذكي للابتعاث' : 'AI Admission Assistant'}
      className={`fixed z-40 ${
        isRtl ? 'bottom-5 left-5 sm:bottom-6 sm:left-6' : 'bottom-5 right-5 sm:bottom-6 sm:right-6'
      }`}
    >
      <button
        onClick={onClick}
        id="floating-ai-admission-assistant-btn"
        className="group relative flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-emerald-950 via-[#005A36] to-emerald-900 text-white shadow-2xl hover:shadow-emerald-900/40 border border-emerald-400/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer"
        title={isRtl ? 'افتح المساعد الذكي للابتعاث' : 'Open AI Admission Assistant'}
      >
        {/* Glow pulse animation */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-500 opacity-30 group-hover:opacity-60 blur-xs transition duration-300"></span>

        {/* Content container */}
        <div className="relative flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0 shadow-inner">
            <Bot className="w-5 h-5 text-emerald-300 group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 border border-emerald-950"></span>
            </span>
          </div>

          <div className={`flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-extrabold tracking-wide text-white">
                {isRtl ? 'المساعد الذكي للابتعاث' : 'AI Admission Assistant'}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </div>
            <span className="text-[10px] text-emerald-200/90 hidden sm:inline-block font-medium">
              {isRtl ? 'مستشارك الأكاديمي المباشر' : 'Instant 24/7 Guidance'}
            </span>
          </div>
        </div>
      </button>
    </aside>
  );
};
