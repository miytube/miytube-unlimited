
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Compass, Film, Music, Gamepad2, Newspaper, Trophy, Video, Upload,
  BookOpen, Moon, GraduationCap, Leaf, Smile, Globe, Cloud, Waves, Zap, TrendingUp,
  UserCircle, Car, Scissors, Heart, Users, Dog, Microscope, Plane, Pizza, Utensils,
  Quote, Clapperboard, Star, CloudLightning, Gavel, Fish, Ship, HeartHandshake, 
  Building, House, Anchor, UserRound, Truck, Theater, Camera, History, Frog, Bug,
  Bird, Crab, Fish as FishIcon, Whale, Skull, Mouse, Octagon, Mountain, Bible, Landmark,
  Clock
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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

  const mainLinks = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'explore', icon: Compass, label: 'Explore', path: '/' },
    { id: 'trending', icon: TrendingUp, label: 'Trending', path: '/trending' },
    { id: 'shorts', icon: Film, label: 'Shorts', path: '/shorts' },
    { id: 'upload', icon: Upload, label: 'Universal Upload', path: '/upload' },
    { id: 'channel', icon: UserCircle, label: 'Your Channel', path: '/channel' },
  ];
  
  const videoAndEntertainmentLinks = [
    { id: 'videos', icon: Video, label: 'Videos', path: '/videos' },
    { id: 'film-animation', icon: Clapperboard, label: 'Film & Animation', path: '/film-animation', 
      subItems: [
        { id: 'animation-military', label: 'Military Animation', path: '/film-animation/military' },
        { id: 'animation-classics', label: 'Classic Animation', path: '/film-animation/classics' },
        { id: 'animation-bloopers', label: 'Bloopers & Mistakes', path: '/film-animation/bloopers' }
      ]
    },
    { id: 'entertainment', icon: Film, label: 'Entertainment', path: '/entertainment',
      subItems: [
        { id: 'entertainment-acting', label: 'Acting (Unscripted)', path: '/entertainment/acting' },
        { id: 'entertainment-bios', label: 'Actor & Actress Bios', path: '/entertainment/actors-actress' },
        { id: 'entertainment-info', label: 'Actor & Actress Info', path: '/entertainment/actors-info' },
        { id: 'entertainment-auditions', label: 'Auditions & Contests', path: '/entertainment/auditions' }
      ]
    },
    { id: 'comedy', icon: Smile, label: 'Comedy', path: '/comedy' },
    { id: 'gaming', icon: Gamepad2, label: 'Gaming', path: '/gaming' },
    { id: 'sports', icon: Trophy, label: 'Sports', path: '/sports' },
  ];
  
  const educationAndInformationLinks = [
    { id: 'education', icon: GraduationCap, label: 'Education', path: '/education',
      subItems: [
        { id: 'american-history', label: 'American History', path: '/education/american-history' },
        { id: 'biblical-history', label: 'Biblical History', path: '/education/biblical-history' },
        { id: 'bible-quotes', label: 'Bible Quotes', path: '/education/bible-quotes' }
      ]
    },
    { id: 'how-to-style', icon: Scissors, label: 'How-to & Style', path: '/how-to-style' },
    { id: 'science-tech', icon: Microscope, label: 'Science & Technology', path: '/science-tech',
      subItems: [
        { id: 'artifacts', label: 'Artifacts & Antiques', path: '/science-tech/artifacts' },
        { id: 'ai', label: 'Artificial Intelligence', path: '/science-tech/ai' },
        { id: 'humanoid-robots', label: 'Humanoid Robots', path: '/science-tech/humanoid-robots' },
        { id: 'robots', label: 'Robots', path: '/science-tech/robots' }
      ]
    },
    { id: 'news-politics', icon: Newspaper, label: 'News & Politics', path: '/news' },
  ];
  
  const musicAndAudioLinks = [
    { id: 'music', icon: Music, label: 'Music', path: '/music' },
    { id: 'podcasts', icon: Music, label: 'Podcasts', path: '/podcasts' },
    { id: 'audiobooks', icon: BookOpen, label: 'Audiobooks', path: '/audiobooks' },
    { id: 'meditation', icon: Moon, label: 'Meditation', path: '/meditation' },
    { id: 'quotes-poems', icon: Quote, label: 'Quotes & Poems', path: '/quotes-poems' },
  ];
  
  const peopleAndSocietyLinks = [
    { id: 'people-blogs', icon: Users, label: 'People & Blogs', path: '/people-blogs' },
    { id: 'relationships', icon: UserRound, label: 'Relationships', path: '/relationships' },
    { id: 'nonprofits', icon: HeartHandshake, label: 'Nonprofits', path: '/nonprofits' },
    { id: 'pets-animals', icon: Dog, label: 'Pets & Animals', path: '/pets-animals',
      subItems: [
        { id: 'amphibians', label: 'Amphibians', path: '/pets-animals/amphibians' },
        { id: 'insects', label: 'Insects & Spiders', path: '/pets-animals/insects' },
        { id: 'birds', label: 'Birds & Raptors', path: '/pets-animals/birds' },
        { id: 'crustaceans', label: 'Crabs & Lobsters', path: '/pets-animals/crustaceans' },
        { id: 'fish', label: 'Fish', path: '/pets-animals/fish' },
        { id: 'mammals', label: 'Mammals', path: '/pets-animals/mammals' },
        { id: 'marine-mammals', label: 'Orcas & Dolphins', path: '/pets-animals/marine-mammals' },
        { id: 'reptiles', label: 'Reptiles & Snakes', path: '/pets-animals/reptiles' },
        { id: 'rodents', label: 'Rodents', path: '/pets-animals/rodents' },
        { id: 'cephalopods', label: 'Octopus & Squid', path: '/pets-animals/cephalopods' }
      ]
    },
    { id: 'models', icon: Star, label: 'Models', path: '/models' },
  ];
  
  const placesAndLocationsLinks = [
    { id: 'travel-events', icon: Plane, label: 'Travel & Events', path: '/travel-events',
      subItems: [
        { id: 'airplanes-airships', label: 'Airships & Blimps', path: '/travel-events/airplanes-airships' },
        { id: 'airplanes-cargo', label: 'Cargo Planes', path: '/travel-events/airplanes-cargo' },
        { id: 'airplanes-commercial', label: 'Commercial Jets', path: '/travel-events/airplanes-commercial' },
        { id: 'airplanes-land-water', label: 'Land & Water Planes', path: '/travel-events/airplanes-land-water' },
        { id: 'airplanes-pilots', label: 'Pilots & Captains', path: '/travel-events/airplanes-pilots' },
        { id: 'airplanes-single-engine', label: 'Single Engine Planes', path: '/travel-events/airplanes-single-engine' }
      ]
    },
    { id: 'airports', icon: Plane, label: 'Airports', path: '/airports',
      subItems: [
        { id: 'airport-fails', label: 'Airport Fails', path: '/airports/fails' }
      ]
    },
    { id: 'real-estate', icon: House, label: 'Real Estate', path: '/real-estate' },
    { id: 'restaurants', icon: Utensils, label: 'Restaurants', path: '/restaurants' },
    { id: 'foods', icon: Pizza, label: 'Foods', path: '/foods' },
  ];
  
  const environmentAndWeatherLinks = [
    { id: 'weather', icon: Cloud, label: 'Weather', path: '/weather' },
    { id: 'disasters', icon: Zap, label: 'Disasters', path: '/disasters',
      subItems: [
        { id: 'avalanche', label: 'Avalanche', path: '/disasters/avalanche' }
      ]
    },
    { id: 'oceans', icon: Waves, label: 'Waters & Oceans', path: '/oceans' },
    { id: 'boats', icon: Ship, label: 'Boats', path: '/boats',
      subItems: [
        { id: 'all-boats', label: 'All Boats', path: '/boats/all' }
      ]
    },
    { id: 'shipping-ports', icon: Anchor, label: 'Shipping Ports', path: '/shipping-ports' },
  ];
  
  const transportAndVehiclesLinks = [
    { id: 'autos-vehicles', icon: Car, label: 'Autos & Vehicles', path: '/autos-vehicles' },
    { id: 'shipping', icon: Truck, label: 'Shipping', path: '/shipping' },
  ];
  
  const lawAndJusticeLinks = [
    { id: 'courts-police', icon: Gavel, label: 'Courts & Police', path: '/courts-police' },
  ];
  
  const documentAndMediaLinks = [
    { id: 'documents', icon: Newspaper, label: 'Documents', path: '/documents' },
    { id: 'blog', icon: Newspaper, label: 'Blog', path: '/blog' },
  ];

  const renderNavLink = (item: { id: string, icon: any, label: string, path: string, subItems?: Array<{id: string, label: string, path: string}> }) => {
    const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
    const Icon = item.icon;
    
    if (item.subItems && item.subItems.length > 0) {
      const isParentOrChildActive = isActive || item.subItems.some(subItem => 
        location.pathname === subItem.path || location.pathname.startsWith(`${subItem.path}/`)
      );
      
      return (
        <div key={item.id} className="mb-1">
          <Link 
            to={item.path} 
            className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary transition-colors ${
              isParentOrChildActive ? 'bg-secondary font-medium' : ''
            }`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
          
          {isParentOrChildActive && (
            <div className="pl-8 space-y-1 mt-1">
              {item.subItems.map(subItem => {
                const isSubActive = location.pathname === subItem.path || location.pathname.startsWith(`${subItem.path}/`);
                
                return (
                  <Link
                    key={subItem.id}
                    to={subItem.path}
                    className={`block px-3 py-1 text-sm rounded-md hover:bg-secondary/60 transition-colors ${
                      isSubActive ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    {subItem.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <Link 
        key={item.id} 
        to={item.path} 
        className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary transition-colors ${
          isActive ? 'bg-secondary font-medium' : ''
        }`}
      >
        <Icon size={20} />
        <span>{item.label}</span>
      </Link>
    );
  };

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
          <div className="space-y-1 mb-6">
            {mainLinks.map(renderNavLink)}
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">VIDEO & ENTERTAINMENT</h3>
            <div className="space-y-1">
              {videoAndEntertainmentLinks.map(renderNavLink)}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">EDUCATION & INFORMATION</h3>
            <div className="space-y-1">
              {educationAndInformationLinks.map(renderNavLink)}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">MUSIC & AUDIO</h3>
            <div className="space-y-1">
              {musicAndAudioLinks.map(renderNavLink)}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">PEOPLE & SOCIETY</h3>
            <div className="space-y-1">
              {peopleAndSocietyLinks.map(renderNavLink)}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">PLACES & LOCATIONS</h3>
            <div className="space-y-1">
              {placesAndLocationsLinks.map(renderNavLink)}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">ENVIRONMENT & WEATHER</h3>
            <div className="space-y-1">
              {environmentAndWeatherLinks.map(renderNavLink)}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">TRANSPORT & VEHICLES</h3>
            <div className="space-y-1">
              {transportAndVehiclesLinks.map(renderNavLink)}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">LAW & JUSTICE</h3>
            <div className="space-y-1">
              {lawAndJusticeLinks.map(renderNavLink)}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">DOCUMENTS & MEDIA</h3>
            <div className="space-y-1">
              {documentAndMediaLinks.map(renderNavLink)}
            </div>
          </div>
          
          <div className="border-t mt-6 pt-4 text-xs text-muted-foreground">
            <div className="flex flex-wrap gap-x-2 px-3 mb-4">
              <Link to="/about" className="hover:underline">About</Link>
              <Link to="/copyright" className="hover:underline">Copyright</Link>
              <Link to="/contact" className="hover:underline">Contact</Link>
              <Link to="/terms" className="hover:underline">Terms</Link>
              <Link to="/privacy" className="hover:underline">Privacy</Link>
            </div>
            <p className="px-3">© 2023 MiyTube</p>
          </div>
        </div>
      </nav>
    </>
  );
};
