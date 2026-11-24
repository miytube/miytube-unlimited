import {
  BLIND_LEVELS, HANDS_PER_LEVEL, TOURNAMENT_BOTS, TOURNAMENT_SEATS,
  TOURNAMENT_STARTING_CHIPS,
  type TournamentAction, type TournamentStatus, type TournamentView,
} from './tournamentTypes.ts';

export interface EngineCard { rank: string; suit: string }
interface EngineSeat { totalChips: number; stack: number; betSize: number }
export interface PokerTable {
  sitDown(seat: number, chips: number): void; startHand(button?: number): void;
  isHandInProgress(): boolean; isBettingRoundInProgress(): boolean;
  areBettingRoundsCompleted(): boolean; endBettingRound(): void; showdown(): void;
  playerToAct(): number; button(): number; roundOfBetting(): string;
  communityCards(): EngineCard[]; holeCards(): (EngineCard[] | null)[];
  seats(): (EngineSeat | null)[]; handPlayers(): (EngineSeat | null)[];
  pots(): { size: number; eligiblePlayers: number[] }[];
  legalActions(): { actions: TournamentAction[]; chipRange?: { min: number; max: number } };
  actionTaken(action: TournamentAction, amount?: number): void;
  winners(): [number, { ranking: number }, EngineCard[]][][];
}
export type PokerConstructor = new (blinds: { smallBlind: number; bigBlind: number }, seats: number) => PokerTable;
export interface TournamentState {
  id: string; hand: number; button: number; stacks: number[]; deck: number[];
  actions: { seat: number; action: TournamentAction; amount?: number; street: string }[];
  status: TournamentStatus; places: (number | null)[];
  recent: { hand: number; result: string; net: number }[];
}
export const blindsForHand = (hand: number) => {
  const level = Math.min(Math.floor((hand - 1) / HANDS_PER_LEVEL), BLIND_LEVELS.length - 1);
  return { level: level + 1, bigBlind: BLIND_LEVELS[level], smallBlind: BLIND_LEVELS[level] / 2 };
};
const seatName = (seat: number) => seat === 0 ? 'You' : TOURNAMENT_BOTS[seat - 1]?.name ?? 'Opponent';
const HANDS = ['High card', 'Pair', 'Two pair', 'Three of a kind', 'Straight', 'Flush', 'Full house', 'Four of a kind', 'Straight flush', 'Royal flush'];
const uint = (max: number) => {
  const limit = Math.floor(4294967296 / max) * max;
  let n: number;
  do { n = crypto.getRandomValues(new Uint32Array(1))[0]; } while (n >= limit);
  return n % max;
};
export function shuffledDeck(): number[] {
  const deck = Array.from({ length: 52 }, (_, i) => i);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = uint(i + 1); [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
export const cardId = (c: EngineCard) => {
  const rank = 'A23456789TJQK'.indexOf(c.rank);
  const suit = ['clubs', 'diamonds', 'hearts', 'spades'].indexOf(c.suit);
  if (rank < 0 || suit < 0) throw new Error('Invalid engine card');
  return suit * 13 + rank;
};

interface InternalPlayer { totalChips(): number; stack(): number; betSize(): number; addToStack(amount: number): void }
interface InternalPot { _size: number; _eligiblePlayers: number[] }
/** Isolated adapter for pinned poker-ts: deck replay, short-all-in raise rights,
 * contribution-correct side pots, and retained all-in winner references. The
 * library remains responsible for betting order and all hand evaluation. */
function configureEngine(table: PokerTable, permutation: number[], bigBlind: number) {
  const internal = table as unknown as { _table: {
    _deck: { rank: number; suit: number }[] & { shuffle: () => void };
    _handPlayers?: (InternalPlayer | null)[];
    _tablePlayers: (InternalPlayer | null)[];
    _dealer?: {
      _bettingRound?: { _minRaise: number; _biggestBet: number };
      _players: (InternalPlayer | null)[];
      _potManager: { _pots: InternalPot[] };
      dealCommunityCards(): void;
    };
  } };
  const deck = internal._table._deck;
  if (deck.length !== 52 || permutation.length !== 52 || new Set(permutation).size !== 52) throw new Error('Invalid deck');
  const ordered = Array.from(deck).sort((a, b) => a.suit - b.suit || a.rank - b.rank);
  deck.shuffle = () => permutation.forEach((index, i) => { deck[i] = ordered[index]; });
  const originalLegal = table.legalActions.bind(table);
  const originalAction = table.actionTaken.bind(table);
  const originalStart = table.startHand.bind(table);
  const originalShowdown = table.showdown.bind(table);
  const originalEnd = table.endBettingRound.bind(table);
  let startingStacks: number[] = [];
  let originalPlayers: (InternalPlayer | null)[] = [];
  let street = ''; let fullRaise = bigBlind;
  const actedTo = new Map<number, number>();
  const folded = new Set<number>();
  table.startHand = button => {
    startingStacks = table.seats().map(s => s?.stack ?? 0);
    originalStart(button);
    originalPlayers = [...(internal._table._handPlayers ?? [])];
  };
  const contributionPots = () => {
    const seats = table.seats();
    // totalChips includes uncollected street bets; only collected contributions
    // form pots. Folded chips stay dead money at their actual contribution tier.
    const paid = startingStacks.map((chips, i) => chips - (seats[i]?.totalChips ?? 0));
    const levels = [...new Set(paid.filter(c => c > 0))].sort((a,b) => a-b);
    const pots: { size: number; eligiblePlayers: number[] }[] = [];
    const refunds: { seat: number; amount: number }[] = [];
    let previous = 0;
    for (const level of levels) {
      const contributors = paid.map((chips, seat) => ({ chips, seat })).filter(s => s.chips >= level);
      const eligiblePlayers = contributors.filter(s => !folded.has(s.seat)).map(s => s.seat);
      const size = (level - previous) * contributors.length;
      if (contributors.length === 1) {
        refunds.push({ seat: contributors[0].seat, amount: size });
        previous = level; continue;
      }
      const last = pots.at(-1);
      if (last && last.eligiblePlayers.join(',') === eligiblePlayers.join(',')) last.size += size;
      else pots.push({ size, eligiblePlayers });
      previous = level;
    }
    return { pots, refunds };
  };
  table.pots = () => contributionPots().pots;
  table.endBettingRound = () => {
    originalEnd();
    // The library may mistake a retained all-in main-pot contender for a fold
    // and omit the runout. Deal through the river before contested evaluation.
    if (table.areBettingRoundsCompleted() && table.communityCards().length < 5 && table.pots().some(p => p.eligiblePlayers.length > 1)) {
      internal._table._dealer?.dealCommunityCards();
    }
  };
  table.showdown = () => {
    const dealer = internal._table._dealer;
    const sample = dealer?._potManager._pots[0];
    if (!dealer || !sample) throw new Error('Missing pot manager');
    const Pot = sample.constructor as new () => InternalPot;
    const { pots, refunds } = contributionPots();
    dealer._potManager._pots = pots.map(p => {
      if (!p.eligiblePlayers.length) throw new Error('Invalid pot eligibility');
      const pot = new Pot(); pot._size = p.size; pot._eligiblePlayers = p.eligiblePlayers;
      return pot;
    });
    for (const refund of refunds) {
      const player = folded.has(refund.seat) ? internal._table._tablePlayers[refund.seat] : originalPlayers[refund.seat];
      player?.addToStack(refund.amount);
    }
    // poker-ts drops all-in seats from later betting rounds. Put their original
    // player objects back only for evaluation/payout, never in the turn queue.
    const remaining = originalPlayers.map((player, seat) => folded.has(seat) ? null : player);
    dealer._players = remaining;
    internal._table._handPlayers = remaining;
    originalShowdown();
  };
  const sync = () => {
    const nextStreet = table.roundOfBetting();
    if (street !== nextStreet) { street = nextStreet; fullRaise = bigBlind; actedTo.clear(); }
    const round = internal._table._dealer?._bettingRound;
    if (!round) throw new Error('Missing betting round');
    // An incomplete opening all-in can be completed to one big blind.
    round._minRaise = round._biggestBet < bigBlind ? bigBlind - round._biggestBet : fullRaise;
    return round;
  };
  table.legalActions = () => {
    const round = sync();
    const seat = table.playerToAct();
    const legal = originalLegal();
    const lastBet = actedTo.get(seat);
    const reopened = lastBet === undefined || (lastBet === 0 && round._biggestBet > 0) || round._biggestBet - lastBet >= fullRaise;
    const hasOpponent = table.seats().some((s, i) => i !== seat && !folded.has(i) && s && s.stack > 0);
    const opponentBet = Math.max(0, ...table.seats().map((s, i) => i !== seat && !folded.has(i) ? s?.betSize ?? 0 : 0));
    // A blind which already covers the last all-in opponent has no decision.
    // Expose only check, not a fold or a nominal full-big-blind top-up.
    if (!hasOpponent && (table.seats()[seat]?.betSize ?? 0) >= opponentBet) return { actions: ['check'] };
    if (!reopened || !hasOpponent) return { actions: legal.actions.filter(a => a !== 'bet' && a !== 'raise') };
    return legal;
  };
  table.actionTaken = (action, amount) => {
    const legal = table.legalActions();
    if (!legal.actions.includes(action)) throw new Error('That action is not available');
    if ((action === 'raise' || action === 'bet') && (amount === undefined || !Number.isSafeInteger(amount) || !legal.chipRange || amount < legal.chipRange.min || amount > legal.chipRange.max)) throw new Error('Choose a legal raise total');
    const round = sync(); const before = round._biggestBet;
    const seat = table.playerToAct();
    originalAction(action, amount);
    if (action === 'fold') folded.add(seat);
    if ((action === 'raise' || action === 'bet') && amount !== undefined) {
      if (before < bigBlind && amount >= bigBlind) fullRaise = amount;
      else if (amount - before >= fullRaise) fullRaise = amount - before;
    }
    actedTo.set(seat, round._biggestBet);
    round._minRaise = round._biggestBet < bigBlind ? bigBlind - round._biggestBet : fullRaise;
  };
}
export function newTournament(): TournamentState {
  return {
    id: crypto.randomUUID(), hand: 1, button: 0,
    stacks: Array(TOURNAMENT_SEATS).fill(TOURNAMENT_STARTING_CHIPS),
    deck: shuffledDeck(), actions: [], status: 'playing',
    places: Array(TOURNAMENT_SEATS).fill(null), recent: [],
  };
}
interface Runtime {
  table: PokerTable; finished: boolean; board: number[]; holes: number[][];
  folded: boolean[]; winners: number[]; result: string;
  pots: { size: number; eligiblePlayers: number[] }[];
}
export function replay(state: TournamentState, Table: PokerConstructor): Runtime {
  const { smallBlind, bigBlind } = blindsForHand(state.hand);
  const table = new Table({ smallBlind, bigBlind }, TOURNAMENT_SEATS);
  configureEngine(table, state.deck, bigBlind);
  state.stacks.forEach((chips, seat) => { if (chips > 0) table.sitDown(seat, chips); });
  table.startHand(state.button);
  const rt: Runtime = { table, finished: false, board: [], holes: [], folded: state.stacks.map(s => s === 0), winners: [], result: '', pots: [] };
  const normalize = () => {
    while (table.isHandInProgress()) {
      if (table.isBettingRoundInProgress()) {
        const seat = table.playerToAct();
        if ((table.seats()[seat]?.stack ?? 0) > 0) break;
        // Forced all-in blind seats cannot make another decision.
        const legal = table.legalActions().actions;
        table.actionTaken(legal.includes('check') ? 'check' : 'call');
        continue;
      }
      if (!table.areBettingRoundsCompleted()) { table.endBettingRound(); continue; }
      rt.board = table.communityCards().map(cardId);
      rt.holes = table.holeCards().map(c => c?.map(cardId) ?? []);
      rt.pots = table.pots();
      table.showdown();
      const ranked = table.winners().flat();
      rt.winners = [...new Set(ranked.map(w => w[0]))];
      if (rt.winners.length === 0) rt.winners = rt.pots[0]?.eligiblePlayers ?? [];
      rt.result = ranked.length > 0
        ? [...new Set(ranked.map(w => `${seatName(w[0])} · ${HANDS[w[1].ranking] ?? 'Winning hand'}`))].join(' / ')
        : `${seatName(rt.winners[0])} wins — everyone else folded`;
      rt.finished = true;
    }
  };
  normalize();
  for (const entry of state.actions) {
    if (rt.finished || table.playerToAct() !== entry.seat || table.roundOfBetting() !== entry.street) throw new Error('Invalid saved action');
    table.actionTaken(entry.action, entry.amount);
    if (entry.action === 'fold') rt.folded[entry.seat] = true;
    normalize();
  }
  if (!rt.finished) {
    rt.board = table.communityCards().map(cardId);
    rt.holes = table.holeCards().map(c => c?.map(cardId) ?? []);
    rt.pots = table.pots();
  }
  return rt;
}
export function tournamentView(state: TournamentState, version: number, Table: PokerConstructor): TournamentView {
  const rt = replay(state, Table);
  const { table, finished } = rt;
  const seats = table.seats();
  const actor = finished ? null : table.playerToAct();
  const legal = actor === 0 ? table.legalActions() : { actions: [] };
  const currentMax = Math.max(0, ...seats.map(s => s?.betSize ?? 0));
  const reveal = finished && rt.board.length === 5 && rt.pots.some(p => p.eligiblePlayers.length > 1);
  const net = (seats[0]?.stack ?? 0) - state.stacks[0];
  return {
    id: state.id, version, status: state.status, hand: state.hand, ...blindsForHand(state.hand),
    handsToNextLevel: HANDS_PER_LEVEL - ((state.hand - 1) % HANDS_PER_LEVEL),
    button: state.button, actor, street: finished ? 'showdown' : table.roundOfBetting(),
    board: rt.board, pot: rt.pots.reduce((a, p) => a + p.size, 0) + (finished ? 0 : seats.reduce((a, s) => a + (s?.betSize ?? 0), 0)),
    pots: rt.pots, seats: seats.map((s, seat) => {
      const last = state.actions.filter(a => a.seat === seat).at(-1);
      return {
        seat, name: seatName(seat), style: seat === 0 ? 'Member' : TOURNAMENT_BOTS[seat - 1].style,
        stack: s?.stack ?? 0, bet: s?.betSize ?? 0,
        cards: seat === 0 || (reveal && !rt.folded[seat]) ? rt.holes[seat] : [],
        folded: rt.folded[seat], eliminated: state.stacks[seat] === 0 || (finished && (s?.stack ?? 0) === 0),
        allIn: !finished && !rt.folded[seat] && s?.stack === 0,
        action: last ? `${last.action}${last.amount !== undefined ? ` ${last.amount.toLocaleString()}` : ''}` : '',
        place: state.places[seat],
      };
    }), legal: legal.actions, minRaise: legal.chipRange?.min ?? null,
    maxRaise: legal.chipRange?.max ?? null,
    callAmount: Math.min(currentMax - (seats[0]?.betSize ?? 0), seats[0]?.stack ?? 0),
    finished, result: rt.result, winners: rt.winners,
    log: state.actions.slice(-14).map(a => `${seatName(a.seat)} · ${a.street} · ${a.action}${a.amount !== undefined ? ` to ${a.amount.toLocaleString()}` : ''}`),
    place: state.places[0], recent: finished ? [{ hand: state.hand, result: rt.result, net }, ...state.recent].slice(0, 8) : state.recent,
  };
}
function botAction(rt: Runtime): { action: TournamentAction; amount?: number } {
  const { table } = rt;
  const seat = table.playerToAct();
  const legal = table.legalActions();
  const player = table.seats()[seat];
  if (!player) throw new Error('Missing player');
  // Deliberately only own hole cards + exposed board; never inspect another seat or future cards.
  const hole = rt.holes[seat];
  const ranks = hole.map(c => c % 13 === 0 ? 14 : c % 13 + 1);
  let strength = (Math.max(...ranks) - 2) / 20;
  if (ranks[0] === ranks[1]) strength += 0.4;
  if (Math.floor(hole[0] / 13) === Math.floor(hole[1] / 13)) strength += 0.1;
  if (Math.abs(ranks[0] - ranks[1]) === 1) strength += 0.08;
  if (rt.board.length > 0) {
    const all = [...hole, ...rt.board].map(c => c % 13);
    const counts = all.map(r => all.filter(x => x === r).length);
    strength = Math.max(strength, Math.max(...counts) >= 3 ? 0.85 : Math.max(...counts) === 2 ? 0.55 : 0.2);
  }
  const loose = seat === 1 || seat === 4;
  const tight = seat === 2;
  const noise = uint(100) / 100;
  const maxBet = Math.max(...table.seats().map(s => s?.betSize ?? 0));
  const call = Math.min(maxBet - player.betSize, player.stack);
  const aggression = loose ? 0.4 : tight ? 0.13 : 0.22;
  const raise = legal.actions.includes('raise') ? 'raise' : legal.actions.includes('bet') ? 'bet' : null;
  if (raise && legal.chipRange && noise < aggression && (strength > 0.55 || (loose && noise < 0.09))) {
    const { min, max } = legal.chipRange;
    const big = Math.max(100, blindsForHand(1).bigBlind, min - maxBet);
    const desired = strength > 0.85 && noise < 0.12 ? max : Math.max(min, maxBet + big * (loose ? 3 : 2));
    return { action: raise, amount: Math.min(max, desired) };
  }
  if (legal.actions.includes('check')) return { action: 'check' };
  const pressure = call / Math.max(1, player.totalChips);
  if (legal.actions.includes('call') && (strength > (tight ? 0.5 : 0.3) + pressure * 0.45 || (seat === 5 && pressure < 0.2) || (loose && noise > 0.45))) return { action: 'call' };
  return { action: 'fold' };
}
export function applyAction(state: TournamentState, Table: PokerConstructor, action?: TournamentAction, amount?: number): TournamentState {
  const next = structuredClone(state);
  if (state.status !== 'playing') throw new Error('Tournament is over');
  const rt = replay(state, Table);
  if (rt.finished) throw new Error('Start the next hand');
  const seat = rt.table.playerToAct();
  const decision = seat === 0 ? { action, amount } : botAction(rt);
  if (seat !== 0 && action !== undefined) throw new Error('Wait for your turn');
  if (!decision.action) throw new Error('Choose an action');
  const legal = rt.table.legalActions();
  if (!legal.actions.includes(decision.action)) throw new Error('That action is not available');
  if (decision.action === 'raise' || decision.action === 'bet') {
    if (!Number.isSafeInteger(decision.amount) || !legal.chipRange || (decision.amount ?? -1) < legal.chipRange.min || (decision.amount ?? Infinity) > legal.chipRange.max) throw new Error('Choose a legal raise total');
  } else if (decision.amount !== undefined) throw new Error('Only bets and raises take an amount');
  if (next.actions.length >= 512) throw new Error('Hand action limit reached');
  next.actions.push({ seat, action: decision.action, amount: decision.amount, street: rt.table.roundOfBetting() });
  const result = replay(next, Table);
  return finishHand(next, result);
}
function finishHand(state: TournamentState, result: Runtime): TournamentState {
  if (result.finished) {
    const seats = result.table.seats();
    const eliminated = state.stacks.map((stack, seat) => ({ stack, seat })).filter(s => s.stack > 0 && (seats[s.seat]?.stack ?? 0) === 0).sort((a, b) => b.stack - a.stack || a.seat - b.seat);
    const remaining = seats.filter(s => s && s.stack > 0).length;
    eliminated.forEach(s => { state.places[s.seat] = remaining + eliminated.findIndex(other => other.stack === s.stack) + 1; });
    if (remaining === 1) {
      const winner = seats.findIndex(s => s && s.stack > 0);
      if (winner >= 0) state.places[winner] = 1;
    }
    if ((seats[0]?.stack ?? 0) === 0) state.status = 'eliminated';
    else if (remaining === 1) { state.status = 'champion'; state.places[0] = 1; }
    const total = seats.reduce((sum, s) => sum + (s?.stack ?? 0), 0);
    if (total !== TOURNAMENT_STARTING_CHIPS * TOURNAMENT_SEATS) throw new Error('Chip conservation failed');
  }
  return state;
}
export function nextHand(state: TournamentState, Table: PokerConstructor): TournamentState {
  if (state.status !== 'playing') throw new Error('Tournament is over');
  const rt = replay(state, Table);
  if (!rt.finished) throw new Error('Finish this hand first');
  const stacks = rt.table.seats().map(s => s?.stack ?? 0);
  let button = state.button;
  do { button = (button + 1) % TOURNAMENT_SEATS; } while (stacks[button] === 0);
  const next = {
    ...state, hand: state.hand + 1, button, stacks, deck: shuffledDeck(), actions: [],
    places: [...state.places],
    recent: [{ hand: state.hand, result: rt.result, net: stacks[0] - state.stacks[0] }, ...state.recent].slice(0, 8),
  };
  // Short stacks may be forced all-in by the blinds before a single decision.
  return finishHand(next, replay(next, Table));
}