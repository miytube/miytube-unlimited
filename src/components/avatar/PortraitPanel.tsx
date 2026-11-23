import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Coins, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { setCoinBalance, refreshCoinWallet, useCoinWallet } from '@/hooks/useCoinWallet';
import { setCachedAvatar, SavedAvatar } from '@/hooks/useAvatars';
import { PORTRAIT_DAILY_LIMIT, PORTRAIT_PRICE_COINS } from '@/lib/avatar';
import { cn } from '@/lib/utils';

const PRESENTATIONS = [
  { id: 'man', label: 'Man' },
  { id: 'woman', label: 'Woman' },
  { id: 'neutral', label: 'Any' },
] as const;
type Presentation = (typeof PRESENTATIONS)[number]['id'];

interface Props {
  userId: string;
  /** The look the portrait will be made from; must already be saved. */
  savedAvatar: SavedAvatar | null;
  hasUnsavedChanges: boolean;
}

/** Turns the member's saved avatar into a photo-real AI portrait for coins. */
export const PortraitPanel: React.FC<Props> = ({ userId, savedAvatar, hasUnsavedChanges }) => {
  const { toast } = useToast();
  const { balance } = useCoinWallet(userId);
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);
  const [presentation, setPresentation] = useState<Presentation>('neutral');
  const [making, setMaking] = useState(false);

  useEffect(() => {
    let alive = true;
    supabase
      .from('avatar_portraits')
      .select('image_url, look')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive || !data) return;
        setPortraitUrl(data.image_url);
        const p = (data.look as { presentation?: Presentation } | null)?.presentation;
        if (p) setPresentation(p);
      });
    return () => {
      alive = false;
    };
  }, [userId]);

  const short = balance !== null && balance < PORTRAIT_PRICE_COINS;
  const blocked = !savedAvatar || hasUnsavedChanges;

  const make = async () => {
    setMaking(true);
    const { data, error } = await supabase.functions.invoke('avatar-portrait', { body: { presentation } });
    setMaking(false);
    const payload = (data ?? {}) as { portrait_url?: string; balance?: number | null; error?: string };
    if (error || !payload.portrait_url) {
      let message = payload.error;
      const ctx = (error as { context?: Response } | null)?.context;
      if (!message && ctx && typeof ctx.json === 'function') {
        message = await ctx.json().then((b: { error?: string }) => b.error).catch(() => undefined);
      }
      await refreshCoinWallet();
      toast({ title: 'No portrait this time', description: message ?? 'Please try again.', variant: 'destructive' });
      return;
    }
    setPortraitUrl(payload.portrait_url);
    if (typeof payload.balance === 'number') setCoinBalance(payload.balance);
    if (savedAvatar) setCachedAvatar(userId, { ...savedAvatar, portraitUrl: payload.portrait_url });
    toast({ title: 'Your portrait is ready', description: 'It now shows next to your comments and in your account menu.' });
  };

  return (
    <div className="mt-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Camera className="h-5 w-5 text-primary" /> Make it real
          </h2>
          <p className="text-sm text-muted-foreground">
            Turn your avatar and gear into a photo-real portrait. {PORTRAIT_PRICE_COINS} coins each.
          </p>
        </div>
        {balance !== null && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm font-semibold">
            <Coins className="h-4 w-4 text-primary" /> {balance.toLocaleString()}
          </span>
        )}
      </div>

      <div className="mt-4 aspect-square overflow-hidden rounded-xl bg-secondary">
        {making ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm">Shooting your portrait… about 30 seconds</span>
          </div>
        ) : portraitUrl ? (
          <img src={portraitUrl} alt="Your photo-real portrait" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
            Your portrait will appear here.
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2" role="radiogroup" aria-label="Portrait style">
        {PRESENTATIONS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={presentation === p.id}
            onClick={() => setPresentation(p.id)}
            className={cn(
              'flex-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
              presentation === p.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-secondary',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {short ? (
        <Button asChild className="mt-3 w-full">
          <Link to="/shop">Get more coins</Link>
        </Button>
      ) : (
        <Button onClick={make} disabled={making || blocked} className="mt-3 w-full gap-2">
          {making ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          {portraitUrl ? 'Make a new portrait' : 'Make my portrait'} · {PORTRAIT_PRICE_COINS} coins
        </Button>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        {blocked
          ? 'Save your avatar first — the portrait uses your saved look.'
          : `Up to ${PORTRAIT_DAILY_LIMIT} a day. If it fails, your coins come back.`}
      </p>
    </div>
  );
};
