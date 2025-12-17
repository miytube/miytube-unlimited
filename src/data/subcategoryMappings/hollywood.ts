import { Film, User, Newspaper, Mic, Star } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const hollywoodSubcategories: SubcategoryMapping = {
  'hollywood-bios': {
    title: 'Actors & Actress: Bios & History',
    description: 'Biographies and history of Hollywood actors and actresses',
    icon: User,
    parent: {
      route: '/hollywood',
      name: 'Hollywood'
    }
  },
  'hollywood-news': {
    title: 'Actors & Actress: News & Gossip',
    description: 'Latest news and gossip about Hollywood celebrities',
    icon: Newspaper,
    parent: {
      route: '/hollywood',
      name: 'Hollywood'
    }
  },
  'hollywood-interviews': {
    title: 'Actors & Actress: Interviews & Work',
    description: 'Interviews and work highlights from Hollywood stars',
    icon: Mic,
    parent: {
      route: '/hollywood',
      name: 'Hollywood'
    }
  },
  'hollywood-celebrities-actors': {
    title: 'Celebrity Actors',
    description: 'Famous celebrity actors and their careers',
    icon: Star,
    parent: {
      route: '/hollywood',
      name: 'Hollywood'
    }
  },
  'hollywood-celebrities-news': {
    title: 'Celebrity News',
    description: 'Latest news about celebrities and entertainment',
    icon: Newspaper,
    parent: {
      route: '/hollywood',
      name: 'Hollywood'
    }
  },
};
