import React from 'react';
import { 
  ProgramMainLogo, 
  Vision2030Logo, 
  HumanCapabilityProgramLogo 
} from './BrandLogos';
import { 
  ShieldCheck, 
  Globe2, 
  Phone, 
  Mail 
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface FooterProps {
  onNavigateTab?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  const { isRtl, t } = useLanguage();

  const handleNav = (tab: string, hash?: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className={`bg-slate-950 text-slate-300 border-t border-slate-800 ${isRtl ? 'text-right' : 'text-left'}`}>
      
      {/* Top Institutional Header Bar with 3 Official Logos */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* 1. Main Program Logo */}
            <div className="flex items-center">
              <ProgramMainLogo variant="white" />
            </div>

            {/* 2 & 3. Human Capability Program + Vision 2030 Logos */}
            <div className="flex items-center gap-6 bg-slate-950/80 border border-slate-800 px-5 py-3 rounded-2xl">
              <HumanCapabilityProgramLogo variant="white" className="h-9" />
              <div className="w-[1px] h-8 bg-slate-800"></div>
              <Vision2030Logo variant="white" className="h-9" />
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: About Program */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.aboutTitle}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.footer.aboutText}
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.footer.govPlatformNote}</span>
            </div>
          </div>

          {/* Col 2: Scholarship Tracks */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.tracksTitle}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#tracks-catalog-section" className="hover:text-emerald-400 transition">{t.footer.trackPioneers}</a></li>
              <li><a href="#tracks-catalog-section" className="hover:text-emerald-400 transition">{t.footer.trackSupply}</a></li>
              <li><a href="#tracks-catalog-section" className="hover:text-emerald-400 transition">{t.footer.trackRd}</a></li>
              <li><a href="#tracks-catalog-section" className="hover:text-emerald-400 transition">{t.footer.trackExcellence}</a></li>
              <li><a href="#tracks-catalog-section" className="hover:text-emerald-400 transition">{t.footer.trackHealth}</a></li>
              <li><a href="#tracks-catalog-section" className="hover:text-emerald-400 transition">{t.footer.trackWaed}</a></li>
            </ul>
          </div>

          {/* Col 3: Digital Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.portalsTitle}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => handleNav('overview', 'journey-section')} className="hover:text-emerald-400 transition cursor-pointer">{t.footer.portalSafeer}</button></li>
              <li><button onClick={() => handleNav('universities')} className="hover:text-emerald-400 transition cursor-pointer">{t.footer.portalUnis}</button></li>
              <li><button onClick={() => handleNav('overview', 'ai-finder-section')} className="hover:text-emerald-400 transition cursor-pointer">{t.footer.portalAi}</button></li>
              <li><button onClick={() => handleNav('help-center')} className="hover:text-emerald-400 transition cursor-pointer">{isRtl ? 'المساعدة' : 'Help'}</button></li>
              <li><button onClick={() => handleNav('faq')} className="hover:text-emerald-400 transition cursor-pointer">{t.footer.portalMissions}</button></li>
            </ul>
          </div>

          {/* Col 4: Support & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.supportTitle}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t.footer.beneficiaryCare}: 19996</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>scholarship@moe.gov.sa</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t.footer.addressKsa}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-slate-900 bg-black/40 py-4">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 text-center ${isRtl ? 'sm:text-right' : 'sm:text-left'}`}>
          <div>
            {t.footer.copyright}
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#faq-section" className="hover:underline">{t.footer.privacy}</a>
            <span>•</span>
            <a href="#faq-section" className="hover:underline">{t.footer.terms}</a>
            <span>•</span>
            <a href="#faq-section" className="hover:underline">{t.footer.accessibility}</a>
          </div>
        </div>
      </div>

    </footer>
  );
};
