import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { convertToModelMessages, streamText, type UIMessage } from "npm:ai";
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
      return json({ error: "Sign in to chat with Cha." }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) return json({ error: "Sign in to chat with Cha." }, 401);

    const body = await req.json().catch(() => null);
    const messages: UIMessage[] = Array.isArray(body?.messages) ? body.messages : [];
    const site = typeof body?.site === "string" ? body.site : "miytube";
    if (!messages.length) return json({ error: "No messages provided." }, 400);

    const admin = createClient(supabaseUrl, serviceKey);

    // One conversation per member per site.
    let conversationId: string | null = null;
    const { data: existing } = await admin
      .from("cha_conversations")
      .select("id")
      .eq("user_id", user.id)
      .eq("site", site)
      .maybeSingle();

    if (existing?.id) {
      conversationId = existing.id;
    } else {
      const { data: created, error: createError } = await admin
        .from("cha_conversations")
        .insert({ user_id: user.id, site })
        .select("id")
        .single();
      if (createError) {
        console.error("cha_conversations insert failed", createError);
        return json({ error: "Could not start the conversation." }, 500);
      }
      conversationId = created.id;
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      const { error: saveUserError } = await admin.from("cha_messages").insert({
        conversation_id: conversationId,
        user_id: user.id,
        role: "user",
        parts: lastMessage.parts ?? [],
        message_key: lastMessage.id ?? null,
      });
      if (saveUserError) console.error("save user message failed", saveUserError);
    }

    const gateway = createLovableAiGatewayProvider(apiKey);

    const result = streamText({
      model: gateway(CHA_MODEL),
      system: CHA_PERSONA,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      headers: corsHeaders,
      onFinish: async ({ responseMessage }) => {
        const { error } = await admin.from("cha_messages").insert({
          conversation_id: conversationId,
          user_id: user.id,
          role: "assistant",
          parts: responseMessage?.parts ?? [],
          message_key: responseMessage?.id ?? null,
        });
        if (error) console.error("save assistant message failed", error);
        await admin
          .from("cha_conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", conversationId);
      },
    });
  } catch (error) {
    console.error("cha-chat error", error);
    return json({ error: error instanceof Error ? error.message : "Unexpected error" }, 500);
  }
});
