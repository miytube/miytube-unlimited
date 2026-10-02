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
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>The Room Premium</DialogTitle></DialogHeader>
          {open && (
            <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
