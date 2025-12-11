import { SubcategoryMapping } from './types';
import { Dog, Cat, Rabbit, Fish, Bird, TreeDeciduous } from 'lucide-react';

export const mammalsSubcategories: SubcategoryMapping = {
  'mammals/primates': {
    title: 'Primates',
    description: 'Humans, monkeys, apes, lemurs',
    icon: Dog,
    parent: { route: '/mammals', name: 'Mammals' }
  },
  'mammals/carnivores': {
    title: 'Carnivores',
    description: 'Dogs, cats, lions, seals, bears',
    icon: Cat,
    parent: { route: '/mammals', name: 'Mammals' }
  },
  'mammals/rodents': {
    title: 'Rodents',
    description: 'Mice, rats, squirrels, beavers',
    icon: Rabbit,
    parent: { route: '/mammals', name: 'Mammals' }
  },
  'mammals/marine-mammals': {
    title: 'Marine Mammals',
    description: 'Whales, dolphins, seals, manatees',
    icon: Fish,
    parent: { route: '/mammals', name: 'Mammals' }
  },
  'mammals/marsupials': {
    title: 'Marsupials',
    description: 'Kangaroos, koalas, opossums',
    icon: Dog,
    parent: { route: '/mammals', name: 'Mammals' }
  },
  'mammals/bats': {
    title: 'Bats',
    description: 'Unique flying mammals',
    icon: Bird,
    parent: { route: '/mammals', name: 'Mammals' }
  },
  'mammals/elephants': {
    title: 'Elephants',
    description: 'African and Asian elephants',
    icon: TreeDeciduous,
    parent: { route: '/mammals', name: 'Mammals' }
  },
  'mammals/ungulates': {
    title: 'Ungulates',
    description: 'Deer, bison, pigs, camels',
    icon: Dog,
    parent: { route: '/mammals', name: 'Mammals' }
  },
};
