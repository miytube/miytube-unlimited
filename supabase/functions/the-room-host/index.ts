import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const requestSchema = z.object({
  topic: z.string().trim().min(1).max(120),
  actionType: z.enum(["DEEPEN", "CHALLENGE", "SYNTHESIZE"]).optional(),
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) })).max(100).default([]),
});

const shortText = z.string().trim().min(1).max(500);
const canvasSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("METRICS_GRID"), title: shortText.max(80), payload: z.object({ metrics: z.array(z.object({ label: shortText, value: shortText, variance: z.string().max(100).optional() })).min(1).max(9) }) }),
  z.object({ type: z.literal("COMPARISON_TABLE"), title: shortText.max(80), payload: z.object({ headers: z.array(shortText).min(2).max(5), rows: z.array(z.array(z.string().max(500))).min(1).max(12) }) }),
  z.object({ type: z.literal("CODE_SANDBOX"), title: shortText.max(80), payload: z.object({ language: shortText.max(30), snippets: z.string().min(1).max(5000) }) }),
]);
const answerSchema = z.object({ text: z.string().trim().min(1).max(12000), canvasBlock: canvasSchema.nullable().optional() });

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const persona = (topic: string) => `You are Maya, the AI host of "The Room" on MiyTube — an interactive interview host. There is no real camera feed or recording; never claim a video is streaming, saved, or rendering.

The room's topic is: "${topic}".

How you host:
- You are on camera, live. Talk like a real host: warm, curious, quick, a little bit of showmanship.
- Be journalistic and attentive for serious answers; be lightly witty when the guest is playful. Respond to their actual words rather than repeating generic praise or scripted reactions.
- Keep answers short — 1 to 4 sentences. No bullet lists, no essays, no corporate filler.
- Always keep the conversation moving: react to what they said, then ask them one sharp follow-up question about the topic.
- Stay on the room's topic unless the guest clearly changes it.
- Never claim to be human. If asked, you're The Room's AI host on MiyTube.

Always respond as a JSON object with "text" (your conversational reply) and "canvasBlock" (null unless a visual breakdown truly helps). If the user's topic or request calls for a deep analytical breakdown, a structural comparison, or heavy metrics tracking, include exactly one optional canvasBlock:
{"type":"METRICS_GRID","title":"UPPERCASE TITLE","payload":{"metrics":[{"label":"...","value":"...","variance":"..."}]}}
or {"type":"COMPARISON_TABLE","title":"UPPERCASE TITLE","payload":{"headers":["...","..."],"rows":[["...","..."]]}}
or {"type":"CODE_SANDBOX","title":"UPPERCASE TITLE","payload":{"language":"...","snippets":"..."}}.
Use METRICS_GRID for grounded numerical measures, COMPARISON_TABLE for side-by-side evaluation, CODE_SANDBOX for code examples only. Never invent measurements or imply live data access. Label estimates explicitly. Code is display-only and never executed. Keep canvasBlock null for normal conversation. Put your spoken reply in text, not inside the canvas.

Boundaries: no hate speech, no harassment, no medical/legal/financial advice presented as fact, no explicit sexual content. If someone sounds in crisis, drop the showmanship and gently point them to real help.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "The host is not configured yet." }, 500);

    const parsed = requestSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return json({ error: "Name a topic first, or shorten your message." }, 400);
    const { topic, messages: history, actionType } = parsed.data;

    const messages = [
      { role: "system", content: persona(topic) },
      ...history.slice(-16),
    ];

    const intense = /\b(sport|sports|boxing|mma|ufc|fight|nfl|nba|wnba|mlb|football|basketball|baseball|soccer|racing|wrestling|hockey|tennis|golf)\b/i.test(topic);
    const appliedTheme = intense ? "INTENSE" : "DEFAULT";

    const modifiers: Record<string, string> = {
      DEEPEN: "Cut past surface-level points. Drill into the technical, advanced, underlying mechanics of the concept being discussed. Keep it tight.",
      CHALLENGE: "Play devil's advocate. Present a strong, compelling counter-argument or structural critique to the position currently being discussed.",
      SYNTHESIZE: "Synthesize everything discussed so far into a razor-sharp breakdown: 3-5 short bullet points, no fluff.",
    };
    if (actionType && modifiers[actionType]) {
      messages.push({ role: "user", content: `[Modifier: ${actionType}] ${modifiers[actionType]}` });
    } else if (messages.length === 1) {
      messages.push({
        role: "user",
        content: `Cold open the show on "${topic}". No hello, no welcome — seize the topic immediately with one sharp, analytical statement, then one opening question. ${intense ? "Bring high-energy, fight-night intensity." : "Calm, precise, cinematic tone."} Two sentences max.`,
      });
    }



    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: "openai/gpt-6-astra", messages, response_format: { type: "json_object" } }),
      signal: AbortSignal.timeout(45_000),
    });

    if (res.status === 429) return json({ error: "The room is busy right now. Try again in a few seconds." }, 429);
    if (res.status === 402) return json({ error: "The host is out of AI credits right now." }, 402);

    if (!res.ok) {
      const detail = await res.text();
      console.error("the-room-host gateway error", res.status, detail);
      return json({ error: "The host hit a snag. Try that again." }, 500);
    }

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (typeof raw !== "string" || !raw.trim()) return json({ error: "The host went quiet. Try that again." }, 500);
    let answer: unknown;
    try { answer = JSON.parse(raw); } catch { answer = { text: raw, canvasBlock: null }; }
    const validated = answerSchema.safeParse(answer);
    if (!validated.success) {
      // Preserve the spoken response if only the optional visualization is malformed.
      const text = typeof answer === "object" && answer !== null && "text" in answer && typeof answer.text === "string" ? answer.text.trim() : "";
      if (!text) return json({ error: "The host went quiet. Try that again." }, 500);
      return json({ success: true, reply: text.slice(0, 12000), canvasBlock: null, appliedTheme });
    }
    const { text, canvasBlock } = validated.data;
    const safeBlock = canvasBlock?.type === "COMPARISON_TABLE" && canvasBlock.payload.rows.some((row) => row.length !== canvasBlock.payload.headers.length) ? null : canvasBlock ?? null;
    return json({ success: true, reply: text, openingStatement: text, canvasBlock: safeBlock, appliedTheme });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error ?? "");
    console.error("the-room-host error", message);
    if (/abort|timeout/i.test(message)) {
      return json({ error: "The host took too long to answer. Try again." }, 504);
    }
    return json({ error: "Unexpected error in the room." }, 500);
  }
});
