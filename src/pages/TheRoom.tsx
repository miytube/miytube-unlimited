
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Armchair, Loader2, Calendar, Eye, Upload, Mail, PlaySquare, PenLine } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentSiteId } from '@/config/sites';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { usePageSEO } from '@/hooks/usePageSEO';
import { VideoCard } from '@/components/VideoCard';

interface RoomVideo {
  id: string;
  title: string;
  thumbnail_url: string | null;
  duration: string | null;
  views: number;
  created_at: string;
  category: string | null;
  subcategory: string | null;
  description: string | null;
  tags: string[] | null;
  user_id: string | null;
}

interface RoomArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  views: number;
  created_at: string;
}

const isInterviewContent = (v: Pick<RoomVideo, 'category' | 'subcategory' | 'tags'>) =>
  (v.tags ?? []).includes('the-room') ||
  [v.category, v.subcategory].some((f) => !!f && /interview/i.test(f));

const relativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d < 1) return 'Today';
  if (d === 1) return '1 day ago';
  if (d < 30) return `${d} days ago`;
  const m = Math.floor(d / 30);
  if (m < 12) return `${m} month${m === 1 ? '' : 's'} ago`;
  return `${Math.floor(m / 12)} year${m < 24 ? '' : 's'} ago`;
};

const formatViews = (views: number) =>
  views >= 1000 ? `${(views / 1000).toFixed(1).replace(/\.0$/, '')}K views` : `${views} views`;

const TheRoom = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<RoomVideo[]>([]);
  const [articles, setArticles] = useState<RoomArticle[]>([]);
  const [channelNames, setChannelNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  usePageSEO({
    title: 'The Room — Interviews with people who have a story | MiyTube',
    description:
      'The Room is MiyTube’s interview series: video interviews and written Q&As with creators, locals, and anyone with a story worth hearing.',
    path: '/the-room',
  });

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'The Room',
    url: 'https://www.miytube.com/the-room',
    description: 'Interview series on MiyTube — video interviews and written Q&As with people who have a story.',
  };

  useEffect(() => {
    (async () => {
      const site = getCurrentSiteId();

      const [videosRes, postsRes] = await Promise.all([
        supabase
          .from('uploaded_videos')
          .select(
            'id, title, thumbnail_url, duration, views, created_at, category, subcategory, description, tags, user_id'
          )
          .eq('site', site)
          .order('created_at', { ascending: false })
          .limit(200),
        supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, cover_image_url, views, created_at, category')
          .eq('is_published', true)
          .eq('site', site)
          .order('created_at', { ascending: false })
          .limit(100),
      ]);

      const roomVideos = (videosRes.data as RoomVideo[] | null ?? []).filter(isInterviewContent).slice(0, 20);
      setVideos(roomVideos);

      const roomPosts = (postsRes.data as (RoomArticle & { category: string | null })[] | null ?? [])
        .filter((p) => /interview|the room/i.test(p.category ?? ''))
        .slice(0, 12);
      setArticles(roomPosts);

      const userIds = [...new Set(roomVideos.map((v) => v.user_id).filter(Boolean) as string[])];
      if (userIds.length) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, channel_name, display_name')
          .in('user_id', userIds);
        const names: Record<string, string> = {};
        (profiles ?? []).forEach((p: { user_id: string; channel_name?: string | null; display_name?: string | null }) => {
          names[p.user_id] = p.channel_name || p.display_name || 'MiyTube Creator';
        });
        setChannelNames(names);
      }

      setLoading(false);
    })();
  }, []);

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <Link to="/" className="font-semibold text-primary">MiyTube</Link> / The Room
        </p>

        {/* Spotlight hero */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card mb-10">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(ellipse 60% 80% at 50% -10%, hsl(var(--primary) / 0.25), transparent 60%)',
            }}
          />
          <div className="relative px-6 sm:px-10 py-10 sm:py-14 text-center">
            <Armchair className="h-10 w-10 mx-auto text-primary mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              The <span className="text-primary">Room</span>
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-lg">
              Interviews with people who have a story. Creators, locals, characters — everyone gets a chair.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Button
                onClick={() => navigate(user ? '/upload' : '/auth')}
                className="rounded-full"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload an Interview
              </Button>
              <Button variant="outline" onClick={() => navigate('/contact')} className="rounded-full">
                <Mail className="mr-2 h-4 w-4" /> Ask to Be Interviewed
              </Button>
            </div>
          </div>
        </div>

        {/* Video interviews */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <PlaySquare className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Video Interviews</h2>
            <span className="text-sm text-muted-foreground">({videos.length})</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-14 bg-card rounded-xl border border-border">
              <Armchair className="h-14 w-14 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">The chairs are empty — for now</h3>
              <p className="text-muted-foreground mb-5 max-w-md mx-auto">
                No interviews yet. Upload yours (tag it <span className="font-medium">the-room</span> or under an
                Interviews category) and it lands here first.
              </p>
              <Button onClick={() => navigate(user ? '/upload' : '/auth')}>
                <Upload className="mr-2 h-4 w-4" /> Be the First
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {videos.map((v) => (
                <VideoCard
                  key={v.id}
                  id={v.id}
                  title={v.title}
                  thumbnail={v.thumbnail_url || '/placeholder.svg'}
                  channelName={channelNames[v.user_id ?? ''] || 'MiyTube Creator'}
                  views={formatViews(v.views ?? 0)}
                  timestamp={relativeTime(v.created_at)}
                  duration={v.duration || ''}
                  description={v.description || ''}
                  tags={v.tags ?? []}
                  category={v.category ?? undefined}
                  subcategory={v.subcategory ?? undefined}
                />
              ))}
            </div>
          )}
        </section>

        {/* Written Q&As */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <PenLine className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Q&A Articles</h2>
            <span className="text-sm text-muted-foreground">({articles.length})</span>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-10 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground mb-4">
                No written interviews yet. Tag an article <span className="font-medium">Interviews</span> and it shows here.
              </p>
              <Button variant="outline" onClick={() => navigate(user ? '/blog/create' : '/auth')}>
                Write a Q&A
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group block bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
                >
                  {post.cover_image_url ? (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
                      <PenLine className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{post.excerpt}</p>}
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default TheRoom;
