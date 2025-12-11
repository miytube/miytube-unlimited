
import React from 'react';
import { Dog, Fish, Bird, Bug, Leaf, TreeDeciduous, Droplets } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const AnimalsNatureLinks: React.FC = () => {
  const animalsNatureLinks = [
    { 
      id: 'pets-animals', 
      icon: Dog, 
      label: 'Pets & Animals', 
      path: '/pets-animals',
      subItems: [
        { id: 'amphibians', label: 'Amphibians (Frogs, Salamanders)', path: '/pets-animals/amphibians' },
        { id: 'insects', label: 'Insects & Spiders', path: '/pets-animals/insects' },
        { id: 'birds', label: 'Birds & Raptors', path: '/pets-animals/birds' },
        { id: 'crustaceans', label: 'Crabs & Lobsters', path: '/pets-animals/crustaceans' },
        { id: 'fish', label: 'Fish', path: '/pets-animals/fish' },
        { id: 'mammals', label: 'Mammals', path: '/pets-animals/mammals' },
        { id: 'marine-mammals', label: 'Orcas & Dolphins', path: '/pets-animals/marine-mammals' },
        { id: 'jellyfish', label: 'Man of War & Siphonophores', path: '/pets-animals/jellyfish' },
        { id: 'reptiles', label: 'Reptiles & Snakes', path: '/pets-animals/reptiles' },
        { id: 'rodents', label: 'Rodents (Rats, Beavers)', path: '/pets-animals/rodents' },
        { id: 'cephalopods', label: 'Octopus & Squid', path: '/pets-animals/cephalopods' }
      ]
    },
    { 
      id: 'mammals', 
      icon: Dog, 
      label: 'Mammals', 
      path: '/mammals',
      subItems: [
        { id: 'mammals-primates', label: 'Primates', path: '/mammals/primates' },
        { id: 'mammals-carnivores', label: 'Carnivores', path: '/mammals/carnivores' },
        { id: 'mammals-rodents', label: 'Rodents', path: '/mammals/rodents' },
        { id: 'mammals-marine', label: 'Marine Mammals', path: '/mammals/marine-mammals' },
        { id: 'mammals-marsupials', label: 'Marsupials', path: '/mammals/marsupials' },
        { id: 'mammals-bats', label: 'Bats', path: '/mammals/bats' },
        { id: 'mammals-elephants', label: 'Elephants', path: '/mammals/elephants' },
        { id: 'mammals-ungulates', label: 'Ungulates', path: '/mammals/ungulates' }
      ]
    },
    { 
      id: 'non-mammals', 
      icon: Fish, 
      label: 'Non-Mammals', 
      path: '/non-mammals',
      subItems: [
        { id: 'non-mammals-fish', label: 'Fish', path: '/non-mammals/fish' },
        { id: 'non-mammals-birds', label: 'Birds', path: '/non-mammals/birds' },
        { id: 'non-mammals-reptiles', label: 'Reptiles', path: '/non-mammals/reptiles' },
        { id: 'non-mammals-amphibians', label: 'Amphibians', path: '/non-mammals/amphibians' },
        { id: 'non-mammals-arthropods', label: 'Arthropods', path: '/non-mammals/arthropods' },
        { id: 'non-mammals-mollusks', label: 'Mollusks', path: '/non-mammals/mollusks' },
        { id: 'non-mammals-echinoderms', label: 'Echinoderms', path: '/non-mammals/echinoderms' },
        { id: 'non-mammals-invertebrates', label: 'Other Invertebrates', path: '/non-mammals/invertebrates' }
      ]
    },
    { 
      id: 'plants', 
      icon: Leaf, 
      label: 'Plants', 
      path: '/plants',
      subItems: [
        { id: 'plants-herbs', label: 'Herbs & Flowers', path: '/plants/herbs' },
        { id: 'plants-vegetables', label: 'Vegetables', path: '/plants/vegetables' }
      ]
    },
    { 
      id: 'fungi', 
      icon: TreeDeciduous, 
      label: 'Fungi', 
      path: '/fungi',
      subItems: [
        { id: 'fungi-killer', label: 'Killer Fungi', path: '/fungi/killer' },
        { id: 'fungi-edible', label: 'Edible Mushrooms', path: '/fungi/edible' }
      ]
    },
    { 
      id: 'waters', 
      icon: Droplets, 
      label: 'Lakes & Rivers', 
      path: '/waters',
      subItems: [
        { id: 'waters-lakes', label: 'Lakes', path: '/waters/lakes' },
        { id: 'waters-rivers', label: 'Rivers', path: '/waters/rivers' },
        { id: 'waters-seas', label: 'Seas', path: '/waters/seas' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="ANIMALS & NATURE" links={animalsNatureLinks} />;
};
