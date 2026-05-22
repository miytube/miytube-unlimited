// Auto-title videos using Lovable AI (Gemini) with vision.
// Supports two modes:
//   1) Legacy: server fetches the thumbnail for each row and titles from one image.
//   2) Smart:  client pre-extracts multiple frames per video and posts them in
//      { videos: [{ id, filename, frames: [dataUrl, ...] }] }. The AI sees
//      multiple frames + the filename hint -> dramatically better titles.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const ALLOWED_CATEGORIES = [
  "Sports", "Music", "News", "Hollywood", "Comedy", "Cars", "Animals",
  "Nature", "Food", "Travel", "Gaming", "Education", "Technology",
  "Military", "Disasters", "Weather", "People", "Family", "Fitness",
  "Business", "Real Estate", "Boats", "Trains", "Airplanes", "Other",
];

interface VideoRow {
  id: string;
  title: string;
  cloud_url: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
}

interface SmartVideoInput {
  id: string;
  filename?: string;
  frames: string[]; // data URLs or http(s) image URLs
}

function isSupportedImageUrl(url: string | null): url is string {
  if (!url) return false;
  if (/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(url)) return true;
  try {
    const parsed = new URL(url);
    return /\.(png|jpe?g|webp|gif)$/i.test(parsed.pathname);
  } catch {
    return false;
  }
}

interface AIMeta {
  title: string;
  category: string;
  subcategory: string;
  description: string;
  confidence: number;
}

