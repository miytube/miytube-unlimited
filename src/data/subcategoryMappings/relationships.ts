
import { Heart } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const relationshipsSubcategories: SubcategoryMapping = {
  // Dating & Relationship Routes
  'relationships-dating': {
    title: 'Dating',
    description: 'Dating advice, tips and experiences',
    icon: Heart,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  'relationships-breakups': {
    title: 'Breakups',
    description: 'Handling relationship endings and moving forward',
    icon: Heart,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  'relationships-flirting': {
    title: 'Attraction & Flirting',
    description: 'Flirting techniques, signs and romantic attraction',
    icon: Heart,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  'relationships-attraction': {
    title: 'Attraction & Flirting',
    description: 'Attraction, flirting techniques and romantic interest',
    icon: Heart,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  'relationships-singles': {
    title: 'Dating & Single',
    description: 'Content for single people and solo lifestyle',
    icon: Heart,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  'relationships-single': {
    title: 'Dating & Single',
    description: 'Content for singles, dating life and solo journey',
    icon: Heart,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  'relationships-divorce': {
    title: 'Divorce',
    description: 'Divorce process, coping strategies and legal aspects',
    icon: Heart,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  'relationships-marriage': {
    title: 'Marriage',
    description: 'Marriage advice, wedding planning and married life',
    icon: Heart,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  'relationships-love': {
    title: 'Love',
    description: 'Love stories, romantic experiences and relationship goals',
    icon: Heart,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  'relationships-intimacy': {
    title: 'Intimacy',
    description: 'Building emotional and physical intimacy in relationships',
    icon: Heart,
    parent: { route: '/relationships', name: 'Relationships' }
  },
};
