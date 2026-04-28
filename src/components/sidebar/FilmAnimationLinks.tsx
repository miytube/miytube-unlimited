
import React from 'react';
import { Film, Flame, Laugh, Ghost, Popcorn } from 'lucide-react';
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
      id: 'film-horror',
      icon: Ghost, 
      label: 'Horror', 
      path: '/film/horror',
      subItems: [
        { id: 'film-horror-terror', label: 'Terror', path: '/film/horror/terror' },
        { id: 'film-horror-fear', label: 'Fear', path: '/film/horror/fear' },
        { id: 'film-horror-fright', label: 'Fright', path: '/film/horror/fright' },
        { id: 'film-horror-dread', label: 'Dread', path: '/film/horror/dread' },
        { id: 'film-horror-slasher', label: 'Slasher', path: '/film/horror/slasher' },
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
        { id: 'film-neo-westerns', label: 'Neo-Westerns', path: '/film/neo-westerns' },
        { id: 'film-acid-westerns', label: 'Acid Westerns', path: '/film/acid-westerns' },
        { id: 'film-movie-trailers', label: 'Film & Movie Trailers', path: '/film/movie-trailers' },
      ]
    },
  ];

  return <SidebarCategoryLinks title="Film & Animation" links={links} />;
};
