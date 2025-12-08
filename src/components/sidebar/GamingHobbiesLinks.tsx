
import React from 'react';
import { Gamepad2, Dice1, Wand2, Target, Trophy, Puzzle } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const GamingHobbiesLinks: React.FC = () => {
  const gamingHobbiesLinks = [
    { 
      id: 'gaming', 
      icon: Gamepad2, 
      label: 'Gaming', 
      path: '/gaming',
      subItems: [
        { id: 'gaming-arcade', label: 'Arcade Games', path: '/gaming/arcade' },
        { id: 'gaming-casino', label: 'Casino Slots', path: '/gaming/casino' },
        { id: 'gaming-dominos', label: 'Dominos & Domino Fails', path: '/gaming/dominos' },
        { id: 'gaming-lottery', label: 'Lottery & Prize & Raffle', path: '/gaming/lottery' },
        { id: 'gaming-xbox', label: 'Xbox & PlayStation 5', path: '/gaming/xbox' },
        { id: 'gaming-cards', label: 'Gaming Cards', path: '/gaming/cards' }
      ]
    },
    { 
      id: 'magic-tricks', 
      icon: Wand2, 
      label: 'Magic Tricks', 
      path: '/magic-tricks',
      subItems: [
        { id: 'magic-illusions', label: 'Illusions & Tricks', path: '/magic-tricks/illusions' },
        { id: 'magic-card', label: 'Card Tricks', path: '/magic-tricks/card' }
      ]
    },
    { 
      id: 'game-challenges', 
      icon: Target, 
      label: 'Game Challenges', 
      path: '/game-challenges',
      subItems: [
        { id: 'game-toys', label: 'Game Toys (Rockets, Missiles)', path: '/game-challenges/toys' },
        { id: 'game-experiments', label: 'Experiments Toys', path: '/game-challenges/experiments' }
      ]
    },
    { 
      id: 'riddles', 
      icon: Puzzle, 
      label: 'Riddles & Puzzles', 
      path: '/riddles',
      subItems: [
        { id: 'riddles-conundrum', label: 'Conundrums & Puzzles', path: '/riddles/conundrum' }
      ]
    },
    { 
      id: 'dances', 
      icon: Trophy, 
      label: 'Dances', 
      path: '/dances',
      subItems: [
        { id: 'dances-styles', label: 'Different Dance Styles', path: '/dances/styles' },
        { id: 'dances-choreography', label: 'Music Choreography', path: '/dances/choreography' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="GAMING & HOBBIES" links={gamingHobbiesLinks} />;
};
