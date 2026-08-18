import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentSiteId } from '@/config/sites';
import { FileText, Newspaper } from 'lucide-react';

interface ArticleCard {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  created_at: string;
  views: number;
}

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(iso).toLocaleDateString();
};

export const LatestArticlesSection = ({ limit = 8 }: { limit?: number }) => {
  const [articles, setArticles] = useState<ArticleCard[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, cover_image_url, created_at, views')
        .eq('site', getCurrentSiteId())
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (active) setArticles(data || []);
    })();
    return () => { active = false; };
  }, [limit]);

  if (articles.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-medium">Latest Articles</h2>
        <Link to="/blog" className="ml-auto text-primary text-sm hover:underline">View all</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {articles.map((a) => (
          <article key={a.id} className="w-full">
            <Link to={`/blog/${a.slug}`} className="block group">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                {a.cover_image_url ? (
                  <img
                    src={a.cover_image_url}
                    alt={a.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-secondary">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <span className="absolute bottom-2 right-2 rounded bg-foreground/80 px-1.5 py-0.5 text-xs text-background">
                  Article
                </span>
              </div>
              <h3 className="mt-2 line-clamp-2 text-sm font-medium">{a.title}</h3>
              {a.excerpt && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>}
              <p className="text-xs text-muted-foreground">{a.views} views • {timeAgo(a.created_at)}</p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LatestArticlesSection;
