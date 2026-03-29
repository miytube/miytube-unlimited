import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { AlertTriangle, ExternalLink, Clock, Tag, MessageSquare, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import BreakingNewsRotator from '@/components/news/BreakingNewsRotator';

interface BreakingNewsItem {
  id: string;
  title: string;
  content: string | null;
  source: string | null;
  source_url: string | null;
  category: string | null;
  is_breaking: boolean;
  is_active: boolean;
  priority: number | null;
  created_at: string;
}

const BreakingNews = () => {
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('id');
  const { user } = useAuth();
  const [news, setNews] = useState<BreakingNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(highlightId);
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchNews();

    const channel = supabase
      .channel('breaking-news-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'breaking_news' }, () => fetchNews())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (highlightId) {
      setExpandedId(highlightId);
      setTimeout(() => {
        document.getElementById(`news-${highlightId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [highlightId]);

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('breaking_news')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (!error && data) {
      const activeNews = data.filter((item: any) => {
        if (!item.expires_at) return true;
        return new Date(item.expires_at) > new Date();
      });
      setNews(activeNews);
    }
    setLoading(false);
  };

  const handleShare = async (item: BreakingNewsItem) => {
    const url = `${window.location.origin}/breaking-news?id=${item.id}`;
    if (navigator.share) {
      await navigator.share({ title: item.title, text: item.content || item.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <Layout>
      <div className="py-4 w-full max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-semibold text-primary">MiyTube</span> / Breaking News
          </p>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-destructive text-destructive-foreground p-2 rounded-lg">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Breaking News</h1>
              <p className="text-sm text-muted-foreground">Live updates • Auto-refreshing</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
              </span>
              <span className="text-xs font-medium text-destructive uppercase tracking-wider">Live</span>
            </div>
          </div>
        </div>

        {/* Live News Rotator */}
        <BreakingNewsRotator />

        {/* News Feed */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card rounded-lg border p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4 mb-3" />
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg border">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Breaking News</h2>
            <p className="text-muted-foreground">There are no active breaking news stories right now. Check back later.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item, idx) => {
              const isExpanded = expandedId === item.id;
              const isHighlighted = highlightId === item.id;

              return (
                <article
                  key={item.id}
                  id={`news-${item.id}`}
                  className={`bg-card rounded-lg border transition-all duration-300 overflow-hidden ${
                    isHighlighted ? 'ring-2 ring-destructive' : ''
                  } ${idx === 0 ? 'border-destructive/30' : ''}`}
                >
                  {/* Card Header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="w-full text-left p-5 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {item.is_breaking && (
                            <Badge variant="destructive" className="text-[10px] uppercase tracking-wider font-bold">
                              Breaking
                            </Badge>
                          )}
                          {item.category && (
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                              <Tag className="h-2.5 w-2.5 mr-1" />
                              {item.category}
                            </Badge>
                          )}
                          {idx === 0 && (
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-primary border-primary">
                              Latest
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto flex-shrink-0">
                            <Clock className="h-3 w-3" />
                            {timeAgo(item.created_at)}
                          </span>
                        </div>
                        <h2 className={`font-bold leading-snug ${idx === 0 ? 'text-xl' : 'text-lg'}`}>
                          {item.title}
                        </h2>
                        {!isExpanded && item.content && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.content}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 mt-1">
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 animate-fade-in">
                      <Separator className="mb-4" />

                      {item.content && (
                        <p className="text-foreground leading-relaxed mb-4 whitespace-pre-line">{item.content}</p>
                      )}

                      {/* Source info */}
                      <div className="flex items-center gap-4 mb-4 flex-wrap">
                        {item.source && (
                          <span className="text-sm text-muted-foreground">
                            Source: <span className="font-medium text-foreground">{item.source}</span>
                          </span>
                        )}
                        {item.source_url && (
                          <a
                            href={item.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Read full story
                          </a>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(item.created_at).toLocaleString()}
                        </span>
                      </div>

                      <Separator className="mb-4" />

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleShare(item)} className="gap-1.5">
                          <Share2 className="h-3.5 w-3.5" />
                          Share
                        </Button>
                      </div>

                      {/* Comment Section */}
                      {user && (
                        <div className="mt-4">
                          <Separator className="mb-4" />
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <Textarea
                                placeholder="Share your thoughts on this story..."
                                value={commentText[item.id] || ''}
                                onChange={(e) => setCommentText({ ...commentText, [item.id]: e.target.value })}
                                className="min-h-[80px] text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end mt-2">
                            <Button
                              size="sm"
                              disabled={!commentText[item.id]?.trim()}
                              onClick={() => {
                                toast.success('Comment feature coming soon!');
                                setCommentText({ ...commentText, [item.id]: '' });
                              }}
                              className="gap-1.5"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              Comment
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BreakingNews;
