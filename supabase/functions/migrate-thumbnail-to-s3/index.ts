import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const API_URL = "https://connector-gateway.lovable.dev";
const S3_PUBLIC_BASE = "https://miytube.s3.us-east-1.amazonaws.com/";

const sanitize = (n: string) =>
  n.trim().replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 180) || "thumb";

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
    if (ids.length > 25) {
      return new Response(JSON.stringify({ error: "Max 25 per request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: rows, error: fetchErr } = await admin
      .from(table)
      .select("id, title, thumbnail_url")
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
      const sourceUrl: string | null = r.thumbnail_url ?? null;
      try {
        if (!sourceUrl) {
          results.push({ id: r.id, status: "skipped", message: "No thumbnail" });
          continue;
        }
        if (sourceUrl.includes("amazonaws.com") || sourceUrl.includes(".s3.")) {
          results.push({ id: r.id, status: "skipped", message: "Already on S3" });
          continue;
        }
        if (!sourceUrl.includes("supabase.co/storage")) {
          results.push({ id: r.id, status: "skipped", message: "External thumbnail" });
          continue;
        }

        const dl = await fetch(sourceUrl);
        if (!dl.ok) throw new Error(`Download failed [${dl.status}]`);
        const contentType = dl.headers.get("content-type") || "image/jpeg";
        const blob = await dl.blob();

        const extMatch =
          (sourceUrl.match(/\.([a-zA-Z0-9]{2,5})(?:\?|$)/) ?? []) as RegExpMatchArray;
        const ext = extMatch[1] ? extMatch[1].toLowerCase() : "jpg";
        const rawTitle = (r.title && String(r.title).trim()) || `thumb-${r.id}`;
        const titleBase = sanitize(rawTitle).replace(/\.[a-zA-Z0-9]{2,5}$/, "");
        const shortId = String(r.id).replace(/-/g, "").slice(0, 6);
        const objectKey = `thumbnails/${titleBase}-${shortId}.${ext}`;

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
        if (!signResp.ok) throw new Error(`Sign failed [${signResp.status}]: ${await signResp.text()}`);
        const signData = await signResp.json();

        const upResp = await fetch(signData.url, {
          method: signData.method ?? "PUT",
          headers: { "Content-Type": contentType },
          body: blob,
        });
        if (!upResp.ok) throw new Error(`S3 PUT failed [${upResp.status}]: ${await upResp.text()}`);

        const publicUrl = `${S3_PUBLIC_BASE}${objectKey}`;

        const { error: upErr } = await admin
          .from(table)
          .update({ thumbnail_url: publicUrl })
          .eq("id", r.id);
        if (upErr) throw new Error(`DB update failed: ${upErr.message}`);

        if (deleteFromSupabase) {
          const m = sourceUrl.match(/\/storage\/v1\/object\/public\/thumbnails\/(.+)$/);
          if (m) {
            const path = decodeURIComponent(m[1]);
            await admin.storage.from("thumbnails").remove([path]).catch(() => {});
          }
        }

        results.push({ id: r.id, status: "migrated", newUrl: publicUrl });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error(`Thumb migrate ${r.id} failed:`, msg);
        results.push({ id: r.id, status: "failed", message: msg });
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("migrate-thumbnail-to-s3 error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
