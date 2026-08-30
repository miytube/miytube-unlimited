import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generateText } from "npm:ai";
import { CHA_MODEL, createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 70) || "article";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "AI is not configured." }, 500);

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return json({ error: "Sign in required." }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) return json({ error: "Sign in required." }, 401);

    const admin = createClient(supabaseUrl, serviceKey);

    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) return json({ error: "Admins only." }, 403);

    const body = await req.json().catch(() => ({}));
    const mode = body?.mode === "count" ? "count" : "run";
    const batchSize = Math.min(Math.max(Number(body?.batch_size) || 5, 1), 15);
    const publish = body?.publish !== false;

    // Videos that already have a generated article
    const { data: existing } = await admin
      .from("blog_posts")
      .select("generated_from_video_id")
      .not("generated_from_video_id", "is", null)
      .limit(5000);
    const done = new Set((existing || []).map((r: any) => r.generated_from_video_id));

    const { data: candidates, error: vErr } = await admin
      .from("uploaded_videos")
      .select("id, local_id, title, description, category, subcategory, tags, user_id, created_at")
      .order("created_at", { ascending: false })
      .limit(2000);
    if (vErr) return json({ error: vErr.message }, 500);

    const pending = (candidates || []).filter(
      (v: any) => !done.has(v.id) && (v.title || "").trim().length > 3,
    );

    if (mode === "count") {
      return json({ remaining: pending.length, total: (candidates || []).length });
    }

    const gateway = createLovableAiGatewayProvider(apiKey);
    const results: any[] = [];
    let created = 0;
    let errors = 0;

    for (const video of pending.slice(0, batchSize)) {
      try {
        const tags = Array.isArray(video.tags) ? video.tags.join(", ") : (video.tags || "");
        const watchUrl = `https://www.miytube.com/watch?v=${video.local_id || video.id}`;

        const prompt = `You are an SEO content writer for MiyTube, a video platform. Turn this video into a search-friendly article.

Title: ${video.title || "Untitled video"}
Description: ${video.description || "No description provided."}
Category: ${video.category || "General"}
Subcategory: ${video.subcategory || "N/A"}
Tags: ${tags || "N/A"}
Watch URL: ${watchUrl}

Return ONLY a JSON object (no code fences, no commentary) with these keys:
{
  "seoTitle": "compelling title under 60 characters, includes the main keyword",
  "metaDescription": "under 155 characters, includes the main keyword, reads naturally",
  "keywords": ["5-8 realistic search keywords people would type"],
  "markdown": "the full article in Markdown"
}

The "markdown" article must:
- start with a single H1 matching the seoTitle
- open with a 2-3 sentence answer-first intro that a search engine could use as a snippet
- use 3-5 H2/H3 sections with concrete, specific detail (no filler, no invented facts or statistics)
- include a "Key Takeaways" bulleted list
- include a short "Frequently Asked Questions" section with 3 Q&A pairs using H3 questions
- include a line linking to the video: [Watch the full video on MiyTube](${watchUrl})
- end with a one-paragraph summary
- be roughly 600-900 words`;

        const { text } = await generateText({ model: gateway(CHA_MODEL), prompt });
        const raw = (text || "").trim();
        if (!raw) throw new Error("Empty AI response");

        let parsed: any = null;
        try {
          parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, ""));
        } catch {
          parsed = null;
        }

        const content = String(parsed?.markdown || raw).trim();
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = String(parsed?.seoTitle || titleMatch?.[1] || video.title).trim().slice(0, 120);
        const withoutTitle = titleMatch ? content.replace(titleMatch[0], "").trim() : content;
        const firstParagraph =
          withoutTitle
            .split(/\n\s*\n/)
            .map((p: string) => p.trim())
            .find((p: string) => p && !p.startsWith("#")) || "";
        const excerpt = String(parsed?.metaDescription || firstParagraph.replace(/[#*_`]/g, "")).slice(0, 250);

        const slug = `${slugify(title)}-${Math.random().toString(36).slice(2, 7)}`;

        const { error: insErr } = await admin.from("blog_posts").insert({
          user_id: video.user_id || user.id,
          title,
          slug,
          excerpt,
          content,
          category: video.category || null,
          is_published: publish,
          generated_from_video_id: video.id,
        });
        if (insErr) throw new Error(insErr.message);

        created++;
        results.push({ video_id: video.id, status: "created", title, slug });
      } catch (e: any) {
        errors++;
        results.push({
          video_id: video.id,
          status: "error",
          title: video.title,
          error: e?.message || "Unknown error",
        });
      }
    }

    return json({
      created,
      errors,
      processed: Math.min(batchSize, pending.length),
      remaining: Math.max(pending.length - created, 0),
      results,
    });
  } catch (error) {
    console.error("batch-generate-articles error", error);
    return json({ error: error instanceof Error ? error.message : "Unexpected error" }, 500);
  }
});
