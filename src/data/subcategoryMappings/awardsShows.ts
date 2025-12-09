import { Award } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const awardsShowsSubcategories: SubcategoryMapping = {
  'awards-shows-music': {
    title: 'Music Awards',
    description: 'Grammy Awards, MTV VMAs, and music award ceremonies',
    icon: Award,
    parent: {
      route: '/awards-shows',
      name: 'Awards Shows'
    }
  },
  '/awards-shows/music': {
    title: 'Music Awards',
    description: 'Grammy Awards, MTV VMAs, and music award ceremonies',
    icon: Award,
    parent: {
      route: '/awards-shows',
      name: 'Awards Shows'
    }
  },
  'awards-shows-film': {
    title: 'Film Awards',
    description: 'Oscars, Golden Globes, and film award ceremonies',
    icon: Award,
    parent: {
      route: '/awards-shows',
      name: 'Awards Shows'
    }
  },
  '/awards-shows/film': {
    title: 'Film Awards',
    description: 'Oscars, Golden Globes, and film award ceremonies',
    icon: Award,
    parent: {
      route: '/awards-shows',
      name: 'Awards Shows'
    }
  },
  'awards-shows-tv': {
    title: 'TV Awards',
    description: 'Emmy Awards and television award ceremonies',
    icon: Award,
    parent: {
      route: '/awards-shows',
      name: 'Awards Shows'
    }
  },
  '/awards-shows/tv': {
    title: 'TV Awards',
    description: 'Emmy Awards and television award ceremonies',
    icon: Award,
    parent: {
      route: '/awards-shows',
      name: 'Awards Shows'
    }
  }
};
