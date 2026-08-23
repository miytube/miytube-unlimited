import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';

const PRESET_AMOUNTS_CENTS = [200, 500, 1000];

interface TipCreatorButtonProps {
  creatorId?: string | null;
  videoId?: string | null;
  className?: string;
  variant?: 'button' | 'pill';
}

const TipPaymentForm: React.FC<{ onSuccess: () => void; onCancel: () => void }> = ({
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: 'Payment failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
      return;
    }

    toast({ title: 'Thank you!', description: 'Your tip was sent to the creator.' });
    onSuccess();
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={!stripe || submitting}>
          {submitting ? 'Processing…' : 'Confirm tip'}
        </Button>
      </div>
    </div>
  );
};

export const TipCreatorButton: React.FC<TipCreatorButtonProps> = ({
  creatorId,
  videoId,
  className,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetState = useCallback(() => {
    setClientSecret(null);
    setCustomAmount('');
    setLoading(false);
  }, []);

  const handleOpen = () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to tip this creator.',
      });
      navigate('/auth');
      return;
    }
    if (!creatorId) return;
    resetState();
    setOpen(true);
  };

  const startTip = async (amountCents: number) => {
    if (!creatorId || !amountCents || amountCents < 100) {
      toast({
        title: 'Invalid amount',
        description: 'Minimum tip amount is $1.00.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-tip-intent', {
        body: {
          creatorId,
          videoId: videoId || undefined,
          amountCents,
          environment: getStripeEnvironment(),
          returnUrl: window.location.href,
        },
      });

      if (error || !data?.clientSecret) {
        throw new Error(error?.message || data?.error || 'Failed to start tip');
      }

      setClientSecret(data.clientSecret);
    } catch (e: any) {
      toast({
        title: 'Unable to start tip',
        description: e.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setOpen(false);
    resetState();
  };

  const handleDialogChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetState();
  };

  if (!creatorId) return null;

  return (
    <>
      <button
        onClick={handleOpen}
        className={
          className ||
          'flex items-center gap-1 px-4 py-1.5 bg-secondary rounded-full hover:bg-secondary/80 transition-colors'
        }
      >
        <Coins size={18} />
        <span className="text-sm font-medium">Tip</span>
      </button>

      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tip this creator</DialogTitle>
            <DialogDescription>
              Show your support with a one-time tip. 100% goes to the creator's payment account.
            </DialogDescription>
          </DialogHeader>

          {!clientSecret ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                {PRESET_AMOUNTS_CENTS.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className="flex-1"
                    disabled={loading}
                    onClick={() => startTip(amount)}
                  >
                    ${(amount / 100).toFixed(0)}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  step="0.01"
                  placeholder="Custom amount ($)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  disabled={loading}
                />
                <Button
                  disabled={loading || !customAmount || Number(customAmount) <= 0}
                  onClick={() => startTip(Math.round(Number(customAmount) * 100))}
                >
                  Tip
                </Button>
              </div>
            </div>
          ) : (
            <Elements
              stripe={getStripe()}
              options={{ clientSecret, appearance: { theme: 'stripe' } }}
            >
              <TipPaymentForm onSuccess={handleSuccess} onCancel={() => setClientSecret(null)} />
            </Elements>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TipCreatorButton;
