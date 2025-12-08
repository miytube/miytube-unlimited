
import React from 'react';
import { Music, BookOpen, Moon, Quote, Headphones } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const MusicAudioLinks: React.FC = () => {
  const musicAndAudioLinks = [
    { 
      id: 'music', 
      icon: Music, 
      label: 'Music', 
      path: '/music',
      subItems: [
        { id: 'music-lyrics', label: 'Lyrics', path: '/music/lyrics' },
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
      id: 'podcasts', 
      icon: Headphones, 
      label: 'Podcasts', 
      path: '/podcasts',
      subItems: [
        { id: 'podcasts-news', label: 'News Podcasts', path: '/podcasts/news' },
        { id: 'podcasts-comedy', label: 'Comedy Podcasts', path: '/podcasts/comedy' },
        { id: 'podcasts-interview', label: 'Interview Podcasts', path: '/podcasts/interview' },
        { id: 'podcasts-educational', label: 'Educational Podcasts', path: '/podcasts/educational' }
      ]
    },
    { 
      id: 'audiobooks', 
      icon: BookOpen, 
      label: 'Audiobooks', 
      path: '/audiobooks',
      subItems: [
        { id: 'audiobooks-fiction', label: 'Fiction', path: '/audiobooks/fiction' },
        { id: 'audiobooks-nonfiction', label: 'Non-Fiction', path: '/audiobooks/nonfiction' },
        { id: 'audiobooks-self-help', label: 'Self-Help', path: '/audiobooks/self-help' },
        { id: 'audiobooks-mystery', label: 'Mystery & Thriller', path: '/audiobooks/mystery' }
      ]
    },
    { 
      id: 'meditation', 
      icon: Moon, 
      label: 'Meditation', 
      path: '/meditation',
      subItems: [
        { id: 'meditation-guided', label: 'Guided Meditation', path: '/meditation/guided' },
        { id: 'meditation-sleep', label: 'Sleep Meditation', path: '/meditation/sleep' },
        { id: 'meditation-music', label: 'Meditation Music', path: '/music-meditation' },
        { id: 'meditation-nature', label: 'Nature Sounds', path: '/nature-sounds' }
      ]
    },
    { 
      id: 'quotes-poems', 
      icon: Quote, 
      label: 'Quotes & Poems', 
      path: '/quotes-poems',
      subItems: [
        { id: 'quotes-inspirational', label: 'Inspirational Quotes', path: '/quotes-poems/inspirational' },
        { id: 'quotes-love', label: 'Love Quotes', path: '/quotes-poems/love' },
        { id: 'poems-classic', label: 'Classic Poems', path: '/quotes-poems/classic' },
        { id: 'poems-modern', label: 'Modern Poetry', path: '/quotes-poems/modern' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="MUSIC & AUDIO" links={musicAndAudioLinks} />;
};
