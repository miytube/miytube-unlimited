import { Tv, Heart, Trophy, Film } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const realityTVSubcategories: SubcategoryMapping = {
  'reality-tv-competition': {
    title: 'Competition Shows',
    description: 'Reality competition and elimination shows',
    icon: Trophy,
    parent: {
      route: '/reality-tv',
      name: 'Reality TV'
    }
  },
  '/reality-tv/competition': {
    title: 'Competition Shows',
    description: 'Reality competition and elimination shows',
    icon: Trophy,
    parent: {
      route: '/reality-tv',
      name: 'Reality TV'
    }
  },
  'reality-tv-dating': {
    title: 'Dating Shows',
    description: 'Romance and dating reality programs',
    icon: Heart,
    parent: {
      route: '/reality-tv',
      name: 'Reality TV'
    }
  },
  '/reality-tv/dating': {
    title: 'Dating Shows',
    description: 'Romance and dating reality programs',
    icon: Heart,
    parent: {
      route: '/reality-tv',
      name: 'Reality TV'
    }
  },
  'reality-tv-documentary': {
    title: 'Documentary Series',
    description: 'Documentary-style reality programming',
    icon: Film,
    parent: {
      route: '/reality-tv',
      name: 'Reality TV'
    }
  },
  '/reality-tv/documentary': {
    title: 'Documentary Series',
    description: 'Documentary-style reality programming',
    icon: Film,
    parent: {
      route: '/reality-tv',
      name: 'Reality TV'
    }
  }
};
