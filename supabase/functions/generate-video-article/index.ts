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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "AI is not configured." }, 500);

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return json({ error: "Sign in to generate an article." }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) return json({ error: "Sign in to generate an article." }, 401);

    const body = await req.json().catch(() => null);
    const videoId = typeof body?.videoId === "string" ? body.videoId : null;
    if (!videoId) return json({ error: "videoId is required." }, 400);

    const admin = createClient(supabaseUrl, serviceKey);

    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    const isAdmin = !!roleRow;

    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(videoId);
    const videoQuery = admin
      .from("uploaded_videos")
      .select("id, local_id, title, description, category, subcategory, tags, user_id");
    if (isUuid) {
      videoQuery.eq("id", videoId);
    } else {
      videoQuery.eq("local_id", videoId);
    }
    const { data: video, error: videoError } = await videoQuery.maybeSingle();

    if (videoError || !video) {
      return json({ error: "Video not found." }, 404);
    }

    if (video.user_id !== user.id && !isAdmin) {
      return json({ error: "You do not have permission to generate an article for this video." }, 403);
    }

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

    const gateway = createLovableAiGatewayProvider(apiKey);

    const { text } = await generateText({
      model: gateway(CHA_MODEL),
      prompt,
    });

    const raw = (text || "").trim();
    if (!raw) return json({ error: "AI did not return any content." }, 500);

    let parsed: {
      seoTitle?: string;
      metaDescription?: string;
      keywords?: string[];
      markdown?: string;
    } | null = null;
    try {
      const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = null;
    }

    const content = (parsed?.markdown || raw).trim();
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = (parsed?.seoTitle || titleMatch?.[1] || video.title || "Untitled Article").trim();

    const withoutTitle = titleMatch ? content.replace(titleMatch[0], "").trim() : content;
    const firstParagraph = withoutTitle
      .split(/\n\s*\n/)
      .map((p: string) => p.trim())
      .find((p: string) => p && !p.startsWith("#")) || "";
    const excerpt = (parsed?.metaDescription || firstParagraph.replace(/[#*_`]/g, "")).slice(0, 250);

    const keywords = Array.isArray(parsed?.keywords) ? parsed!.keywords!.slice(0, 8) : [];

    return json({ title, excerpt, content, keywords, watchUrl, videoId: video.id });
  } catch (error) {
    console.error("generate-video-article error", error);
    return json({ error: error instanceof Error ? error.message : "Unexpected error" }, 500);
  }
});
