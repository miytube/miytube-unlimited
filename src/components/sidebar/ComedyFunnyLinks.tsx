
import React from 'react';
import { Smile, Laugh, Drama, PartyPopper, AlertCircle, Zap } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const ComedyFunnyLinks: React.FC = () => {
  const comedyFunnyLinks = [
    { 
      id: 'comedy', 
      icon: Smile, 
      label: 'Comedy', 
      path: '/comedy',
      subItems: [
        { id: 'comedy-standup', label: 'Stand Up Comedy', path: '/comedy/standup' },
        { id: 'comedy-roasts', label: 'Roasts & Jokes & Events', path: '/comedy/roasts' },
        { id: 'comedy-snl', label: 'SNL (Saturday Night Live)', path: '/comedy/snl' },
        { id: 'comedy-sitcom', label: 'Comedy Shows (Sitcom)', path: '/comedy/sitcom' },
        { id: 'comedy-pranks', label: 'Funny & Pranks Videos', path: '/comedy/pranks' },
        { id: 'comedy-jokes', label: 'Comedy & Jokes', path: '/comedy/jokes' }
      ]
    },
    { 
      id: 'comedians', 
      icon: Drama, 
      label: 'Comedians', 
      path: '/comedians',
      subItems: [
        { id: 'comedians-interviews', label: 'Interviews & Work', path: '/comedians/interviews' },
        { id: 'comedians-specials', label: 'Comedy Specials', path: '/comedians/specials' }
      ]
    },
    { 
      id: 'funny', 
      icon: Laugh, 
      label: 'Funny', 
      path: '/funny',
      subItems: [
        { id: 'funny-pranks', label: 'Funny Pranks (Work, Home)', path: '/funny/pranks' },
        { id: 'funny-shorts', label: 'Funny Short Videos', path: '/funny/shorts' },
        { id: 'funny-videos', label: 'Funny Videos', path: '/funny/videos' },
        { id: 'funny-weird', label: 'Funny Weird (Wacky, Bizarre)', path: '/funny/weird' }
      ]
    },
    { 
      id: 'bloopers', 
      icon: PartyPopper, 
      label: 'Bloopers', 
      path: '/bloopers',
      subItems: [
        { id: 'bloopers-screwup', label: 'Screwups & Blunders', path: '/bloopers/screwup' },
        { id: 'bloopers-fails', label: 'Fails & Mistakes', path: '/bloopers/fails' }
      ]
    },
    { 
      id: 'fails', 
      icon: AlertCircle, 
      label: 'Fails', 
      path: '/fails',
      subItems: [
        { id: 'fails-expensive', label: 'Expensive Fails & Crashes', path: '/fails/expensive' },
        { id: 'fails-people', label: 'People Fails & Comedy', path: '/fails/people' }
      ]
    },
    { 
      id: 'crazy', 
      icon: Zap, 
      label: 'Crazy & Amazing', 
      path: '/crazy',
      subItems: [
        { id: 'crazy-amazing', label: 'Amazing Things', path: '/crazy/amazing' },
        { id: 'crazy-wouldnt-believe', label: "Wouldn't Believe", path: '/crazy/wouldnt-believe' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="COMEDY & FUNNY" links={comedyFunnyLinks} />;
};
