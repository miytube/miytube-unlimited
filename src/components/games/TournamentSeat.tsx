import { User, Crown } from 'lucide-react';
import { UserAvatarBubble } from '@/components/avatar/UserAvatarBubble';
import { PlayingCard } from './PlayingCard';
import { SuitIcon } from './SuitIcon';
import { TOURNAMENT_BOTS, type TournamentSeatView } from '@/lib/tournament';
import { cn } from '@/lib/utils';

export function TournamentSeat({ seat, active, dealer, winner, hand, userId }: {
  seat: TournamentSeatView; active: boolean; dealer: boolean; winner: boolean; hand: number; userId?: string;
}) {
  const human = seat.seat === 0;
  const avatar = <span className="tournament-avatar">{human ? <User size={19} /> : <SuitIcon suit={TOURNAMENT_BOTS[seat.seat - 1].suit} className="h-5 w-5" />}</span>;
  return (
    <div className={cn('tournament-seat', human && 'tournament-human', active && 'tournament-active', seat.eliminated && 'tournament-out')} data-seat={seat.seat}>
      <div className="tournament-seat-label">
        {human && userId ? <UserAvatarBubble userId={userId} className="h-[22px] w-[22px] shrink-0 sm:h-8 sm:w-8" fallback={avatar} /> : avatar}
        <div className="min-w-0">
          <p className="tournament-name font-bold">{seat.name}</p>
          <p className="tournament-role text-felt-foreground">{human ? 'Your seat' : `${seat.style} bot`}</p>
        </div>
        {dealer && <span className="tournament-button" title="Dealer button" aria-label="Dealer button">D</span>}
        {winner && <Crown size={14} className="shrink-0 text-gold" aria-label="Hand winner" />}
      </div>
      <p className="mt-1 text-center text-xl font-bold tabular-nums text-gold" data-testid={`stack-${seat.seat}`}>T${seat.stack.toLocaleString()}</p>
      <div className="tournament-hole">
        {(!seat.eliminated || seat.cards.length > 0) && [0, 1].map(i => (
          <PlayingCard key={`${hand}-${seat.seat}-${i}`} card={seat.cards[i]} faceDown={seat.cards[i] === undefined} index={i} className={seat.folded ? 'opacity-30' : ''} />
        ))}
        {seat.eliminated && seat.cards.length === 0 && <span className="text-base text-felt-foreground">{seat.place ? `${seat.place}${seat.place === 1 ? 'st' : seat.place === 2 ? 'nd' : seat.place === 3 ? 'rd' : 'th'} place` : 'Out'}</span>}
      </div>
      <p className={cn('tournament-action', seat.allIn && 'text-gold font-bold')} aria-live={human ? 'polite' : undefined}>
        {seat.allIn ? 'ALL-IN' : active ? human ? 'Your turn' : 'Thinking…' : seat.action || (seat.bet > 0 ? `Posted ${seat.bet}` : '')}
      </p>
    </div>
  );
}