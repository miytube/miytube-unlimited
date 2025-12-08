
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarMainLinks } from './sidebar/SidebarMainLinks';
import { SidebarFooter } from './sidebar/SidebarFooter';
import { SidebarSearch } from './sidebar/SidebarSearch';
import { Separator } from './ui/separator';

// New comprehensive sidebar components
import { AITechnologyLinks } from './sidebar/AITechnologyLinks';
import { AviationTransportLinks } from './sidebar/AviationTransportLinks';
import { AnimalsNatureLinks } from './sidebar/AnimalsNatureLinks';
import { CrimeJusticeLinks } from './sidebar/CrimeJusticeLinks';
import { BusinessFinanceLinks } from './sidebar/BusinessFinanceLinks';
import { FoodDrinksLinks } from './sidebar/FoodDrinksLinks';
import { EnvironmentWeatherLinks } from './sidebar/EnvironmentWeatherLinks';
import { EntertainmentMediaLinks } from './sidebar/EntertainmentMediaLinks';
import { ComedyFunnyLinks } from './sidebar/ComedyFunnyLinks';
import { MusicFullLinks } from './sidebar/MusicFullLinks';
import { GamingHobbiesLinks } from './sidebar/GamingHobbiesLinks';
import { FitnessHealthLinks } from './sidebar/FitnessHealthLinks';
import { ModelsPhotosLinks } from './sidebar/ModelsPhotosLinks';
import { TravelPlacesLinks } from './sidebar/TravelPlacesLinks';
import { HowToEducationLinks } from './sidebar/HowToEducationLinks';
import { PeopleWorkersLinks } from './sidebar/PeopleWorkersLinks';
import { DocumentMediaLinks } from './sidebar/DocumentMediaLinks';
import { EducationInformationLinks } from './sidebar/EducationInformationLinks';

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
          <SidebarSearch />
          <SidebarMainLinks />
          
          <Separator className="my-3" />
          
          {/* Entertainment & Media */}
          <EntertainmentMediaLinks />
          <ComedyFunnyLinks />
          <MusicFullLinks />
          <GamingHobbiesLinks />
          
          <Separator className="my-3" />
          
          {/* Technology & Science */}
          <AITechnologyLinks />
          
          <Separator className="my-3" />
          
          {/* Education & Information */}
          <EducationInformationLinks />
          <HowToEducationLinks />
          <DocumentMediaLinks />
          
          <Separator className="my-3" />
          
          {/* Business & Finance */}
          <BusinessFinanceLinks />
          
          <Separator className="my-3" />
          
          {/* Lifestyle & People */}
          <PeopleWorkersLinks />
          <FitnessHealthLinks />
          <ModelsPhotosLinks />
          
          <Separator className="my-3" />
          
          {/* Food & Drinks */}
          <FoodDrinksLinks />
          
          <Separator className="my-3" />
          
          {/* Animals & Nature */}
          <AnimalsNatureLinks />
          <EnvironmentWeatherLinks />
          
          <Separator className="my-3" />
          
          {/* Travel & Places */}
          <TravelPlacesLinks />
          <AviationTransportLinks />
          
          <Separator className="my-3" />
          
          {/* Crime & Justice */}
          <CrimeJusticeLinks />
          
          <SidebarFooter />
        </div>
      </nav>
    </>
  );
};
