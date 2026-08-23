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

    const prompt = `You are a skilled content writer for MiyTube, a video platform. Write a blog article based on the following video metadata:

Title: ${video.title || "Untitled video"}
Description: ${video.description || "No description provided."}
Category: ${video.category || "General"}
Subcategory: ${video.subcategory || "N/A"}
Tags: ${tags || "N/A"}

Write a ~400-800 word article in Markdown format that includes:
- A single H1 title (can be similar to but more engaging than the video title)
- 2-4 H2/H3 headings organizing the content
- A "Key Takeaways" section with a bulleted list
- A short transcript-style excerpt paragraph presented as if quoting highlights from the video (clearly framed as illustrative, based on the description/title, not a verbatim transcript)
- A 1-paragraph summary at the end

Output ONLY the Markdown article, nothing else.`;

    const gateway = createLovableAiGatewayProvider(apiKey);

    const { text } = await generateText({
      model: gateway(CHA_MODEL),
      prompt,
    });

    const content = (text || "").trim();
    if (!content) return json({ error: "AI did not return any content." }, 500);

    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : (video.title || "Untitled Article");

    const withoutTitle = titleMatch ? content.replace(titleMatch[0], "").trim() : content;
    const firstParagraph = withoutTitle
      .split(/\n\s*\n/)
      .map((p: string) => p.trim())
      .find((p: string) => p && !p.startsWith("#")) || "";
    const excerpt = firstParagraph.replace(/[#*_`]/g, "").slice(0, 250);

    return json({ title, excerpt, content, videoId: video.id });
  } catch (error) {
    console.error("generate-video-article error", error);
    return json({ error: error instanceof Error ? error.message : "Unexpected error" }, 500);
  }
});
