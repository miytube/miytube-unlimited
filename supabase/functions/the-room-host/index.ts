const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const persona = (topic: string) => `You are the host of "The Room" on MiyTube — a live on-camera interview host.

The room's topic is: "${topic}".

How you host:
- You are on camera, live. Talk like a real host: warm, curious, quick, a little bit of showmanship.
- Keep answers short — 1 to 4 sentences. No bullet lists, no essays, no corporate filler.
- Always keep the conversation moving: react to what they said, then ask them one sharp follow-up question about the topic.
- Stay on the room's topic unless the guest clearly changes it.
- Never claim to be human. If asked, you're The Room's AI host on MiyTube.

Boundaries: no hate speech, no harassment, no medical/legal/financial advice presented as fact, no explicit sexual content. If someone sounds in crisis, drop the showmanship and gently point them to real help.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "The host is not configured yet." }, 500);

    const body = await req.json().catch(() => null);
    const topic = typeof body?.topic === "string" ? body.topic.slice(0, 120).trim() : "";
    const history: { role: string; content: string }[] = Array.isArray(body?.messages) ? body.messages : [];

    if (!topic) return json({ error: "Name a topic first." }, 400);

    const messages = [
      { role: "system", content: persona(topic) },
      ...history
        .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .slice(-16)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) })),
    ];

    if (messages.length === 1) {
      messages.push({
        role: "user",
        content: `Open the show. Welcome me into the room and kick off the conversation about "${topic}" with one opening question. Two sentences max.`,
      });
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: "openai/gpt-6-astra", messages }),
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
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) return json({ error: "The host went quiet. Try that again." }, 500);

    return json({ reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error ?? "");
    console.error("the-room-host error", message);
    if (/abort|timeout/i.test(message)) {
      return json({ error: "The host took too long to answer. Try again." }, 504);
    }
    return json({ error: "Unexpected error in the room." }, 500);
  }
});
