const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
}

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
  // Sports
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
  // Gaming
  { path: '/gaming/action', priority: '0.7', changefreq: 'weekly' },
  { path: '/gaming/adventure', priority: '0.7', changefreq: 'weekly' },
  { path: '/gaming/rpg', priority: '0.7', changefreq: 'weekly' },
  { path: '/gaming/sports', priority: '0.7', changefreq: 'weekly' },
  { path: '/gaming/strategy', priority: '0.7', changefreq: 'weekly' },
  // Film
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
  // Other
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Generating static pages sitemap...')
    const today = new Date().toISOString().split('T')[0]

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

    for (const route of staticRoutes) {
      xml += `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`
    }

    xml += `</urlset>`

    console.log(`Static sitemap generated with ${staticRoutes.length} routes`)

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    console.error('Error generating static sitemap:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate sitemap' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
