
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
  'comedy-jokes': {
    title: 'Comedy & Jokes',
    description: 'Comedy sketches, jokes and humorous content',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/comedy/standup': {
    title: 'Stand-up Comedy',
    description: 'Stand-up comedians, performances and specials',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/comedy/roasts': {
    title: 'Roasts & Jokes & Events',
    description: 'Comedy roasts, jokes and humorous events',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/comedy/snl': {
    title: 'SNL (Saturday Night Live)',
    description: 'SNL sketches, performers and history',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/comedy/sitcom': {
    title: 'Comedy Shows (Sitcom)',
    description: 'Situation comedy shows and TV series',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/comedy/pranks': {
    title: 'Funny & Pranks Videos',
    description: 'Practical jokes, pranks and humorous clips',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/comedy/jokes': {
    title: 'Comedy & Jokes',
    description: 'Comedy sketches, jokes and humorous content',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/comedians': {
    title: 'Comedians',
    description: 'Famous comedians, profiles and performances',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/comedians/interviews': {
    title: 'Interviews & Work',
    description: 'Interviews with comedians and behind-the-scenes',
    icon: Smile,
    parent: { route: '/comedians', name: 'Comedians' }
  },
  '/comedians/specials': {
    title: 'Comedy Specials',
    description: 'Stand-up comedy specials and performances',
    icon: Smile,
    parent: { route: '/comedians', name: 'Comedians' }
  },
  '/funny': {
    title: 'Funny Videos',
    description: 'Funny videos and humorous content',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/funny/pranks': {
    title: 'Funny Pranks (Work, Home)',
    description: 'Funny pranks at work and home',
    icon: Smile,
    parent: { route: '/funny', name: 'Funny' }
  },
  '/funny/shorts': {
    title: 'Funny Short Videos',
    description: 'Short comedic videos for quick laughs',
    icon: Smile,
    parent: { route: '/funny', name: 'Funny' }
  },
  '/funny/videos': {
    title: 'Funny Videos',
    description: 'Hilarious video compilations',
    icon: Smile,
    parent: { route: '/funny', name: 'Funny' }
  },
  '/funny/weird': {
    title: 'Funny Weird (Wacky, Bizarre)',
    description: 'Strange, unusual, and bizarre funny videos',
    icon: Smile,
    parent: { route: '/funny', name: 'Funny' }
  },
  '/bloopers': {
    title: 'Bloopers',
    description: 'Bloopers, outtakes and funny mistakes',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/bloopers/screwup': {
    title: 'Screwups & Blunders',
    description: 'Funny screwups and blunders',
    icon: Smile,
    parent: { route: '/bloopers', name: 'Bloopers' }
  },
  '/bloopers/fails': {
    title: 'Fails & Mistakes',
    description: 'Funny fails and mistakes',
    icon: Smile,
    parent: { route: '/bloopers', name: 'Bloopers' }
  },
  '/fails': {
    title: 'Fails',
    description: 'Epic fails and funny mistakes',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/fails/expensive': {
    title: 'Expensive Fails & Crashes',
    description: 'Expensive accidents and costly fails',
    icon: Smile,
    parent: { route: '/fails', name: 'Fails' }
  },
  '/fails/people': {
    title: 'People Fails & Comedy',
    description: 'Funny people fails and accidents',
    icon: Smile,
    parent: { route: '/fails', name: 'Fails' }
  },
  '/crazy': {
    title: 'Crazy & Amazing',
    description: 'Crazy, amazing and unbelievable content',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/crazy/amazing': {
    title: 'Amazing Things',
    description: 'Amazing and incredible videos',
    icon: Smile,
    parent: { route: '/crazy', name: 'Crazy & Amazing' }
  },
  '/crazy/wouldnt-believe': {
    title: "Wouldn't Believe",
    description: 'Unbelievable and incredible moments',
    icon: Smile,
    parent: { route: '/crazy', name: 'Crazy & Amazing' }
  },
};
