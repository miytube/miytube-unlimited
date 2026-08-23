import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface VideoMeta {
  title?: string | null;
  description?: string | null;
  category?: string | null;
  subcategory?: string | null;
  tags?: string[] | string | null;
}

interface GenerateArticleButtonProps {
  videoId: string;
  video: VideoMeta;
  ownerId?: string | null;
}

export const GenerateArticleButton = ({ videoId, video, ownerId }: GenerateArticleButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const isOwner = !!(user?.id && ownerId && user.id === ownerId);
  if (!isOwner) return null;

  const handleGenerate = async () => {
    if (!videoId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-video-article', {
        body: { videoId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      navigate('/blog/create', {
        state: {
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          generatedFromVideoId: data.videoId || videoId,
        },
      });
    } catch (err: any) {
      toast({
        title: 'Could not generate article',
        description: err?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleGenerate}
      disabled={loading}
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      {loading ? 'Generating…' : 'Generate Article'}
    </Button>
  );
};
