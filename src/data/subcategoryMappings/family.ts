
import { Users, TreePine, History, Dna } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const familySubcategories: SubcategoryMapping = {
  'family/roots': {
    title: 'Family Roots',
    description: 'Exploring ancestry, genealogy, and family origins',
    icon: TreePine,
    parent: { route: '/family', name: 'Family' }
  },
  'family/history': {
    title: 'Family History',
    description: 'Historical records, stories, and family heritage',
    icon: History,
    parent: { route: '/family', name: 'Family' }
  },
  'family/dna': {
    title: 'Family DNA',
    description: 'DNA testing, genetic ancestry, and heritage discoveries',
    icon: Dna,
    parent: { route: '/family', name: 'Family' }
  }
};
