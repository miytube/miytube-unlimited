const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
}

const DOMAIN = 'https://miytube.com'
const FUNCTIONS_URL = 'https://dfwbddmckfzfocpruvtj.supabase.co/functions/v1'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Generating sitemap index...')
    
    const today = new Date().toISOString()

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${FUNCTIONS_URL}/sitemap-static</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${FUNCTIONS_URL}/sitemap-videos</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${FUNCTIONS_URL}/sitemap-music</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`

    console.log('Sitemap index generated successfully')

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error generating sitemap index:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate sitemap index' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
