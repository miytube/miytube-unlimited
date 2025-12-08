
import React from 'react';
import { Heart, Baby, Users, Sparkles, Scissors, HeartHandshake, BadgeCheck } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const LifestyleRelationshipsLinks: React.FC = () => {
  const lifestyleRelationshipsLinks = [
    { 
      id: 'relationships', 
      icon: Heart, 
      label: 'Relationships', 
      path: '/relationships',
      subItems: [
        { id: 'relationships-divorce', label: 'Divorce', path: '/relationships/divorce' },
        { id: 'relationships-love', label: 'Love', path: '/relationships/love' },
        { id: 'relationships-marriage', label: 'Marriage', path: '/relationships/marriage' },
        { id: 'relationships-dating', label: 'Dating', path: '/relationships/dating' },
        { id: 'relationships-breakups', label: 'Breakups', path: '/relationships/breakups' },
        { id: 'relationships-attraction', label: 'Attraction & Flirting', path: '/relationships/attraction' },
        { id: 'relationships-single', label: 'Dating & Single', path: '/relationships/single' },
        { id: 'relationships-intimacy', label: 'Intimacy', path: '/relationships/intimacy' }
      ]
    },
    { 
      id: 'babies', 
      icon: Baby, 
      label: 'Babies & Infants', 
      path: '/babies',
      subItems: [
        { id: 'babies-funny', label: 'Funny & Comedy', path: '/babies/funny' },
        { id: 'babies-fails', label: 'Baby Fails', path: '/babies/fails' }
      ]
    },
    { 
      id: 'cosmetics', 
      icon: Sparkles, 
      label: 'Cosmetics', 
      path: '/cosmetics',
      subItems: [
        { id: 'cosmetics-eyelashes', label: 'Eyelashes & Eyeshadow', path: '/cosmetics/eyelashes' },
        { id: 'cosmetics-foundation', label: 'Foundation & Powder', path: '/cosmetics/foundation' },
        { id: 'cosmetics-lipstick', label: 'Lipstick & Makeup', path: '/cosmetics/lipstick' }
      ]
    },
    { 
      id: 'hair', 
      icon: Scissors, 
      label: 'Hair', 
      path: '/hair',
      subItems: [
        { id: 'hair-cuts', label: 'Hair Cuts (Men & Women)', path: '/hair/cuts' },
        { id: 'hair-extensions', label: 'Hair Extensions', path: '/hair/extensions' },
        { id: 'hair-styles', label: 'Hair Styles (Men & Women)', path: '/hair/styles' }
      ]
    },
    { 
      id: 'ideology', 
      icon: BadgeCheck, 
      label: 'Ideology & Lifestyles', 
      path: '/ideology',
      subItems: [
        { id: 'ideology-beliefs', label: 'Beliefs & Values', path: '/ideology/beliefs' }
      ]
    },
    { 
      id: 'celebrities', 
      icon: Users, 
      label: 'Celebrities', 
      path: '/celebrities',
      subItems: [
        { id: 'celebrities-actors', label: 'Actors & Actresses', path: '/celebrities/actors' },
        { id: 'celebrities-news', label: 'Celebrity News', path: '/celebrities/news' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="LIFESTYLE & RELATIONSHIPS" links={lifestyleRelationshipsLinks} />;
};
