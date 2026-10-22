
import React from 'react';
import { Landmark, Flag, Megaphone, Users, Newspaper, Radio, Mic, MessagesSquare } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';
import { debateWatchRoute, debateWatchTitle } from '@/data/subcategoryMappings/debate';

export const GovernmentPoliticsLinks: React.FC = () => {
  const governmentPoliticsLinks = [
    {
      id: 'debate',
      icon: MessagesSquare,
      label: 'Debate',
      path: '/debate',
      subItems: [
        { id: 'debate-politics', label: debateWatchTitle, path: debateWatchRoute },
      ],
    },
    { 
      id: 'news-politics', 
      icon: Newspaper, 
      label: 'News & Politics', 
      path: '/news',
      subItems: [
        { id: 'news-breaking', label: 'Breaking News', path: '/news/breaking' },
        { id: 'news-politics', label: 'Politics', path: '/news/politics' },
        { id: 'news-world', label: 'World News', path: '/news/world' },
        { id: 'news-local', label: 'Local News', path: '/news/local' },
        { id: 'news-shows', label: 'News Shows (60 Minutes)', path: '/news/shows' },
        { id: 'news-podcasts', label: 'News & Politics Podcasts', path: '/news/podcasts' }
      ]
    },
    { 
      id: 'presidents', 
      icon: Flag, 
      label: 'Presidents', 
      path: '/presidents',
      subItems: [
        { id: 'presidents-motorcade', label: 'Presidential Motorcade', path: '/presidents/motorcade' },
        { id: 'presidents-airforce', label: 'Air Force One & Marine One', path: '/presidents/airforce' },
        { id: 'presidents-former', label: 'Former Presidents', path: '/presidents/former' }
      ]
    },
    { 
      id: 'senate', 
      icon: Landmark, 
      label: 'Senate & House', 
      path: '/senate',
      subItems: [
        { id: 'senate-house', label: 'House of Representatives', path: '/senate/house' },
        { id: 'senate-sessions', label: 'Senate Sessions', path: '/senate/sessions' }
      ]
    },
    { 
      id: 'protesters', 
      icon: Megaphone, 
      label: 'Protesters', 
      path: '/protesters',
      subItems: [
        { id: 'protesters-demonstrators', label: 'Demonstrators', path: '/protesters/demonstrators' },
        { id: 'protesters-rallies', label: 'Rallies & Marches', path: '/protesters/rallies' }
      ]
    },
    { 
      id: 'speeches', 
      icon: Mic, 
      label: 'Speeches', 
      path: '/speeches',
      subItems: [
        { id: 'speeches-arguments', label: 'Arguments & Disagreements', path: '/speeches/arguments' },
        { id: 'speeches-commencement', label: 'Commencement Speeches', path: '/speeches/commencement' },
        { id: 'speeches-eulogy', label: 'Eulogy & Memorial', path: '/speeches/eulogy' },
        { id: 'speeches-informative', label: 'Informative Speeches', path: '/speeches/informative' },
        { id: 'speeches-motivational', label: 'Motivational Speeches', path: '/speeches/motivational' },
        { id: 'speeches-persuasive', label: 'Persuasive & Protest', path: '/speeches/persuasive' },
        { id: 'speeches-motivation', label: 'Self-Empowerment', path: '/speeches/motivation' }
      ]
    },
    { 
      id: 'journalist', 
      icon: Radio, 
      label: 'Journalist', 
      path: '/journalist',
      subItems: [
        { id: 'journalist-correspondent', label: 'Correspondents & Reporters', path: '/journalist/correspondent' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="GOVERNMENT & POLITICS" links={governmentPoliticsLinks} />;
};
