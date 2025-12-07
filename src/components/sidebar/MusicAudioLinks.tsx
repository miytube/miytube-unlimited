
import React from 'react';
import { Music, BookOpen, Moon, Quote } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const MusicAudioLinks: React.FC = () => {
  const musicAndAudioLinks = [
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
    { id: 'podcasts', icon: Music, label: 'Podcasts', path: '/podcasts' },
    { id: 'audiobooks', icon: BookOpen, label: 'Audiobooks', path: '/audiobooks' },
    { id: 'meditation', icon: Moon, label: 'Meditation', path: '/meditation' },
    { id: 'quotes-poems', icon: Quote, label: 'Quotes & Poems', path: '/quotes-poems' },
  ];

  return <SidebarCategoryLinks title="MUSIC & AUDIO" links={musicAndAudioLinks} />;
};
