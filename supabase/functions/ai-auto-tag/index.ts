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
    const { title, description, fileName, fileType, allowedCategories, allowedSubcategories } = await req.json();

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

    const categoryList: string[] = Array.isArray(allowedCategories) && allowedCategories.length
      ? allowedCategories
      : [];

    const subcategoryList: string[] = Array.isArray(allowedSubcategories) ? allowedSubcategories : [];

    const prompt = `Analyze this uploaded video and suggest metadata. Return ONLY valid JSON.

Title: "${title}"
Description: "${description || 'No description provided'}"
File name: "${fileName || 'unknown'}"
File type: "${fileType || 'video'}"

CRITICAL RULES:
- Do not move the upload to a different category or subcategory.
- "suggestedCategory" MUST be EXACTLY the current selected category id, or empty string if none was provided: ${categoryList.length ? categoryList.join(', ') : '(none provided — return empty string)'}
- "suggestedSubcategory" MUST be EXACTLY the current selected subcategory id, or empty string if none was provided: ${subcategoryList.length ? subcategoryList.join(', ') : '(none provided — return empty string)'}
- Do NOT invent new category or subcategory names.

Return JSON with:
{
  "suggestedTags": ["tag1", "tag2", ...up to 10 relevant tags],
  "suggestedCategory": "<one id from the allowed category list>",
  "suggestedSubcategory": "<one id from the allowed subcategory list, or empty string>",
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
          { role: 'system', content: 'You are an expert video metadata assistant. Generate useful tags and descriptions, but never recategorize uploads. Category and subcategory must stay exactly as provided by the user. Always return valid JSON only.' },
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

    let result: any;
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
        suggestedCategory: '',
        suggestedSubcategory: '',
        improvedDescription: description || '',
        contentType: 'video',
        language: 'en',
        sentiment: 'neutral',
        ageRating: 'G',
      };
    }

    // Server-side validation: drop any value that isn't in the allowed list
    const normalize = (v: string) => (v || '').toString().toLowerCase().trim()
      .replace(/^\/+|\/+$/g, '')
      .replace(/[\/\s_]+/g, '-')
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    const catNorm = normalize(result.suggestedCategory || '');
    const subNorm = normalize(result.suggestedSubcategory || '');
    result.suggestedCategory = categoryList.includes(catNorm) ? catNorm : '';
    result.suggestedSubcategory = subcategoryList.length === 0
      ? ''
      : (subcategoryList.includes(subNorm) ? subNorm : '');

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
