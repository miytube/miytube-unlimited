
import React from 'react';
import { Film, Clapperboard } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const FilmAnimationLinks: React.FC = () => {
  const links = [
    { 
      id: 'film-animation',
      icon: Film, 
      label: 'Film & Animation', 
      path: '/film-animation',
      subItems: [
        { id: 'film-movies', label: 'Film & Movies', path: '/film' },
        { id: 'film-animation-movies', label: 'Animation Movies', path: '/film-animation/movies' },
        { id: 'film-animation-cartoons', label: 'Cartoons', path: '/film-animation/cartoons' },
      ]
    },
  ];

  return <SidebarCategoryLinks title="Film & Animation" links={links} />;
};
