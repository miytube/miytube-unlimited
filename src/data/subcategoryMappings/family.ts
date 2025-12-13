
import { TreePine, History, Dna, Heart, Users, Search } from 'lucide-react';
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
  },
  'family/traditions': {
    title: 'Family Traditions',
    description: 'Cultural customs, celebrations, and family rituals',
    icon: Heart,
    parent: { route: '/family', name: 'Family' }
  },
  'family/reunions': {
    title: 'Family Reunions',
    description: 'Family gatherings, events, and reunion planning',
    icon: Users,
    parent: { route: '/family', name: 'Family' }
  },
  'family/genealogy-tools': {
    title: 'Genealogy Tools',
    description: 'Resources and tools for researching family history',
    icon: Search,
    parent: { route: '/family', name: 'Family' }
  }
};
