import { Gamepad2 } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const gameShowsSubcategories: SubcategoryMapping = {
  'game-shows-trivia': {
    title: 'Trivia Shows',
    description: 'Quiz and trivia game shows testing knowledge',
    icon: Gamepad2,
    parent: {
      route: '/game-shows',
      name: 'Game Shows'
    }
  },
  '/game-shows/trivia': {
    title: 'Trivia Shows',
    description: 'Quiz and trivia game shows testing knowledge',
    icon: Gamepad2,
    parent: {
      route: '/game-shows',
      name: 'Game Shows'
    }
  },
  'game-shows-physical-challenges': {
    title: 'Physical Challenges',
    description: 'Game shows featuring physical competitions and obstacles',
    icon: Gamepad2,
    parent: {
      route: '/game-shows',
      name: 'Game Shows'
    }
  },
  '/game-shows/physical-challenges': {
    title: 'Physical Challenges',
    description: 'Game shows featuring physical competitions and obstacles',
    icon: Gamepad2,
    parent: {
      route: '/game-shows',
      name: 'Game Shows'
    }
  },
  'game-shows-word-games': {
    title: 'Word Games',
    description: 'Game shows featuring word puzzles and vocabulary challenges',
    icon: Gamepad2,
    parent: {
      route: '/game-shows',
      name: 'Game Shows'
    }
  },
  '/game-shows/word-games': {
    title: 'Word Games',
    description: 'Game shows featuring word puzzles and vocabulary challenges',
    icon: Gamepad2,
    parent: {
      route: '/game-shows',
      name: 'Game Shows'
    }
  }
};
