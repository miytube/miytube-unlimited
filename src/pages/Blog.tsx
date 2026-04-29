import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { PenTool, Plus, Loader2, Calendar, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  views: number;
  created_at: string;
  user_id: string;
}

const Blog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, cover_image_url, views, created_at, user_id')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(50);
      setPosts(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = posts.filter((p) =>
    !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1200px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <Link to="/" className="font-semibold text-primary">MiyTube</Link> / Blog
        </p>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <PenTool className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">MiyTube Blog</h1>
              <p className="text-sm text-muted-foreground">Read articles & write your own</p>
            </div>
          </div>
          <Button onClick={() => navigate(user ? '/blog/create' : '/auth')} className="rounded-full">
            <Plus className="mr-2 h-4 w-4" /> Write Article
          </Button>
        </div>

        <Input
          placeholder="Search articles…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md mb-6"
        />

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg">
            <PenTool className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No articles yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to publish!</p>
            <Button onClick={() => navigate(user ? '/blog/create' : '/auth')}>Write Article</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group block bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {post.cover_image_url ? (
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
                    <PenTool className="h-12 w-12 text-primary/40" />
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

export default Blog;
