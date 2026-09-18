import React, { useState } from 'react';
import { Track, University } from '../../types';
import { LandingHero } from './LandingHero';
import { HeroInfoStrip } from './HeroInfoStrip';
import { QuickServices } from './QuickServices';
import { ScholarshipTracksSection } from './ScholarshipTracksSection';
import { ScholarshipJourneySection } from './ScholarshipJourneySection';
import { ProgramStrategySection } from './ProgramStrategySection';
import { AiTrackFinderSection } from './AiTrackFinderSection';
import { UniversitiesShowcaseSection } from './UniversitiesShowcaseSection';
import { NewsAndAnnouncementsSection } from './NewsAndAnnouncementsSection';
import { FaqHomeSection } from './FaqHomeSection';
import { FinalCtaSection } from './FinalCtaSection';
import { TrackDetailsModal } from '../TrackDetailsModal';

interface HomePageViewProps {
  tracks: Track[];
  universities: University[];
  onStartApplication: () => void;
  onSelectTrackForApplication: (trackId: string) => void;
  onOpenAiAssistant: () => void;
  onOpenFullUniversitiesDirectory: () => void;
}

export const HomePageView: React.FC<HomePageViewProps> = ({
  tracks,
  universities,
  onStartApplication,
  onSelectTrackForApplication,
  onOpenAiAssistant,
  onOpenFullUniversitiesDirectory
}) => {
  const [selectedTrackForModal, setSelectedTrackForModal] = useState<Track | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickService = (serviceKey: string) => {
    switch (serviceKey) {
      case 'tracks_catalog':
        scrollToSection('tracks-catalog-section');
        break;
      case 'eligibility_check':
        scrollToSection('journey-section');
        break;
      case 'universities':
        scrollToSection('universities-section');
        break;
      case 'apply':
        onStartApplication();
        break;
      case 'faq':
        scrollToSection('faq-section');
        break;
      case 'news':
        scrollToSection('news-section');
        break;
      case 'ai_assistant':
        onOpenAiAssistant();
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20">
      
      {/* 1. HERO SECTION */}
      <LandingHero
        onStartApplication={onStartApplication}
        onExploreTracks={() => scrollToSection('tracks-catalog-section')}
        onOpenAiAssistant={onOpenAiAssistant}
        onOpenAiFinder={() => scrollToSection('ai-finder-section')}
      />

      {/* 2. HERO INFORMATION STRIP */}
      <HeroInfoStrip
        onExploreTracks={() => scrollToSection('tracks-catalog-section')}
        onExploreUniversities={() => scrollToSection('universities-section')}
      />

      {/* 3. QUICK SERVICES ("ابدأ من هنا") */}
      <QuickServices onSelectService={handleQuickService} />

      {/* 4. SCHOLARSHIP TRACKS (6 Cards with realistic photos & sequence numbers) */}
      <ScholarshipTracksSection
        tracks={tracks}
        onSelectTrackForApplication={onSelectTrackForApplication}
        onOpenTrackDetails={(track) => setSelectedTrackForModal(track)}
      />

      {/* 5. SCHOLARSHIP JOURNEY TIMELINE (8 Steps) */}
      <ScholarshipJourneySection />

      {/* 6. PROGRAM STRATEGY & VISION 2030 (Infographic visual flow) */}
      <ProgramStrategySection />

      {/* 7. SMART AI TRACK FINDER WIZARD */}
      <AiTrackFinderSection
        tracks={tracks}
        onSelectTrackForApplication={onSelectTrackForApplication}
      />

      {/* 8. UNIVERSITIES & MAJORS SHOWCASE */}
      <UniversitiesShowcaseSection
        universities={universities}
        onOpenFullDirectory={onOpenFullUniversitiesDirectory}
      />

      {/* 9. OFFICIAL NEWS & ANNOUNCEMENTS (مع إمكانية رفع الأخبار) */}
      <NewsAndAnnouncementsSection />

      {/* 10. FAQ ACCORDION SECTION */}
      <FaqHomeSection onOpenAiChat={onOpenAiAssistant} />

      {/* 11. FINAL CTA BANNER */}
      <FinalCtaSection
        onStartApplication={onStartApplication}
        onExploreTracks={() => scrollToSection('tracks-catalog-section')}
      />

      {/* Track Details Modal */}
      <TrackDetailsModal
        track={selectedTrackForModal}
        isOpen={!!selectedTrackForModal}
        onClose={() => setSelectedTrackForModal(null)}
        onApplyTrack={onSelectTrackForApplication}
      />

    </div>
  );
};
