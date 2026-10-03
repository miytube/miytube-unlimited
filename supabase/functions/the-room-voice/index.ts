import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Maya's premium voice: ElevenLabs text-to-speech, streamed back as MP3.
// Falls back to the browser's built-in voice on the client when not configured.

const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Sarah — warm, conversational host
const MODEL_ID = "eleven_turbo_v2_5";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  let text = "";
  try {
    const body = await req.json();
    text = typeof body?.text === "string" ? body.text.trim() : "";
  } catch {
    return json({ error: "invalid_body" }, 400);
  }
  if (!text) return json({ error: "empty_text" }, 400);
  if (text.length > 5000) text = text.slice(0, 5000);

  const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
  if (!apiKey) {
    return json({ error: "voice_not_configured" }, 503);
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.75,
            style: 0.4,
            use_speaker_boost: true,
            speed: 1.0,
          },
        }),
      }
    );

    if (!response.ok) {
      const details = await response.text();
      console.error(`ElevenLabs TTS failed [${response.status}]: ${details}`);
      if (response.status === 401 || response.status === 403) {
        return json({ error: "voice_key_invalid", status: response.status, details }, 502);
      }
      return json({ error: "voice_provider_failed", status: response.status, details }, 502);
    }

    const audioBuffer = await response.arrayBuffer();
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("ElevenLabs TTS error:", err);
    return json({ error: "voice_provider_failed" }, 502);
  }
});
