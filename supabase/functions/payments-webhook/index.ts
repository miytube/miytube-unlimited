import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, verifyWebhook, createStripeClient } from "../_shared/stripe.ts";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
  }
  return _supabase;
}

async function enqueueEmail(payload: Record<string, unknown>) {
  try {
    await getSupabase().rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload,
    });
  } catch (e) {
    console.error("enqueue_email failed:", e);
  }
}

async function handleCampaignPayment(session: any, env: StripeEnv, isTopup: boolean) {
  const campaignId = session.metadata?.campaignId;
  const userId = session.metadata?.userId;
  if (!campaignId) {
    console.warn("Session with no campaignId metadata:", session.id);
    return;
  }

  // Get the paid PaymentIntent for reliable amount + intent id
  const stripe = createStripeClient(env);
  const intentId = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id;
  if (!intentId) return;
  const pi = await stripe.paymentIntents.retrieve(intentId);
  const amountUsd = Number(pi.amount_received || pi.amount || 0) / 100;

  const { data: campaign } = await getSupabase()
    .from("ad_campaigns")
    .select("*")
    .eq("id", campaignId)
    .maybeSingle();
  if (!campaign) return;

  const payments = (campaign.budget_payments as any[]) || [];
  // Idempotency: skip if this PI is already recorded
  if (payments.find((p) => p.payment_intent === pi.id)) {
    console.log("Duplicate webhook, skipping:", pi.id);
    return;
  }
  payments.push({
    payment_intent: pi.id,
    session_id: session.id,
    amount: amountUsd,
    paid_at: new Date().toISOString(),
    kind: isTopup ? "topup" : "initial",
    refunded_cents: 0,
  });

  const update: Record<string, unknown> = {
    budget_payments: payments,
    payment_status: "paid",
    stripe_customer_id: session.customer || campaign.stripe_customer_id,
  };

  if (isTopup) {
    update.total_budget = Number(campaign.total_budget || 0) + amountUsd;
  } else {
    // Initial payment → move to admin review (per user's business rule)
    update.status = "pending_review";
  }

  await getSupabase().from("ad_campaigns").update(update).eq("id", campaignId);

  // Notify advertiser
  if (userId) {
    const { data: profile } = await getSupabase()
      .from("profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    void profile;
  }

  // Fetch email from auth.users via service role
  const { data: userRes } = await getSupabase().auth.admin.getUserById(userId);
  const userEmail = userRes?.user?.email;

  if (userEmail) {
    await enqueueEmail({
      to: userEmail,
      label: isTopup ? "ad_topup_receipt" : "ad_campaign_receipt",
      subject: isTopup
        ? `Budget added — ${campaign.campaign_name}`
        : `Payment received for ${campaign.campaign_name}`,
      html: `
        <h2>Thanks for your ${isTopup ? "top-up" : "campaign payment"}!</h2>
        <p>Campaign: <strong>${campaign.campaign_name}</strong></p>
        <p>Amount: <strong>$${amountUsd.toFixed(2)} USD</strong></p>
        ${isTopup
          ? `<p>Your campaign budget has been increased.</p>`
          : `<p>Your campaign is now under review by our team. You'll get another email as soon as it's approved and live.</p>`}
        <p>View it any time in <a href="https://miytube.com/advertising">My Campaigns</a>.</p>
      `,
    });
  }

  // Notify admins (best-effort — email all admins)
  if (!isTopup) {
    const { data: admins } = await getSupabase()
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");
    for (const admin of admins || []) {
      const { data: adminUser } = await getSupabase().auth.admin.getUserById(admin.user_id);
      const email = adminUser?.user?.email;
      if (!email) continue;
      await enqueueEmail({
        to: email,
        label: "ad_campaign_review_needed",
        subject: `New paid campaign needs review: ${campaign.campaign_name}`,
        html: `
          <h2>New ad campaign awaiting review</h2>
          <p><strong>${campaign.campaign_name}</strong> by ${campaign.business_name}</p>
          <p>Budget: $${Number(campaign.total_budget).toFixed(2)} USD</p>
          <p><a href="https://miytube.com/admin">Open admin dashboard</a></p>
        `,
      });
    }
  }
}

async function handleChargeRefunded(charge: any) {
  const piId = typeof charge.payment_intent === "string"
    ? charge.payment_intent
    : charge.payment_intent?.id;
  if (!piId) return;

  // Find the campaign that has this PI in its budget_payments
  const { data: campaigns } = await getSupabase()
    .from("ad_campaigns")
    .select("id, budget_payments, refunded_amount")
    .contains("budget_payments", [{ payment_intent: piId }]);
  const campaign = campaigns?.[0];
  if (!campaign) {
    console.log("No campaign found for refunded PI:", piId);
    return;
  }

  // Recompute refunded totals from Stripe's authoritative amount_refunded (cents)
  const payments = (campaign.budget_payments as any[]) || [];
  const totalRefundedCents = Number(charge.amount_refunded || 0);
  const updated = payments.map((p) =>
    p.payment_intent === piId ? { ...p, refunded_cents: totalRefundedCents } : p,
  );
  const totalRefundedUsd = updated.reduce(
    (s, p) => s + Number(p.refunded_cents || 0) / 100,
    0,
  );

  await getSupabase()
    .from("ad_campaigns")
    .update({ budget_payments: updated, refunded_amount: totalRefundedUsd })
    .eq("id", campaign.id);
}

async function handleDispute(dispute: any) {
  const piId = typeof dispute.payment_intent === "string"
    ? dispute.payment_intent
    : dispute.payment_intent?.id;
  if (!piId) return;
  const { data: campaigns } = await getSupabase()
    .from("ad_campaigns")
    .select("id, campaign_name, user_id")
    .contains("budget_payments", [{ payment_intent: piId }]);
  const campaign = campaigns?.[0];
  if (!campaign) return;
  await getSupabase()
    .from("ad_campaigns")
    .update({
      dispute_status: dispute.status,
      status: "paused",
    })
    .eq("id", campaign.id);

  // Notify admins so someone can respond
  const { data: admins } = await getSupabase()
    .from("user_roles")
    .select("user_id")
    .eq("role", "admin");
  for (const admin of admins || []) {
    const { data: adminUser } = await getSupabase().auth.admin.getUserById(admin.user_id);
    const email = adminUser?.user?.email;
    if (!email) continue;
    await enqueueEmail({
      to: email,
      label: "ad_campaign_dispute",
      subject: `⚠️ Dispute opened on ${campaign.campaign_name}`,
      html: `<p>A payment dispute (${dispute.status}) was opened on <strong>${campaign.campaign_name}</strong>. The campaign has been paused.</p><p>Review evidence in the Stripe dashboard.</p>`,
    });
  }
}

async function handlePaymentFailed(pi: any) {
  const campaignId = pi.metadata?.campaignId;
  if (!campaignId) return;
  const err = pi.last_payment_error?.message || "Payment failed";
  await getSupabase()
    .from("ad_campaigns")
    .update({ last_payment_error: err })
    .eq("id", campaignId);
  console.log("Recorded payment failure for", campaignId, err);
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const purpose = session.metadata?.purpose;
      if (purpose === "campaign_payment") {
        await handleCampaignPayment(session, env, false);
      } else if (purpose === "campaign_topup") {
        await handleCampaignPayment(session, env, true);
      } else {
        console.log("Unhandled session purpose:", purpose);
      }
      break;
    }
    case "charge.refunded":
      await handleChargeRefunded(event.data.object);
      break;
    case "charge.dispute.created":
    case "charge.dispute.funds_withdrawn":
      await handleDispute(event.data.object);
      break;
    case "payment_intent.payment_failed":
      await handlePaymentFailed(event.data.object);
      break;
    case "checkout.session.async_payment_failed":
      console.log("Async payment failed:", (event.data.object as any)?.id);
      break;
    default:
      console.log("Unhandled event:", event.type);
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    console.error("Invalid env query parameter:", rawEnv);
    return new Response(JSON.stringify({ received: true, ignored: "invalid env" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await handleWebhook(req, rawEnv);
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});
