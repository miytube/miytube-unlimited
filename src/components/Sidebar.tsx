
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarMainLinks } from './sidebar/SidebarMainLinks';
import { VideoEntertainmentLinks } from './sidebar/VideoEntertainmentLinks';
import { EducationInformationLinks } from './sidebar/EducationInformationLinks';
import { MusicAudioLinks } from './sidebar/MusicAudioLinks';
import { PeopleSocietyLinks } from './sidebar/PeopleSocietyLinks';
import { PlacesLocationsLinks } from './sidebar/PlacesLocationsLinks';
import { EnvironmentWeatherLinks } from './sidebar/EnvironmentWeatherLinks';
import { TransportVehiclesLinks } from './sidebar/TransportVehiclesLinks';
import { LawJusticeLinks } from './sidebar/LawJusticeLinks';
import { DocumentMediaLinks } from './sidebar/DocumentMediaLinks';
import { HollywoodLinks } from './sidebar/HollywoodLinks';
import { FilmAnimationLinks } from './sidebar/FilmAnimationLinks';
import { RealEstateLinks } from './sidebar/RealEstateLinks';
import { SidebarFooter } from './sidebar/SidebarFooter';
import { CollapsibleSidebarSection } from './sidebar/CollapsibleSidebarSection';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      onClose();
    }
  }, [location.pathname, isMobile, isOpen, onClose]);

  const sidebarClasses = `fixed inset-y-0 left-0 z-40 w-60 bg-sidebar bg-background transition-transform duration-300 ease-in-out border-r overflow-y-auto ${
    isOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'
  }`;

  const overlayClasses = `fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${
    isOpen && isMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`;

  return (
    <>
      <div className={overlayClasses} onClick={onClose} />
      <nav className={sidebarClasses}>
        <div className="p-4">
          <SidebarMainLinks />
          
          <CollapsibleSidebarSection title="Entertainment & Media">
            <VideoEntertainmentLinks />
            <MusicAudioLinks />
            <FilmAnimationLinks />
            <HollywoodLinks />
          </CollapsibleSidebarSection>
          
          <CollapsibleSidebarSection title="Education & Information">
            <EducationInformationLinks />
            <DocumentMediaLinks />
            <LawJusticeLinks />
          </CollapsibleSidebarSection>
          
          <CollapsibleSidebarSection title="Lifestyle & Places">
            <PeopleSocietyLinks />
            <PlacesLocationsLinks />
            <RealEstateLinks />
            <EnvironmentWeatherLinks />
            <TransportVehiclesLinks />
          </CollapsibleSidebarSection>
          
          <SidebarFooter />
        </div>
      </nav>
    </>
  );
};
