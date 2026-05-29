import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Youtube } from 'lucide-react';

function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m) return m[1];
  }
  return null;
}

export const YouTubeRestoreManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRestore = async () => {
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      toast({ title: 'Invalid YouTube URL or ID', variant: 'destructive' });
      return;
    }
    if (!title.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' });
      return;
    }
    if (!user) return;

    setSubmitting(true);
    const { error } = await supabase.from('uploaded_videos').insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      category: category.trim() || null,
      is_youtube_embed: true,
      youtube_video_id: videoId,
      video_url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail_url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      is_cloud_stored: false,
    });
    setSubmitting(false);

    if (error) {
      toast({ title: 'Restore failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Video restored', description: `YouTube video ${videoId} added.` });
      setUrl('');
      setTitle('');
      setDescription('');
      setCategory('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Youtube className="h-5 w-5" />
          Restore YouTube Video
        </CardTitle>
        <CardDescription>
          Re-add a previously deleted YouTube-embed video by URL or 11-char ID.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="yt-url">YouTube URL or Video ID</Label>
          <Input
            id="yt-url"
            placeholder="https://www.youtube.com/watch?v=... or MK1VPyx0gXg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yt-title">Title</Label>
          <Input
            id="yt-title"
            placeholder="Video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yt-category">Category (optional)</Label>
          <Input
            id="yt-category"
            placeholder="e.g. music, comedy"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yt-desc">Description (optional)</Label>
          <Textarea
            id="yt-desc"
            placeholder="Video description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <Button onClick={handleRestore} disabled={submitting}>
          {submitting ? 'Restoring...' : 'Restore Video'}
        </Button>
      </CardContent>
    </Card>
  );
};
