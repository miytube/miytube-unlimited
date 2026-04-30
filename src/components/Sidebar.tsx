import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarMainLinks } from './sidebar/SidebarMainLinks';
import { SidebarFooter } from './sidebar/SidebarFooter';
import { SidebarSearch } from './sidebar/SidebarSearch';
import { Separator } from './ui/separator';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

// Comprehensive sidebar components
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
import { AudioMusicVideosLinks } from './sidebar/AudioMusicVideosLinks';
import { GamingHobbiesLinks } from './sidebar/GamingHobbiesLinks';
import { FitnessHealthLinks } from './sidebar/FitnessHealthLinks';
import { ModelsPhotosLinks } from './sidebar/ModelsPhotosLinks';
import { TravelPlacesLinks } from './sidebar/TravelPlacesLinks';
import { HowToEducationLinks } from './sidebar/HowToEducationLinks';
import { PeopleWorkersLinks } from './sidebar/PeopleWorkersLinks';
import { DocumentMediaLinks } from './sidebar/DocumentMediaLinks';
import { EducationInformationLinks } from './sidebar/EducationInformationLinks';
import { LifestyleRelationshipsLinks } from './sidebar/LifestyleRelationshipsLinks';
import { FilmAnimationLinks } from './sidebar/FilmAnimationLinks';
import { SportsExtendedLinks } from './sidebar/SportsExtendedLinks';
import { HollywoodLinks } from './sidebar/HollywoodLinks';
import { RealEstateLinks } from './sidebar/RealEstateLinks';
import { GovernmentPoliticsLinks } from './sidebar/GovernmentPoliticsLinks';
import { HistoryArtifactsLinks } from './sidebar/HistoryArtifactsLinks';
import { KidsEducationLinks } from './sidebar/KidsEducationLinks';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CollapsibleGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleGroup: React.FC<CollapsibleGroupProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between px-2 py-1.5 h-auto text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground"
        >
          {title}
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

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
              <CollapsibleGroup title="Entertainment & Media" defaultOpen={true}>
                <EntertainmentMediaLinks />
                <FilmAnimationLinks />
                <HollywoodLinks />
                <ComedyFunnyLinks />
                <MusicFullLinks />
                <AudioMusicVideosLinks />
                <GamingHobbiesLinks />
                <SportsExtendedLinks />
              </CollapsibleGroup>
              
              <Separator className="my-3" />
              
              {/* Technology & Science */}
              <CollapsibleGroup title="Technology & Science">
                <AITechnologyLinks />
              </CollapsibleGroup>
              
              <Separator className="my-3" />
              
              {/* Education & Information */}
              <CollapsibleGroup title="Education & Learning">
                <EducationInformationLinks />
                <KidsEducationLinks />
                <HowToEducationLinks />
                <DocumentMediaLinks />
                <HistoryArtifactsLinks />
              </CollapsibleGroup>
              
              <Separator className="my-3" />
              
              {/* Business & Finance */}
              <CollapsibleGroup title="Business & Finance">
                <BusinessFinanceLinks />
                <RealEstateLinks />
              </CollapsibleGroup>
              
              <Separator className="my-3" />
              
              {/* Government & Politics */}
              <CollapsibleGroup title="Government & Law">
                <GovernmentPoliticsLinks />
                <CrimeJusticeLinks />
              </CollapsibleGroup>
              
              <Separator className="my-3" />
              
              {/* Lifestyle & People */}
              <CollapsibleGroup title="Lifestyle & People">
                <LifestyleRelationshipsLinks />
                <PeopleWorkersLinks />
                <FitnessHealthLinks />
                <ModelsPhotosLinks />
              </CollapsibleGroup>
              
              <Separator className="my-3" />
              
              {/* Food & Drinks */}
              <CollapsibleGroup title="Food & Drinks">
                <FoodDrinksLinks />
              </CollapsibleGroup>
              
              <Separator className="my-3" />
              
              {/* Animals & Nature */}
              <CollapsibleGroup title="Animals & Nature">
                <AnimalsNatureLinks />
                <EnvironmentWeatherLinks />
              </CollapsibleGroup>
              
              <Separator className="my-3" />
              
              {/* Travel & Transport */}
              <CollapsibleGroup title="Travel & Transport">
                <TravelPlacesLinks />
                <AviationTransportLinks />
              </CollapsibleGroup>
              
              <SidebarFooter />
            </>
          )}
        </div>
      </nav>
    </>
  );
};
