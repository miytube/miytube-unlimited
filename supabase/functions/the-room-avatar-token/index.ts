import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// Mints a short-lived HeyGen streaming token so the browser can open a
// WebRTC avatar session without ever seeing the API key.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // Live avatar is Premium-only: verify the signed-in user's subscription.
    const env = new URL(req.url).searchParams.get("env") === "live" ? "live" : "sandbox";
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    const { data: { user } } = await sb.auth.getUser(jwt);
    if (!user) return json({ error: "premium_required" }, 403);
    const { data: isAdmin } = await sb.rpc("has_role", { _user_id: user.id, _role: "admin" });
    const { data: active } = await sb.rpc("has_active_subscription", { _user_id: user.id, _env: env });
    if (!active && !isAdmin) return json({ error: "premium_required" }, 403);

    const apiKey = Deno.env.get("HEYGEN_API_KEY");
    if (!apiKey) {
      // Not configured yet — the page falls back to text-only mode.
      return json({ error: "avatar_not_configured" }, 503);
    }

    const res = await fetch("https://api.heygen.com/v1/streaming.create_token", {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("heygen token error", res.status, detail);
      if (res.status === 401 || res.status === 403) {
        return json({ error: "avatar_key_invalid" }, 502);
      }
      return json({ error: "avatar_unavailable" }, 502);
    }

    const data = await res.json();
    const token = data?.data?.token;
    if (typeof token !== "string" || !token) {
      console.error("heygen token missing in response", JSON.stringify(data).slice(0, 500));
      return json({ error: "avatar_unavailable" }, 502);
    }

    return json({ token });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error ?? "");
    console.error("the-room-avatar-token error", message);
    return json({ error: "avatar_unavailable" }, 500);
  }
});
