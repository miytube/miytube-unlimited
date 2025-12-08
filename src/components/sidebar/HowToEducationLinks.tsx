
import React from 'react';
import { Wrench, Lightbulb, Hammer, Zap, PaintBucket, BookOpen, GraduationCap } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const HowToEducationLinks: React.FC = () => {
  const howToEducationLinks = [
    { 
      id: 'how-to', 
      icon: Wrench, 
      label: 'How To', 
      path: '/how-to-style',
      subItems: [
        { id: 'howto-building', label: 'Building & Garages', path: '/how-to/building' },
        { id: 'howto-clean-carpet', label: 'Clean Carpet & Windows', path: '/how-to/clean-carpet' },
        { id: 'howto-clean-bathroom', label: 'Clean Shower & Sink', path: '/how-to/clean-bathroom' },
        { id: 'howto-remodel', label: 'Remodel Bathroom', path: '/how-to/remodel' },
        { id: 'howto-windows-doors', label: 'Fix Windows & Doors', path: '/how-to/windows-doors' },
        { id: 'howto-toilets', label: 'Fix/Replace Toilets', path: '/how-to/toilets' },
        { id: 'howto-arts-crafts', label: 'Arts & Crafts', path: '/how-to/arts-crafts' }
      ]
    },
    { 
      id: 'home-electrical', 
      icon: Zap, 
      label: 'Home Electrical', 
      path: '/home-electrical',
      subItems: [
        { id: 'electrical-replace', label: 'Replace & Repair', path: '/home-electrical/replace' },
        { id: 'electrical-install', label: 'Installation', path: '/home-electrical/install' }
      ]
    },
    { 
      id: 'education', 
      icon: GraduationCap, 
      label: 'Education', 
      path: '/education',
      subItems: [
        { id: 'education-anatomy', label: 'Anatomy & Human Body', path: '/education/anatomy' },
        { id: 'education-countries', label: 'Countries History', path: '/education/countries' },
        { id: 'education-immigration', label: 'Immigration & Questions', path: '/education/immigration' },
        { id: 'education-geography', label: 'Kids Geography', path: '/education/geography' },
        { id: 'education-laws', label: 'Laws & Constitution', path: '/education/laws' },
        { id: 'education-medicine', label: 'Medicine & Medication', path: '/education/medicine' },
        { id: 'education-religion', label: 'Religion', path: '/education/religion' },
        { id: 'education-nursing', label: 'RN Nursing & LVN', path: '/education/nursing' },
        { id: 'education-learn', label: 'Learning Techniques', path: '/education/learn' }
      ]
    },
    { 
      id: 'documentaries', 
      icon: BookOpen, 
      label: 'Documentaries', 
      path: '/documentaries',
      subItems: [
        { id: 'documentaries-drugs', label: 'Drugs & Dealers', path: '/documentaries/drugs' },
        { id: 'documentaries-real-events', label: 'Real Events & People', path: '/documentaries/real-events' }
      ]
    },
    { 
      id: 'machines', 
      icon: Hammer, 
      label: 'Machines', 
      path: '/machines',
      subItems: [
        { id: 'machines-amazing', label: 'Amazing Machines', path: '/machines/amazing' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="HOW TO & EDUCATION" links={howToEducationLinks} />;
};
