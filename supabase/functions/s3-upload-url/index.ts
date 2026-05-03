import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const API_URL = "https://connector-gateway.lovable.dev";

const sanitizeObjectFileName = (fileName: string): string => {
  const trimmed = fileName.trim().replace(/[^a-zA-Z0-9._-]/g, "_");
  const withoutTraversal = trimmed.replace(/\.{2,}/g, ".").replace(/^\.+/, "");
  const safeName = withoutTraversal || "upload";
  return safeName.slice(0, 180);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const AWS_S3_API_KEY = Deno.env.get("AWS_S3_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!AWS_S3_API_KEY) throw new Error("AWS_S3_API_KEY not configured");

    // Require authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const body = await req.json();
    const { fileName, contentType, kind } = body as {
      fileName?: string;
      contentType?: string;
      kind?: "video" | "thumbnail";
    };

    if (!fileName || typeof fileName !== "string" || fileName.length > 255) {
      return new Response(JSON.stringify({ error: "Invalid fileName" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safeName = sanitizeObjectFileName(fileName);
    const folder = kind === "thumbnail" ? "thumbnails" : "videos";
    const objectKey = `${folder}/${userId}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 9)}-${safeName}`;

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
      const errText = await signResp.text();
      throw new Error(`Sign error [${signResp.status}]: ${errText}`);
    }

    const signData = await signResp.json();

    // Public URL pattern for the bucket (path-style works in us-east-1)
    const publicUrl = `https://miytube.s3.us-east-1.amazonaws.com/${objectKey}`;

    return new Response(
      JSON.stringify({
        upload_url: signData.url,
        method: signData.method ?? "PUT",
        expires_in: signData.expires_in ?? 900,
        object_key: objectKey,
        public_url: publicUrl,
        content_type: contentType ?? "application/octet-stream",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("s3-upload-url error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
