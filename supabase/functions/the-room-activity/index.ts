import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

// Public, aggregate-only activity for The Room: visitor counts, no personal data.
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=60" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const since7d = new Date(Date.now() - 7 * 864e5).toISOString();
  const since5m = new Date(Date.now() - 5 * 60e3).toISOString();

  const [week, live] = await Promise.all([
    supabase.from("page_views").select("session_id").eq("page_path", "/the-room").gte("created_at", since7d).limit(20000),
    supabase.from("active_sessions").select("session_id", { count: "exact", head: true })
      .eq("current_page", "/the-room").gte("last_active_at", since5m),
  ]);
  if (week.error) return json({ error: "unavailable" }, 500);

  const visitors = new Set((week.data ?? []).map((r) => r.session_id)).size;
  return json({ visitorsThisWeek: visitors, visitsThisWeek: week.data?.length ?? 0, inRoomNow: live.count ?? 0 });
});
