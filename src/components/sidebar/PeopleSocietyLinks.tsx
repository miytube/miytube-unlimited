
import React from 'react';
import { Users, HeartHandshake, Dog, Star, Heart } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const PeopleSocietyLinks: React.FC = () => {
  const peopleAndSocietyLinks = [
    { 
      id: 'people-blogs', 
      icon: Users, 
      label: 'People & Blogs', 
      path: '/people-blogs',
      subItems: [
        { id: 'people-vlogs', label: 'Vlogs', path: '/people-blogs/vlogs' },
        { id: 'people-lifestyle', label: 'Lifestyle', path: '/people-blogs/lifestyle' },
        { id: 'people-family', label: 'Family Blogs', path: '/people-blogs/family' },
        { id: 'people-daily', label: 'Daily Life', path: '/people-blogs/daily' }
      ]
    },
    { 
      id: 'relationships', 
      icon: Heart, 
      label: 'Relationships', 
      path: '/relationships',
      subItems: [
        { id: 'relationships-dating', label: 'Dating', path: '/relationships/dating' },
        { id: 'relationships-marriage', label: 'Marriage', path: '/relationships/marriage' },
        { id: 'relationships-divorce', label: 'Divorce', path: '/relationships/divorce' },
        { id: 'relationships-breakups', label: 'Breakups', path: '/relationships/breakups' }
      ]
    },
    { 
      id: 'nonprofits', 
      icon: HeartHandshake, 
      label: 'Nonprofits', 
      path: '/nonprofits',
      subItems: [
        { id: 'nonprofits-charity', label: 'Charity Work', path: '/nonprofits/charity' },
        { id: 'nonprofits-volunteer', label: 'Volunteering', path: '/nonprofits/volunteer' },
        { id: 'nonprofits-fundraising', label: 'Fundraising', path: '/nonprofits/fundraising' },
        { id: 'nonprofits-awareness', label: 'Awareness Campaigns', path: '/nonprofits/awareness' }
      ]
    },
    { 
      id: 'pets-animals', 
      icon: Dog, 
      label: 'Pets & Animals', 
      path: '/pets-animals',
      subItems: [
        { id: 'amphibians', label: 'Amphibians', path: '/pets-animals/amphibians' },
        { id: 'insects', label: 'Insects & Spiders', path: '/pets-animals/insects' },
        { id: 'birds', label: 'Birds & Raptors', path: '/pets-animals/birds' },
        { id: 'crustaceans', label: 'Crabs & Lobsters', path: '/pets-animals/crustaceans' },
        { id: 'fish', label: 'Fish', path: '/pets-animals/fish' },
        { id: 'mammals', label: 'Mammals', path: '/pets-animals/mammals' },
        { id: 'marine-mammals', label: 'Orcas & Dolphins', path: '/pets-animals/marine-mammals' },
        { id: 'reptiles', label: 'Reptiles & Snakes', path: '/pets-animals/reptiles' },
        { id: 'rodents', label: 'Rodents', path: '/pets-animals/rodents' },
        { id: 'cephalopods', label: 'Octopus & Squid', path: '/pets-animals/cephalopods' }
      ]
    },
    { 
      id: 'models', 
      icon: Star, 
      label: 'Models', 
      path: '/models',
      subItems: [
        { id: 'models-fashion', label: 'Fashion Models', path: '/models/fashion' },
        { id: 'models-runway', label: 'Runway Shows', path: '/models/runway' },
        { id: 'models-photoshoots', label: 'Photoshoots', path: '/models/photoshoots' },
        { id: 'models-interviews', label: 'Model Interviews', path: '/models/interviews' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="PEOPLE & SOCIETY" links={peopleAndSocietyLinks} />;
};