async function generateTitleFromFrames(
  frames: string[],
  filenameHint?: string,
): Promise<AIMeta | null> {
  const imageParts = frames
    .filter((f) => typeof f === "string" && f.length > 0)
    .slice(0, 6) // cap to keep prompt size sane
    .map((url) => ({ type: "image_url", image_url: { url } }));

  if (imageParts.length === 0) return null;

  const userText =
    `Allowed categories: ${ALLOWED_CATEGORIES.join(", ")}.\n` +
    `You are looking at ${imageParts.length} frames sampled across one video ` +
    `(start → middle → end). Use ALL frames together to infer the true subject. ` +
    `If frames disagree, prioritize what is shown for the longest / appears most often. ` +
    (filenameHint ? `Original filename hint: "${filenameHint}".\n` : "") +
    `Output a confidence 0-1: only set high confidence (>=0.7) when the subject is clearly identifiable across frames. ` +
    `If unsure, pick category "Other" and a generic descriptive title (do NOT invent specifics like city names, league names, or people).`;

  const body = {
    model: "google/gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content:
          "You are a video metadata expert. You will be shown multiple frames from ONE video. Generate one concise SEO-friendly title (<=70 chars), a category from the allowed list, a 1-3 word subcategory, a 1-sentence description, and a confidence score. Be specific only when the frames clearly support it. Never hallucinate locations, names, brands, or events.",
      },
      {
        role: "user",
        content: [{ type: "text", text: userText }, ...imageParts],
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "set_video_metadata",
          description: "Save the generated title, category, subcategory, description, and confidence.",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string", description: "Descriptive SEO title (max 70 chars)" },
              category: { type: "string", enum: ALLOWED_CATEGORIES },
              subcategory: { type: "string", description: "1-3 word subcategory" },
              description: { type: "string", description: "One sentence summary" },
              confidence: { type: "number", description: "0-1 confidence that the title accurately reflects the video" },
            },
            required: ["title", "category", "subcategory", "description", "confidence"],
            additionalProperties: false,
          },
        },
      },
    ],
    tool_choice: { type: "function", function: { name: "set_video_metadata" } },
  };

  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`AI gateway ${resp.status}: ${txt.slice(0, 300)}`);
  }
  const data = await resp.json();
  const tc = data?.choices?.[0]?.message?.tool_calls?.[0];
  if (!tc) return null;
  try {
    const args = JSON.parse(tc.function.arguments);
    return {
      title: String(args.title || "").slice(0, 100),
      category: String(args.category || "Other"),
      subcategory: String(args.subcategory || ""),
      description: String(args.description || ""),
      confidence: Math.max(0, Math.min(1, Number(args.confidence ?? 0.5))),
    };
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = await req.json().catch(() => ({}));
    const { batch_size = 10, dry_run = false, videos: smartVideos, min_confidence = 0.5 } = payload as {
      batch_size?: number;
      dry_run?: boolean;
      videos?: SmartVideoInput[];
      min_confidence?: number;
    };

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
    const results: any[] = [];
    const startTime = Date.now();
    const MAX_RUNTIME_MS = 110_000;

    // ----- SMART MODE: client supplied pre-extracted frames -----
    if (Array.isArray(smartVideos) && smartVideos.length > 0) {
      for (const v of smartVideos.slice(0, 100)) {
        if (Date.now() - startTime > MAX_RUNTIME_MS) {
          results.push({ id: v.id, status: "skipped", reason: "batch timeout" });
          break;
        }
        if (!v?.id || !Array.isArray(v.frames) || v.frames.length === 0) {
          results.push({ id: v?.id, status: "skipped", reason: "no frames" });
          continue;
        }
        try {
          const meta = await generateTitleFromFrames(v.frames, v.filename);
          if (!meta) {
            results.push({ id: v.id, status: "skipped", reason: "no AI output" });
            continue;
          }
          // If confidence is low, mark category Other so user can review.
          const safeCategory = meta.confidence >= min_confidence ? meta.category : "Other";
          const safeSubcategory = meta.confidence >= min_confidence ? meta.subcategory : "";

          if (!dry_run) {
            const { error: upErr } = await supabase
              .from("uploaded_videos")
              .update({
                title: meta.title,
                category: safeCategory,
                subcategory: safeSubcategory,
                description: meta.description,
              })
              .eq("id", v.id);
            if (upErr) throw upErr;
          }
          results.push({
            id: v.id,
            status: "updated",
            title: meta.title,
            category: safeCategory,
            subcategory: safeSubcategory,
            confidence: meta.confidence,
            frames_used: v.frames.length,
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          results.push({ id: v.id, status: "error", error: msg });
          if (msg.includes("429") || msg.includes("402")) break;
        }
        await new Promise((r) => setTimeout(r, 200));
      }

      return new Response(
        JSON.stringify({
          mode: "smart",
          processed: results.length,
          updated: results.filter((r) => r.status === "updated").length,
          errors: results.filter((r) => r.status === "error").length,
          results,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ----- LEGACY MODE: single thumbnail fallback -----
    const limit = Math.min(Math.max(1, Number(batch_size)), 100);
    const { data: rows, error } = await supabase
      .from("uploaded_videos")
      .select("id, title, cloud_url, video_url, thumbnail_url")
      .eq("is_cloud_stored", true)
      .or(
        [
          "title.ilike.%.480p",
          "title.ilike.%.360p",
          "title.ilike.%.720p",
          "title.ilike.%.1080p",
          "title.ilike.%.mob",
          "title.ilike.%.mp4",
          "title.ilike.%.webm",
          "title.ilike.%.mov",
          "title.ilike.upload-%",
        ].join(","),
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    for (const row of (rows as VideoRow[]) || []) {
      if (Date.now() - startTime > MAX_RUNTIME_MS) {
        results.push({ id: row.id, status: "skipped", reason: "batch timeout" });
        break;
      }
      const imgSrc = isSupportedImageUrl(row.thumbnail_url) ? row.thumbnail_url : null;
      if (!imgSrc) {
        results.push({
          id: row.id,
          status: "skipped",
          reason: row.thumbnail_url ? "thumbnail is not a supported image" : "no thumbnail",
        });
        continue;
      }
      try {
        const meta = await generateTitleFromFrames([imgSrc], row.title);
        if (!meta) {
          results.push({ id: row.id, status: "skipped", reason: "no AI output" });
          continue;
        }
        const safeCategory = meta.confidence >= min_confidence ? meta.category : "Other";
        const safeSubcategory = meta.confidence >= min_confidence ? meta.subcategory : "";
        if (!dry_run) {
          const { error: upErr } = await supabase
            .from("uploaded_videos")
            .update({
              title: meta.title,
              category: safeCategory,
              subcategory: safeSubcategory,
              description: meta.description,
            })
            .eq("id", row.id);
          if (upErr) throw upErr;
        }
        results.push({
          id: row.id,
          status: "updated",
          old_title: row.title,
          title: meta.title,
          category: safeCategory,
          subcategory: safeSubcategory,
          confidence: meta.confidence,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        results.push({ id: row.id, status: "error", error: msg });
        if (msg.includes("429") || msg.includes("402")) break;
      }
      await new Promise((r) => setTimeout(r, 300));
    }

    return new Response(
      JSON.stringify({
        mode: "legacy",
        processed: results.length,
        updated: results.filter((r) => r.status === "updated").length,
        errors: results.filter((r) => r.status === "error").length,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("ai-auto-title error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
