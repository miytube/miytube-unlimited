import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoId, title, description, thumbnailUrl } = await req.json();
    
    console.log('Analyzing music video:', { videoId, title });
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // AI analysis prompt for thumbnail and content quality
    const analysisPrompt = `Analyze this music video for featured eligibility. Score each metric from 0-100:

Title: "${title}"
Description: "${description || 'No description'}"
Thumbnail URL: ${thumbnailUrl || 'No thumbnail'}

Evaluate and return JSON with these exact fields:
{
  "thumbnail_quality_score": <0-100 based on: visual appeal, clarity, composition, click-worthiness>,
  "content_clarity_score": <0-100 based on: title clarity, description quality, professional presentation>,
  "title_effectiveness_score": <0-100 based on: SEO value, engagement potential, clear intent>
}

Consider:
- Thumbnail: Is it visually compelling? Does it represent the content well?
- Content Clarity: Is the purpose/genre clear? Would viewers know what to expect?
- Title: Is it searchable? Does it spark curiosity or clearly state value?

Return ONLY the JSON object, no additional text.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert content analyst specializing in music video optimization for maximum engagement.' },
          { role: 'user', content: analysisPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded, please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI analysis failed');
    }

    const aiResponse = await response.json();
    const analysisText = aiResponse.choices?.[0]?.message?.content || '';
    
    console.log('AI analysis response:', analysisText);
    
    // Parse the JSON response
    let scores;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scores = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Default scores if parsing fails
      scores = {
        thumbnail_quality_score: 50,
        content_clarity_score: 50,
        title_effectiveness_score: 50
      };
    }

    // Clamp scores to 0-100
    const clamp = (val: number) => Math.max(0, Math.min(100, Math.round(val)));
    
    const result = {
      thumbnail_quality_score: clamp(scores.thumbnail_quality_score || 50),
      content_clarity_score: clamp(scores.content_clarity_score || 50),
      title_effectiveness_score: clamp(scores.title_effectiveness_score || 50),
    };

    console.log('Final scores:', result);

    // Update the database if videoId provided
    if (videoId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error: updateError } = await supabase
        .from('music_videos')
        .update(result)
        .eq('id', videoId);

      if (updateError) {
        console.error('Database update error:', updateError);
      } else {
        console.log('Database updated for video:', videoId);
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-music-video:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
