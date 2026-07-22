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
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const {
      campaignId,
      priceId,           // for fixed tiers: 'ad_starter_10' | 'ad_growth_50' | 'ad_enterprise_500'
      customAmountCents, // for custom-budget checkout, integer cents (>= 1000)
      returnUrl,
      environment,
    } = body as {
      campaignId: string;
      priceId?: string;
      customAmountCents?: number;
      returnUrl: string;
      environment: StripeEnv;
    };

    if (!campaignId || !returnUrl || (environment !== "sandbox" && environment !== "live")) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load & verify campaign belongs to user
    const { data: campaign, error: campErr } = await supabase
      .from("ad_campaigns")
      .select("id, user_id, campaign_name, business_name, total_budget, payment_status")
      .eq("id", campaignId)
      .maybeSingle();

    if (campErr || !campaign) throw new Error("Campaign not found");
    if (campaign.user_id !== user.id) throw new Error("Forbidden");
    if (campaign.payment_status === "paid") throw new Error("Campaign already paid");

    const stripe = createStripeClient(environment);
    const customerId = await resolveOrCreateCustomer(stripe, {
      email: user.email ?? undefined,
      userId: user.id,
    });

    // Build line item — either fixed price lookup_key or dynamic price_data
    let lineItem: any;
    let description: string;

    if (priceId) {
      const prices = await stripe.prices.list({ lookup_keys: [priceId] });
      if (!prices.data.length) throw new Error("Price not found");
      lineItem = { price: prices.data[0].id, quantity: 1 };
      const productId = typeof prices.data[0].product === "string"
        ? prices.data[0].product
        : prices.data[0].product.id;
      const product = await stripe.products.retrieve(productId);
      description = `${product.name} — ${campaign.campaign_name}`;
    } else if (customAmountCents && customAmountCents >= 1000) {
      lineItem = {
        price_data: {
          currency: "usd",
          product_data: {
            name: "MiyTube Ad Campaign",
            tax_code: "txcd_10103000",
          },
          unit_amount: customAmountCents,
        },
        quantity: 1,
      };
      description = `MiyTube Ad Campaign — ${campaign.campaign_name}`;
    } else {
      throw new Error("Provide either priceId or customAmountCents (>= 1000)");
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [lineItem],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: returnUrl,
      customer: customerId,
      // Required by automatic_tax: save the billing address entered at
      // checkout back to the Customer so Stripe can determine tax location.
      customer_update: { address: "auto", name: "auto" },
      billing_address_collection: "required",
      payment_intent_data: {
        description,
        metadata: {
          userId: user.id,
          campaignId,
          purpose: "campaign_payment",
        },
      },
      metadata: {
        userId: user.id,
        campaignId,
        purpose: "campaign_payment",
        managed_payments: "false",
      },
      // Advertising services aren't eligible for Managed Payments; use
      // automatic_tax so Stripe still calculates/collects sales tax.
      automatic_tax: { enabled: true },
    } as any);


    // Stash the session id on the campaign so webhooks / UI can correlate
    await supabase
      .from("ad_campaigns")
      .update({ payment_reference: session.id, stripe_customer_id: customerId })
      .eq("id", campaignId);

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("create-ad-checkout error:", e);
    return new Response(JSON.stringify({ error: e.message || "Checkout failed" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
