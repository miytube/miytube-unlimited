import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const API_URL = "https://connector-gateway.lovable.dev";

const sanitize = (n: string) =>
  n.trim().replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 180) || "upload";

interface MigrateBody {
  videoIds: string[];
  table?: "uploaded_videos" | "music_videos";
  deleteFromSupabase?: boolean;
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

    // Auth + admin check
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

    const body = (await req.json()) as MigrateBody;
    const table = body.table ?? "uploaded_videos";
    const ids = Array.isArray(body.videoIds) ? body.videoIds.filter(Boolean) : [];
    const deleteFromSupabase = !!body.deleteFromSupabase;

    if (ids.length === 0) {
      return new Response(JSON.stringify({ error: "videoIds required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (ids.length > 5) {
      return new Response(JSON.stringify({ error: "Max 5 videos per request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const urlCol = "cloud_url";
    const fallbackCol = "video_url";

    const { data: rows, error: fetchErr } = await admin
      .from(table)
      .select(`id, title, file_name, ${urlCol}, ${fallbackCol}`)
      .in("id", ids);

    if (fetchErr) throw new Error(`Lookup failed: ${fetchErr.message}`);

    const results: Array<{
      id: string;
      status: "migrated" | "skipped" | "failed";
      message?: string;
      newUrl?: string;
    }> = [];

    for (const row of rows ?? []) {
      const r = row as Record<string, any>;
      const sourceUrl: string | null = r[urlCol] ?? r[fallbackCol] ?? null;
      try {
        if (!sourceUrl) {
          results.push({ id: r.id, status: "skipped", message: "No source URL" });
          continue;
        }
        if (sourceUrl.includes("amazonaws.com") || sourceUrl.includes(".s3.")) {
          results.push({ id: r.id, status: "skipped", message: "Already on S3" });
          continue;
        }

        // Download from Supabase Storage (public URL)
        const dl = await fetch(sourceUrl);
        if (!dl.ok) throw new Error(`Download failed [${dl.status}]`);
        const contentType = dl.headers.get("content-type") || "video/mp4";
        const blob = await dl.blob();

        // Build S3 object key — use the video TITLE as the filename so it's
        // easy to find in S3. Fall back to original filename, then id. We add
        // a short 6-char id suffix only to prevent collisions between videos
        // that happen to share the same title.
        const rawTitle = (r.title && String(r.title).trim()) || r.file_name || `video-${r.id}`;
        const extMatch = (r.file_name || sourceUrl || "").match(/\.([a-zA-Z0-9]{2,5})(?:\?|$)/);
        const ext = extMatch ? extMatch[1].toLowerCase() : "mp4";
        const titleBase = sanitize(rawTitle).replace(/\.[a-zA-Z0-9]{2,5}$/, "");
        const shortId = String(r.id).replace(/-/g, "").slice(0, 6);
        const objectKey = `videos/${titleBase}-${shortId}.${ext}`;

        // Sign S3 upload
        const signResp = await fetch(
          `${API_URL}/api/v1/sign_storage_url?provider=aws_s3&mode=write`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "X-Connection-Api-Key": AWS_S3_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ object_path: objectKey }),
          }
        );
        if (!signResp.ok) {
          throw new Error(`Sign failed [${signResp.status}]: ${await signResp.text()}`);
        }
        const signData = await signResp.json();

        // Upload to S3
        const upResp = await fetch(signData.url, {
          method: signData.method ?? "PUT",
          headers: { "Content-Type": contentType },
          body: blob,
        });
        if (!upResp.ok) {
          throw new Error(`S3 PUT failed [${upResp.status}]: ${await upResp.text()}`);
        }

        const publicUrl = `https://miytube.s3.us-east-1.amazonaws.com/${objectKey}`;

        // Update DB row
        const updates: Record<string, any> = { [urlCol]: publicUrl };
        if (table === "uploaded_videos") updates.video_url = publicUrl;
        const { error: upErr } = await admin.from(table).update(updates).eq("id", r.id);
        if (upErr) throw new Error(`DB update failed: ${upErr.message}`);

        // Optionally remove from Supabase Storage
        if (deleteFromSupabase) {
          const m = sourceUrl.match(/\/storage\/v1\/object\/public\/videos\/(.+)$/);
          if (m) {
            const path = decodeURIComponent(m[1]);
            await admin.storage.from("videos").remove([path]).catch(() => {});
          }
        }

        results.push({ id: r.id, status: "migrated", newUrl: publicUrl });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error(`Migrate ${r.id} failed:`, msg);
        results.push({ id: r.id, status: "failed", message: msg });
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("migrate-video-to-s3 error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
