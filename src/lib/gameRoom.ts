/** Tables in the MiyTube Gaming Room lobby. Only open tables have a play page. */
export type GameTableStatus = 'open' | 'soon';

export interface GameTable {
  id: string;
  name: string;
  tagline: string;
  path?: string;
  status: GameTableStatus;
  group: 'Cards' | 'Chinese games' | 'Sports';
}

export const GAME_TABLES: GameTable[] = [
  { id: 'blackjack', name: 'Blackjack', tagline: 'Beat the dealer to 21. Blackjack pays 3 to 2.', path: '/game-room/blackjack', status: 'open', group: 'Cards' },
  { id: 'poker', name: "Texas Hold'em", tagline: 'You vs the dealer. Royal flush pays 100 to 1.', path: '/game-room/texas-holdem', status: 'open', group: 'Cards' },
  { id: 'tournament', name: 'Championship Poker', tagline: 'Free six-seat Sit & Go. Five bots. One champion.', path: '/game-room/tournament', status: 'open', group: 'Cards' },
  { id: 'sic-bo', name: 'Sic Bo', tagline: 'Three dice, big or small. Triples pay 180 to 1.', path: '/game-room/sic-bo', status: 'open', group: 'Chinese games' },
  { id: 'pai-gow', name: 'Pai Gow Poker', tagline: 'Seven cards, two hands, beat the banker.', path: '/game-room/pai-gow', status: 'open', group: 'Chinese games' },
  { id: 'mahjong', name: 'Mahjong', tagline: 'Match the tiles and clear the pyramid. Free to play.', path: '/game-room/mahjong', status: 'open', group: 'Chinese games' },
  { id: 'golf', name: 'Mini Golf', tagline: 'Your avatar on the green. Lowest strokes wins.', status: 'soon', group: 'Sports' },
  { id: 'bowling', name: 'Bowling', tagline: 'Roll for strikes in the MiyTube lanes.', status: 'soon', group: 'Sports' },
];
