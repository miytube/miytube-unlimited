import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
}

const DOMAIN = 'https://miytube.com'

function escapeXml(text: string): string {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function parseDurationToSeconds(duration: string | null): number | null {
  if (!duration) return null
  const parts = duration.split(':').map(Number)
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Generating videos sitemap...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: videos, error } = await supabase
      .from('uploaded_videos')
      .select('id, title, description, thumbnail_url, video_url, cloud_url, duration, category, tags, created_at, updated_at, views')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching videos:', error)
    }

    const today = new Date().toISOString().split('T')[0]

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`

    if (videos && videos.length > 0) {
      for (const video of videos) {
        const lastmod = video.updated_at 
          ? new Date(video.updated_at).toISOString().split('T')[0] 
          : today
        
        const publicationDate = video.created_at
          ? new Date(video.created_at).toISOString()
          : new Date().toISOString()

        const thumbnailUrl = video.thumbnail_url || `${DOMAIN}/placeholder.svg`
        const contentUrl = video.cloud_url || video.video_url || ''
        const durationSeconds = parseDurationToSeconds(video.duration)
        const description = video.description || video.title || 'Video on MiyTube'
        const tags = video.tags || []
        const viewCount = video.views || 0
        
        xml += `  <url>
    <loc>${DOMAIN}/watch/${video.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    <video:video>
      <video:thumbnail_loc>${escapeXml(thumbnailUrl)}</video:thumbnail_loc>
      <video:title>${escapeXml(video.title)}</video:title>
      <video:description>${escapeXml(description.substring(0, 2048))}</video:description>
      <video:player_loc>${DOMAIN}/watch/${video.id}</video:player_loc>
${contentUrl ? `      <video:content_loc>${escapeXml(contentUrl)}</video:content_loc>\n` : ''}${durationSeconds ? `      <video:duration>${durationSeconds}</video:duration>\n` : ''}      <video:publication_date>${publicationDate}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
${viewCount > 0 ? `      <video:view_count>${viewCount}</video:view_count>\n` : ''}${video.category ? `      <video:category>${escapeXml(video.category)}</video:category>\n` : ''}${tags.length > 0 ? tags.slice(0, 32).map((tag: string) => `      <video:tag>${escapeXml(tag)}</video:tag>`).join('\n') + '\n' : ''}    </video:video>
  </url>
`
      }
    }

    xml += `</urlset>`

    console.log(`Videos sitemap generated with ${videos?.length || 0} videos`)

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
