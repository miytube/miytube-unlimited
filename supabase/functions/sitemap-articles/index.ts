import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
}

const DOMAIN = 'https://www.miytube.com'

function escapeXml(text: string): string {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, title, updated_at, created_at, cover_image_url')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(5000)

    if (error) console.error('Error fetching blog posts:', error)

    const today = new Date().toISOString().split('T')[0]

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${DOMAIN}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`

    for (const post of posts || []) {
      if (!post.slug) continue
      const lastmod = (post.updated_at || post.created_at)
        ? new Date(post.updated_at || post.created_at).toISOString().split('T')[0]
        : today

      xml += `  <url>
    <loc>${DOMAIN}/blog/${escapeXml(post.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
`
      if (post.cover_image_url) {
        xml += `    <image:image>
      <image:loc>${escapeXml(post.cover_image_url)}</image:loc>
      <image:title>${escapeXml(post.title || 'MiyTube article')}</image:title>
    </image:image>
`
      }
      xml += `  </url>
`
    }

    xml += `</urlset>`

    return new Response(xml, {
      headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=1800' },
    })
  } catch (error) {
    console.error('Error generating articles sitemap:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate articles sitemap' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
