import { SubcategoryMapping } from './types';
import { Fish, Bird, Bug, Shell, Snail } from 'lucide-react';

export const nonMammalsSubcategories: SubcategoryMapping = {
  'non-mammals/fish': {
    title: 'Fish',
    description: 'Sharks, tuna, salmon, eels, lampreys (jawless fish)',
    icon: Fish,
    parent: { route: '/non-mammals', name: 'Non-Mammals' }
  },
  'non-mammals/birds': {
    title: 'Birds',
    description: 'Eagles, penguins, hummingbirds, ducks, ostriches',
    icon: Bird,
    parent: { route: '/non-mammals', name: 'Non-Mammals' }
  },
  'non-mammals/reptiles': {
    title: 'Reptiles',
    description: 'Snakes, lizards, turtles, crocodiles, alligators',
    icon: Snail,
    parent: { route: '/non-mammals', name: 'Non-Mammals' }
  },
  'non-mammals/amphibians': {
    title: 'Amphibians',
    description: 'Frogs, toads, salamanders, caecilians',
    icon: Snail,
    parent: { route: '/non-mammals', name: 'Non-Mammals' }
  },
  'non-mammals/arthropods': {
    title: 'Arthropods',
    description: 'Insects (butterflies, beetles), arachnids (spiders, scorpions), crustaceans (crabs, shrimp)',
    icon: Bug,
    parent: { route: '/non-mammals', name: 'Non-Mammals' }
  },
  'non-mammals/mollusks': {
    title: 'Mollusks',
    description: 'Snails, clams, oysters, squid, octopuses',
    icon: Shell,
    parent: { route: '/non-mammals', name: 'Non-Mammals' }
  },
  'non-mammals/echinoderms': {
    title: 'Echinoderms',
    description: 'Starfish, sea urchins, sea cucumbers',
    icon: Shell,
    parent: { route: '/non-mammals', name: 'Non-Mammals' }
  },
  'non-mammals/invertebrates': {
    title: 'Other Invertebrates',
    description: 'Jellyfish, sponges, corals, worms (nematodes, annelids)',
    icon: Shell,
    parent: { route: '/non-mammals', name: 'Non-Mammals' }
  },
};
