import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { videoSitemapEntry } from '../_shared/videoSitemap.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Generating videos sitemap...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseKey) throw new Error('Sitemap configuration unavailable');
    const supabase = createClient(supabaseUrl, supabaseKey)
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`

    let count = 0;
    // Fetch beyond the API's default first 1,000 rows: older legend clips still matter.
    for (let offset = 0; offset < 50000; offset += 1000) {
      const { data, error } = await supabase.from('uploaded_videos_public')
        .select('id, local_id, title, description, thumbnail_url, video_url, cloud_url, duration, category, created_at, updated_at, is_youtube_embed, youtube_video_id')
        .eq('site', 'miytube')
        .order('created_at', { ascending: false }).order('id', { ascending: true })
        .range(offset, offset + 999);
      if (error) throw error;
      const videos = data || [];
      xml += videos.map(videoSitemapEntry).join('');
      count += videos.length;
      if (videos.length < 1000) break;
    }

    xml += `</urlset>`

    console.log(`Videos sitemap generated with ${count} videos`)

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error generating videos sitemap:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate sitemap' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
