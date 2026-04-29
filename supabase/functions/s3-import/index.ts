import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const GATEWAY = 'https://connector-gateway.lovable.dev';
const VIDEO_EXT = /\.(mp4|mov|m4v|webm|mkv|avi)$/i;

function parseListXml(xml: string) {
  const items: { key: string; size: number; lastModified: string }[] = [];
  const regex = /<Contents>([\s\S]*?)<\/Contents>/g;
  let m;
  while ((m = regex.exec(xml)) !== null) {
    const block = m[1];
    const key = block.match(/<Key>([^<]+)<\/Key>/)?.[1] ?? '';
    const size = Number(block.match(/<Size>([^<]+)<\/Size>/)?.[1] ?? '0');
    const lastModified = block.match(/<LastModified>([^<]+)<\/LastModified>/)?.[1] ?? '';
    if (key) items.push({ key, size, lastModified });
  }
  const isTruncated = /<IsTruncated>true<\/IsTruncated>/.test(xml);
  const nextToken = xml.match(/<NextContinuationToken>([^<]+)<\/NextContinuationToken>/)?.[1];
  return { items, isTruncated, nextToken };
}

function titleFromKey(key: string) {
  const base = key.split('/').pop() ?? key;
  return base.replace(VIDEO_EXT, '').replace(/[_\-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function categoryFromKey(key: string) {
  // First folder segment becomes category; second segment becomes subcategory
  const parts = key.split('/');
  if (parts.length < 2) return { category: 'Uncategorized', subcategory: null as string | null };
  const category = parts[0].replace(/[_\-]+/g, ' ').trim();
  const subcategory = parts.length >= 3 ? parts[1].replace(/[_\-]+/g, ' ').trim() : null;
  return { category, subcategory };
}

async function s3List(prefix: string, token?: string) {
  const LOVABLE = Deno.env.get('LOVABLE_API_KEY')!;
  const S3KEY = Deno.env.get('AWS_S3_API_KEY')!;
  const params = new URLSearchParams({ 'list-type': '2', 'max-keys': '1000' });
  if (prefix) params.set('prefix', prefix);
  if (token) params.set('continuation-token', token);
  const r = await fetch(`${GATEWAY}/aws_s3/?${params}`, {
    headers: { Authorization: `Bearer ${LOVABLE}`, 'X-Connection-Api-Key': S3KEY },
  });
  if (!r.ok) throw new Error(`S3 list failed [${r.status}]: ${await r.text()}`);
  return parseListXml(await r.text());
}

async function s3SignedUrl(key: string) {
  const LOVABLE = Deno.env.get('LOVABLE_API_KEY')!;
  const S3KEY = Deno.env.get('AWS_S3_API_KEY')!;
  const r = await fetch(`${GATEWAY}/api/v1/sign_storage_url?provider=aws_s3&mode=read`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LOVABLE}`,
      'X-Connection-Api-Key': S3KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ object_path: key }),
  });
  if (!r.ok) throw new Error(`Sign failed [${r.status}]: ${await r.text()}`);
  const j = await r.json();
  return j.url as string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } },
    );

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const { data: roleRow } = await supabase.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle();
    if (!roleRow) return new Response(JSON.stringify({ error: 'Admin only' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    if (action === 'list') {
      const { items, isTruncated, nextToken } = await s3List(body.prefix ?? '', body.continuation_token);
      // Filter: only videos, skip .mob.mp4 (30s preview clips)
      let videos = items.filter((i) => VIDEO_EXT.test(i.key) && !/\.mob\.(mp4|mov|m4v|webm)$/i.test(i.key));

      // Deduplicate variants: keep only the highest quality per base name
      // Quality rank: 1080 > 720 > 480 > 360 > (no suffix / other)
      const qualityRank = (key: string): number => {
        if (/\.1080p?\.(mp4|mov|m4v|webm)$/i.test(key)) return 5;
        if (/\.720p?\.(mp4|mov|m4v|webm)$/i.test(key)) return 4;
        if (/\.480p?\.(mp4|mov|m4v|webm)$/i.test(key)) return 3;
        if (/\.360p?\.(mp4|mov|m4v|webm)$/i.test(key)) return 2;
        return 1;
      };
      const baseKey = (key: string): string =>
        key.replace(/\.(1080p?|720p?|480p?|360p?|240p?)\.(mp4|mov|m4v|webm)$/i, '.$2');

      const bestByBase = new Map<string, typeof videos[number]>();
      for (const v of videos) {
        const base = baseKey(v.key);
        const existing = bestByBase.get(base);
        if (!existing || qualityRank(v.key) > qualityRank(existing.key)) {
          bestByBase.set(base, v);
        }
      }
      videos = Array.from(bestByBase.values());

      return new Response(JSON.stringify({ items: videos, isTruncated, nextToken }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'import') {
      const keys: string[] = body.keys ?? [];
      if (!Array.isArray(keys) || keys.length === 0) {
        return new Response(JSON.stringify({ error: 'keys required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Pre-fetch existing rows to avoid duplicates by local_id
      const localIds = keys.map((k) => `s3:${k}`);
      const { data: existing } = await supabase.from('uploaded_videos').select('local_id').in('local_id', localIds);
      const existingSet = new Set((existing ?? []).map((r: any) => r.local_id));

      const results: { key: string; status: string; error?: string }[] = [];
      for (const key of keys) {
        const localId = `s3:${key}`;
        if (existingSet.has(localId)) { results.push({ key, status: 'skipped' }); continue; }
        try {
          const url = await s3SignedUrl(key);
          // Strip query so we store the canonical S3 object URL; the player will re-sign on demand if needed.
          // For now we store the signed URL — short-lived. Better: store the canonical URL.
          const canonical = url.split('?')[0];
          const { category, subcategory } = categoryFromKey(key);
          const title = titleFromKey(key);
          const { error } = await supabase.from('uploaded_videos').insert({
            user_id: user.id,
            title,
            category,
            subcategory,
            video_url: canonical,
            cloud_url: canonical,
            is_cloud_stored: true,
            file_name: key.split('/').pop(),
            local_id: localId,
          });
          if (error) throw error;
          results.push({ key, status: 'imported' });
        } catch (e: any) {
          results.push({ key, status: 'error', error: e?.message ?? String(e) });
        }
      }
      return new Response(JSON.stringify({ results }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'sign') {
      const url = await s3SignedUrl(body.key);
      return new Response(JSON.stringify({ url }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'unknown action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    console.error('s3-import error', e);
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
