import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generateText } from "npm:ai";
import { CHA_MODEL, CHA_PERSONA, createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "AI is not configured." }, 500);

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return json({ error: "Sign in to talk in a room." }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData?.user) return json({ error: "Sign in to talk in a room." }, 401);

    const body = await req.json().catch(() => null);
    const roomId = typeof body?.roomId === "string" ? body.roomId : "";
    if (!roomId) return json({ error: "roomId is required." }, 400);

    const admin = createClient(supabaseUrl, serviceKey);

    const { data: room, error: roomError } = await admin
      .from("cha_rooms")
      .select("id, name, topic, description")
      .eq("id", roomId)
      .eq("is_active", true)
      .maybeSingle();
    if (roomError || !room) return json({ error: "Room not found." }, 404);

    const { data: recent, error: recentError } = await admin
      .from("cha_room_messages")
      .select("author_name, role, content, created_at")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })
      .limit(25);
    if (recentError) {
      console.error("load room messages failed", recentError);
      return json({ error: "Could not read the room." }, 500);
    }

    const history = (recent ?? []).slice().reverse();
    if (!history.length) return json({ skipped: true });
    if (history[history.length - 1].role === "assistant") return json({ skipped: true });

    const transcript = history
      .map((m) => `${m.role === "assistant" ? "Cha" : m.author_name}: ${m.content}`)
      .join("\n");

    const gateway = createLovableAiGatewayProvider(apiKey);

    const result = await generateText({
      model: gateway(CHA_MODEL),
      system: `${CHA_PERSONA}

You are in the MiyTube group room "${room.name}" (${room.topic ?? room.description ?? "open chat"}).
Several people are talking at once. Reply once, to the room, in 1-3 sentences.
Address people by name when it helps. Keep the conversation moving — ask something back or add a take.
Do not prefix your reply with your name.`,
      prompt: `Here is the recent room chat:\n\n${transcript}\n\nGive Cha's next reply to the room.`,
    });

    const reply = (result.text ?? "").trim().slice(0, 1500);
    if (!reply) return json({ skipped: true });

    const { error: insertError } = await admin.from("cha_room_messages").insert({
      room_id: roomId,
      user_id: null,
      author_name: "Cha",
      role: "assistant",
      content: reply,
    });
    if (insertError) {
      console.error("insert assistant room message failed", insertError);
      return json({ error: "Could not post Cha's reply." }, 500);
    }

    return json({ reply });
  } catch (error) {
    console.error("cha-room-reply error", error);
    return json({ error: error instanceof Error ? error.message : "Unexpected error" }, 500);
  }
});
