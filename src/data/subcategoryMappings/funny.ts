
import { Laugh, Bug } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const funnySubcategories: SubcategoryMapping = {
  'funny-short-videos': {
    title: 'Funny Short Videos',
    description: 'Short comedic videos for quick laughs',
    icon: Laugh,
    parent: {
      route: '/funny',
      name: 'Funny'
    }
  },
  'funny-weird': {
    title: 'Wacky & Bizarre',
    description: 'Strange, unusual, and bizarre funny videos',
    icon: Bug,
    parent: {
      route: '/funny',
      name: 'Funny'
    }
  }
};