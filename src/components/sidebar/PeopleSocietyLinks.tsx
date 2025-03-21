
import React from 'react';
import { Users, UserRound, HeartHandshake, Dog, Star } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const PeopleSocietyLinks: React.FC = () => {
  const peopleAndSocietyLinks = [
    { id: 'people-blogs', icon: Users, label: 'People & Blogs', path: '/people-blogs' },
    { id: 'relationships', icon: UserRound, label: 'Relationships', path: '/relationships' },
    { id: 'nonprofits', icon: HeartHandshake, label: 'Nonprofits', path: '/nonprofits' },
    { id: 'pets-animals', icon: Dog, label: 'Pets & Animals', path: '/pets-animals',
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
    { id: 'models', icon: Star, label: 'Models', path: '/models' },
  ];

  return <SidebarCategoryLinks title="PEOPLE & SOCIETY" links={peopleAndSocietyLinks} />;
};
