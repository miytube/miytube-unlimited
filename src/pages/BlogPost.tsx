import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Calendar, Eye, Trash2, Pencil } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePageSEO } from '@/hooks/usePageSEO';
import TipCreatorButton from '@/components/tips/TipCreatorButton';


interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  views: number;
  created_at: string;
  user_id: string;
  generated_from_video_id: string | null;
}

interface SourceVideo {
  id: string;
  local_id: string | null;
  title: string;
  thumbnail_url: string | null;
}

const BlogJsonLd = ({ data }: { data: object }) => {
  const ref = React.useRef<HTMLScriptElement>(null);
  React.useEffect(() => {
    if (ref.current) ref.current.textContent = JSON.stringify(data);
  }, [data]);
  return <script type="application/ld+json" ref={ref} />;
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [sourceVideo, setSourceVideo] = useState<SourceVideo | null>(null);

  usePageSEO({
    title: post ? `${post.title} — MiyTube Blog` : 'MiyTube Blog',
    description: post?.excerpt || (post ? post.content.slice(0, 155) : 'Read the latest article on the MiyTube blog.'),
    path: `/blog/${slug ?? ''}`,
    ogImage: post?.cover_image_url || undefined,
    ogType: 'article',
  });

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, content, excerpt, cover_image_url, views, created_at, user_id, generated_from_video_id')
        .eq('slug', slug)
        .maybeSingle();
      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setPost(data);
      setLoading(false);

      if (data.generated_from_video_id) {
        supabase
          .from('uploaded_videos')
          .select('id, local_id, title, thumbnail_url')
          .eq('id', data.generated_from_video_id)
          .maybeSingle()
          .then(({ data: v }) => {
            if (v) setSourceVideo(v as SourceVideo);
          });
      }
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

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.cover_image_url || undefined,
    datePublished: post.created_at,
    url: `https://www.miytube.com/blog/${slug}`,
    mainEntityOfPage: `https://www.miytube.com/blog/${slug}`,
    ...(sourceVideo
      ? {
          video: {
            '@type': 'VideoObject',
            name: sourceVideo.title,
            thumbnailUrl: sourceVideo.thumbnail_url || undefined,
            uploadDate: post.created_at,
            contentUrl: `https://www.miytube.com/watch?v=${sourceVideo.local_id || sourceVideo.id}`,
          },
        }
      : {}),
  };

  const watchPath = sourceVideo ? `/watch?v=${sourceVideo.local_id || sourceVideo.id}` : null;

  return (
    <Layout>
      <BlogJsonLd data={articleJsonLd} />
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
            <div className="ml-auto flex items-center gap-1">
              <Button size="sm" variant="ghost" onClick={() => navigate(`/blog/edit/${slug}`)}>
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          )}

        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>

        {watchPath && sourceVideo && (
          <Link
            to={watchPath}
            className="mt-8 flex items-center gap-4 rounded-lg border p-3 transition-colors hover:border-primary/60 hover:bg-primary/5"
          >
            {sourceVideo.thumbnail_url && (
              <img
                src={sourceVideo.thumbnail_url}
                alt={sourceVideo.title}
                loading="lazy"
                className="h-20 w-32 flex-shrink-0 rounded object-cover"
              />
            )}
            <div>
              <p className="text-xs uppercase tracking-wide text-primary font-semibold">Watch the video</p>
              <p className="font-medium leading-tight">{sourceVideo.title}</p>
            </div>
          </Link>
        )}

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <p className="font-semibold">
              {isAuthor ? 'Your tip jar is live on this article' : 'Enjoyed this article?'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isAuthor
                ? 'Readers see this button at the end of your article. 100% of tips go to you.'
                : 'Send the writer a tip. 100% goes straight to them.'}
            </p>
          </div>
          <div className={isAuthor ? 'pointer-events-none opacity-70' : undefined}>
            <TipCreatorButton
              creatorId={post.user_id}
              className="inline-flex items-center gap-1 px-5 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
            />
          </div>
        </div>
      </article>

    </Layout>
  );
};

export default BlogPost;
