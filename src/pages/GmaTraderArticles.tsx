import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentSiteId } from '@/config/sites';
import { usePageSEO } from '@/hooks/usePageSEO';
import { LineChart, Calendar, Eye, Loader2, ChevronRight, Video } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  views: number;
  created_at: string;
}

const GmaTraderArticles: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  usePageSEO({
    title: 'GmaTrader Nasdaq Futures Articles | MiyTube',
    description:
      'Daily Nasdaq futures market analysis, trading playbooks and session recaps from GmaTrader on MiyTube.',
    path: '/gmatrader-articles',
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, cover_image_url, views, created_at')
        .eq('is_published', true)
        .eq('site', getCurrentSiteId())
        .eq('category', 'gmatrader')
        .order('created_at', { ascending: false })
        .limit(100);
      setPosts(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1200px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1 flex-wrap">
          <Link to="/" className="font-semibold text-primary">MiyTube</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/stocks" className="hover:text-foreground">Stocks &amp; Money</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/c/stocks/gmatrader-nasdaq-futures-markets" className="hover:text-foreground">
            GmaTrader Nasdaq Futures Markets
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">GmaTrader Articles</span>
        </p>

        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div className="flex items-center gap-3">
            <LineChart className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">GmaTrader Articles</h1>
              <p className="text-sm text-muted-foreground">
                Nasdaq futures markets — daily analysis, levels and trading playbooks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/c/stocks/gmatrader-nasdaq-futures-markets/gmatrader-videos"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-muted transition-colors"
            >
              <Video className="h-4 w-4" /> GmaTrader Videos
            </Link>
            <Link
              to="/blog/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Upload className="h-4 w-4" /> Upload Article
            </Link>
          </div>
        </div>


        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg">
            <LineChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No articles yet</h2>
            <p className="text-muted-foreground">Market articles published in this category will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group block bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
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
                    <LineChart className="h-12 w-12 text-primary/40" />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h2>
                  {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{post.excerpt}</p>}
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.views}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GmaTraderArticles;
