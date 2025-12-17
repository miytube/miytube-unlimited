
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Film, User, Newspaper, Mic } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const HollywoodLinks: React.FC = () => {
  const location = useLocation();
  
  const links = [
    { 
      id: 'hollywood',
      icon: Film, 
      label: 'Hollywood', 
      path: '/hollywood',
      subItems: [
        { id: 'hollywood-bios', label: 'Bios & History', path: '/hollywood/bios' },
        { id: 'hollywood-news', label: 'News & Gossip', path: '/hollywood/news' },
        { id: 'hollywood-interviews', label: 'Interviews & Work', path: '/hollywood/interviews' },
        { id: 'hollywood-celebrities-actors', label: 'Celebrity Actors', path: '/hollywood/celebrities/actors' },
        { id: 'hollywood-celebrities-news', label: 'Celebrity News', path: '/hollywood/celebrities/news' },
      ]
    },
  ];

  return <SidebarCategoryLinks title="Hollywood" links={links} />;
};
