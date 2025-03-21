
import React from 'react';
import { Music, BookOpen, Moon, Quote } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const MusicAudioLinks: React.FC = () => {
  const musicAndAudioLinks = [
    { id: 'music', icon: Music, label: 'Music', path: '/music' },
    { id: 'podcasts', icon: Music, label: 'Podcasts', path: '/podcasts' },
    { id: 'audiobooks', icon: BookOpen, label: 'Audiobooks', path: '/audiobooks' },
    { id: 'meditation', icon: Moon, label: 'Meditation', path: '/meditation' },
    { id: 'quotes-poems', icon: Quote, label: 'Quotes & Poems', path: '/quotes-poems' },
  ];

  return <SidebarCategoryLinks title="MUSIC & AUDIO" links={musicAndAudioLinks} />;
};
