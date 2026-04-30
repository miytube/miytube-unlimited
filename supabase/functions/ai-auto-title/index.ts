// Auto-title videos using Lovable AI (Gemini) with vision on a video frame.
// Processes a batch of videos whose titles look like raw filenames/hashes.
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

function looksLikeFilename(title: string): boolean {
  if (!title) return true;
  // Hex hash filenames or quality suffixes
  if (/^[0-9a-f]{16,}/i.test(title)) return true;
  if (/\.(360p|480p|720p|1080p|mp4|mov|avi|mkv|webm)(\.|$)/i.test(title)) return true;
  if (/^upload[-_]?\d/i.test(title)) return true;
  return false;
}

async function fetchAsBase64(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, { method: "GET" });
    if (!r.ok) return null;
    const buf = new Uint8Array(await r.arrayBuffer());
    // Limit to first 2MB to keep prompts fast/cheap
    const slice = buf.slice(0, 2 * 1024 * 1024);
    let bin = "";
    for (let i = 0; i < slice.length; i++) bin += String.fromCharCode(slice[i]);
    return btoa(bin);
  } catch {
    return null;
  }
}

async function generateTitleFromImage(
  imageUrl: string,
): Promise<{ title: string; category: string; subcategory: string; description: string } | null> {
  const body = {
    model: "google/gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content:
          "You are a video metadata expert. Given a single thumbnail/frame from a video, generate a concise, descriptive, SEO-friendly title (max 70 chars), pick the best category from a fixed list, suggest a 1-3 word subcategory, and write a 1-sentence description. Be specific about what is shown — sports league, animal species, vehicle type, location, etc.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: `Allowed categories: ${ALLOWED_CATEGORIES.join(", ")}. Generate metadata for this video frame.` },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "set_video_metadata",
          description: "Save the generated title, category, subcategory and description.",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string", description: "Descriptive SEO title (max 70 chars)" },
              category: { type: "string", enum: ALLOWED_CATEGORIES },
              subcategory: { type: "string", description: "1-3 word subcategory" },
              description: { type: "string", description: "One sentence summary" },
            },
            required: ["title", "category", "subcategory", "description"],
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
    };
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { batch_size = 10, dry_run = false } = await req.json().catch(() => ({}));
    const limit = Math.min(Math.max(1, Number(batch_size)), 25);

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Pick rows with raw filename-style titles. Use regex on Postgres side.
    const { data: rows, error } = await supabase
      .from("uploaded_videos")
      .select("id, title, cloud_url, video_url, thumbnail_url")
      .eq("is_cloud_stored", true)
      .or("title.ilike.%.480p,title.ilike.%.360p,title.ilike.%.720p,title.ilike.%.1080p")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const results: any[] = [];
    const startTime = Date.now();
    const MAX_RUNTIME_MS = 110_000; // stop before 150s edge timeout

    for (const row of (rows as VideoRow[]) || []) {
      // Stop if we're approaching the timeout — return what we have so far
      if (Date.now() - startTime > MAX_RUNTIME_MS) {
        results.push({ id: row.id, status: "skipped", reason: "batch timeout - run another batch" });
        break;
      }

      // Only use image URLs (thumbnails). Skip if only a video file is available —
      // downloading multi-MB videos to send to vision API causes 504 timeouts.
      const imgSrc = row.thumbnail_url;
      if (!imgSrc) {
        results.push({ id: row.id, status: "skipped", reason: "no thumbnail" });
        continue;
      }
      try {
        const meta = await generateTitleFromImage(imgSrc);
        if (!meta) {
          results.push({ id: row.id, status: "skipped", reason: "no AI output" });
          continue;
        }
        if (!dry_run) {
          const { error: upErr } = await supabase
            .from("uploaded_videos")
            .update({
              title: meta.title,
              category: meta.category,
              subcategory: meta.subcategory,
              description: meta.description,
            })
            .eq("id", row.id);
          if (upErr) throw upErr;
        }
        results.push({ id: row.id, status: "updated", old_title: row.title, ...meta });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        results.push({ id: row.id, status: "error", error: msg });
        if (msg.includes("429")) break; // back off
        if (msg.includes("402")) break; // out of credits
      }
      // Light delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 300));
    }

    return new Response(
      JSON.stringify({
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
