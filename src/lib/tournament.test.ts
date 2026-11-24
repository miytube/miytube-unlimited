import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { Table } from 'poker-ts';
import { applyAction, blindsForHand, cardId, newTournament, nextHand, replay, tournamentView, type PokerConstructor } from '../../supabase/functions/_shared/tournamentEngine';

const Engine = Table as unknown as PokerConstructor;
function deckWithDraws(cards: number[]): number[] {
  const draws = cards.map(c => Math.floor(c/13)*13+((c%13+12)%13));
  return [...Array.from({length:52},(_,i)=>i).filter(i=>!draws.includes(i)),...draws.reverse()];
}
describe('six-seat no-limit tournament', () => {
  test('starts with 10,000 chips in each of six seats', () => {
    const state = newTournament();
    assert.deepEqual(state.stacks, [10000, 10000, 10000, 10000, 10000, 10000]);
    assert.equal(new Set(state.deck).size, 52);
    const view = tournamentView(state, 1, Engine);
    assert.equal(view.seats.length, 6);
    assert.equal(view.pot, 150);
    assert.equal(view.actor, 3);
  });
  test('free chips never touch MiyTube Coins', () => {
    const state = newTournament();
    assert.equal('balance' in state, false);
    assert.equal('payout' in tournamentView(state, 1, Engine), false);
    assert.equal(state.stacks.reduce((a,b) => a+b), 60000);
  });
  test('blinds rise every six hands', () => {
    assert.deepEqual(blindsForHand(1), { level: 1, bigBlind: 100, smallBlind: 50 });
    assert.equal(blindsForHand(6).bigBlind, 100);
    assert.equal(blindsForHand(7).bigBlind, 200);
    assert.equal(blindsForHand(13).bigBlind, 400);
  });
  test('cards map to the shared playing cards', () => {
    assert.equal(cardId({rank:'A',suit:'clubs'}),0);
    assert.equal(cardId({rank:'K',suit:'spades'}),51);
  });
  test('replay and reload produce identical cards and legal actions', () => {
    const state = newTournament();
    assert.deepEqual(tournamentView(state, 3, Engine), tournamentView(JSON.parse(JSON.stringify(state)), 3, Engine));
  });
  test('other seats and undealt cards never appear in the member view', () => {
    const view = tournamentView(newTournament(), 1, Engine);
    assert.equal(view.seats[0].cards.length, 2);
    assert.ok(view.seats.slice(1).every(s => s.cards.length === 0));
    assert.equal(view.board.length, 0);
    assert.equal('deck' in view, false);
  });
  test('rejects actions out of turn and illegal raise totals', () => {
    let state = newTournament();
    assert.throws(() => applyAction(state, Engine, 'call'), /Wait for your turn/);
    while (tournamentView(state,1,Engine).actor !== 0) state = applyAction(state,Engine);
    assert.throws(() => applyAction(state,Engine,'check'), /not available/);
    assert.throws(() => applyAction(state,Engine,'raise',1), /legal raise/);
    assert.throws(() => applyAction(state,Engine,'raise',60001), /legal raise/);
  });
  test('checks and calls traverse preflop, flop, turn and river', () => {
    const state = newTournament();
    const table = replay(state,Engine).table;
    const streets = new Set<string>();
    while (table.isHandInProgress()) {
      if (table.isBettingRoundInProgress()) {
        streets.add(table.roundOfBetting());
        const actions = table.legalActions().actions;
        table.actionTaken(actions.includes('check') ? 'check' : 'call');
      } else if (!table.areBettingRoundsCompleted()) table.endBettingRound();
      else table.showdown();
    }
    assert.deepEqual([...streets], ['preflop','flop','turn','river']);
    assert.equal(table.seats().reduce((sum,s) => sum+(s?.stack??0),0),60000);
  });
  test('unequal all-ins create separate eligible side pots', () => {
    const table = new Table({ smallBlind:50,bigBlind:100 },3);
    table.sitDown(0,1000); table.sitDown(1,2000); table.sitDown(2,3000); table.startHand(0);
    let pots: {size:number;eligiblePlayers:number[]}[] = [];
    while (table.isHandInProgress()) {
      if (table.isBettingRoundInProgress()) {
        const legal = table.legalActions();
        if (legal.chipRange && legal.actions.includes('raise')) table.actionTaken('raise',legal.chipRange.max);
        else table.actionTaken(legal.actions.includes('call')?'call':'check');
      } else if (!table.areBettingRoundsCompleted()) table.endBettingRound();
      else { pots=table.pots(); table.showdown(); }
    }
    assert.ok(pots.length >= 2);
    assert.equal(pots[0].size,3000);
    assert.deepEqual([...pots[0].eligiblePlayers].sort(),[0,1,2]);
    assert.equal(table.seats().reduce((a,s)=>a+(s?.stack??0),0),6000);
  });
  test('heads-up dealer posts small blind and acts first preflop, last postflop', () => {
    const state = newTournament(); state.stacks = [30000,30000,0,0,0,0];
    const table = replay(state,Engine).table;
    assert.equal(table.playerToAct(),0);
    assert.equal(table.seats()[0]?.betSize,50);
    assert.equal(table.seats()[1]?.betSize,100);
    table.actionTaken('call'); table.actionTaken('check'); table.endBettingRound();
    assert.equal(table.roundOfBetting(),'flop');
    assert.equal(table.playerToAct(),1);
  });
  test('a short all-in does not lower the full raise or reopen a prior caller', () => {
    const state=newTournament(); state.stacks=[20000,150,10000,10000,10000,9850];
    state.actions=[3,4,5].map(seat=>({seat,action:'fold' as const,street:'preflop'}));
    state.actions.push({seat:0,action:'call',street:'preflop'},{seat:1,action:'raise',amount:150,street:'preflop'});
    const before = replay(state,Engine).table;
    assert.equal(before.playerToAct(),2);
    assert.equal(before.legalActions().chipRange?.min,250);
    state.actions.push({seat:2,action:'call',street:'preflop'});
    const view=tournamentView(state,1,Engine);
    assert.equal(view.actor,0);
    assert.equal(view.minRaise,null);
    assert.deepEqual(view.legal,['fold','call']);
    assert.throws(()=>applyAction(state,Engine,'raise',250),/not available/);
  });
  test('cumulative short all-ins reopen betting when they equal a full raise', () => {
    const state=newTournament(); state.stacks=[20000,150,200,10000,10000,19650];
    state.actions=[{seat:3,action:'call',street:'preflop'},...[4,5].map(seat=>({seat,action:'fold' as const,street:'preflop'}))];
    state.actions.push({seat:0,action:'call',street:'preflop'},{seat:1,action:'raise',amount:150,street:'preflop'},{seat:2,action:'raise',amount:200,street:'preflop'});
    const table=replay(state,Engine).table;
    assert.equal(table.playerToAct(),3);
    assert.equal(table.legalActions().chipRange?.min,300);
    state.actions.push({seat:3,action:'call',street:'preflop'});
    const view=tournamentView(state,1,Engine);
    assert.equal(view.actor,0);
    assert.ok(view.legal.includes('raise'));
    assert.equal(view.minRaise,300);
    assert.equal(view.callAmount,100);
  });
  test('no empty side-pot bet is offered against opponents already all-in', () => {
    const state=newTournament(); state.stacks=[20000,150,200,10000,10000,19650];
    state.actions=[3,4,5].map(seat=>({seat,action:'fold' as const,street:'preflop'}));
    state.actions.push({seat:0,action:'call',street:'preflop'},{seat:1,action:'raise',amount:150,street:'preflop'},{seat:2,action:'raise',amount:200,street:'preflop'});
    assert.deepEqual(tournamentView(state,1,Engine).legal,['fold','call']);
  });
  test('shared royal-flush board splits the pot equally with no invented winner', () => {
    const state=newTournament();
    state.deck=deckWithDraws([13,14,15,16,17,18,19,20,21,22,23,24,0,12,11,10,9]);
    const table=replay(state,Engine).table;
    while (table.isHandInProgress()) {
      if (table.isBettingRoundInProgress()) {
        const action=table.legalActions().actions.includes('check')?'check':'call';
        state.actions.push({seat:table.playerToAct(),action,street:table.roundOfBetting()});
        table.actionTaken(action);
      } else if (!table.areBettingRoundsCompleted()) table.endBettingRound();
      else table.showdown();
    }
    const view=tournamentView(state,1,Engine);
    assert.deepEqual([...view.winners].sort(),[0,1,2,3,4,5]);
    assert.deepEqual(view.seats.map(s=>s.stack),[10000,10000,10000,10000,10000,10000]);
    assert.equal(view.pot,600);
  });
  test('winning the final heads-up all-in earns first place and all 60,000 chips', () => {
    let state=newTournament(); state.stacks=[50000,10000,0,0,0,0];
    state.deck=deckWithDraws([0,13,12,25,2,16,30,44,9]);
    state=applyAction(state,Engine,'raise',50000);
    state=applyAction(state,Engine);
    const view=tournamentView(state,1,Engine);
    assert.equal(state.status,'champion');
    assert.equal(view.place,1);
    assert.equal(view.seats[0].stack,60000);
    assert.equal(view.seats[1].place,2);
  });
  test('an early all-in winner remains eligible after other players bet later streets', () => {
    const state=newTournament(); state.stacks=[10000,2000,10000,10000,10000,18000];
    state.deck=deckWithDraws([26,27,0,13,12,25,11,24,10,23,8,21,2,17,32,46,9]);
    state.actions=[3,4,5,0].map(seat=>({seat,action:'call' as const,street:'preflop'}));
    state.actions.push({seat:1,action:'raise',amount:2000,street:'preflop'},...[2,3,4,5,0].map(seat=>({seat,action:'call' as const,street:'preflop'})));
    const table=replay(state,Engine).table;
    while(table.isHandInProgress()) {
      if(table.isBettingRoundInProgress()) {
        const action=table.legalActions().actions.includes('check')?'check':'call';
        state.actions.push({seat:table.playerToAct(),action,street:table.roundOfBetting()});
        table.actionTaken(action);
      } else if (!table.areBettingRoundsCompleted()) table.endBettingRound();
      else table.showdown();
    }
    const view=tournamentView(state,1,Engine);
    assert.deepEqual(view.winners,[1]);
    assert.equal(view.seats[1].stack,12000);
    assert.equal(view.seats.reduce((sum,s)=>sum+s.stack,0),60000);
  });
  test('dealer button moves to the next surviving seat', () => {
    const state=newTournament();
    state.actions=[3,4,5,0,1].map(seat=>({seat,action:'fold' as const,street:'preflop'}));
    const next=nextHand(state,Engine);
    assert.equal(next.button,1);
    assert.equal(next.hand,2);
    assert.equal(next.actions.length,0);
    assert.equal(next.recent.length,1);
  });
  test('short big blind does not force an unnecessary call or fold by the covering small blind', () => {
    const state=newTournament(); state.hand=33; state.button=2; state.stacks=[1350,0,58650,0,0,0];
    const rt=replay(state,Engine);
    let view=tournamentView(state,1,Engine);
    if(!rt.finished) {
      assert.equal(rt.table.playerToAct(),2);
      assert.deepEqual(rt.table.legalActions().actions,['check']);
      view=tournamentView(applyAction(state,Engine),1,Engine);
    }
    assert.equal(view.finished,true);
    assert.equal(view.seats.reduce((sum,s)=>sum+s.stack,0),60000);
    assert.equal(view.pot,2700);
  });
  test('a folded side-pot player never prevents an all-in main-pot runout', () => {
    const state=newTournament(); state.hand=23; state.stacks=[7750,40433,6600,0,2017,3200];
    state.actions=[
      {seat:4,action:'raise',amount:2017,street:'preflop'},
      {seat:5,action:'call',street:'preflop'}, {seat:0,action:'fold',street:'preflop'},
      {seat:1,action:'call',street:'preflop'}, {seat:2,action:'fold',street:'preflop'},
      {seat:1,action:'bet',amount:2400,street:'flop'}, {seat:5,action:'fold',street:'flop'},
    ];
    const view=tournamentView(state,1,Engine);
    assert.equal(view.finished,true);
    assert.equal(view.board.length,5);
    assert.equal(view.seats.reduce((sum,s)=>sum+s.stack,0),60000);
  });
  test('the blinds alone can settle a tournament without another player decision', () => {
    let state=newTournament(); state.hand=49; state.stacks=[30000,30000,0,0,0,0];
    const table=replay(state,Engine).table;
    while(table.isHandInProgress()) {
      if(table.isBettingRoundInProgress()) {
        const action=table.legalActions().actions.includes('check')?'check':'call';
        state.actions.push({seat:table.playerToAct(),action,street:table.roundOfBetting()});
        table.actionTaken(action);
      } else if(!table.areBettingRoundsCompleted())table.endBettingRound();
      else table.showdown();
    }
    const view=tournamentView(state,1,Engine);
    assert.equal(view.seats.reduce((sum,s)=>sum+s.stack,0),60000);
  });
  test('complete tournaments conserve chips and end with a real placing', () => {
    for (let run=0;run<5;run++) {
      let state=newTournament(); let steps=0;
      while (state.status==='playing' && steps++<3000) {
        const view=tournamentView(state,1,Engine);
        if (view.finished) state=nextHand(state,Engine);
        else if (view.actor===0) {
          if (view.maxRaise !== null) state=applyAction(state,Engine,view.legal.includes('raise')?'raise':'bet',view.maxRaise);
          else state=applyAction(state,Engine,view.legal.includes('call')?'call':'check');
        } else state=applyAction(state,Engine);
      }
      assert.notEqual(state.status,'playing');
      const final=tournamentView(state,1,Engine);
      assert.ok(final.place && final.place>=1 && final.place<=6);
      assert.equal(final.seats.reduce((sum,s)=>sum+s.stack,0),60000);
      assert.throws(()=>applyAction(state,Engine,'call'),/Tournament is over/);
    }
  });
});