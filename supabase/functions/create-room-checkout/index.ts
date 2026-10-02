import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, createStripeClient, resolveOrCreateCustomer } from "../_shared/stripe.ts";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const PRICE_ID = "room_premium_monthly";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

// Starts The Room Premium ($9.99/mo) embedded checkout for the signed-in user.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return json({ error: "Please sign in to upgrade." }, 401);

    const { returnUrl, environment } = (await req.json()) as { returnUrl?: string; environment?: StripeEnv };
    if (!returnUrl || (environment !== "sandbox" && environment !== "live")) {
      return json({ error: "Missing required fields" }, 400);
    }

    const { data: active } = await supabase.rpc("has_active_subscription", { _user_id: user.id, _env: environment });
    if (active) return json({ error: "You already have Premium." }, 400);

    const stripe = createStripeClient(environment);
    const prices = await stripe.prices.list({ lookup_keys: [PRICE_ID] });
    if (!prices.data.length) throw new Error("Price not found");
    const customerId = await resolveOrCreateCustomer(stripe, { email: user.email, userId: user.id });

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: prices.data[0].id, quantity: 1 }],
      mode: "subscription",
      ui_mode: "embedded_page",
      return_url: returnUrl,
      customer: customerId,
      customer_update: { address: "auto", name: "auto" },
      billing_address_collection: "required",
      automatic_tax: { enabled: true },
      metadata: { userId: user.id, purpose: "room_premium" },
      subscription_data: { metadata: { userId: user.id, purpose: "room_premium" } },
    } as any);

    return json({ clientSecret: session.client_secret });
  } catch (e: any) {
    console.error("create-room-checkout error:", e);
    return json({ error: e.message || "Checkout failed" }, 400);
  }
});
