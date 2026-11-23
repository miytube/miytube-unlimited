import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { generateImage, GatewayError } from "npm:@lovable.dev/ai-gateway";
import { z } from "npm:zod@3";
import { PORTRAIT_MODEL, PORTRAIT_PRICE_COINS } from "../_shared/avatarPortrait.ts";

const CONNECTOR_URL = "https://connector-gateway.lovable.dev";
const S3_PUBLIC_BASE = "https://miytube.s3.us-east-1.amazonaws.com/";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const Body = z.object({ presentation: z.enum(["man", "woman", "neutral"]).default("neutral") });

const SKIN: Record<string, string> = {
  porcelain: "very fair porcelain", light: "light", tan: "warm tan", bronze: "bronze olive",
  brown: "medium-dark brown", deep: "deep dark brown",
};
const HAIR: Record<string, string> = {
  bald: "a clean-shaven bald head", buzz: "a short buzz cut", short: "short neatly styled hair",
  hightop: "a high-top fade", afro: "a full rounded afro", bun: "hair pulled back in a bun", long: "long hair past the shoulders",
};
const HAIR_COLOR: Record<string, string> = {
  black: "black", brown: "dark brown", auburn: "auburn", blonde: "blonde", silver: "silver-gray", electric: "dyed electric blue",
};
const EXPRESSION: Record<string, string> = {
  smile: "a relaxed, confident smile", grin: "a big genuine grin showing teeth",
  focused: "an intense, focused game-day expression", chill: "a calm, cool half-smile",
};
const SHIRT: Record<string, string> = {
  graphite: "charcoal", white: "white", royal: "royal blue", crimson: "crimson", forest: "forest green", gold: "gold",
};
const BACKDROP: Record<string, string> = {
  court: "a softly blurred indoor hardwood basketball court", night: "a blurred stadium at night under bright lights",
  turf: "a blurred green turf field", ice: "a blurred ice hockey rink", sunset: "a warm blurred sunset sky",
};

interface Item { name: string; slot: string; description: string | null; metadata: Record<string, string> }

function describeItem(item: Item): string {
  const m = item.metadata ?? {};
  const colors = [m.primary && `main color ${m.primary}`, m.trim && `trim ${m.trim}`].filter(Boolean).join(", ");
  const print = [m.label, m.number && `#${m.number}`].filter(Boolean).join(" ");
  const style = m.style ?? item.slot;
  return `${item.name} (${style}${colors ? `, ${colors}` : ""}${print ? `, printed "${print}"` : ""})`;
}

function buildPrompt(config: Record<string, string>, items: Item[], presentation: string): string {
  const who = presentation === "man" ? "an athletic adult man" : presentation === "woman" ? "an athletic adult woman" : "an athletic adult";
  const top = items.find((i) => i.slot === "top");
  const backdropItem = items.find((i) => i.slot === "background");
  const others = items.filter((i) => i !== top && i !== backdropItem);
  const outfit = top ? `wearing ${describeItem(top)}` : `wearing a plain ${SHIRT[config.shirtColor] ?? "charcoal"} athletic t-shirt`;
  const extras = others.length ? ` Also wearing: ${others.map(describeItem).join("; ")}.` : "";
  const scene = backdropItem ? describeItem(backdropItem) : BACKDROP[config.backdrop] ?? BACKDROP.night;
  return [
    `Photorealistic head-and-shoulders sports portrait of ${who} with ${SKIN[config.skin] ?? "warm tan"} skin,`,
    `${HAIR[config.hair] ?? HAIR.short}${config.hair === "bald" ? "" : ` in ${HAIR_COLOR[config.hairColor] ?? "black"}`},`,
    `${config.eyes ?? "brown"} eyes and ${EXPRESSION[config.expression] ?? EXPRESSION.smile}, ${outfit}.${extras}`,
    `Background: ${scene}. Lean, fit, natural proportions, real skin texture and pores, natural hands if visible.`,
    `Shot like a professional media-day photo: 85mm lens, shallow depth of field, soft key light, sharp focus on the eyes.`,
    `Fictional person, not a real celebrity. No brand logos. No text other than what is printed on the clothing. No watermark.`,
  ].join(" ");
}

