import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getStripe, getStripeEnvironment, isPaymentsConfigured } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';

/** Returns whether the signed-in user has an active Room Premium subscription. */
export const useRoomPremium = (userId?: string) => {
  const [isPremium, setIsPremium] = useState(false);
  const refresh = useCallback(async () => {
    if (!userId || !isPaymentsConfigured()) return setIsPremium(false);
    const { data } = await supabase.rpc('has_active_subscription', {
      _user_id: userId,
      _env: getStripeEnvironment(),
    });
    setIsPremium(!!data);
  }, [userId]);
  useEffect(() => { void refresh(); }, [refresh]);
  return { isPremium, refresh };
};

export const RoomPremiumCard = ({ signedIn }: { signedIn: boolean }) => {
  const [open, setOpen] = useState(false);
  const fetchClientSecret = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke('create-room-checkout', {
      body: {
        returnUrl: `${window.location.origin}/the-room?upgraded=1&session_id={CHECKOUT_SESSION_ID}`,
        environment: getStripeEnvironment(),
      },
    });
    if (error || !data?.clientSecret) throw new Error(data?.error || error?.message || 'Could not start checkout');
    return data.clientSecret as string;
  }, []);

  return (
    <div className="mx-4 mt-4 rounded-md border border-primary/40 bg-muted p-3">
      <p className="text-sm font-semibold text-foreground">Free host: voice only</p>
      <p className="text-xs text-muted-foreground mt-1">
        Upgrade to Premium to see and hear Maya live on video — $9.99/month, cancel anytime.
      </p>
      {signedIn ? (
        <Button size="sm" className="mt-2 w-full" onClick={() => setOpen(true)} disabled={!isPaymentsConfigured()}>
          Go Live with Maya — $9.99/mo
        </Button>
      ) : (
        <Button size="sm" className="mt-2 w-full" asChild>
          <Link to="/auth">Sign in to upgrade</Link>
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto border-2 border-primary">
          <DialogHeader className="items-center text-center space-y-2">
            <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              MiyTube Premium
            </span>
            <DialogTitle className="text-2xl">Unlock The Live Studio Host</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Step inside a live broadcast. Watch Maya react and interview you face-to-face in real time.
            </p>
          </DialogHeader>
          <ul className="space-y-1 rounded-md bg-muted p-3 text-sm text-foreground">
            <li>✓ Live streaming video host</li>
            <li>✓ Split-screen interview downloads, ready for social sharing</li>
            <li>✓ Cancel anytime</li>
          </ul>
          <p className="text-center text-3xl font-bold text-primary">
            $9.99 <span className="text-sm font-normal text-muted-foreground">/ month</span>
          </p>
          {open && (
            <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
          <p className="text-center text-xs text-muted-foreground">🔒 Secure checkout by Stripe. Cancel anytime.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
};
