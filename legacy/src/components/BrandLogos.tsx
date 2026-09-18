import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'white';
  showSubtitle?: boolean;
}

// 1. Official Main Logo: The Scholarship Program (برنامج الابتعاث)
export const ProgramMainLogo: React.FC<LogoProps> = ({ 
  className = 'h-12', 
  variant = 'dark',
  showSubtitle = true 
}) => {
  const { isRtl } = useLanguage();
  const isLightText = variant === 'white' || variant === 'light';

  return (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      {/* Official Saudi Palm & Crossed Swords Emblem Badge */}
      <div className="relative shrink-0 flex items-center justify-center">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 shadow-sm border ${
          isLightText 
            ? 'bg-gradient-to-br from-emerald-800 to-emerald-950 border-emerald-600/40 text-amber-300' 
            : 'bg-gradient-to-br from-[#005A36] to-[#004026] border-[#005A36]/30 text-amber-400'
        }`}>
          <svg viewBox="0 0 64 64" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
            {/* Palm Tree */}
            <path d="M32 10C32 10 30 16 28 20C26 24 24 26 21 27C21 27 26 27 28 24C28 24 25 30 22 33C26 31 29 27 30 24C30 28 28 35 24 38C28 36 31 31 32 26C33 31 36 36 40 38C36 35 34 28 34 24C35 27 38 31 42 33C39 30 36 24 36 24C38 27 43 27 43 27C40 26 38 24 36 20C34 16 32 10 32 10Z" fill="currentColor"/>
            <path d="M31 26H33V42H31V26Z" fill="currentColor"/>
            {/* Crossed Curved Swords */}
            <path d="M19 49C25 46 32 42 45 35L44 33C31 40 24 44 18 47L19 49Z" fill="#E2B755"/>
            <path d="M45 49C39 46 32 42 19 35L20 33C33 40 40 44 46 47L45 49Z" fill="#E2B755"/>
            {/* Sword Hilts */}
            <path d="M16 48L19 51L17 53L14 50L16 48Z" fill="#E2B755"/>
            <path d="M48 48L45 51L47 53L50 50L48 48Z" fill="#E2B755"/>
          </svg>
        </div>
        {/* Subtle Sand Gold Ring accent */}
        <div className="absolute -inset-0.5 rounded-2xl border border-amber-400/20 pointer-events-none"></div>
      </div>

      {/* Typography Hierarchy */}
      <div className={`flex flex-col leading-tight ${isRtl ? 'text-right' : 'text-left'}`}>
        <span className={`text-[10px] tracking-wider font-semibold uppercase ${
          isLightText ? 'text-emerald-300' : 'text-[#005A36]'
        }`}>
          {isRtl ? 'المملكة العربية السعودية • وزارة التعليم' : 'Kingdom of Saudi Arabia • Ministry of Education'}
        </span>
        <h1 className={`text-base sm:text-lg font-black tracking-tight ${
          isLightText ? 'text-white' : 'text-slate-900'
        }`}>
          {isRtl ? 'برنامج الابتعاث' : 'The Scholarship Program'}
        </h1>
        {showSubtitle && (
          <span className={`text-[10.5px] font-medium tracking-normal font-sans-en uppercase ${
            isLightText ? 'text-slate-300' : 'text-slate-500'
          }`}>
            {isRtl ? 'SCHOLARSHIP PROGRAM' : 'برنامج الابتعاث'}
          </span>
        )}
      </div>
    </div>
  );
};

// 2. Official Vision 2030 Logo
export const Vision2030Logo: React.FC<LogoProps> = ({ 
  className = 'h-10', 
  variant = 'dark' 
}) => {
  const { isRtl } = useLanguage();
  const isLightText = variant === 'white' || variant === 'light';

  return (
    <div 
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      title={isRtl ? '2030 رؤية المملكة العربية السعودية' : 'Vision 2030 Kingdom of Saudi Arabia'}
      aria-label={isRtl ? '2030 رؤية المملكة العربية السعودية' : 'Vision 2030 Kingdom of Saudi Arabia'}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-1">
          <span className={`text-xl sm:text-2xl font-black tracking-tighter leading-none font-sans-en ${
            isLightText ? 'text-white' : 'text-slate-900'
          }`}>
            20
          </span>
          {/* Distinctive Palm within the zero/circle */}
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#005A36] to-emerald-700 flex items-center justify-center text-amber-300 shadow-xs">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M12 2C12 2 10.5 5 9.5 7C8.5 9 7.5 10 6 10.5C6 10.5 8.5 10.5 9.5 9C9.5 9 8 12 6.5 13.5C8.5 12.5 10 10.5 10.5 9C10.5 11 9.5 14.5 7.5 16C9.5 15 11 12.5 11.5 10C12 12.5 13.5 15 15.5 16C13.5 14.5 12.5 11 12.5 9C13 10.5 14.5 12.5 16.5 13.5C15 12 13.5 9 13.5 9C14.5 10.5 17 10.5 17 10.5C15.5 10 14.5 9 13.5 7C12.5 5 12 2 12 2Z"/>
              <path d="M11.5 10H12.5V18H11.5V10Z"/>
            </svg>
          </div>
          <span className={`text-xl sm:text-2xl font-black tracking-tighter leading-none font-sans-en ${
            isLightText ? 'text-white' : 'text-slate-900'
          }`}>
            30
          </span>
        </div>
        <div className="flex flex-col text-[8.5px] leading-tight font-bold tracking-wide mt-0.5">
          <span className={isLightText ? 'text-emerald-300' : 'text-[#005A36]'}>
            {isRtl ? 'رؤيــــة' : 'VISION'}
          </span>
          <span className={isLightText ? 'text-slate-400' : 'text-slate-500'}>
            {isRtl ? 'المملكة العربية السعودية' : 'KINGDOM OF SAUDI ARABIA'}
          </span>
        </div>
      </div>
    </div>
  );
};

// 3. Official Human Capability Development Program Logo
export const HumanCapabilityProgramLogo: React.FC<LogoProps> = ({ 
  className = 'h-10', 
  variant = 'dark' 
}) => {
  const isLightText = variant === 'white' || variant === 'light';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Icon Emblem */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
        isLightText 
          ? 'bg-slate-800/80 border-slate-700 text-teal-300' 
          : 'bg-emerald-50 border-emerald-200/80 text-[#005A36]'
      }`}>
        <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
          {/* People & Growth Rings Icon */}
          <circle cx="16" cy="9" r="3.5" fill="currentColor" />
          <path d="M8 24C8 19.5817 11.5817 16 16 16C20.4183 16 24 19.5817 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M22 8L27 5M27 5V10M27 5H22" stroke="#E2B755" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="flex flex-col text-right leading-tight">
        <span className={`text-[12px] font-extrabold ${
          isLightText ? 'text-white' : 'text-slate-900'
        }`}>
          برنامج تنمية القدرات البشرية
        </span>
        <span className={`text-[9.5px] font-medium font-sans-en ${
          isLightText ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Human Capability Development Program
        </span>
      </div>
    </div>
  );
};
