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
    const customerId = await resolveOrCreateCustomer(stripe, { email: user.email, userId: user.id });

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: prices.data[0].id, quantity: 1 }],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: returnUrl,
      customer: customerId,
      customer_update: { address: "auto", name: "auto" },
      billing_address_collection: "required",
      automatic_tax: { enabled: true },
      metadata: { userId: user.id, purpose: "coin_pack", packId },
      payment_intent_data: { metadata: { userId: user.id, purpose: "coin_pack", packId } },
    } as any);

    return json({ clientSecret: session.client_secret });
  } catch (e: any) {
    console.error("create-coin-checkout error:", e);
    return json({ error: e.message || "Checkout failed" }, 400);
  }
});
