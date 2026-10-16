import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const Body = z.object({
  name: z.string().trim().min(1).max(100),
  company: z.string().trim().min(1).max(150),
  email: z.string().trim().email().max(255),
  role: z.string().trim().max(100).optional().default(""),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await admin.from("rate_card_requests").select("id", { count: "exact", head: true })
      .eq("email", parsed.data.email).gte("created_at", since);
    if ((count ?? 0) >= 3) return json({ error: "Too many requests" }, 429);
    const { data, error } = await admin.from("rate_card_requests")
      .insert({ ...parsed.data, role: parsed.data.role || null }).select("id").single();
    if (error) throw error;
    return json({ ok: true, id: data.id });
  } catch (e) {
    console.error(e);
    return json({ error: "Could not save request" }, 500);
  }
});
