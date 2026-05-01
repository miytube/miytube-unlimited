import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Save, Trash2, Video, Play, Eye, Users } from 'lucide-react';

export const FeaturedDiscussionManager = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [form, setForm] = useState({
    video_url: '',
    title: '',
    description: '',
    thumbnail_url: '',
  });
  const [stats, setStats] = useState({ plays: 0, uniqueSessions: 0, uniqueUsers: 0 });

  useEffect(() => {
    fetchCurrent();
  }, []);

  useEffect(() => {
    if (currentId) fetchStats(currentId);
  }, [currentId]);

  const fetchStats = async (videoId: string) => {
    const { data } = await supabase
      .from('video_engagement_events')
      .select('session_id, user_id')
      .eq('video_table', 'featured_discussion_video')
      .eq('video_id', videoId)
      .eq('event_type', 'play');

    if (data) {
      const sessions = new Set(data.map((d) => d.session_id).filter(Boolean));
      const users = new Set(data.map((d) => d.user_id).filter(Boolean));
      setStats({ plays: data.length, uniqueSessions: sessions.size, uniqueUsers: users.size });
    }
  };

  const fetchCurrent = async () => {
    const { data } = await supabase
      .from('featured_discussion_video')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setCurrentId(data.id);
      setForm({
        video_url: data.video_url,
        title: data.title,
        description: data.description || '',
        thumbnail_url: data.thumbnail_url || '',
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.video_url.trim() || !form.title.trim()) {
      toast({ title: 'Error', description: 'Video URL and title are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);

    // Delete existing then insert new
    if (currentId) {
      await supabase.from('featured_discussion_video').delete().eq('id', currentId);
    }

    const { data, error } = await supabase
      .from('featured_discussion_video')
      .insert({
        video_url: form.video_url.trim(),
        title: form.title.trim(),
        description: form.description.trim() || null,
        thumbnail_url: form.thumbnail_url.trim() || null,
        created_by: user?.id || null,
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setCurrentId(data.id);
      toast({ title: 'Saved!', description: 'Featured discussion video updated.' });
    }
    setSaving(false);
  };

  const handleRemove = async () => {
    if (!currentId) return;
    await supabase.from('featured_discussion_video').delete().eq('id', currentId);
    setCurrentId(null);
    setForm({ video_url: '', title: '', description: '', thumbnail_url: '' });
    toast({ title: 'Removed', description: 'Featured video removed from Talk at Cha.' });
  };

  if (loading) return <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Featured Discussion Video
        </CardTitle>
        <CardDescription>
          Set a video on the Talk at Cha page to spark discussions. Change it every few days to keep things fresh.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentId && (
          <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/50 border">
            <div className="flex flex-col items-center text-center">
              <Play className="h-4 w-4 text-primary mb-1" />
              <div className="text-2xl font-bold">{stats.plays}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Plays</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <Eye className="h-4 w-4 text-primary mb-1" />
              <div className="text-2xl font-bold">{stats.uniqueSessions}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Unique Sessions</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users className="h-4 w-4 text-primary mb-1" />
              <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Logged-in Viewers</div>
            </div>
          </div>
        )}
        <div>
          <label className="text-sm font-medium">Video URL *</label>
          <Input
            placeholder="YouTube URL or direct video link"
            value={form.video_url}
            onChange={(e) => setForm({ ...form, video_url: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Title *</label>
          <Input
            placeholder="What should people discuss?"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            placeholder="Optional context or discussion prompt..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Thumbnail URL</label>
          <Input
            placeholder="Optional thumbnail (for non-YouTube videos)"
            value={form.thumbnail_url}
            onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : currentId ? 'Update Video' : 'Set Video'}
          </Button>
          {currentId && (
            <Button variant="destructive" onClick={handleRemove}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
