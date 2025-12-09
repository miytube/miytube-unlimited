
import React from 'react';
import { Film, Flame, Laugh } from 'lucide-react';
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
    { 
      id: 'film-westerns',
      icon: Flame, 
      label: 'Westerns', 
      path: '/film/westerns',
      subItems: [
        { id: 'film-spaghetti-westerns', label: 'Spaghetti Westerns', path: '/film/spaghetti-westerns' },
        { id: 'film-modern-westerns', label: 'Modern Westerns', path: '/film/modern-westerns' },
        { id: 'film-western-comedies', label: 'Western Comedies', path: '/film/western-comedies' },
      ]
    },
  ];

  return <SidebarCategoryLinks title="Film & Animation" links={links} />;
};
