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

    const body = await req.json().catch(() => null);
    const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
    const force = body?.force === true;
    if (!slug) return json({ error: "slug is required." }, 400);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: post, error } = await admin
      .from("blog_posts")
      .select("id, title, excerpt, content, ai_summary")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !post) return json({ error: "Article not found." }, 404);
    if (post.ai_summary && !force) return json({ summary: post.ai_summary, cached: true });

    const gateway = createLovableAiGatewayProvider(apiKey);

    const prompt = `Break down this article for a reader who wants the gist fast.

Title: ${post.title}
Article:
${String(post.content || "").slice(0, 12000)}

Write in plain Markdown, no preamble, using exactly this shape:
**The short version**
One or two sentences.

**Key takeaways**
- 3 to 5 bullets, each a concrete point from the article.

**Why it matters**
One or two sentences.

Only use facts from the article. Do not invent numbers, names or quotes.`;

    const { text } = await generateText({
      model: gateway(CHA_MODEL),
      prompt,
      abortSignal: AbortSignal.timeout(60_000),
    });

    const summary = (text || "").trim();
    if (!summary) return json({ error: "Could not generate a breakdown." }, 502);

    await admin
      .from("blog_posts")
      .update({ ai_summary: summary, ai_summary_generated_at: new Date().toISOString() })
      .eq("id", post.id);

    return json({ summary, cached: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("summarize-article failed", message);
    if (/429|rate limit/i.test(message)) {
      return json({ error: "Too many requests right now. Try again in a moment." }, 429);
    }
    if (/402|credit/i.test(message)) {
      return json({ error: "AI credits are exhausted. Try again later." }, 402);
    }
    return json({ error: "Could not generate a breakdown." }, 500);
  }
});
