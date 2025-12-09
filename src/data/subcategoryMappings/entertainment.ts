
import { Clapperboard, Trophy, Tv, Star } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const entertainmentSubcategories: SubcategoryMapping = {
  'entertainment-awards': {
    title: 'Awards & Ceremonies',
    description: 'The Oscars, Golden Globes, and other entertainment awards',
    icon: Trophy,
    parent: {
      route: '/entertainment',
      name: 'Entertainment'
    }
  },
  'entertainment-actors': {
    title: 'Actors & Actresses',
    description: 'Actors and actresses in film and television',
    icon: Star,
    parent: {
      route: '/entertainment',
      name: 'Entertainment'
    }
  },
  'entertainment-late-night': {
    title: 'Late Night Shows',
    description: 'Late night talk shows and hosts',
    icon: Tv,
    parent: {
      route: '/entertainment',
      name: 'Entertainment'
    }
  },
  '/entertainment/late-night': {
    title: 'Late Night Shows',
    description: 'Late night talk shows and hosts',
    icon: Tv,
    parent: {
      route: '/entertainment',
      name: 'Entertainment'
    }
  },
  'entertainment-hollywood': {
    title: 'Hollywood & Celebrities',
    description: 'Hollywood, celebrity culture, and entertainment news',
    icon: Star,
    parent: {
      route: '/entertainment',
      name: 'Entertainment'
    }
  }
};