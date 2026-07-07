import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Refunds (total_paid - amount_spent - already_refunded) across the campaign's payment history.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    const { campaignId, environment } = await req.json();
    if (!campaignId || (environment !== "sandbox" && environment !== "live")) {
      throw new Error("Invalid input");
    }

    const { data: campaign } = await supabase
      .from("ad_campaigns")
      .select("*")
      .eq("id", campaignId)
      .maybeSingle();
    if (!campaign) throw new Error("Campaign not found");

    // Verify user owns campaign OR is admin
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id, _role: "admin",
    });
    if (campaign.user_id !== user.id && !isAdmin) throw new Error("Forbidden");

    const payments = (campaign.budget_payments as any[]) || [];
    const totalPaid = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
    const spent = Number(campaign.amount_spent || 0);
    const alreadyRefunded = Number(campaign.refunded_amount || 0);
    const refundableUsd = Math.max(0, totalPaid - spent - alreadyRefunded);

    if (refundableUsd < 0.5) {
      throw new Error("No refundable balance");
    }

    const stripe = createStripeClient(environment);

    // Refund newest-first until we've covered refundableUsd
    let remainingCents = Math.round(refundableUsd * 100);
    const refunds: { payment_intent: string; amount: number }[] = [];

    const sortedPayments = [...payments].sort((a, b) =>
      new Date(b.paid_at || 0).getTime() - new Date(a.paid_at || 0).getTime()
    );

    for (const p of sortedPayments) {
      if (remainingCents <= 0) break;
      if (!p.payment_intent) continue;
      const already = Number(p.refunded_cents || 0);
      const paidCents = Math.round(Number(p.amount) * 100);
      const availableCents = paidCents - already;
      if (availableCents <= 0) continue;
      const toRefund = Math.min(availableCents, remainingCents);
      const refund = await stripe.refunds.create({
        payment_intent: p.payment_intent,
        amount: toRefund,
        metadata: { campaignId, reason: "campaign_cancellation" },
      });
      refunds.push({ payment_intent: p.payment_intent, amount: toRefund });
      p.refunded_cents = already + toRefund;
      remainingCents -= toRefund;
      console.log("Refund issued:", refund.id, toRefund);
    }

    const totalRefundedNow = refunds.reduce((s, r) => s + r.amount, 0) / 100;

    await supabase
      .from("ad_campaigns")
      .update({
        refunded_amount: alreadyRefunded + totalRefundedNow,
        budget_payments: sortedPayments,
        status: "completed",
      })
      .eq("id", campaignId);

    return new Response(JSON.stringify({ refunded: totalRefundedNow, refunds }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("refund-ad-campaign error:", e);
    return new Response(JSON.stringify({ error: e.message || "Refund failed" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
