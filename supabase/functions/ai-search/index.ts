import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, limit = 20, category, sortBy = 'relevance' } = await req.json();

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Search query is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    // Step 1: Use AI to understand the search intent and generate search terms
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: 'Extract search keywords from the user query. Return ONLY a JSON object: {"keywords": ["word1", "word2"], "category": "detected category or null", "intent": "what the user is looking for in one sentence"}' },
          { role: 'user', content: query }
        ],
      }),
    });

    let searchKeywords: string[] = [query];
    let detectedCategory: string | null = category || null;
    let searchIntent = query;

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      const content = aiData.choices?.[0]?.message?.content || '';
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          searchKeywords = parsed.keywords || [query];
          detectedCategory = category || parsed.category || null;
          searchIntent = parsed.intent || query;
        }
      } catch { /* use defaults */ }
    } else {
      await aiResponse.text(); // consume body
    }

    // Step 2: Query the database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build search pattern
    const searchPattern = searchKeywords.map(k => `%${k.toLowerCase()}%`);

    let dbQuery = supabase
      .from('uploaded_videos')
      .select('*');

    // Apply text search across title, description, category, tags
    // Use OR conditions for each keyword
    const orConditions = searchKeywords.map(k => {
      const kw = k.toLowerCase();
      return `title.ilike.%${kw}%,description.ilike.%${kw}%,category.ilike.%${kw}%,subcategory.ilike.%${kw}%`;
    }).join(',');

    dbQuery = dbQuery.or(orConditions);

    if (detectedCategory) {
      dbQuery = dbQuery.ilike('category', `%${detectedCategory}%`);
    }

    // Apply sorting
    if (sortBy === 'newest') {
      dbQuery = dbQuery.order('created_at', { ascending: false });
    } else if (sortBy === 'views') {
      dbQuery = dbQuery.order('views', { ascending: false });
    } else {
      dbQuery = dbQuery.order('created_at', { ascending: false });
    }

    dbQuery = dbQuery.limit(Math.min(limit, 50));

    const { data: videos, error } = await dbQuery;

    if (error) {
      console.error('Database search error:', error);
      throw new Error('Search query failed');
    }

    // Also search music_videos
    let musicQuery = supabase
      .from('music_videos')
      .select('*');

    const musicOrConditions = searchKeywords.map(k => {
      const kw = k.toLowerCase();
      return `title.ilike.%${kw}%,description.ilike.%${kw}%,category.ilike.%${kw}%`;
    }).join(',');

    musicQuery = musicQuery.or(musicOrConditions).limit(10);

    const { data: musicVideos } = await musicQuery;

    return new Response(JSON.stringify({
      videos: videos || [],
      musicVideos: musicVideos || [],
      searchIntent,
      detectedCategory,
      totalResults: (videos?.length || 0) + (musicVideos?.length || 0),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('ai-search error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
