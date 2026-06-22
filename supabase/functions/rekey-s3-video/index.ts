import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const API_URL = "https://connector-gateway.lovable.dev";
const S3_PUBLIC_BASE = "https://miytube.s3.us-east-1.amazonaws.com/";

const sanitize = (n: string) =>
  n.trim().replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 180) || "upload";

interface RekeyBody {
  videoIds: string[];
  table?: "uploaded_videos" | "music_videos";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const AWS_S3_API_KEY = Deno.env.get("AWS_S3_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!AWS_S3_API_KEY) throw new Error("AWS_S3_API_KEY not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin } = await userClient.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden — admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as RekeyBody;
    const table = body.table ?? "uploaded_videos";
    const ids = Array.isArray(body.videoIds) ? body.videoIds.filter(Boolean) : [];

    if (ids.length === 0) {
      return new Response(JSON.stringify({ error: "videoIds required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (ids.length > 10) {
      return new Response(JSON.stringify({ error: "Max 10 videos per request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: rows, error: fetchErr } = await admin
      .from(table)
      .select("id, title, file_name, cloud_url, video_url")
      .in("id", ids);

    if (fetchErr) throw new Error(`Lookup failed: ${fetchErr.message}`);

    const results: Array<{
      id: string;
      status: "rekeyed" | "skipped" | "failed";
      message?: string;
      oldKey?: string;
      newKey?: string;
      newUrl?: string;
    }> = [];

    for (const row of rows ?? []) {
      const r = row as Record<string, any>;
      const sourceUrl: string | null = r.cloud_url ?? r.video_url ?? null;
      try {
        if (!sourceUrl) {
          results.push({ id: r.id, status: "skipped", message: "No source URL" });
          continue;
        }
        if (!sourceUrl.includes("amazonaws.com") && !sourceUrl.includes(".s3.")) {
          results.push({ id: r.id, status: "skipped", message: "Not on S3" });
          continue;
        }

        // Extract current S3 object key from the public URL
        const keyMatch = sourceUrl.match(/amazonaws\.com\/(.+?)(?:\?|$)/);
        const oldKey = keyMatch ? decodeURIComponent(keyMatch[1]) : "";
        if (!oldKey) {
          results.push({ id: r.id, status: "skipped", message: "Cannot parse S3 key" });
          continue;
        }

        // Build the new title-based key
        const rawTitle = (r.title && String(r.title).trim()) || r.file_name || `video-${r.id}`;
        const extMatch =
          oldKey.match(/\.([a-zA-Z0-9]{2,5})$/) ||
          (r.file_name || "").match(/\.([a-zA-Z0-9]{2,5})$/);
        const ext = extMatch ? extMatch[1].toLowerCase() : "mp4";
        const titleBase = sanitize(rawTitle).replace(/\.[a-zA-Z0-9]{2,5}$/, "");
        const shortId = String(r.id).replace(/-/g, "").slice(0, 6);
        const newKey = `videos/${titleBase}-${shortId}.${ext}`;

        if (newKey === oldKey) {
          results.push({
            id: r.id,
            status: "skipped",
            message: "Already title-keyed",
            oldKey,
          });
          continue;
        }

        // Download existing S3 object (public bucket URL)
        const dl = await fetch(sourceUrl);
        if (!dl.ok) throw new Error(`Download failed [${dl.status}]`);
        const contentType = dl.headers.get("content-type") || "video/mp4";
        const blob = await dl.blob();

        // Sign upload to new key
        const signResp = await fetch(
          `${API_URL}/api/v1/sign_storage_url?provider=aws_s3&mode=write`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "X-Connection-Api-Key": AWS_S3_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ object_path: newKey }),
          }
        );
        if (!signResp.ok) {
          throw new Error(`Sign failed [${signResp.status}]: ${await signResp.text()}`);
        }
        const signData = await signResp.json();

        // Upload under new key
        const upResp = await fetch(signData.url, {
          method: signData.method ?? "PUT",
          headers: { "Content-Type": contentType },
          body: blob,
        });
        if (!upResp.ok) {
          throw new Error(`S3 PUT failed [${upResp.status}]: ${await upResp.text()}`);
        }

        const newUrl = `${S3_PUBLIC_BASE}${newKey}`;

        const updates: Record<string, any> = { cloud_url: newUrl };
        if (table === "uploaded_videos") updates.video_url = newUrl;
        const { error: upErr } = await admin.from(table).update(updates).eq("id", r.id);
        if (upErr) throw new Error(`DB update failed: ${upErr.message}`);

        results.push({
          id: r.id,
          status: "rekeyed",
          oldKey,
          newKey,
          newUrl,
          message:
            "Renamed on S3. Old object still exists — delete it manually from the AWS console to free storage.",
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error(`Rekey ${r.id} failed:`, msg);
        results.push({ id: r.id, status: "failed", message: msg });
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("rekey-s3-video error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
