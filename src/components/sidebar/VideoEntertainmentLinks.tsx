
import React from 'react';
import { Video, Film, Smile, Gamepad2, Trophy, Clapperboard, UserRound, Music, Mic } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const VideoEntertainmentLinks: React.FC = () => {
  const videoAndEntertainmentLinks = [
    { id: 'videos', icon: Video, label: 'Videos', path: '/videos' },
    { 
      id: 'film-animation', 
      icon: Clapperboard, 
      label: 'Film & Animation', 
      path: '/film-animation', 
      subItems: [
        { id: 'animation-military', label: 'Military Animation', path: '/film-animation/military' },
        { id: 'animation-classics', label: 'Classic Animation', path: '/film-animation/classics' },
        { id: 'animation-bloopers', label: 'Bloopers & Mistakes', path: '/film-animation/bloopers' }
      ]
    },
    { 
      id: 'entertainment', 
      icon: Film, 
      label: 'Entertainment', 
      path: '/entertainment',
      subItems: [
        { id: 'entertainment-acting', label: 'Acting (Unscripted)', path: '/entertainment/acting' },
        { id: 'entertainment-bios', label: 'Actor & Actress Bios', path: '/entertainment/actors-actress' },
        { id: 'entertainment-info', label: 'Actor & Actress Info', path: '/entertainment/actors-info' },
        { id: 'entertainment-works', label: 'Actor & Actress Works', path: '/entertainment/actors-works' },
        { id: 'entertainment-auditions', label: 'Auditions & Contests', path: '/entertainment/auditions' }
      ]
    },
    { 
      id: 'music', 
      icon: Music, 
      label: 'Music', 
      path: '/music',
      subItems: [
        { id: 'music-spanish', label: 'Spanish Music', path: '/music/spanish' },
        { id: 'music-folk', label: 'Folk Music', path: '/music/folk' },
        { id: 'music-chinese', label: 'Chinese Music', path: '/music/chinese' },
        { id: 'music-r-and-b', label: 'R & B Music', path: '/music/r-and-b' },
        { id: 'music-soul', label: 'Soul Music', path: '/music/soul' },
        { id: 'music-jazz', label: 'Jazz Music', path: '/music/jazz' },
        { id: 'music-country', label: 'Country & Western', path: '/music/country' }
      ]
    },
    { 
      id: 'music-artists', 
      icon: Mic, 
      label: 'Music Artists', 
      path: '/music-artists',
      subItems: [
        { id: 'music-artists-info', label: 'Artists Info & News', path: '/music-artists/info' },
        { id: 'music-artists-works', label: 'Artists Works & Hobbies', path: '/music-artists/works' }
      ]
    },
    { id: 'comedy', icon: Smile, label: 'Comedy', path: '/comedy' },
    { id: 'gaming', icon: Gamepad2, label: 'Gaming', path: '/gaming' },
    { 
      id: 'sports', 
      icon: Trophy, 
      label: 'Sports', 
      path: '/sports',
      subItems: [
        { id: 'sports-basketball', label: 'Basketball', path: '/sports/basketball' },
        { id: 'sports-baseball', label: 'Baseball', path: '/sports/baseball' },
        { id: 'sports-football', label: 'Football', path: '/sports/football' },
        { id: 'sports-soccer', label: 'Soccer', path: '/sports/soccer' },
        { id: 'sports-hockey', label: 'Hockey', path: '/sports/hockey' },
        { id: 'sports-swimming', label: 'Swimming', path: '/sports/swimming' },
        { id: 'sports-boxing', label: 'Boxing', path: '/sports/boxing' },
        { id: 'sports-nascar', label: 'NASCAR', path: '/sports/nascar' },
        { id: 'sports-drag-racing', label: 'Drag Car Racing', path: '/sports/drag-racing' },
        { id: 'sports-dirt-racing', label: 'Dirt Car Racing', path: '/sports/dirt-racing' },
        { id: 'sports-motorcycle-racing', label: 'Motorcycle Racing', path: '/sports/motorcycle-racing' },
        { id: 'sports-motorcycle-drag', label: 'Motorcycle Drag Racing', path: '/sports/motorcycle-drag' },
        { id: 'sports-olympics', label: 'Olympics', path: '/sports/olympics' },
        { id: 'sports-horse-racing', label: 'Horse Racing', path: '/sports/horse-racing' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="VIDEO & ENTERTAINMENT" links={videoAndEntertainmentLinks} />;
};
