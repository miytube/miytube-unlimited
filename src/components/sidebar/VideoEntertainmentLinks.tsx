
import React from 'react';
import { Video, Film, Smile, Gamepad2, Trophy, Clapperboard } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const VideoEntertainmentLinks: React.FC = () => {
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

  return <SidebarCategoryLinks title="VIDEO & ENTERTAINMENT" links={videoAndEntertainmentLinks} />;
};
