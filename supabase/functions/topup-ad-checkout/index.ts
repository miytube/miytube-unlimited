import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, createStripeClient, resolveOrCreateCustomer } from "../_shared/stripe.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

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

    const { campaignId, amountCents, returnUrl, environment } = await req.json();
    if (!campaignId || !amountCents || amountCents < 500 || !returnUrl ||
        (environment !== "sandbox" && environment !== "live")) {
      throw new Error("Invalid input (minimum top-up is $5.00)");
    }

    const { data: campaign } = await supabase
      .from("ad_campaigns")
      .select("id, user_id, campaign_name")
      .eq("id", campaignId)
      .maybeSingle();
    if (!campaign || campaign.user_id !== user.id) throw new Error("Forbidden");

    const stripe = createStripeClient(environment);
    const customerId = await resolveOrCreateCustomer(stripe, {
      email: user.email ?? undefined,
      userId: user.id,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: "usd",
          product: "ad_campaign_custom",
          unit_amount: amountCents,
        },
        quantity: 1,
      }],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: returnUrl,
      customer: customerId,
      payment_intent_data: {
        description: `Budget top-up — ${campaign.campaign_name}`,
        metadata: {
          userId: user.id,
          campaignId,
          purpose: "campaign_topup",
          topupCents: String(amountCents),
        },
      },
      metadata: {
        userId: user.id,
        campaignId,
        purpose: "campaign_topup",
        topupCents: String(amountCents),
        managed_payments: "true",
      },
      managed_payments: { enabled: true },
    } as any);

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("topup-ad-checkout error:", e);
    return new Response(JSON.stringify({ error: e.message || "Top-up failed" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
