import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
}

// Static routes for the sitemap
const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/videos', priority: '0.9', changefreq: 'daily' },
  { path: '/shorts', priority: '0.9', changefreq: 'daily' },
  { path: '/music', priority: '0.9', changefreq: 'daily' },
  { path: '/trending', priority: '0.9', changefreq: 'daily' },
  { path: '/sports', priority: '0.8', changefreq: 'weekly' },
  { path: '/gaming', priority: '0.8', changefreq: 'weekly' },
  { path: '/podcasts', priority: '0.8', changefreq: 'weekly' },
  { path: '/film-animation', priority: '0.8', changefreq: 'weekly' },
  { path: '/comedy', priority: '0.8', changefreq: 'weekly' },
  { path: '/educational', priority: '0.8', changefreq: 'weekly' },
  { path: '/news', priority: '0.8', changefreq: 'daily' },
  { path: '/audio', priority: '0.8', changefreq: 'weekly' },
  { path: '/meditation', priority: '0.8', changefreq: 'weekly' },
  { path: '/fitness', priority: '0.8', changefreq: 'weekly' },
  { path: '/autos-vehicles', priority: '0.7', changefreq: 'weekly' },
  { path: '/pets-animals', priority: '0.7', changefreq: 'weekly' },
  { path: '/travel-events', priority: '0.7', changefreq: 'weekly' },
  { path: '/how-to-style', priority: '0.7', changefreq: 'weekly' },
  { path: '/blog', priority: '0.7', changefreq: 'weekly' },
  { path: '/about', priority: '0.5', changefreq: 'monthly' },
  { path: '/contact', priority: '0.5', changefreq: 'monthly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/copyright', priority: '0.3', changefreq: 'yearly' },
  // Sports subcategories
  { path: '/sports/football', priority: '0.7', changefreq: 'weekly' },
  { path: '/sports/basketball', priority: '0.7', changefreq: 'weekly' },
  { path: '/sports/soccer', priority: '0.7', changefreq: 'weekly' },
  { path: '/sports/baseball', priority: '0.7', changefreq: 'weekly' },
  { path: '/sports/hockey', priority: '0.7', changefreq: 'weekly' },
  { path: '/sports/tennis', priority: '0.7', changefreq: 'weekly' },
  { path: '/sports/golf', priority: '0.7', changefreq: 'weekly' },
  { path: '/sports/boxing', priority: '0.7', changefreq: 'weekly' },
  { path: '/sports/mma', priority: '0.7', changefreq: 'weekly' },
  { path: '/sports/wrestling', priority: '0.7', changefreq: 'weekly' },
  // Music genres
  { path: '/music/pop', priority: '0.7', changefreq: 'weekly' },
  { path: '/music/rock', priority: '0.7', changefreq: 'weekly' },
  { path: '/music/hip-hop', priority: '0.7', changefreq: 'weekly' },
  { path: '/music/r-and-b', priority: '0.7', changefreq: 'weekly' },
  { path: '/music/country', priority: '0.7', changefreq: 'weekly' },
  { path: '/music/jazz', priority: '0.7', changefreq: 'weekly' },
  { path: '/music/classical', priority: '0.7', changefreq: 'weekly' },
  { path: '/music/electronic', priority: '0.7', changefreq: 'weekly' },
  // Gaming categories
  { path: '/gaming/action', priority: '0.7', changefreq: 'weekly' },
  { path: '/gaming/adventure', priority: '0.7', changefreq: 'weekly' },
  { path: '/gaming/rpg', priority: '0.7', changefreq: 'weekly' },
  { path: '/gaming/sports', priority: '0.7', changefreq: 'weekly' },
  { path: '/gaming/strategy', priority: '0.7', changefreq: 'weekly' },
  // Film categories
  { path: '/film-animation/action', priority: '0.7', changefreq: 'weekly' },
  { path: '/film-animation/comedy', priority: '0.7', changefreq: 'weekly' },
  { path: '/film-animation/drama', priority: '0.7', changefreq: 'weekly' },
  { path: '/film-animation/horror', priority: '0.7', changefreq: 'weekly' },
  { path: '/film-animation/documentary', priority: '0.7', changefreq: 'weekly' },
  // Military
  { path: '/military', priority: '0.7', changefreq: 'weekly' },
  { path: '/military/army', priority: '0.6', changefreq: 'weekly' },
  { path: '/military/navy', priority: '0.6', changefreq: 'weekly' },
  { path: '/military/airforce', priority: '0.6', changefreq: 'weekly' },
  { path: '/military/marines', priority: '0.6', changefreq: 'weekly' },
  // Hollywood
  { path: '/hollywood', priority: '0.7', changefreq: 'weekly' },
  { path: '/hollywood/news', priority: '0.7', changefreq: 'daily' },
  { path: '/hollywood/interviews', priority: '0.6', changefreq: 'weekly' },
  { path: '/hollywood/bios', priority: '0.6', changefreq: 'weekly' },
  // Other categories
  { path: '/real-estate', priority: '0.7', changefreq: 'weekly' },
  { path: '/weather', priority: '0.7', changefreq: 'daily' },
  { path: '/disasters', priority: '0.7', changefreq: 'weekly' },
  { path: '/floods', priority: '0.6', changefreq: 'weekly' },
  { path: '/mammals', priority: '0.6', changefreq: 'weekly' },
  { path: '/non-mammals', priority: '0.6', changefreq: 'weekly' },
  { path: '/plants', priority: '0.6', changefreq: 'weekly' },
  { path: '/trains', priority: '0.6', changefreq: 'weekly' },
  { path: '/boats', priority: '0.6', changefreq: 'weekly' },
  { path: '/airports', priority: '0.6', changefreq: 'weekly' },
  { path: '/shipping', priority: '0.6', changefreq: 'weekly' },
  { path: '/swimming', priority: '0.6', changefreq: 'weekly' },
  { path: '/lakes-rivers', priority: '0.6', changefreq: 'weekly' },
  { path: '/oceans', priority: '0.6', changefreq: 'weekly' },
  { path: '/speeches', priority: '0.6', changefreq: 'weekly' },
  { path: '/family', priority: '0.6', changefreq: 'weekly' },
  { path: '/relationships', priority: '0.6', changefreq: 'weekly' },
]

