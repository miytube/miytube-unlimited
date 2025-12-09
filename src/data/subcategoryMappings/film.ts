import { Film, Clapperboard, Drama, Laugh, Skull, Heart, FlaskConical, Sword, Compass, Castle, Bookmark, Bomb, Scale, Medal, Flame, Flower, Scissors, Music, Popcorn, FileText, Ghost } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const filmSubcategories: SubcategoryMapping = {
  // Film & Movies subcategories
  'film-romance': {
    title: 'Film (Romance)',
    description: 'Romantic films and love stories',
    icon: Heart,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-action-crime-thriller': {
    title: 'Film (Action, Crime, Thriller)',
    description: 'Action-packed crime and thriller films',
    icon: Bomb,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-action-thriller-adventure': {
    title: 'Film (Action, Thriller, Adventure)',
    description: 'Action, thriller, and adventure films',
    icon: Sword,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-adventure-fantasy': {
    title: 'Film (Adventure, Fantasy, Thriller)',
    description: 'Adventure, fantasy, and thriller films',
    icon: Castle,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-comedy-drama-crime': {
    title: 'Film (Comedy, Drama, Crime)',
    description: 'Films combining comedy, drama, and crime',
    icon: Bookmark,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-comedy': {
    title: 'Film (Comedy)',
    description: 'Comedy films and humorous movies',
    icon: Laugh,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-crime-drama-thriller': {
    title: 'Film (Crime, Drama, Thriller)',
    description: 'Crime, drama, and thriller films',
    icon: Scale,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-documentary-drama-crime': {
    title: 'Film (Documentary, Drama, Crime)',
    description: 'Documentary-style drama and crime films',
    icon: Film,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-drama': {
    title: 'Film (Drama)',
    description: 'Dramatic films and emotional stories',
    icon: Drama,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-gangsters-crime-drama': {
    title: 'Film (Gangsters, Crime, Drama)',
    description: 'Gangster films with crime and drama',
    icon: Skull,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-mystery-fiction': {
    title: 'Film (Mystery, Fiction)',
    description: 'Mystery and fiction films',
    icon: FlaskConical,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-romance-comedy-drama': {
    title: 'Film (Romance, Comedy, Drama)',
    description: 'Romantic comedies and dramatic love stories',
    icon: Flower,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-scientific': {
    title: 'Film (Scientific)',
    description: 'Scientific and science-themed films',
    icon: FlaskConical,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-war-action-thriller': {
    title: 'Film (War, Action, Thriller)',
    description: 'War films with action and thriller elements',
    icon: Sword,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-westerns-action-drama': {
    title: 'Film (Westerns, Action, Drama)',
    description: 'Western films with action and drama',
    icon: Flame,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-westerns-crime-thriller': {
    title: 'Film (Westerns, Crime, Thriller)',
    description: 'Western films with crime and thriller elements',
    icon: Flame,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-westerns': {
    title: 'Westerns',
    description: 'Classic and modern Western films featuring cowboys, outlaws, and frontier adventures',
    icon: Flame,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-spaghetti-westerns': {
    title: 'Spaghetti Westerns',
    description: 'Italian-produced Western films known for stylized violence and iconic soundtracks',
    icon: Flame,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-modern-westerns': {
    title: 'Modern Westerns',
    description: 'Contemporary Western films with modern settings and themes',
    icon: Flame,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-western-comedies': {
    title: 'Western Comedies',
    description: 'Humorous Western films blending frontier settings with comedy',
    icon: Laugh,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-movies-action-thriller': {
    title: 'Film, Movies (Action, Thriller)',
    description: 'Action and thriller movies',
    icon: Bomb,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-movies-clips': {
    title: 'Film, Movies (Clips)',
    description: 'Movie clips and film excerpts',
    icon: Scissors,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-movies-created': {
    title: 'Films, Movies (Created, Filmed)',
    description: 'Original created and filmed movies',
    icon: Clapperboard,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },

  // Film Animation subcategories
  'film-animation-action': {
    title: 'Film & Animation (Action)',
    description: 'Action-packed animated films',
    icon: Sword,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-movies': {
    title: 'Film & Animation Movies',
    description: 'Animated feature films and movies',
    icon: Popcorn,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-fantasy-drama': {
    title: 'Film Animation (Fantasy, Drama)',
    description: 'Fantasy and drama animated films',
    icon: Castle,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-adventure': {
    title: 'Film Animation (Adventure)',
    description: 'Adventure animated films',
    icon: Compass,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-cartoons': {
    title: 'Film Animation (Cartoons)',
    description: 'Traditional cartoons and animated series',
    icon: Clapperboard,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-comedy-crime': {
    title: 'Film Animation (Comedy, Crime)',
    description: 'Comedy and crime animated films',
    icon: Bookmark,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-comedy': {
    title: 'Film Animation (Comedy)',
    description: 'Comedy animated films',
    icon: Laugh,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-drama': {
    title: 'Film Animation (Drama)',
    description: 'Dramatic animated films',
    icon: Drama,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-musical-comedy': {
    title: 'Film Animation (Musical, Comedy)',
    description: 'Musical comedy animated films',
    icon: Music,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-parody-comedy': {
    title: 'Film Animation (Parody, Comedy)',
    description: 'Parody and comedy animated films',
    icon: Laugh,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-short-film': {
    title: 'Film Animation (Short Film)',
    description: 'Short animated films',
    icon: Film,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-clips-trailers': {
    title: 'Film, Animation (Clips, Trailers)',
    description: 'Animation clips and movie trailers',
    icon: Scissors,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
  'film-animation-horror': {
    title: 'Film, Animation, Movies (Horror)',
    description: 'Horror animated films and movies',
    icon: Ghost,
    parent: {
      route: '/film-animation',
      name: 'Film & Animation'
    }
  },
};
