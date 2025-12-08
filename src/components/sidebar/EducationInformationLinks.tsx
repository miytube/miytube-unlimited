
import React from 'react';
import { GraduationCap, Scissors, Microscope, Newspaper } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const EducationInformationLinks: React.FC = () => {
  const educationAndInformationLinks = [
    { 
      id: 'education', 
      icon: GraduationCap, 
      label: 'Education', 
      path: '/education',
      subItems: [
        { id: 'american-history', label: 'American History', path: '/education/american-history' },
        { id: 'biblical-history', label: 'Biblical History', path: '/education/biblical-history' },
        { id: 'bible-quotes', label: 'Bible Quotes', path: '/education/bible-quotes' },
        { id: 'medicine', label: 'Medicine & Medication', path: '/education/medicine' },
        { id: 'religion', label: 'Religion', path: '/education/religion' },
        { id: 'nursing', label: 'Nursing & Healthcare', path: '/education/nursing' },
        { id: 'learn', label: 'Learning Techniques', path: '/education/learn' },
        { id: 'math', label: 'Mathematics', path: '/education/math' },
        { id: 'science', label: 'Science', path: '/education/science' },
        { id: 'music-education', label: 'Music Education', path: '/education/music-education' }
      ]
    },
    { 
      id: 'how-to-style', 
      icon: Scissors, 
      label: 'How-to & Style', 
      path: '/how-to-style',
      subItems: [
        { id: 'howto-diy', label: 'DIY Projects', path: '/how-to-style/diy' },
        { id: 'howto-fashion', label: 'Fashion Tips', path: '/how-to-style/fashion' },
        { id: 'howto-beauty', label: 'Beauty & Makeup', path: '/how-to-style/beauty' },
        { id: 'howto-home', label: 'Home Improvement', path: '/how-to-style/home' }
      ]
    },
    { 
      id: 'science-tech', 
      icon: Microscope, 
      label: 'Science & Technology', 
      path: '/science-tech',
      subItems: [
        { id: 'artifacts', label: 'Artifacts & Antiques', path: '/science-tech/artifacts' },
        { id: 'ai', label: 'Artificial Intelligence', path: '/science-tech/ai' },
        { id: 'humanoid-robots', label: 'Humanoid Robots', path: '/science-tech/humanoid-robots' },
        { id: 'robots', label: 'Robots', path: '/science-tech/robots' }
      ]
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
        { id: 'news-local', label: 'Local News', path: '/news/local' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="EDUCATION & INFORMATION" links={educationAndInformationLinks} />;
};
