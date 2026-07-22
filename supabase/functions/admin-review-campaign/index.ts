import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const SITE_URL = "https://miytube.com";

async function enqueueEmail(payload: Record<string, unknown>) {
  try {
    await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload,
    });
  } catch (e) {
    console.error("enqueue_email failed:", e);
  }
}

async function emailAdvertiser(campaign: any, subject: string, html: string) {
  const { data } = await supabase.auth.admin.getUserById(campaign.user_id);
  const to = data?.user?.email;
  if (!to) return;
  await enqueueEmail({ to, label: "ad_campaign_review", subject, html });
}

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
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) throw new Error("Unauthorized");

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { campaignId, action, reason, environment } = await req.json() as {
      campaignId: string;
      action: "approve" | "reject" | "request_changes";
      reason?: string;
      environment?: "sandbox" | "live";
    };

    if (!campaignId || !["approve", "reject", "request_changes"].includes(action)) {
      throw new Error("Invalid input");
    }
    if ((action === "reject" || action === "request_changes") && !reason?.trim()) {
      throw new Error("Reason required");
    }

    const { data: campaign, error: cErr } = await supabase
      .from("ad_campaigns")
      .select("*")
      .eq("id", campaignId)
      .maybeSingle();
    if (cErr || !campaign) throw new Error("Campaign not found");

    const reviewedFields = {
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    };

    const isSafeHttpUrl = (raw: unknown): boolean => {
      if (typeof raw !== "string" || !raw) return false;
      try {
        const u = new URL(raw.trim());
        return u.protocol === "https:" || u.protocol === "http:";
      } catch {
        return false;
      }
    };

    if (action === "approve") {
      // Defense in depth: refuse to activate a campaign whose destination or
      // media URL is not a plain http(s) link (blocks javascript:/data: XSS).
      if (!isSafeHttpUrl(campaign.destination_url)) {
        throw new Error("Campaign destination_url must be an http(s) URL");
      }
      if (campaign.media_url && !isSafeHttpUrl(campaign.media_url)) {
        throw new Error("Campaign media_url must be an http(s) URL");
      }

      await supabase
        .from("ad_campaigns")
        .update({
          ...reviewedFields,
          status: "active",
          admin_notes: reason || null,
          rejection_reason: null,
        })
        .eq("id", campaignId);

      await emailAdvertiser(
        campaign,
        `Your campaign "${campaign.campaign_name}" is live`,
        `<h2>Approved!</h2><p><strong>${campaign.campaign_name}</strong> is now running.</p><p><a href="${SITE_URL}/advertising">View performance</a></p>`,
      );
      return new Response(JSON.stringify({ ok: true, status: "active" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "request_changes") {
      await supabase
        .from("ad_campaigns")
        .update({
          ...reviewedFields,
          status: "draft",
          // Keep payment_status as-is so the advertiser doesn't have to pay again.
          admin_notes: reason,
        })
        .eq("id", campaignId);

      await emailAdvertiser(
        campaign,
        `Changes requested on "${campaign.campaign_name}"`,
        `<h2>We need a small change</h2><p>${reason}</p><p>Open your campaign in <a href="${SITE_URL}/advertising">My Campaigns</a> to update it.</p>`,
      );
      return new Response(JSON.stringify({ ok: true, status: "draft" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // action === "reject" → full refund via existing refund function
    if (environment !== "sandbox" && environment !== "live") {
      throw new Error("environment required for reject");
    }

    // Call refund-ad-campaign as service-role to refund everything unspent.
    // We pass the admin's JWT so it can pass its own admin check.
    const refundRes = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/refund-ad-campaign`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campaignId,
          environment,
          reason,
          finalStatus: "rejected",
        }),
      },
    );
    const refundJson = await refundRes.json();
    if (!refundRes.ok) throw new Error(refundJson.error || "Refund failed");

    await supabase
      .from("ad_campaigns")
      .update({
        ...reviewedFields,
        status: "rejected",
        rejection_reason: reason,
      })
      .eq("id", campaignId);

    await emailAdvertiser(
      campaign,
      `Campaign "${campaign.campaign_name}" was not approved`,
      `<h2>Unfortunately we can't run this campaign</h2><p>${reason}</p><p>We've refunded <strong>$${Number(refundJson.refunded || 0).toFixed(2)} USD</strong> to your original card. It typically clears in 5–10 business days.</p>`,
    );

    return new Response(
      JSON.stringify({ ok: true, status: "rejected", refunded: refundJson.refunded }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    console.error("admin-review-campaign error:", e);
    return new Response(JSON.stringify({ error: e.message || "Review failed" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
