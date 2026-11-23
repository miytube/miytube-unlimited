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
  { id: 'poker', name: "Texas Hold'em", tagline: 'Take a seat at the poker table with other members.', status: 'soon', group: 'Cards' },
  { id: 'sic-bo', name: 'Sic Bo', tagline: 'Three dice, big or small. The classic Chinese dice game.', status: 'soon', group: 'Chinese games' },
  { id: 'pai-gow', name: 'Pai Gow', tagline: 'Chinese domino tiles, two hands, beat the banker.', status: 'soon', group: 'Chinese games' },
  { id: 'mahjong', name: 'Mahjong', tagline: 'Match the tiles and clear the board.', status: 'soon', group: 'Chinese games' },
  { id: 'golf', name: 'Mini Golf', tagline: 'Your avatar on the green. Lowest strokes wins.', status: 'soon', group: 'Sports' },
  { id: 'bowling', name: 'Bowling', tagline: 'Roll for strikes in the MiyTube lanes.', status: 'soon', group: 'Sports' },
];
