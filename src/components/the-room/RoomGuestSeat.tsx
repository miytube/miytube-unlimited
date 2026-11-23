import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Armchair, Sparkles, UserRound } from 'lucide-react';
import { AvatarBubble } from '@/components/avatar/UserAvatarBubble';
import { useSavedAvatars } from '@/hooks/useAvatars';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

/** Loads the signed-in member's saved avatar and display name for The Room. */
export function useRoomGuest(userId: string | undefined) {
  const avatar = useSavedAvatars(userId ? [userId] : [])[userId ?? ''];
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setName(null);
      return;
    }
    let alive = true;
    supabase
      .from('profiles')
      .select('display_name, channel_name')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (alive) setName(data?.display_name || data?.channel_name || null);
      });
    return () => {
      alive = false;
    };
  }, [userId]);

  return { avatar, name, loading: !!userId && avatar === undefined };
}

type Guest = ReturnType<typeof useRoomGuest>;

const GuestFallback = ({ className }: { className?: string }) => (
  <span className={cn('inline-flex items-center justify-center rounded-full bg-secondary ring-1 ring-border text-muted-foreground', className)}>
    <UserRound className="h-1/2 w-1/2" aria-hidden="true" />
  </span>
);

/** Small bubble beside the guest's lines in the transcript. */
export const RoomGuestBubble: React.FC<{ guest: Guest; className?: string }> = ({ guest, className }) => (
  <AvatarBubble
    avatar={guest.avatar}
    title={guest.name ?? 'You'}
    className={className}
    fallback={<GuestFallback className={className} />}
  />
);

/** The guest chair on the studio stage: the member's avatar sits across from Maya. */
export const RoomGuestSeat: React.FC<{ guest: Guest; signedIn: boolean; speaking?: boolean }> = ({
  guest,
  signedIn,
  speaking = false,
}) => {
  const hasAvatar = !!guest.avatar;
  const label = guest.name ?? 'You';

  return (
    <div className="mx-4 mt-4 flex items-center gap-4 rounded-md border border-border bg-background p-3" aria-label="Guest chair">
      <div className="relative shrink-0">
        <RoomGuestBubble
          guest={guest}
          className={cn('h-16 w-16 transition-shadow', speaking && 'ring-2 ring-primary shadow-[0_0_18px_hsl(var(--primary)/0.45)]')}
        />
        <Armchair className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-card p-0.5 text-primary ring-1 ring-border" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-mono uppercase text-muted-foreground">Guest chair</p>
        <p className="truncate font-semibold text-foreground">{signedIn ? label : 'Empty seat'}</p>
        {!signedIn ? (
          <p className="text-xs text-muted-foreground mt-0.5">
            <Link to="/auth" className="font-medium text-primary hover:underline">Sign in</Link> to walk in as your avatar.
          </p>
        ) : guest.loading ? (
          <p className="text-xs text-muted-foreground mt-0.5">Walking in...</p>
        ) : !hasAvatar ? (
          <p className="text-xs text-muted-foreground mt-0.5">
            <Link to="/avatar" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
              <Sparkles className="h-3 w-3" aria-hidden="true" /> Make your avatar
            </Link>{' '}
            to take this seat.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-0.5">On stage with Maya{guest.avatar?.portraitUrl ? ' · portrait' : ''}.</p>
        )}
      </div>
    </div>
  );
};
