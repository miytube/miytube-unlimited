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

    // Always include the raw query as a keyword so the user's exact phrase still matches,
    // even if AI keyword extraction split or dropped words.
    const cleanKeyword = (value: string) => value
      .toLowerCase()
      .replace(/["'`{}[\](),]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const rawQuery = cleanKeyword(query);
    const genericTerms = new Set(['a', 'an', 'and', 'at', 'by', 'for', 'from', 'in', 'of', 'on', 'the', 'to', 'vs', 'nba', 'basketball', 'sports', 'game', 'full', 'highlights', 'highlight']);
    const rawTerms = rawQuery.split(/[\s,_\-|/]+/).filter(w => w.length >= 2);
    const importantTerms = rawTerms.filter(w => !genericTerms.has(w));
    const termsForDbSearch = importantTerms.length > 0 ? importantTerms : rawTerms;
    const keywordSet = new Set<string>([
      rawQuery,
      ...searchKeywords.map(cleanKeyword).filter(k => {
        const parts = k.split(/\s+/).filter(Boolean);
        return parts.length > 1 || !genericTerms.has(k);
      }),
      ...termsForDbSearch,
    ]);
    const allKeywords = Array.from(keywordSet).filter(Boolean);

    let dbQuery = supabase
      .from('uploaded_videos')
      .select('*');

    // Search across title, description, category, subcategory, tags AND file_name
    // (file_name preserves the original upload name even after AI auto-title rewrites it)
    const tagSafe = (s: string) => /^[a-z0-9][a-z0-9_-]*$/i.test(s);
    const orConditions = allKeywords.map(k => {
      const kw = k;
      const conditions = [
        `title.ilike.%${kw}%`,
        `description.ilike.%${kw}%`,
        `category.ilike.%${kw}%`,
        `subcategory.ilike.%${kw}%`,
        `file_name.ilike.%${kw}%`,
      ];

      if (tagSafe(kw)) {
        conditions.push(`tags.cs.{${kw}}`);
      }

      return conditions.join(',');
    }).join(',');

    dbQuery = dbQuery.or(orConditions);

    // Only filter by category if the USER explicitly picked one in the UI.
    if (category) {
      dbQuery = dbQuery.ilike('category', `%${category}%`);
    }

    // Apply sorting
    if (sortBy === 'newest') {
      dbQuery = dbQuery.order('created_at', { ascending: false });
    } else if (sortBy === 'views') {
      dbQuery = dbQuery.order('views', { ascending: false });
    } else {
      dbQuery = dbQuery.order('created_at', { ascending: false });
    }

    dbQuery = dbQuery.limit(200);

    const { data: videos, error } = await dbQuery;

    if (error) {
      console.error('Database search error:', error);
      throw new Error('Search query failed');
    }

    const normalizeText = (value: unknown) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const requiredTerms = importantTerms.length > 0 ? importantTerms : rawTerms;

    const scoreVideo = (video: Record<string, unknown>) => {
      const primaryText = normalizeText(`${video.title || ''} ${video.file_name || ''}`);
      const secondaryText = normalizeText(`${video.description || ''} ${(video.tags as string[] | null || []).join(' ')}`);
      const categoryText = normalizeText(`${video.category || ''} ${video.subcategory || ''}`);
      const allText = `${primaryText} ${secondaryText} ${categoryText}`;

      const requiredMatches = requiredTerms.filter(term => allText.includes(term)).length;
      const primaryMatches = requiredTerms.filter(term => primaryText.includes(term)).length;
      const secondaryMatches = requiredTerms.filter(term => secondaryText.includes(term)).length;
      const categoryMatches = requiredTerms.filter(term => categoryText.includes(term)).length;

      let score = 0;
      if (rawQuery && primaryText.includes(rawQuery)) score += 1000;
      score += primaryMatches * 120;
      score += secondaryMatches * 45;
      score += categoryMatches * 10;
      score += requiredMatches * 20;

      return { score, requiredMatches };
    };

    const minRequiredMatches = requiredTerms.length > 1 ? Math.min(2, requiredTerms.length) : 1;
    const rankedVideos = (videos || [])
      .map(video => ({ video, ...scoreVideo(video as Record<string, unknown>) }))
      .filter(item => requiredTerms.length === 0 || item.requiredMatches >= minRequiredMatches)
      .sort((a, b) => {
        if (sortBy === 'relevance' && b.score !== a.score) return b.score - a.score;
        if (sortBy === 'views') return ((b.video.views as number | null) || 0) - ((a.video.views as number | null) || 0);
        return new Date((b.video.created_at as string) || 0).getTime() - new Date((a.video.created_at as string) || 0).getTime();
      })
      .slice(0, Math.min(limit, 50))
      .map(item => item.video);

    // Also search music_videos (include file_name fallback)
    let musicQuery = supabase
      .from('music_videos')
      .select('*');

    const musicOrConditions = allKeywords.map(k => {
      const kw = k;
      return `title.ilike.%${kw}%,description.ilike.%${kw}%,category.ilike.%${kw}%,file_name.ilike.%${kw}%`;
    }).join(',');

    musicQuery = musicQuery.or(musicOrConditions).limit(10);

    const { data: musicVideos } = await musicQuery;

    return new Response(JSON.stringify({
      videos: rankedVideos || [],
      musicVideos: musicVideos || [],
      searchIntent,
      detectedCategory,
      totalResults: (rankedVideos?.length || 0) + (musicVideos?.length || 0),
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
