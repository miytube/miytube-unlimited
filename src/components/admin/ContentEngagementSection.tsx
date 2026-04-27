import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Play, MousePointerClick, Heart, Share2, Film } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TopVideo {
  id: string;
  title: string;
  views: number;
  table: 'uploaded_videos' | 'music_videos';
}

interface EngagementTotals {
  views: number;
  clicks: number;
  likes: number;
  shares: number;
}

interface DailyPoint {
  day: string;
  views: number;
  clicks: number;
  likes: number;
  shares: number;
}

const colorFor = (key: string) => {
  switch (key) {
    case 'views':
      return 'hsl(var(--primary))';
    case 'clicks':
      return 'hsl(var(--accent-foreground))';
    case 'likes':
      return '#ef4444';
    case 'shares':
      return '#22c55e';
    default:
      return 'hsl(var(--muted-foreground))';
  }
};

export const ContentEngagementSection = () => {
  const [totals, setTotals] = useState<EngagementTotals>({
    views: 0,
    clicks: 0,
    likes: 0,
    shares: 0,
  });
  const [daily, setDaily] = useState<DailyPoint[]>([]);
  const [topVideos, setTopVideos] = useState<TopVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // 1. Pull last 30d of engagement events
      const { data: events } = await supabase
        .from('video_engagement_events')
        .select('event_type, created_at, video_id, video_table')
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: true });

      const t: EngagementTotals = { views: 0, clicks: 0, likes: 0, shares: 0 };
      const dailyMap: Record<string, DailyPoint> = {};

      // Seed last 30 days
      for (let i = 29; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().slice(0, 10);
        dailyMap[key] = { day: key.slice(5), views: 0, clicks: 0, likes: 0, shares: 0 };
      }

      events?.forEach((e: any) => {
        const key = (e.created_at as string).slice(0, 10);
        const bucket = dailyMap[key];
        const type = e.event_type as keyof EngagementTotals;
        if (type in t) t[type]++;
        if (bucket && type in bucket) (bucket as any)[type]++;
      });

      setTotals(t);
      setDaily(Object.values(dailyMap));

      // 2. Top videos by stored `views` count (works even before events accumulate)
      const [{ data: uv }, { data: mv }] = await Promise.all([
        supabase
          .from('uploaded_videos')
          .select('id, title, views')
          .order('views', { ascending: false })
          .limit(5),
        supabase
          .from('music_videos')
          .select('id, title, views')
          .order('views', { ascending: false })
          .limit(5),
      ]);

      const combined: TopVideo[] = [
        ...(uv || []).map((v) => ({
          id: v.id,
          title: v.title,
          views: v.views || 0,
          table: 'uploaded_videos' as const,
        })),
        ...(mv || []).map((v) => ({
          id: v.id,
          title: v.title,
          views: v.views || 0,
          table: 'music_videos' as const,
        })),
      ]
        .sort((a, b) => b.views - a.views)
        .slice(0, 8);

      setTopVideos(combined);
    } catch (err) {
      console.error('engagement fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Content Engagement</h3>
        <p className="text-sm text-muted-foreground">
          When people view, click, like, and share videos and audio (last 30 days)
        </p>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Views</CardTitle>
            <Play className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totals.views.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totals.clicks.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Likes</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totals.likes.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Shares</CardTitle>
            <Share2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totals.shares.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} interval={3} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="views" stroke={colorFor('views')} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="clicks" stroke={colorFor('clicks')} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="likes" stroke={colorFor('likes')} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="shares" stroke={colorFor('shares')} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top videos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="h-5 w-5" />
            Most-Viewed Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topVideos.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 text-center">
              No content with views yet.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {topVideos.map((v, i) => (
                <li key={`${v.table}-${v.id}`} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-mono text-muted-foreground w-6">{i + 1}</span>
                    <span className="text-sm truncate">{v.title}</span>
                    {v.table === 'music_videos' && (
                      <span className="text-[10px] uppercase tracking-wide bg-muted px-1.5 py-0.5 rounded">
                        Audio
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold ml-4 shrink-0">
                    {v.views.toLocaleString()} views
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
