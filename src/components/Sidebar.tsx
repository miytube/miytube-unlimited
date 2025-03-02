
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Clock, ThumbsUp, History, Film, Music, Gamepad2, Trophy, Newspaper, Flame, ShoppingBag } from 'lucide-react';
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
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Film, label: 'Shorts', path: '/shorts' },
    { icon: Clock, label: 'Watch Later', path: '/playlist?list=WL' },
    { icon: ThumbsUp, label: 'Liked Videos', path: '/playlist?list=LL' },
    { icon: History, label: 'History', path: '/history' },
  ];
  
  const exploreLinks = [
    { icon: Flame, label: 'Trending', path: '/trending' },
    { icon: Music, label: 'Music', path: '/music' },
    { icon: Gamepad2, label: 'Gaming', path: '/gaming' },
    { icon: Trophy, label: 'Sports', path: '/sports' },
    { icon: Newspaper, label: 'News', path: '/news' },
    { icon: ShoppingBag, label: 'Shopping', path: '/shopping' },
  ];

  const renderNavLink = (item: { icon: any, label: string, path: string }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    
    return (
      <Link 
        key={item.path} 
        to={item.path} 
        className={`nav-link ${isActive ? 'active' : ''}`}
      >
        <Icon size={20} />
        <span>{item.label}</span>
      </Link>
    );
  };

  const sidebarClasses = `fixed inset-y-0 left-0 z-40 w-60 bg-sidebar transition-transform duration-300 ease-in-out border-r overflow-y-auto ${
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
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">EXPLORE</h3>
            <div className="space-y-1">
              {exploreLinks.map(renderNavLink)}
            </div>
          </div>
          
          <div className="border-t mt-6 pt-4 text-xs text-muted-foreground">
            <div className="flex flex-wrap gap-x-2 px-3 mb-4">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Press</a>
              <a href="#" className="hover:underline">Copyright</a>
              <a href="#" className="hover:underline">Contact</a>
              <a href="#" className="hover:underline">Terms</a>
              <a href="#" className="hover:underline">Privacy</a>
            </div>
            <p className="px-3">© 2023 MiyTube</p>
          </div>
        </div>
      </nav>
    </>
  );
};
