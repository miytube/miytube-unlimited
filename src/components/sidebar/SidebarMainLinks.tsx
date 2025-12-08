import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Film, Upload, UserCircle, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarMainLinksProps {
  className?: string;
  collapsed?: boolean;
}

export const SidebarMainLinks: React.FC<SidebarMainLinksProps> = ({ className, collapsed = false }) => {
  const location = useLocation();

  const mainLinks = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'explore', icon: Compass, label: 'Explore', path: '/' },
    { id: 'trending', icon: TrendingUp, label: 'Trending', path: '/trending' },
    { id: 'shorts', icon: Film, label: 'Shorts', path: '/shorts' },
    { id: 'upload', icon: Upload, label: 'Universal Upload', path: '/upload' },
    { id: 'channel', icon: UserCircle, label: 'Your Channel', path: '/channel' },
  ];

  if (collapsed) {
    return (
      <TooltipProvider>
        <div className={`space-y-1 mb-6 ${className}`}>
          {mainLinks.map(link => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            
            return (
              <Tooltip key={link.id}>
                <TooltipTrigger asChild>
                  <Link 
                    to={link.path} 
                    className={`flex items-center justify-center p-2 rounded-md hover:bg-secondary transition-colors ${
                      isActive ? 'bg-secondary font-medium' : ''
                    }`}
                  >
                    <Icon size={20} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {link.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className={`space-y-1 mb-6 ${className}`}>
      {mainLinks.map(link => {
        const isActive = location.pathname === link.path;
        const Icon = link.icon;
        
        return (
          <Link 
            key={link.id} 
            to={link.path} 
            className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary transition-colors ${
              isActive ? 'bg-secondary font-medium' : ''
            }`}
          >
            <Icon size={20} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
