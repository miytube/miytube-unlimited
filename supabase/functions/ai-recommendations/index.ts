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
    const { videoId, category, tags, limit = 8 } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get recommendations based on category, tags, and recency
    let recommendations: any[] = [];

    // 1. Same category videos (highest priority)
    if (category) {
      const { data: categoryVideos } = await supabase
        .from('uploaded_videos')
        .select('*')
        .ilike('category', `%${category}%`)
        .neq('id', videoId || '')
        .order('views', { ascending: false })
        .limit(limit);

      if (categoryVideos) recommendations.push(...categoryVideos);
    }

    // 2. If not enough, get popular videos
    if (recommendations.length < limit) {
      const remaining = limit - recommendations.length;
      const existingIds = recommendations.map(v => v.id);
      
      const { data: popularVideos } = await supabase
        .from('uploaded_videos')
        .select('*')
        .not('id', 'in', `(${[videoId, ...existingIds].filter(Boolean).join(',')})`)
        .order('views', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(remaining);

      if (popularVideos) recommendations.push(...popularVideos);
    }

    // 3. Use AI to rank if we have enough context
    if (tags && tags.length > 0 && recommendations.length > 3) {
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      if (LOVABLE_API_KEY) {
        try {
          const videoSummaries = recommendations.slice(0, 20).map((v, i) => 
            `${i}: "${v.title}" (${v.category || 'uncategorized'})`
          ).join('\n');

          const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash-lite',
              messages: [
                { role: 'system', content: 'You rank video recommendations. Return ONLY a JSON array of indices sorted by relevance, e.g. [2,0,5,1,3,4]' },
                { role: 'user', content: `Current video tags: ${tags.join(', ')}\nCategory: ${category}\n\nRank these videos by relevance:\n${videoSummaries}` }
              ],
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            const content = aiData.choices?.[0]?.message?.content || '';
            const arrayMatch = content.match(/\[[\d,\s]+\]/);
            if (arrayMatch) {
              const order = JSON.parse(arrayMatch[0]) as number[];
              const reordered = order
                .filter(i => i >= 0 && i < recommendations.length)
                .map(i => recommendations[i]);
              // Add any items not in the AI ranking
              const remaining = recommendations.filter((_, i) => !order.includes(i));
              recommendations = [...reordered, ...remaining];
            }
          } else {
            await aiResponse.text();
          }
        } catch (aiError) {
          console.error('AI ranking failed, using default order:', aiError);
        }
      }
    }

    return new Response(JSON.stringify({
      recommendations: recommendations.slice(0, limit),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('ai-recommendations error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
