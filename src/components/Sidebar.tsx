
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Compass, Film, Music, Gamepad2, Newspaper, Trophy, Video, Upload,
  BookOpen, Moon, GraduationCap, Leaf, Smile, Globe, Cloud, Waves, Zap, TrendingUp,
  UserCircle
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
  
  const contentLinks = [
    { id: 'videos', icon: Video, label: 'Videos', path: '/videos' },
    { id: 'music', icon: Music, label: 'Music', path: '/music' },
    { id: 'sports', icon: Trophy, label: 'Sports', path: '/sports' },
    { id: 'gaming', icon: Gamepad2, label: 'Gaming', path: '/gaming' },
  ];
  
  const audioLinks = [
    { id: 'podcasts', icon: Music, label: 'Podcasts', path: '/podcasts' },
    { id: 'audiobooks', icon: BookOpen, label: 'Audiobooks', path: '/audiobooks' },
    { id: 'meditation', icon: Moon, label: 'Meditation', path: '/meditation' },
    { id: 'educational', icon: GraduationCap, label: 'Educational', path: '/educational' },
    { id: 'nature-sounds', icon: Leaf, label: 'Nature Sounds', path: '/nature-sounds' },
    { id: 'comedy', icon: Smile, label: 'Comedy', path: '/comedy' },
  ];
  
  const newsAndWeatherLinks = [
    { id: 'news', icon: Globe, label: 'News & Politics', path: '/news' },
    { id: 'weather', icon: Cloud, label: 'Weather', path: '/weather' },
    { id: 'oceans', icon: Waves, label: 'Oceans', path: '/oceans' },
    { id: 'disasters', icon: Zap, label: 'Disasters', path: '/disasters' },
  ];
  
  const exploreLinks = [
    { id: 'audio', icon: Music, label: 'Audio', path: '/audio' },
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
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">CONTENT</h3>
            <div className="space-y-1">
              {contentLinks.map(renderNavLink)}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">AUDIO</h3>
            <div className="space-y-1">
              {audioLinks.map(renderNavLink)}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">NEWS & WEATHER</h3>
            <div className="space-y-1">
              {newsAndWeatherLinks.map(renderNavLink)}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">EXPLORE</h3>
            <div className="space-y-1">
              {exploreLinks.map(renderNavLink)}
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
