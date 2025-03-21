
import { UserRound } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const relationshipsSubcategories: SubcategoryMapping = {
  // Dating & Relationship Routes
  'relationships-dating': {
    title: 'Dating',
    description: 'Dating advice, tips and experiences',
    icon: UserRound,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  'relationships-breakups': {
    title: 'Breakups',
    description: 'Handling relationship endings and moving forward',
    icon: UserRound,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  'relationships-flirting': {
    title: 'Flirting',
    description: 'Flirting techniques, signs and romantic attraction',
    icon: UserRound,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  'relationships-singles': {
    title: 'Singles',
    description: 'Content for single people and solo lifestyle',
    icon: UserRound,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  'relationships-divorce': {
    title: 'Divorce',
    description: 'Divorce process, coping strategies and legal aspects',
    icon: UserRound,
    parent: { route: '/relationships', name: 'Relationships' }
  },
};
