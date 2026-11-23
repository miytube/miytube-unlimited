import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Check, Coins, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { setCoinBalance } from '@/hooks/useCoinWallet';
import { BOOKSEM_PASS_DISCOUNT_PERCENT, BOOKSEM_PASS_PRICE_COINS, BOOKSEM_URL, type BooksemPass } from '@/lib/booksemPass';

interface Props {
  userId: string | null;
  balance: number;
}

/** Booksem partner kiosk: trade coins for a one-book half-price pass on Booksem.com. */
export const BooksemPassCard: React.FC<Props> = ({ userId, balance }) => {
  const { toast } = useToast();
  const [passes, setPasses] = useState<BooksemPass[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    if (!userId) {
      setPasses([]);
      setLoaded(true);
      return;
    }
    const { data } = await supabase
      .from('booksem_passes')
      .select('id, code, status, book_id, redeemed_at, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
    setPasses((data ?? []) as BooksemPass[]);
    setLoaded(true);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const unused = passes.find((p) => p.status !== 'redeemed');
  const usedCount = passes.filter((p) => p.status === 'redeemed').length;
  const short = BOOKSEM_PASS_PRICE_COINS - balance;

  const redeem = async () => {
    setBusy(true);
    const { data, error } = await supabase.rpc('redeem_booksem_pass');
    setBusy(false);
    setConfirming(false);
    if (error) {
      toast({ title: 'Could not get the pass', description: error.message, variant: 'destructive' });
      return;
    }
    const result = data as { balance?: number; code?: string };
    if (typeof result?.balance === 'number') setCoinBalance(result.balance);
    toast({ title: 'Your Booksem pass is ready', description: 'Pick any book on Booksem and choose "Use my MiyTube pass".' });
    load();
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked; the code is still on screen */
    }
  };

  return (
    <section aria-labelledby="booksem-pass-title" className="overflow-hidden rounded-2xl border bg-card">
      <div className="grid gap-6 p-5 md:grid-cols-[auto_1fr_auto] md:items-center md:p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BookOpen className="h-8 w-8" />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Booksem partner kiosk</p>
          <h2 id="booksem-pass-title" className="text-xl font-black tracking-tight md:text-2xl">
            Booksem {BOOKSEM_PASS_DISCOUNT_PERCENT}% Off Pass
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Trade {BOOKSEM_PASS_PRICE_COINS} coins for half price on any audiobook at Booksem.com. Sign in there with this same
            MiyTube account and the book unlocks for good.
          </p>
          {usedCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {usedCount} pass{usedCount === 1 ? '' : 'es'} used so far.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 md:items-end">
          {!userId ? (
            <Button asChild>
              <Link to="/auth">Sign in to get a pass</Link>
            </Button>
          ) : !loaded ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : unused ? (
            <>
              <button
                type="button"
                onClick={() => copyCode(unused.code)}
                className="flex items-center gap-2 rounded-lg border border-dashed border-primary px-3 py-2 font-mono text-sm font-bold tracking-wider"
                aria-label={`Pass code ${unused.code}, tap to copy`}
              >
                {unused.code}
                {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </button>
              <p className="text-xs text-muted-foreground">{unused.status === 'reserved' ? 'Checkout in progress' : 'Ready to use · 1 book'}</p>
              <Button asChild>
                <a href={BOOKSEM_URL} target="_blank" rel="noopener">
                  Shop books on Booksem <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </>
          ) : (
            <>
              <Button disabled={short > 0 || busy} onClick={() => setConfirming(true)} className="gap-2">
                <Coins className="h-4 w-4" /> Get pass · {BOOKSEM_PASS_PRICE_COINS} coins
              </Button>
              {short > 0 && <p className="text-xs text-muted-foreground">{short.toLocaleString()} more coins needed</p>}
            </>
          )}
        </div>
      </div>

      <AlertDialog open={confirming} onOpenChange={(open) => !open && !busy && setConfirming(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Get the Booksem {BOOKSEM_PASS_DISCOUNT_PERCENT}% Off Pass?</AlertDialogTitle>
            <AlertDialogDescription>
              {BOOKSEM_PASS_PRICE_COINS} coins will come out of your balance. You'll have {(balance - BOOKSEM_PASS_PRICE_COINS).toLocaleString()} left.
              The pass covers one audiobook at half price.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Not now</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              onClick={(e) => {
                e.preventDefault();
                redeem();
              }}
            >
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Coins className="mr-2 h-4 w-4" />}
              Get pass for {BOOKSEM_PASS_PRICE_COINS}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};
