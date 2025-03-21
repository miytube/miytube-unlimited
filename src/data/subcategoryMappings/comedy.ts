
import { Smile } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const comedySubcategories: SubcategoryMapping = {
  // Comedy Routes
  'comedy-standup': {
    title: 'Stand-up Comedy',
    description: 'Stand-up comedians, performances and specials',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  'comedy-roasts': {
    title: 'Roasts & Jokes',
    description: 'Comedy roasts, jokes and humorous events',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  'comedy-snl': {
    title: 'Saturday Night Live',
    description: 'SNL sketches, performers and history',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  'comedy-sitcom': {
    title: 'Sitcoms',
    description: 'Situation comedy shows and TV series',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  'comedy-pranks': {
    title: 'Pranks & Funny Videos',
    description: 'Practical jokes, pranks and humorous clips',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  'comedy-interviews': {
    title: 'Comedian Interviews',
    description: 'Interviews with comedians, backstage content and work discussions',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
};
