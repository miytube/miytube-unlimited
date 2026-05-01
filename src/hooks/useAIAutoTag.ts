import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AITagSuggestions {
  suggestedTags: string[];
  suggestedCategory: string;
  suggestedSubcategory: string;
  improvedDescription: string;
  contentType: string;
  language: string;
  sentiment: string;
  ageRating: string;
}

export const useAIAutoTag = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<AITagSuggestions | null>(null);
  const { toast } = useToast();

  const analyzeContent = async (
    title: string,
    description: string,
    fileName?: string,
    fileType?: string,
    allowedCategories?: string[],
    allowedSubcategories?: string[]
  ): Promise<AITagSuggestions | null> => {
    if (!title.trim()) return null;

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-auto-tag', {
        body: { title, description, fileName, fileType, allowedCategories, allowedSubcategories },
      });

      if (error) {
        console.error('AI auto-tag error:', error);
        toast({
          title: "AI Analysis",
          description: "Could not generate AI suggestions. You can still upload manually.",
          variant: "destructive",
        });
        return null;
      }

      setSuggestions(data);
      toast({
        title: "AI Suggestions Ready",
        description: `Found ${data.suggestedTags?.length || 0} tags and category: ${data.suggestedCategory}`,
      });
      return data;
    } catch (err) {
      console.error('AI auto-tag failed:', err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analyzeContent, isAnalyzing, suggestions, setSuggestions };
};
