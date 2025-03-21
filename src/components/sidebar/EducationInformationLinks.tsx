
import React from 'react';
import { GraduationCap, Scissors, Microscope, Newspaper } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const EducationInformationLinks: React.FC = () => {
  const educationAndInformationLinks = [
    { id: 'education', icon: GraduationCap, label: 'Education', path: '/education',
      subItems: [
        { id: 'american-history', label: 'American History', path: '/education/american-history' },
        { id: 'biblical-history', label: 'Biblical History', path: '/education/biblical-history' },
        { id: 'bible-quotes', label: 'Bible Quotes', path: '/education/bible-quotes' }
      ]
    },
    { id: 'how-to-style', icon: Scissors, label: 'How-to & Style', path: '/how-to-style' },
    { id: 'science-tech', icon: Microscope, label: 'Science & Technology', path: '/science-tech',
      subItems: [
        { id: 'artifacts', label: 'Artifacts & Antiques', path: '/science-tech/artifacts' },
        { id: 'ai', label: 'Artificial Intelligence', path: '/science-tech/ai' },
        { id: 'humanoid-robots', label: 'Humanoid Robots', path: '/science-tech/humanoid-robots' },
        { id: 'robots', label: 'Robots', path: '/science-tech/robots' }
      ]
    },
    { id: 'news-politics', icon: Newspaper, label: 'News & Politics', path: '/news' },
  ];

  return <SidebarCategoryLinks title="EDUCATION & INFORMATION" links={educationAndInformationLinks} />;
};
