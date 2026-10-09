const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Expose-Headers': 'x-loom-title',
};

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

async function resolveMp4(id: string): Promise<string | null> {
  for (const kind of ['transcoded-url', 'raw-url']) {
    const r = await fetch(`https://www.loom.com/api/campaigns/sessions/${id}/${kind}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      body: '{}',
    });
    if (!r.ok) continue;
    const j = await r.json().catch(() => null);
    const url: string | undefined = j?.url;
    if (url && !url.includes('.m3u8')) return url;
  }
  return null;
}

async function fetchTitle(id: string): Promise<string> {
  try {
    const r = await fetch(`https://www.loom.com/v1/oembed?url=https://www.loom.com/share/${id}`);
    if (r.ok) return ((await r.json())?.title as string) || 'Loom video';
  } catch { /* ignore */ }
  return 'Loom video';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { url } = await req.json();
    const id = String(url ?? '').match(/loom\.com\/(?:share|embed)\/([a-f0-9]{32})/i)?.[1];
    if (!id) return json({ error: 'not_loom', message: 'Paste a loom.com/share/... link.' }, 400);

    const mp4 = await resolveMp4(id);
    if (!mp4) return json({ error: 'not_downloadable', message: 'This Loom video is private or downloads are turned off by its owner.' }, 404);

    const [video, title] = await Promise.all([fetch(mp4), fetchTitle(id)]);
    if (!video.ok || !video.body) return json({ error: 'fetch_failed', message: 'Could not download the Loom video.' }, 502);

    return new Response(video.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'video/mp4',
        'x-loom-title': encodeURIComponent(title),
        ...(video.headers.get('content-length') ? { 'Content-Length': video.headers.get('content-length')! } : {}),
      },
    });
  } catch (e) {
    return json({ error: 'server_error', message: String(e) }, 500);
  }
});
