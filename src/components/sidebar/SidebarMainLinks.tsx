
import React from 'react';
import { useLocation } from 'react-router-dom';
import { renderNavLink } from './SidebarCategoryLinks';
import { Home, Compass, Film, Upload, UserCircle, TrendingUp } from 'lucide-react';

interface SidebarMainLinksProps {
  className?: string;
}

export const SidebarMainLinks: React.FC<SidebarMainLinksProps> = ({ className }) => {
  const location = useLocation();

  const mainLinks = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'explore', icon: Compass, label: 'Explore', path: '/' },
    { id: 'trending', icon: TrendingUp, label: 'Trending', path: '/trending' },
    { id: 'shorts', icon: Film, label: 'Shorts', path: '/shorts' },
    { id: 'upload', icon: Upload, label: 'Universal Upload', path: '/upload' },
    { id: 'channel', icon: UserCircle, label: 'Your Channel', path: '/channel' },
  ];

  return (
    <div className={`space-y-1 mb-6 ${className}`}>
      {mainLinks.map(link => renderNavLink(link, location))}
    </div>
  );
};
