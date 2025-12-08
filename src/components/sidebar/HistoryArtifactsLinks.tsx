
import React from 'react';
import { BookOpen, Landmark, Church, Globe, Crown, Scroll, Amphora } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const HistoryArtifactsLinks: React.FC = () => {
  const historyArtifactsLinks = [
    { 
      id: 'history', 
      icon: BookOpen, 
      label: 'History', 
      path: '/history',
      subItems: [
        { id: 'history-american', label: 'American History', path: '/history/american' },
        { id: 'history-world', label: 'World History', path: '/history/world' },
        { id: 'history-biblical', label: 'Biblical History', path: '/history/biblical' }
      ]
    },
    { 
      id: 'artifacts', 
      icon: Amphora, 
      label: 'Artifacts & Antiques', 
      path: '/artifacts',
      subItems: [
        { id: 'artifacts-antique', label: 'Antiques & Antiquities', path: '/artifacts/antique' },
        { id: 'artifacts-collectibles', label: 'Collectibles', path: '/artifacts/collectibles' }
      ]
    },
    { 
      id: 'bible', 
      icon: Church, 
      label: 'Bible & Religion', 
      path: '/bible',
      subItems: [
        { id: 'bible-quotes', label: 'Quotes & Scriptures', path: '/bible/quotes' },
        { id: 'bible-history', label: 'Biblical History', path: '/bible/history' }
      ]
    },
    { 
      id: 'colosseum', 
      icon: Landmark, 
      label: 'Colosseum & Arenas', 
      path: '/colosseum',
      subItems: [
        { id: 'colosseum-rome', label: 'Rome Arena & Stadium', path: '/colosseum/rome' }
      ]
    },
    { 
      id: 'statues', 
      icon: Crown, 
      label: 'Statues & Sculpture', 
      path: '/statues',
      subItems: [
        { id: 'statues-sculpture', label: 'Sculpture & Effigy', path: '/statues/sculpture' },
        { id: 'statues-stone', label: 'Stone Carvers', path: '/statues/stone' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="HISTORY & ARTIFACTS" links={historyArtifactsLinks} />;
};
