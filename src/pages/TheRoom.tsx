import React, { useEffect, useRef, useState } from 'react';
import { Layout } from '@/components/Layout';
import {
  Armchair,
  Loader2,
  Calendar,
  Eye,
  Upload,
  Mail,
  PlaySquare,
  PenLine,
  Video,
  Send,
  X,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentSiteId } from '@/config/sites';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface RoomMessage {
  sender: 'AI_HOST' | 'GUEST';
  text: string;
}

const SUGGESTED_TOPICS = ['Artificial Intelligence', 'Stock Markets', 'Boxing', 'Music Production'];

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

  // Live room state (session only — nothing is saved)
  const [topicInput, setTopicInput] = useState('');
  const [topic, setTopic] = useState('');
  const [isLaunched, setIsLaunched] = useState(false);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [guestInput, setGuestInput] = useState('');
  const [hostThinking, setHostThinking] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [roomError, setRoomError] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  // Blind-hook teaser (cinematic intro)
  const [showTeaser, setShowTeaser] = useState(() => {
    if (typeof window === 'undefined') return true;
    return sessionStorage.getItem('the-room-teaser-seen') !== '1';
  });
  const [teaserStep, setTeaserStep] = useState(0);

  const dismissTeaser = () => {
    try { sessionStorage.setItem('the-room-teaser-seen', '1'); } catch { /* ignore */ }
    setShowTeaser(false);
  };

  useEffect(() => {
    if (!showTeaser) return;
    const timers = [
      window.setTimeout(() => setTeaserStep(1), 2500),
      window.setTimeout(() => setTeaserStep(2), 5500),
      window.setTimeout(() => setTeaserStep(3), 8500),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [showTeaser]);


  usePageSEO({
    title: 'The Room — You name the topic. We build the room. | MiyTube',
    description:
      'The Room on MiyTube: name any topic and a live AI host builds the room around it. Plus video interviews and written Q&As with people who have a story.',
    path: '/the-room',
  });

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'The Room',
    url: 'https://www.miytube.com/the-room',
    description:
      'The Room on MiyTube — you name the topic, we build the room. Live AI host conversations, video interviews and written Q&As.',
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

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, hostThinking]);

  const askHost = async (nextTopic: string, history: RoomMessage[]) => {
    setHostThinking(true);
    setRoomError(null);
    try {
      const { data, error } = await supabase.functions.invoke('the-room-host', {
        body: {
          topic: nextTopic,
          messages: history.map((m) => ({
            role: m.sender === 'AI_HOST' ? 'assistant' : 'user',
            content: m.text,
          })),
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.reply) {
        setMessages((prev) => [...prev, { sender: 'AI_HOST', text: data.reply }]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'The host hit a snag. Try again.';
      setRoomError(msg);
    } finally {
      setHostThinking(false);
    }
  };

  const handleLaunch = (rawTopic?: string) => {
    const chosen = (rawTopic ?? topicInput).trim();
    if (!chosen) return;
    setTopic(chosen);
    setTopicInput(chosen);
    setIsLaunched(true);
    setMessages([]);
    setCameraReady(false);
    setRoomError(null);
    window.setTimeout(() => setCameraReady(true), 1200);
    askHost(chosen, []);
  };

  const handleSend = () => {
    const text = guestInput.trim();
    if (!text || hostThinking) return;
    const next: RoomMessage[] = [...messages, { sender: 'GUEST', text }];
    setMessages(next);
    setGuestInput('');
    askHost(topic, next);
  };

  const exitRoom = () => {
    setIsLaunched(false);
    setTopic('');
    setTopicInput('');
    setMessages([]);
    setGuestInput('');
    setRoomError(null);
    setCameraReady(false);
  };

  if (showTeaser) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 px-6 text-center select-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse 60% 60% at 50% 40%, hsl(var(--primary) / 0.18), transparent 70%)',
          }}
        />

        <div className="relative max-w-2xl w-full">
          {teaserStep === 0 && (
            <p className="animate-fade-in text-xl sm:text-3xl font-light tracking-wide text-neutral-400 leading-relaxed">
              The internet gave you infinite streams to watch<span className="animate-pulse">...</span>
            </p>
          )}

          {teaserStep === 1 && (
            <p className="animate-fade-in text-xl sm:text-3xl font-light tracking-wide text-neutral-200 leading-relaxed">
              ...but it never built a space specifically for your mind.
            </p>
          )}

          {teaserStep === 2 && (
            <div className="animate-fade-in flex flex-col items-center gap-4">
              <span className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.35em] text-neutral-500">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> Camera initializing
              </span>
              <p className="text-lg sm:text-2xl font-light text-neutral-400">
                Immediate. Immersive. Fully interactive.
              </p>
            </div>
          )}

          {teaserStep >= 3 && (
            <div className="animate-fade-in flex flex-col items-center gap-6">
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white">The Room</h1>
              <p className="text-lg sm:text-2xl font-light text-neutral-300">
                You name the topic. We build the room.
              </p>
              <Button onClick={dismissTeaser} className="h-12 rounded-full px-8 text-base">
                <Sparkles className="mr-2 h-4 w-4" /> Step Inside
              </Button>
              <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-neutral-600">miytube.com</p>
            </div>
          )}
        </div>

        {teaserStep < 3 && (
          <button
            onClick={dismissTeaser}
            className="absolute bottom-8 right-8 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-200 transition-colors"
          >
            Skip intro
          </button>
        )}
      </div>
    );
  }

  return (
    <Layout>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <Link to="/" className="font-semibold text-primary">MiyTube</Link> / The Room
        </p>

        {!isLaunched ? (
          <>
            {/* Launch screen */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card mb-10">
              <div
                className="absolute inset-0 opacity-70"
                style={{
                  background:
                    'radial-gradient(ellipse 60% 80% at 50% -10%, hsl(var(--primary) / 0.28), transparent 60%)',
                }}
              />
              <div className="relative px-6 sm:px-10 py-12 sm:py-16 text-center">
                <Armchair className="h-10 w-10 mx-auto text-primary mb-4" />
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
                  The <span className="text-primary">Room</span>
                </h1>
                <p className="text-muted-foreground mt-4 text-lg sm:text-xl font-medium">
                  You name the topic. We build the room.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                  <Input
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLaunch()}
                    placeholder="Enter a single keyword or topic..."
                    className="h-12 text-base rounded-full px-5"
                  />
                  <Button
                    onClick={() => handleLaunch()}
                    disabled={!topicInput.trim()}
                    className="h-12 rounded-full px-7 text-base"
                  >
                    <Sparkles className="mr-2 h-4 w-4" /> Build My Room
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                  {SUGGESTED_TOPICS.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleLaunch(t)}
                      className="text-sm rounded-full border border-border bg-background/60 px-4 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                  <Button variant="outline" onClick={() => navigate(user ? '/upload' : '/auth')} className="rounded-full">
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
          </>
        ) : (
          /* Live room */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 mb-12">
            {/* Topic canvas */}
            <div className="rounded-2xl border border-border bg-card flex flex-col min-h-[600px]">
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Topic Canvas</p>
                  <h1 className="text-xl sm:text-2xl font-bold truncate">{topic}</h1>
                </div>
                <Button variant="ghost" size="sm" onClick={exitRoom} className="rounded-full shrink-0">
                  <X className="mr-1 h-4 w-4" /> Exit Room
                </Button>
              </div>

              <div ref={feedRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-5 max-h-[520px]">
                {messages.map((m, i) => (
                  <div key={i} className={m.sender === 'AI_HOST' ? '' : 'text-right'}>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
                      {m.sender === 'AI_HOST' ? 'Host Response' : 'You'}
                    </p>
                    <div
                      className={`inline-block max-w-[85%] text-left rounded-2xl px-4 py-3 leading-relaxed ${
                        m.sender === 'AI_HOST'
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}

                {hostThinking && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" /> The host is talking...
                  </div>
                )}

                {roomError && (
                  <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
                    {roomError}
                  </div>
                )}
              </div>

              <div className="border-t border-border p-4 flex gap-2">
                <Input
                  value={guestInput}
                  onChange={(e) => setGuestInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={`Say something about ${topic}...`}
                  className="h-11 rounded-full px-5"
                  disabled={hostThinking}
                />
                <Button onClick={handleSend} disabled={hostThinking || !guestInput.trim()} className="h-11 rounded-full px-5">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* AI Host feed */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden h-fit lg:sticky lg:top-20">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">AI Host Feed</p>
                <span className="flex items-center gap-2 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  {cameraReady ? 'STREAMING LIVE' : 'CAMERA INITIALIZING...'}
                </span>
              </div>
              <div className="relative aspect-video bg-muted flex items-center justify-center">
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    background:
                      'radial-gradient(ellipse 70% 70% at 50% 30%, hsl(var(--primary) / 0.3), transparent 65%)',
                  }}
                />
                <Video
                  className={`relative h-16 w-16 text-primary ${cameraReady ? 'animate-pulse' : 'opacity-40'}`}
                />
              </div>
              <div className="px-4 py-4">
                <p className="font-semibold">The Room — Live Host</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {cameraReady
                    ? `On air, talking ${topic}. Ask anything.`
                    : 'Warming up the lights and rolling camera...'}
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  This conversation lives in this session only — nothing is saved.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TheRoom;
