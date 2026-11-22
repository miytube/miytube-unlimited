import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { Coins, CreditCard, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { getStripe, getStripeEnvironment, isPaymentsConfigured } from '@/lib/stripe';
import { COIN_PACKS, CoinPack, formatUsd } from '@/lib/coinPacks';
import { cn } from '@/lib/utils';

/** Card-bought MiyTube Coin packs, paid through an embedded Stripe checkout. */
export const CoinPacks = ({ signedIn }: { signedIn: boolean }) => {
  const [pack, setPack] = useState<CoinPack | null>(null);
  const payments = isPaymentsConfigured();

  const fetchClientSecret = useCallback(async () => {
    if (!pack) throw new Error('No pack selected');
    const { data, error } = await supabase.functions.invoke('create-coin-checkout', {
      body: {
        packId: pack.id,
        returnUrl: `${window.location.origin}/shop?coins=success&session_id={CHECKOUT_SESSION_ID}`,
        environment: getStripeEnvironment(),
      },
    });
    if (error || !data?.clientSecret) throw new Error(data?.error || error?.message || 'Could not start checkout');
    return data.clientSecret as string;
  }, [pack]);

  return (
    <section aria-labelledby="coin-packs-heading" className="space-y-3">
      <div className="flex items-end justify-between gap-2">
        <h2 id="coin-packs-heading" className="flex items-center gap-2 text-lg font-bold">
          <CreditCard className="h-5 w-5" /> Get more coins
        </h2>
        <p className="text-xs text-muted-foreground">One-time card payment. No subscription.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {COIN_PACKS.map((p) => (
          <div
            key={p.id}
            className={cn(
              'relative flex flex-col gap-2 rounded-xl border bg-card p-4',
              p.tag === 'Best value' && 'border-rarity-legendary ring-1 ring-rarity-legendary/40',
            )}
          >
            {p.tag && (
              <span className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                {p.tag}
              </span>
            )}
            <p className="text-sm font-semibold text-muted-foreground">{p.label}</p>
            <p className="flex items-center gap-1.5 text-2xl font-black tabular-nums">
              <Coins className="h-5 w-5 text-rarity-legendary" /> {p.coins.toLocaleString()}
            </p>
            {signedIn ? (
              <Button size="sm" className="mt-auto" disabled={!payments} onClick={() => setPack(p)}>
                Buy for {formatUsd(p.priceCents)}
              </Button>
            ) : (
              <Button asChild size="sm" variant="outline" className="mt-auto">
                <Link to="/auth">
                  <Lock className="mr-1 h-3 w-3" /> Sign in · {formatUsd(p.priceCents)}
                </Link>
              </Button>
            )}
          </div>
        ))}
      </div>

      <Dialog open={Boolean(pack)} onOpenChange={(open) => !open && setPack(null)}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          {pack && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {pack.coins.toLocaleString()} MiyTube Coins — {formatUsd(pack.priceCents)}
                </DialogTitle>
                <DialogDescription>Coins land in your balance as soon as the payment goes through.</DialogDescription>
              </DialogHeader>
              <EmbeddedCheckoutProvider key={pack.id} stripe={getStripe()} options={{ fetchClientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
              <p className="text-center text-xs text-muted-foreground">Secure checkout by Stripe.</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
