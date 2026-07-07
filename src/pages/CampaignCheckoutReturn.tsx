import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Status = "polling" | "paid" | "timeout" | "no-session";

export default function CampaignCheckoutReturn() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<Status>(sessionId ? "polling" : "no-session");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 20; // 20 * 1.5s = 30s

    const poll = async () => {
      attempts++;
      setAttempt(attempts);
      const { data } = await supabase
        .from("ad_campaigns")
        .select("payment_status, status")
        .eq("payment_reference", sessionId)
        .maybeSingle();

      if (cancelled) return;

      if (data?.payment_status === "paid") {
        setStatus("paid");
        return;
      }
      if (attempts >= maxAttempts) {
        setStatus("timeout");
        return;
      }
      setTimeout(poll, 1500);
    };

    poll();
    return () => { cancelled = true; };
  }, [sessionId]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center space-y-4 bg-card border rounded-xl p-8">
        {status === "no-session" && (
          <>
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
            <p>No checkout session found.</p>
            <Button asChild><Link to="/advertising">Back to My Campaigns</Link></Button>
          </>
        )}
        {status === "polling" && (
          <>
            <Loader2 className="h-10 w-10 mx-auto animate-spin text-primary" />
            <h1 className="text-xl font-semibold">Confirming your payment…</h1>
            <p className="text-sm text-muted-foreground">Waiting for confirmation from your bank ({attempt}s)</p>
          </>
        )}
        {status === "paid" && (
          <>
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
            <h1 className="text-2xl font-semibold">Payment received</h1>
            <p className="text-muted-foreground">
              Your campaign has been submitted for review. We'll email you as soon as it's live.
            </p>
            <Button asChild><Link to="/advertising">Back to My Campaigns</Link></Button>
          </>
        )}
        {status === "timeout" && (
          <>
            <AlertCircle className="h-12 w-12 mx-auto text-amber-500" />
            <h1 className="text-xl font-semibold">Payment is still processing</h1>
            <p className="text-sm text-muted-foreground">
              Your card was charged but our system hasn't confirmed it yet. It will appear in My Campaigns within a minute — no need to pay again.
            </p>
            <div className="text-xs text-muted-foreground break-all">Ref: {sessionId}</div>
            <Button asChild><Link to="/advertising">Back to My Campaigns</Link></Button>
          </>
        )}
      </div>
    </main>
  );
}
