import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, createStripeClient, resolveOrCreateCustomer } from "../_shared/stripe.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const MIN_AMOUNT_CENTS = 100;
const MAX_AMOUNT_CENTS = 1000000;

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

    const body = await req.json().catch(() => ({}));
    const {
      creatorId,
      videoId,
      amountCents,
      environment,
      returnUrl,
    } = body as {
      creatorId?: string;
      videoId?: string;
      amountCents?: number;
      environment?: StripeEnv;
      returnUrl?: string;
    };

    const errors: string[] = [];
    if (!creatorId || typeof creatorId !== "string") errors.push("creatorId is required");
    if (!returnUrl || typeof returnUrl !== "string") errors.push("returnUrl is required");
    if (environment !== "sandbox" && environment !== "live") errors.push("environment must be 'sandbox' or 'live'");
    if (
      typeof amountCents !== "number" ||
      !Number.isInteger(amountCents) ||
      amountCents < MIN_AMOUNT_CENTS ||
      amountCents > MAX_AMOUNT_CENTS
    ) {
      errors.push(`amountCents must be an integer between ${MIN_AMOUNT_CENTS} and ${MAX_AMOUNT_CENTS}`);
    }

    if (errors.length) {
      return new Response(JSON.stringify({ error: "Validation failed", details: errors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (creatorId === user.id) {
      return new Response(JSON.stringify({ error: "You cannot tip yourself" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = createStripeClient(environment as StripeEnv);
    const customerId = await resolveOrCreateCustomer(stripe, {
      email: user.email ?? undefined,
      userId: user.id,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      customer: customerId,
      automatic_payment_methods: { enabled: true },
      description: "MiyTube creator tip",
      metadata: {
        userId: user.id,
        creatorId: creatorId as string,
        videoId: videoId ?? "",
        purpose: "creator_tip",
      },
    });

    const { error: insertError } = await supabase.from("tips").insert({
      payer_id: user.id,
      creator_id: creatorId,
      video_id: videoId || null,
      amount_cents: amountCents,
      stripe_payment_intent_id: paymentIntent.id,
      status: "pending",
    });

    if (insertError) {
      console.error("create-tip-intent: failed to insert tip row", insertError);
      throw new Error("Failed to record tip");
    }

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("create-tip-intent error:", e);
    return new Response(JSON.stringify({ error: e.message || "Failed to create tip" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
