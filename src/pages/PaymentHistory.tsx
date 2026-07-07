import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Receipt, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Row {
  campaignId: string;
  campaignName: string;
  kind: "initial" | "topup" | "refund";
  amount: number; // positive for charges, negative for refunds
  date: string;
  paymentIntent?: string;
}

export default function PaymentHistory() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("ad_campaigns")
        .select("id, campaign_name, budget_payments")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const flat: Row[] = [];
      for (const c of data || []) {
        const payments = ((c as any).budget_payments as any[]) || [];
        for (const p of payments) {
          flat.push({
            campaignId: c.id,
            campaignName: c.campaign_name,
            kind: p.kind === "topup" ? "topup" : "initial",
            amount: Number(p.amount || 0),
            date: p.paid_at,
            paymentIntent: p.payment_intent,
          });
          if (Number(p.refunded_cents || 0) > 0) {
            flat.push({
              campaignId: c.id,
              campaignName: c.campaign_name,
              kind: "refund",
              amount: -Number(p.refunded_cents) / 100,
              date: p.paid_at,
              paymentIntent: p.payment_intent,
            });
          }
        }
      }
      flat.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRows(flat);
      setLoading(false);
    })();
  }, [user]);

  const totalPaid = rows.filter(r => r.amount > 0).reduce((s, r) => s + r.amount, 0);
  const totalRefunded = -rows.filter(r => r.amount < 0).reduce((s, r) => s + r.amount, 0);
  const net = totalPaid - totalRefunded;

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link to="/account"><ArrowLeft className="h-4 w-4 mr-1" /> Back to account</Link>
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Receipt className="h-7 w-7" /> Payment History
          </h1>
          <p className="text-muted-foreground mt-1">
            Every charge and refund on your account. Receipts are also emailed to you at the time of purchase.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card><CardContent className="pt-6"><div className="text-xs text-muted-foreground">Total charged</div><div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-xs text-muted-foreground">Total refunded</div><div className="text-2xl font-bold">${totalRefunded.toFixed(2)}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-xs text-muted-foreground">Net</div><div className="text-2xl font-bold">${net.toFixed(2)}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Newest first</CardDescription>
          </CardHeader>
          <CardContent>
            {rows.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No transactions yet.</p>
            ) : (
              <div className="divide-y">
                {rows.map((r, i) => (
                  <div key={i} className="py-3 flex items-center justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{r.campaignName}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                        <Badge variant={r.kind === "refund" ? "outline" : "secondary"}>
                          {r.kind === "initial" ? "Campaign payment" : r.kind === "topup" ? "Budget top-up" : "Refund"}
                        </Badge>
                        <span>{new Date(r.date).toLocaleString()}</span>
                        {r.paymentIntent && <span className="font-mono">{r.paymentIntent.slice(0, 18)}…</span>}
                      </div>
                    </div>
                    <div className={r.amount < 0 ? "text-red-600 font-semibold" : "font-semibold"}>
                      {r.amount < 0 ? "-" : ""}${Math.abs(r.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
