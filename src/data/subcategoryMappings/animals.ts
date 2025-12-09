
import { SubcategoryMapping } from './types';
import { Dog, Fish, Bird, Bug, Snail, Rabbit, Shell } from 'lucide-react';

export const animalsSubcategories: SubcategoryMapping = {
  'pets-animals/amphibians': {
    title: 'Amphibians',
    description: 'Frogs, salamanders, newts, and other amphibian videos',
    icon: Snail,
    parent: {
      route: '/pets-animals',
      name: 'Pets & Animals'
    }
  },
  'pets-animals/insects': {
    title: 'Insects & Spiders',
    description: 'Insects, spiders, and arthropod videos',
    icon: Bug,
    parent: {
      route: '/pets-animals',
      name: 'Pets & Animals'
    }
  },
  'pets-animals/birds': {
    title: 'Birds & Raptors',
    description: 'Birds, raptors, and avian wildlife videos',
    icon: Bird,
    parent: {
      route: '/pets-animals',
      name: 'Pets & Animals'
    }
  },
  'pets-animals/crustaceans': {
    title: 'Crabs & Lobsters',
    description: 'Crabs, lobsters, shrimp, and crustacean videos',
    icon: Shell,
    parent: {
      route: '/pets-animals',
      name: 'Pets & Animals'
    }
  },
  'pets-animals/fish': {
    title: 'Fish',
    description: 'Fish, aquariums, and aquatic life videos',
    icon: Fish,
    parent: {
      route: '/pets-animals',
      name: 'Pets & Animals'
    }
  },
  'pets-animals/mammals': {
    title: 'Mammals',
    description: 'Mammals, wildlife, and domestic animal videos',
    icon: Dog,
    parent: {
      route: '/pets-animals',
      name: 'Pets & Animals'
    }
  },
  'pets-animals/marine-mammals': {
    title: 'Orcas & Dolphins',
    description: 'Orcas, dolphins, whales, and marine mammal videos',
    icon: Fish,
    parent: {
      route: '/pets-animals',
      name: 'Pets & Animals'
    }
  },
  'pets-animals/jellyfish': {
    title: 'Man of War & Siphonophores',
    description: 'Jellyfish, man of war, siphonophores, and gelatinous sea creature videos',
    icon: Shell,
    parent: {
      route: '/pets-animals',
      name: 'Pets & Animals'
    }
  },
  'pets-animals/reptiles': {
    title: 'Reptiles & Snakes',
    description: 'Reptiles, snakes, lizards, and turtles videos',
    icon: Snail,
    parent: {
      route: '/pets-animals',
      name: 'Pets & Animals'
    }
  },
  'pets-animals/rodents': {
    title: 'Rodents',
    description: 'Rats, beavers, hamsters, and other rodent videos',
    icon: Rabbit,
    parent: {
      route: '/pets-animals',
      name: 'Pets & Animals'
    }
  },
  'pets-animals/cephalopods': {
    title: 'Octopus & Squid',
    description: 'Octopus, squid, cuttlefish, and cephalopod videos',
    icon: Shell,
    parent: {
      route: '/pets-animals',
      name: 'Pets & Animals'
    }
  },
};
