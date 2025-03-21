
import { Film, Clapperboard, Drama, Laugh, Skull, Heart, Flask, Sword, Compass, Castle, Masks, Bomb, Scale, Medal, Flame, Flower } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const filmSubcategories: SubcategoryMapping = {
  'film-romance': {
    title: 'Romance Films',
    description: 'Films focused on romantic relationships and love stories',
    icon: Heart,
    parent: {
      route: '/film',
      name: 'Film'
    }
  },
  'film-action-crime-thriller': {
    title: 'Action, Crime & Thriller',
    description: 'Films in the action, crime, and thriller genres',
    icon: Bomb,
    parent: {
      route: '/film',
      name: 'Film'
    }
  },
  'film-action-thriller-adventure': {
    title: 'Action, Thriller & Adventure',
    description: 'Films combining action, thriller, and adventure elements',
    icon: Sword,
    parent: {
      route: '/film',
      name: 'Film'
    }
  },
  'film-adventure-fantasy': {
    title: 'Adventure & Fantasy',
    description: 'Films in the adventure and fantasy genres',
    icon: Castle,
    parent: {
      route: '/film',
      name: 'Film'
    }
  },
  'film-comedy-drama-crime': {
    title: 'Comedy, Drama & Crime',
    description: 'Films combining comedy, drama, and crime elements',
    icon: Masks,
    parent: {
      route: '/film',
      name: 'Film'
    }
  },
  'film-comedy': {
    title: 'Comedy Films',
    description: 'Films in the comedy genre',
    icon: Laugh,
    parent: {
      route: '/film',
      name: 'Film'
    }
  },
  'film-crime-drama-thriller': {
    title: 'Crime, Drama & Thriller',
    description: 'Films combining crime, drama, and thriller elements',
    icon: Scale,
    parent: {
      route: '/film',
      name: 'Film'
    }
  },
  'film-documentary-drama-crime': {
    title: 'Documentary, Drama & Crime',
    description: 'Documentary-style films with drama and crime elements',
    icon: Film,
    parent: {
      route: '/film',
      name: 'Film'
    }
  },
  'film-drama': {
    title: 'Drama Films',
    description: 'Films in the drama genre',
    icon: Drama,
    parent: {
      route: '/film',
      name: 'Film'
    }
  },
  'film-gangsters-crime-drama': {
    title: 'Gangsters, Crime & Drama',
    description: 'Films about gangsters with crime and drama elements',
    icon: Skull,
    parent: {
      route: '/film',
      name: 'Film'
    }
  },
  'film-romance-comedy-drama': {
    title: 'Romance, Comedy & Drama',
    description: 'Films combining romance, comedy, and drama elements',
    icon: Flower,
    parent: {
      route: '/film',
      name: 'Film'
    }
  },
  'film-scientific': {
    title: 'Scientific Films',
    description: 'Films with scientific themes and concepts',
    icon: Flask,
    parent: {
      route: '/film',
      name: 'Film'
    }
  },
  'film-war-action-thriller': {
    title: 'War, Action & Thriller',
    description: 'War films with action and thriller elements',
    icon: Sword,
    parent: {
      route: '/film',
      name: 'Film'
    }
  },
  'film-westerns-action-drama': {
    title: 'Westerns, Action & Drama',
    description: 'Western films with action and drama elements',
    icon: Flame,
    parent: {
      route: '/film',
      name: 'Film'
    }
  },
  'film-animation-action': {
    title: 'Action Animation',
    description: 'Animated films in the action genre',
    icon: Clapperboard,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-fantasy-drama': {
    title: 'Fantasy & Drama Animation',
    description: 'Animated films combining fantasy and drama elements',
    icon: Castle,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-adventure': {
    title: 'Adventure Animation',
    description: 'Animated films in the adventure genre',
    icon: Compass,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-cartoons': {
    title: 'Cartoons',
    description: 'Traditional cartoon and animated content',
    icon: Clapperboard,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-comedy-crime': {
    title: 'Comedy & Crime Animation',
    description: 'Animated films combining comedy and crime elements',
    icon: Masks,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-comedy': {
    title: 'Comedy Animation',
    description: 'Animated films in the comedy genre',
    icon: Laugh,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-drama': {
    title: 'Drama Animation',
    description: 'Animated films in the drama genre',
    icon: Drama,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-parody-comedy': {
    title: 'Parody & Comedy Animation',
    description: 'Animated films combining parody and comedy elements',
    icon: Laugh,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-movies-action-thriller': {
    title: 'Action & Thriller Movies',
    description: 'Movies combining action and thriller elements',
    icon: Bomb,
    parent: {
      route: '/film-movies',
      name: 'Film & Movies'
    }
  },
  'film-movies-clips': {
    title: 'Movie Clips',
    description: 'Short clips from films and movies',
    icon: Film,
    parent: {
      route: '/film-movies',
      name: 'Film & Movies'
    }
  }
};
