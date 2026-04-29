import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Calendar, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  views: number;
  created_at: string;
  user_id: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, content, excerpt, cover_image_url, views, created_at, user_id')
        .eq('slug', slug)
        .maybeSingle();
      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setPost(data);
      setLoading(false);
      // Increment views (fire-and-forget)
      supabase.from('blog_posts').update({ views: (data.views || 0) + 1 }).eq('id', data.id).then(() => {});
    })();
  }, [slug]);

  const handleDelete = async () => {
    if (!post || !confirm('Delete this article?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', post.id);
    if (error) {
      toast({ title: 'Could not delete', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Article deleted' });
    navigate('/blog');
  };

  if (loading) return <Layout><div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  if (notFound || !post) return <Layout><div className="py-16 text-center"><h1 className="text-2xl font-bold mb-2">Article not found</h1><Link to="/blog" className="text-primary underline">Back to Blog</Link></div></Layout>;

  const isAuthor = user?.id === post.user_id;

  return (
    <Layout>
      <article className="py-6 animate-fade-in w-full max-w-3xl mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="font-semibold text-primary">MiyTube</Link> / <Link to="/blog">Blog</Link> / {post.title}
        </p>

        {post.cover_image_url && (
          <img src={post.cover_image_url} alt={post.title} className="w-full aspect-video object-cover rounded-lg mb-6" />
        )}

        <h1 className="text-4xl font-bold mb-3">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(post.created_at).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{post.views} views</span>
          {isAuthor && (
            <Button size="sm" variant="ghost" onClick={handleDelete} className="ml-auto text-destructive">
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          )}
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
