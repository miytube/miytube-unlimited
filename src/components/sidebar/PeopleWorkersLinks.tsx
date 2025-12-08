
import React from 'react';
import { Users, UserCheck, Briefcase, AlertTriangle, Heart, Award } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const PeopleWorkersLinks: React.FC = () => {
  const peopleWorkersLinks = [
    { 
      id: 'people', 
      icon: Users, 
      label: 'People', 
      path: '/people-blogs',
      subItems: [
        { id: 'people-bigotry', label: 'Bigotry & Favoritism', path: '/people/bigotry' },
        { id: 'people-fighting', label: 'Fighting & Confrontations', path: '/people/fighting' },
        { id: 'people-karma', label: 'Karma & Deserved', path: '/people/karma' },
        { id: 'people-lookalikes', label: 'Look-a-likes & Impressionists', path: '/people/lookalikes' },
        { id: 'people-thefts', label: 'Thefts & Stealing', path: '/people/thefts' },
        { id: 'people-amazing', label: 'People Amazing', path: '/people/amazing' },
        { id: 'people-amazing-things', label: 'Amazing Things', path: '/people/amazing-things' },
        { id: 'people-fails', label: 'People Fails & Comedy', path: '/people/fails' }
      ]
    },
    { 
      id: 'workers', 
      icon: Briefcase, 
      label: 'Workers', 
      path: '/workers',
      subItems: [
        { id: 'workers-amazing', label: 'Amazing & Great Things', path: '/workers/amazing' },
        { id: 'workers-fails', label: 'Worker Fails & Accidents', path: '/workers/fails' }
      ]
    },
    { 
      id: 'moments', 
      icon: Award, 
      label: 'Moments', 
      path: '/moments',
      subItems: [
        { id: 'moments-good', label: 'Good Moments', path: '/moments/good' },
        { id: 'moments-bad', label: 'Bad Moments', path: '/moments/bad' },
        { id: 'moments-special', label: 'Special Moments', path: '/moments/special' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="PEOPLE & WORKERS" links={peopleWorkersLinks} />;
};
