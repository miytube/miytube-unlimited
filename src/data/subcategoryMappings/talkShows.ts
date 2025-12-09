
import { Tv, Sun, Moon, Mic } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const talkShowsSubcategories: SubcategoryMapping = {
  '/talk-shows/morning': {
    title: 'Morning Shows',
    description: 'Morning talk shows and breakfast television programs',
    icon: Sun,
    parent: { route: '/talk-shows', name: 'Talk Shows' }
  },
  '/talk-shows/evening': {
    title: 'Evening Talk Shows',
    description: 'Evening and primetime talk show programs',
    icon: Moon,
    parent: { route: '/talk-shows', name: 'Talk Shows' }
  },
  '/talk-shows/interviews': {
    title: 'Interview Programs',
    description: 'In-depth interview shows and celebrity conversations',
    icon: Mic,
    parent: { route: '/talk-shows', name: 'Talk Shows' }
  },
  'talk-shows-morning': {
    title: 'Morning Shows',
    description: 'Morning talk shows and breakfast television programs',
    icon: Sun,
    parent: { route: '/talk-shows', name: 'Talk Shows' }
  },
  'talk-shows-evening': {
    title: 'Evening Talk Shows',
    description: 'Evening and primetime talk show programs',
    icon: Moon,
    parent: { route: '/talk-shows', name: 'Talk Shows' }
  },
  'talk-shows-interviews': {
    title: 'Interview Programs',
    description: 'In-depth interview shows and celebrity conversations',
    icon: Mic,
    parent: { route: '/talk-shows', name: 'Talk Shows' }
  },
};
