
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Compass, Film, Music, Gamepad2, Newspaper, Trophy, Video, Upload,
  BookOpen, Moon, GraduationCap, Leaf, Smile, Globe, Cloud, Waves, Zap, TrendingUp,
  UserCircle, Car, Scissors, Heart, Users, Dog, Microscope, Plane, Pizza, Utensils,
  Quote, Clapperboard, Star, CloudLightning, Gavel, Fish, Ship, HeartHandshake, 
  Building, House, Anchor, UserRound, Truck
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
    { id: 'film-animation', icon: Clapperboard, label: 'Film & Animation', path: '/film-animation' },
    { id: 'entertainment', icon: Film, label: 'Entertainment', path: '/entertainment' },
    { id: 'comedy', icon: Smile, label: 'Comedy', path: '/comedy' },
    { id: 'gaming', icon: Gamepad2, label: 'Gaming', path: '/gaming' },
    { id: 'sports', icon: Trophy, label: 'Sports', path: '/sports' },
  ];
  
  const educationAndInformationLinks = [
    { id: 'education', icon: GraduationCap, label: 'Education', path: '/education' },
    { id: 'how-to-style', icon: Scissors, label: 'How-to & Style', path: '/how-to-style' },
    { id: 'science-tech', icon: Microscope, label: 'Science & Technology', path: '/science-tech' },
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
    { id: 'pets-animals', icon: Dog, label: 'Pets & Animals', path: '/pets-animals' },
    { id: 'models', icon: Star, label: 'Models', path: '/models' },
  ];
  
  const placesAndLocationsLinks = [
    { id: 'travel-events', icon: Plane, label: 'Travel & Events', path: '/travel-events' },
    { id: 'airports', icon: Plane, label: 'Airports', path: '/airports' },
    { id: 'real-estate', icon: House, label: 'Real Estate', path: '/real-estate' },
    { id: 'restaurants', icon: Utensils, label: 'Restaurants', path: '/restaurants' },
    { id: 'foods', icon: Pizza, label: 'Foods', path: '/foods' },
  ];
  
  const environmentAndWeatherLinks = [
    { id: 'weather', icon: Cloud, label: 'Weather', path: '/weather' },
    { id: 'disasters', icon: Zap, label: 'Disasters', path: '/disasters' },
    { id: 'oceans', icon: Waves, label: 'Waters & Oceans', path: '/oceans' },
    { id: 'boats', icon: Ship, label: 'Boats', path: '/boats' },
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

  const renderNavLink = (item: { id: string, icon: any, label: string, path: string }) => {
    const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
    const Icon = item.icon;
    
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