const DOMAIN = 'https://miytube.com'

// Escape XML special characters
function escapeXml(text: string): string {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Parse duration string (e.g., "3:45" or "1:23:45") to seconds
function parseDurationToSeconds(duration: string | null): number | null {
  if (!duration) return null
  const parts = duration.split(':').map(Number)
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  return null
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Generating dynamic video sitemap...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all uploaded videos with full details
    const { data: videos, error: videosError } = await supabase
      .from('uploaded_videos')
      .select('id, title, description, thumbnail_url, video_url, cloud_url, duration, category, tags, created_at, updated_at, views')
      .order('created_at', { ascending: false })

    if (videosError) {
      console.error('Error fetching videos:', videosError)
    }

    // Fetch all music videos with full details
    const { data: musicVideos, error: musicError } = await supabase
      .from('music_videos')
      .select('id, title, description, thumbnail_url, video_url, duration, category, tags, created_at, updated_at, views')
      .order('created_at', { ascending: false })

    if (musicError) {
      console.error('Error fetching music videos:', musicError)
    }

    const today = new Date().toISOString().split('T')[0]

    // Generate XML with video sitemap namespace
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`

    // Add static routes (without video extension)
    for (const route of staticRoutes) {
      xml += `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`
    }

    // Add dynamic video pages with video sitemap extension
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

    // Add dynamic music video pages with video sitemap extension
    if (musicVideos && musicVideos.length > 0) {
      for (const video of musicVideos) {
        const lastmod = video.updated_at 
          ? new Date(video.updated_at).toISOString().split('T')[0] 
          : today
        
        const publicationDate = video.created_at
          ? new Date(video.created_at).toISOString()
          : new Date().toISOString()

        const thumbnailUrl = video.thumbnail_url || `${DOMAIN}/placeholder.svg`
        const contentUrl = video.video_url || ''
        const durationSeconds = parseDurationToSeconds(video.duration)
        const description = video.description || video.title || 'Music video on MiyTube'
        const tags = video.tags || []
        const viewCount = video.views || 0
        
        xml += `  <url>
    <loc>${DOMAIN}/music/watch/${video.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    <video:video>
      <video:thumbnail_loc>${escapeXml(thumbnailUrl)}</video:thumbnail_loc>
      <video:title>${escapeXml(video.title)}</video:title>
      <video:description>${escapeXml(description.substring(0, 2048))}</video:description>
      <video:player_loc>${DOMAIN}/music/watch/${video.id}</video:player_loc>
${contentUrl ? `      <video:content_loc>${escapeXml(contentUrl)}</video:content_loc>\n` : ''}${durationSeconds ? `      <video:duration>${durationSeconds}</video:duration>\n` : ''}      <video:publication_date>${publicationDate}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
${viewCount > 0 ? `      <video:view_count>${viewCount}</video:view_count>\n` : ''}      <video:category>Music</video:category>
${tags.length > 0 ? tags.slice(0, 32).map((tag: string) => `      <video:tag>${escapeXml(tag)}</video:tag>`).join('\n') + '\n' : ''}    </video:video>
  </url>
`
      }
    }

    xml += `</urlset>`

    console.log(`Video sitemap generated with ${staticRoutes.length} static routes, ${videos?.length || 0} videos, ${musicVideos?.length || 0} music videos`)

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate sitemap' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
