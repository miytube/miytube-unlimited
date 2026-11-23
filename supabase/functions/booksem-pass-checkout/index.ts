import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, createStripeClient, resolveOrCreateCustomer } from "../_shared/stripe.ts";
import { BOOKSEM_BOOKS, passPriceCents } from "../_shared/booksemBooks.ts";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

// Only send buyers back to Booksem (or a local dev copy of it).
const ALLOWED_RETURN = /^https:\/\/(www\.)?booksem\.com$|^http:\/\/localhost(:\d+)?$/;

// GET: does the signed-in member hold a usable pass? POST: start a half-price checkout with it.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST" && req.method !== "GET") return json({ error: "Method not allowed" }, 405);

  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return json({ error: "Sign in with your MiyTube account to use your pass." }, 401);

  if (req.method === "GET") {
    const { data } = await supabase
      .from("booksem_passes")
      .select("code, status, reserved_until")
      .eq("user_id", user.id)
      .neq("status", "redeemed")
      .order("created_at")
      .limit(1)
      .maybeSingle();
    const usable = Boolean(data) && (data!.status === "active" || new Date(data!.reserved_until ?? 0) < new Date());
    return json({ hasPass: usable, code: usable ? data!.code : null });
  }

  let body: { bookId?: unknown; environment?: unknown; returnOrigin?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  const bookId = typeof body.bookId === "string" ? body.bookId : "";
  const book = BOOKSEM_BOOKS[bookId];
  const environment = body.environment as StripeEnv;
  const returnOrigin = typeof body.returnOrigin === "string" ? body.returnOrigin.replace(/\/$/, "") : "https://booksem.com";
  if (!book) return json({ error: "This book can't be bought with a pass." }, 400);
  if (environment !== "sandbox" && environment !== "live") return json({ error: "Missing environment" }, 400);
  if (!ALLOWED_RETURN.test(returnOrigin)) return json({ error: "Invalid return address" }, 400);

  const { data: owned } = await supabase
    .from("booksem_purchases")
    .select("id")
    .eq("user_id", user.id)
    .in("book_id", [bookId, "all"])
    .limit(1);
  if (owned?.length) return json({ error: "You already own this book." }, 400);

  const { data: passId, error: reserveError } = await supabase.rpc("reserve_booksem_pass", { _user_id: user.id });
  if (reserveError) {
    console.error("reserve_booksem_pass failed:", reserveError);
    return json({ error: "Could not use your pass right now." }, 500);
  }
  if (!passId) return json({ error: "No unused Booksem pass. Get one for 250 coins in the MiyTube Shop." }, 400);

  try {
    const stripe = createStripeClient(environment);
    const customerId = await resolveOrCreateCustomer(stripe, { email: user.email, userId: user.id });
    const metadata = { userId: user.id, purpose: "booksem_pass", bookId, passId: passId as string };
    const params: Record<string, unknown> = {
      mode: "payment",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: passPriceCents(book.priceCents),
          product_data: { name: `${book.title} — Booksem audiobook (MiyTube 50% pass)` },
        },
      }],
      customer: customerId,
      customer_update: { address: "auto", name: "auto" },
      billing_address_collection: "required",
      automatic_tax: { enabled: true },
      expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
      success_url: `${returnOrigin}/?payment=success&book_id=${encodeURIComponent(bookId)}&via=miytube_pass`,
      cancel_url: `${returnOrigin}/`,
      metadata,
      payment_intent_data: { description: `${book.title} (Booksem, MiyTube pass)`, metadata },
    };

    let session;
    try {
      session = await stripe.checkout.sessions.create(params as any);
    } catch (e: any) {
      // Test accounts without a head office address can't calculate tax yet; live keeps tax on.
      if (environment !== "sandbox" || !/head office address/i.test(e?.message ?? "")) throw e;
      const { automatic_tax: _tax, ...rest } = params;
      session = await stripe.checkout.sessions.create(rest as any);
    }

    await supabase.rpc("attach_booksem_session", { _pass_id: passId, _session_id: session.id });
    return json({ url: session.url, priceCents: passPriceCents(book.priceCents) });
  } catch (e: any) {
    console.error("booksem-pass-checkout error:", e);
    await supabase.rpc("release_booksem_pass", { _pass_id: passId });
    return json({ error: e.message || "Checkout failed" }, 400);
  }
});
