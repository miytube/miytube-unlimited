import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CampaignCheckoutReturn() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center space-y-4 bg-card border rounded-xl p-8">
        {sessionId ? (
          <>
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
            <h1 className="text-2xl font-semibold">Payment received</h1>
            <p className="text-muted-foreground">
              Thanks — your campaign has been submitted for review. We'll email you as soon as it's live.
            </p>
            <div className="text-xs text-muted-foreground break-all">Ref: {sessionId}</div>
            <Button asChild>
              <Link to="/advertising">Back to My Campaigns</Link>
            </Button>
          </>
        ) : (
          <>
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
            <p>Finalizing…{seconds > 0 ? ` (${seconds}s)` : ""}</p>
          </>
        )}
      </div>
    </main>
  );
}
