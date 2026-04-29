import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save, ImageIcon } from 'lucide-react';

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 80);

const BlogCreate = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !content.trim()) {
      toast({ title: 'Title and content required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      let coverUrl: string | null = null;
      if (coverFile) {
        if (!coverFile.type.startsWith('image/')) throw new Error('Cover must be an image');
        if (coverFile.size > 5 * 1024 * 1024) throw new Error('Cover image must be < 5MB');
        const ext = coverFile.name.split('.').pop() || 'jpg';
        const path = `${user.id}/blog-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('pictures').upload(path, coverFile, { contentType: coverFile.type });
        if (upErr) throw upErr;
        coverUrl = supabase.storage.from('pictures').getPublicUrl(path).data.publicUrl;
      }

      const baseSlug = slugify(title);
      const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;

      const { error } = await supabase.from('blog_posts').insert({
        user_id: user.id,
        title: title.trim(),
        slug,
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        cover_image_url: coverUrl,
        is_published: true,
      });
      if (error) throw error;

      toast({ title: 'Article published!' });
      navigate(`/blog/${slug}`);
    } catch (err: any) {
      toast({ title: 'Could not publish', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-3xl mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <Link to="/" className="font-semibold text-primary">MiyTube</Link> / <Link to="/blog">Blog</Link> / Write
        </p>

        <h1 className="text-3xl font-bold mb-6">Write a New Article</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} required placeholder="Your article title" />
          </div>

          <div>
            <Label htmlFor="excerpt">Short summary (optional)</Label>
            <Input id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} maxLength={250} placeholder="A 1-2 sentence preview…" />
          </div>

          <div>
            <Label htmlFor="cover">Cover image (optional, max 5MB)</Label>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
              <Input id="cover" type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
            </div>
          </div>

          <div>
            <Label htmlFor="content">Article content * (markdown supported)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              maxLength={50000}
              rows={18}
              placeholder="Write your article here…"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">{content.length} / 50,000 characters</p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {saving ? 'Publishing…' : 'Publish Article'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/blog')}>Cancel</Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default BlogCreate;
