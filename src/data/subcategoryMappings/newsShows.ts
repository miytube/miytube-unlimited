import { SubcategoryMapping } from './types';
import { Sun, Moon, Zap } from 'lucide-react';

export const newsShowsSubcategories: SubcategoryMapping = {
  'morning-news': {
    title: 'Morning News',
    description: 'Morning news broadcasts and early day updates',
    icon: Sun,
    parent: {
      route: '/news-shows',
      name: 'News Shows'
    }
  },
  'evening-news': {
    title: 'Evening News',
    description: 'Evening news broadcasts and nightly updates',
    icon: Moon,
    parent: {
      route: '/news-shows',
      name: 'News Shows'
    }
  },
  'breaking-news': {
    title: 'Breaking News',
    description: 'Breaking news coverage and live updates',
    icon: Zap,
    parent: {
      route: '/news-shows',
      name: 'News Shows'
    }
  }
};
