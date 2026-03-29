import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, fileName, fileType } = await req.json();

    if (!title || typeof title !== 'string') {
      return new Response(JSON.stringify({ error: 'Title is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const prompt = `Analyze this uploaded video and suggest metadata. Return ONLY valid JSON.

Title: "${title}"
Description: "${description || 'No description provided'}"
File name: "${fileName || 'unknown'}"
File type: "${fileType || 'video'}"

Return JSON with:
{
  "suggestedTags": ["tag1", "tag2", ...up to 10 relevant tags],
  "suggestedCategory": "best matching category from: Music, Comedy, Sports, Education, Gaming, News, Entertainment, Science, Technology, Travel, Film, Fitness, Food, Animals, Fashion, Art, Documentary, How-To",
  "suggestedSubcategory": "more specific subcategory",
  "improvedDescription": "A better SEO-optimized description if the original is empty or weak, otherwise return the original",
  "contentType": "video|short|music|podcast|documentary",
  "language": "detected language",
  "sentiment": "positive|neutral|negative",
  "ageRating": "G|PG|PG-13|R"
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: 'You are an expert video content classifier and SEO specialist. Always return valid JSON only.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limited, please try again later.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Add funds in Settings > Workspace > Usage.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI auto-tag analysis failed');
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '';

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON in response');
      }
    } catch {
      result = {
        suggestedTags: [],
        suggestedCategory: 'Entertainment',
        suggestedSubcategory: '',
        improvedDescription: description || '',
        contentType: 'video',
        language: 'en',
        sentiment: 'neutral',
        ageRating: 'G',
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('ai-auto-tag error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