async function uploadToS3(bytes: Uint8Array, key: string): Promise<string> {
  const sign = await fetch(`${CONNECTOR_URL}/api/v1/sign_storage_url?provider=aws_s3&mode=write`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      "X-Connection-Api-Key": Deno.env.get("AWS_S3_API_KEY") ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ object_path: key }),
  });
  if (!sign.ok) throw new Error(`Storage sign failed [${sign.status}]`);
  const signed = await sign.json();
  const put = await fetch(signed.url, { method: signed.method ?? "PUT", headers: { "Content-Type": "image/webp" }, body: bytes });
  if (!put.ok) throw new Error(`Storage upload failed [${put.status}]`);
  return `${S3_PUBLIC_BASE}${key}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Sign in required" }, 401);
  const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData } = await userClient.auth.getUser();
  const user = userData?.user;
  if (!user) return json({ error: "Sign in required" }, 401);

  let raw: unknown = {};
  try { raw = await req.json(); } catch { /* empty body */ }
  const parsed = Body.safeParse(raw ?? {});
  if (!parsed.success) return json({ error: "Invalid request" }, 400);

  const admin = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: avatar } = await admin.from("user_avatars").select("config, equipped").eq("user_id", user.id).maybeSingle();
  if (!avatar) return json({ error: "Save your avatar in Avatar Studio first." }, 400);

  const equipped = Object.values((avatar.equipped ?? {}) as Record<string, string>).filter(Boolean);
  let items: Item[] = [];
  if (equipped.length) {
    const { data } = await admin.from("avatar_items").select("name, slot, description, metadata").in("sku", equipped);
    items = (data ?? []) as Item[];
  }

  const { data: charge, error: chargeErr } = await admin.rpc("charge_portrait", { _user_id: user.id, _price: PORTRAIT_PRICE_COINS });
  if (chargeErr) {
    const msg = chargeErr.message.includes("Not enough coins") ? "Not enough coins"
      : chargeErr.message.includes("Daily portrait limit") ? "You've made 5 portraits today. Try again tomorrow."
      : "Could not start your portrait";
    return json({ error: msg }, 400);
  }
  const txId = (charge as { transaction_id: string }).transaction_id;

  try {
    const prompt = buildPrompt((avatar.config ?? {}) as Record<string, string>, items, parsed.data.presentation);
    const result = await generateImage({
      model: PORTRAIT_MODEL,
      prompt,
      size: "1024x1024",
      quality: "medium",
      output_format: "webp",
      n: 1,
    });
    const b64 = (result as { data?: { b64_json?: string }[] }).data?.[0]?.b64_json;
    if (!b64) throw new Error("The AI returned no image");
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const url = await uploadToS3(bytes, `avatar-portraits/${user.id}-${Date.now()}.webp`);
    const { error: saveErr } = await admin.from("avatar_portraits").upsert(
      { user_id: user.id, image_url: url, look: { config: avatar.config, equipped: avatar.equipped, presentation: parsed.data.presentation }, created_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (saveErr) throw new Error(saveErr.message);
    const { data: wallet } = await admin.from("user_coin_wallets").select("balance").eq("user_id", user.id).maybeSingle();
    return json({ portrait_url: url, balance: wallet?.balance ?? null });
  } catch (err) {
    console.error("portrait failed", err instanceof GatewayError ? { code: err.code, status: err.httpStatus, ids: err.ids } : err);
    await admin.rpc("refund_portrait", { _transaction_id: txId });
    return json({ error: "We couldn't make your portrait this time. Your coins were refunded." }, 502);
  }
});
