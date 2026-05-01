import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Volume2, VolumeX } from 'lucide-react';

interface FeaturedVideo {
  id: string;
  video_url: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
}

export const FeaturedDiscussionVideo = () => {
  const [video, setVideo] = useState<FeaturedVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('featured_discussion_video')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      setVideo(data);
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-4">
          <div className="aspect-video bg-muted rounded-lg" />
          <div className="h-4 bg-muted rounded mt-3 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (!video) return null;

  const isYouTube = video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be');
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent sticky top-24">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
          <MessageSquare className="h-4 w-4" />
          Featured Discussion
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <div className="aspect-video rounded-lg overflow-hidden bg-black">
          {isYouTube ? (
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(video.video_url)}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          ) : (
            <video
              src={video.video_url}
              poster={video.thumbnail_url || undefined}
              controls
              className="w-full h-full object-contain"
            />
          )}
        </div>
        <h3 className="font-semibold text-sm leading-tight">{video.title}</h3>
        {video.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{video.description}</p>
        )}
        <p className="text-[10px] text-muted-foreground/60 italic">
          What do you think? Start a discussion below!
        </p>
      </CardContent>
    </Card>
  );
};
