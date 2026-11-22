import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, createStripeClient, resolveOrCreateCustomer } from "../_shared/stripe.ts";
import { COIN_PACKS } from "../_shared/coinPacks.ts";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

// Starts an embedded one-time checkout for a MiyTube Coin pack.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return json({ error: "Please sign in to buy coins." }, 401);

    const { packId, returnUrl, environment } = (await req.json()) as {
      packId?: string;
      returnUrl?: string;
      environment?: StripeEnv;
    };
    const pack = packId ? COIN_PACKS[packId] : undefined;
    if (!pack) return json({ error: "Unknown coin pack" }, 400);
    if (!returnUrl || (environment !== "sandbox" && environment !== "live")) {
      return json({ error: "Missing required fields" }, 400);
    }

    const stripe = createStripeClient(environment);
    const prices = await stripe.prices.list({ lookup_keys: [pack.priceLookupKey] });
    if (!prices.data.length) throw new Error("Coin pack price not found");
    const stripePrice = prices.data[0];
    const productId = typeof stripePrice.product === "string" ? stripePrice.product : stripePrice.product.id;
    const product = await stripe.products.retrieve(productId);
    const customerId = await resolveOrCreateCustomer(stripe, { email: user.email, userId: user.id });

    const params: Record<string, unknown> = {
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: returnUrl,
      customer: customerId,
      customer_update: { address: "auto", name: "auto" },
      billing_address_collection: "required",
      automatic_tax: { enabled: true },
      metadata: { userId: user.id, purpose: "coin_pack", packId },
      payment_intent_data: { description: product.name, metadata: { userId: user.id, purpose: "coin_pack", packId } },
    };

    let session;
    try {
      session = await stripe.checkout.sessions.create(params as any);
    } catch (e: any) {
      // Test accounts without a head office address can't calculate tax yet.
      // Let test purchases through; live checkouts always keep tax on.
      if (environment !== "sandbox" || !/head office address/i.test(e?.message ?? "")) throw e;
      console.warn("Sandbox tax settings incomplete; creating test checkout without automatic tax.");
      const { automatic_tax: _tax, ...rest } = params;
      session = await stripe.checkout.sessions.create(rest as any);
    }

    return json({ clientSecret: session.client_secret });
  } catch (e: any) {
    console.error("create-coin-checkout error:", e);
    return json({ error: e.message || "Checkout failed" }, 400);
  }
});
