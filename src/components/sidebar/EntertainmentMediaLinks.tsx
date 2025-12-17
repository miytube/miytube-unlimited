
import React from 'react';
import { Film, Clapperboard, Tv, Radio, Mic, Camera, Star, Popcorn } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const EntertainmentMediaLinks: React.FC = () => {
  const entertainmentMediaLinks = [
    { 
      id: 'entertainment', 
      icon: Star, 
      label: 'Entertainment', 
      path: '/entertainment',
      subItems: [
        { id: 'entertainment-oscars', label: 'Oscars & Golden Globes', path: '/entertainment/oscars' },
        { id: 'entertainment-actors', label: 'Actors & Actresses', path: '/entertainment/actors' },
        { id: 'entertainment-late-night', label: 'Late Night Shows', path: '/entertainment/late-night' },
        { id: 'entertainment-podcast', label: 'Film & Entertainment Podcasts', path: '/entertainment/podcast' },
        { id: 'entertainment-auditions', label: 'Auditions & Contests', path: '/entertainment/auditions' }
      ]
    },
    { 
      id: 'film', 
      icon: Clapperboard, 
      label: 'Film', 
      path: '/film-animation',
      subItems: [
        { id: 'film-romance', label: 'Romance', path: '/film/romance' },
        { id: 'film-action-crime', label: 'Action, Crime, Thriller', path: '/film/action-crime' },
        { id: 'film-adventure', label: 'Adventure, Fantasy, Thriller', path: '/film/adventure' },
        { id: 'film-comedy-drama', label: 'Comedy, Drama, Crime', path: '/film/comedy-drama' },
        { id: 'film-comedy', label: 'Comedy', path: '/film/comedy' },
        { id: 'film-crime-drama', label: 'Crime, Drama, Thriller', path: '/film/crime-drama' },
        { id: 'film-documentary', label: 'Documentary', path: '/film/documentary' },
        { id: 'film-drama', label: 'Drama', path: '/film/drama' },
        { id: 'film-gangsters', label: 'Gangsters, Crime, Drama', path: '/film/gangsters' },
        { id: 'film-mystery', label: 'Mystery & Fiction', path: '/film/mystery' },
        { id: 'film-scientific', label: 'Scientific', path: '/film/scientific' },
        { id: 'film-war', label: 'War Films', path: '/film/war' },
        { id: 'film-westerns', label: 'Westerns', path: '/film/westerns' },
        { id: 'film-clips', label: 'Film Clips & Trailers', path: '/film/clips' }
      ]
    },
    { 
      id: 'animation', 
      icon: Film, 
      label: 'Animation', 
      path: '/animation',
      subItems: [
        { id: 'animation-action', label: 'Action Animation', path: '/animation/action' },
        { id: 'animation-fantasy', label: 'Fantasy & Dark', path: '/animation/fantasy' },
        { id: 'animation-adventure', label: 'Adventure Animation', path: '/animation/adventure' },
        { id: 'animation-cartoons', label: 'Cartoons', path: '/animation/cartoons' },
        { id: 'animation-comedy', label: 'Comedy Animation', path: '/animation/comedy' },
        { id: 'animation-drama', label: 'Drama Animation', path: '/animation/drama' },
        { id: 'animation-musical', label: 'Musical Animation', path: '/animation/musical' },
        { id: 'animation-parody', label: 'Parody Animation', path: '/animation/parody' },
        { id: 'animation-short', label: 'Short Films', path: '/animation/short' }
      ]
    },
    { 
      id: 'tv-shows', 
      icon: Tv, 
      label: 'TV Shows', 
      path: '/tv-shows',
      subItems: [
        { id: 'tv-news', label: 'TV News Shows', path: '/tv-shows/news' },
        { id: 'tv-court', label: 'Court TV', path: '/tv-shows/court' },
        { id: 'tv-talk', label: 'Talk Shows (The View)', path: '/tv-shows/talk' }
      ]
    },
    { 
      id: 'hollywood', 
      icon: Camera, 
      label: 'Hollywood', 
      path: '/hollywood',
      subItems: [
        { id: 'hollywood-bios', label: 'Actor & Actress Bios', path: '/hollywood/bios' },
        { id: 'hollywood-news', label: 'Hollywood News & Gossip', path: '/hollywood/news' },
        { id: 'hollywood-interviews', label: 'Hollywood Interviews', path: '/hollywood/interviews' }
      ]
    },
    { 
      id: 'radio', 
      icon: Radio, 
      label: 'Radio', 
      path: '/radio',
      subItems: [
        { id: 'radio-music', label: 'Music Radio', path: '/radio/music' },
        { id: 'radio-podcast', label: 'Podcast Radio', path: '/radio/podcast' },
        { id: 'radio-rc', label: 'RC Cars & Airplanes', path: '/radio/rc' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="ENTERTAINMENT & MEDIA" links={entertainmentMediaLinks} />;
};
