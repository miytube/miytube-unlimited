import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarMainLinks } from './sidebar/SidebarMainLinks';
import { SidebarFooter } from './sidebar/SidebarFooter';
import { SidebarSearch } from './sidebar/SidebarSearch';
import { Separator } from './ui/separator';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      onClose();
    }
  }, [location.pathname, isMobile, isOpen, onClose]);

  // Don't collapse on mobile
  const effectiveCollapsed = isMobile ? false : isCollapsed;

  const sidebarWidth = effectiveCollapsed ? 'w-16' : 'w-60';
  
  const sidebarClasses = `fixed inset-y-0 left-0 z-40 ${sidebarWidth} bg-sidebar bg-background transition-all duration-300 ease-in-out border-r overflow-y-auto ${
    isOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'
  }`;

  const overlayClasses = `fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${
    isOpen && isMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`;

  const toggleCollapse = () => setIsCollapsed(prev => !prev);

  return (
    <>
      <div className={overlayClasses} onClick={onClose} />
      <nav className={sidebarClasses}>
        <div className={`p-4 ${effectiveCollapsed ? 'px-2' : ''}`}>
          {/* Collapse Toggle Button */}
          {!isMobile && (
            <div className={`flex ${effectiveCollapsed ? 'justify-center' : 'justify-end'} mb-2`}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleCollapse}
                      className="h-8 w-8"
                    >
                      {effectiveCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                      ) : (
                        <ChevronLeft className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          
          {!effectiveCollapsed && <SidebarSearch />}
          <SidebarMainLinks collapsed={effectiveCollapsed} />
          
          {!effectiveCollapsed && (
            <>
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
            </>
          )}
        </div>
      </nav>
    </>
  );
};
