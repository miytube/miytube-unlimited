import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Image as ImageIcon, Upload, Loader2, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Picture {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  user_id: string;
  views: number;
  created_at: string;
}

const Pictures = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selected, setSelected] = useState<Picture | null>(null);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('pictures')
      .select('id, title, description, image_url, user_id, views, created_at')
      .order('created_at', { ascending: false })
      .limit(100);
    setPictures(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    if (!file || !title.trim()) {
      toast({ title: 'Title and image required', variant: 'destructive' });
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Only images allowed', variant: 'destructive' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'Image too large', description: 'Max 10MB', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('pictures').upload(path, file, { contentType: file.type });
      if (upErr) throw upErr;
      const url = supabase.storage.from('pictures').getPublicUrl(path).data.publicUrl;

      const { error: insErr } = await supabase.from('pictures').insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        image_url: url,
      });
      if (insErr) throw insErr;

      toast({ title: 'Picture uploaded!' });
      setOpen(false);
      setTitle(''); setDescription(''); setFile(null);
      fetch();
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (pic: Picture) => {
    if (!confirm('Delete this picture?')) return;
    const { error } = await supabase.from('pictures').delete().eq('id', pic.id);
    if (error) {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Picture deleted' });
    setSelected(null);
    fetch();
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <Link to="/" className="font-semibold text-primary">MiyTube</Link> / Pictures
        </p>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">MiyTube Pictures</h1>
              <p className="text-sm text-muted-foreground">Upload and browse community photos</p>
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full"><Upload className="mr-2 h-4 w-4" />Upload Picture</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Upload Picture</DialogTitle></DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4">
                <div><Label>Title *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} required /></div>
                <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} /></div>
                <div><Label>Image (max 10MB) *</Label><Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required /></div>
                <Button type="submit" disabled={uploading} className="w-full">
                  {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  {uploading ? 'Uploading…' : 'Upload'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : pictures.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg">
            <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No pictures yet</h3>
            <p className="text-muted-foreground">Be the first to upload!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {pictures.map((pic) => (
              <button
                key={pic.id}
                onClick={() => setSelected(pic)}
                className="group aspect-square rounded-lg overflow-hidden bg-muted relative"
              >
                <img src={pic.image_url} alt={pic.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-sm font-medium line-clamp-2">{pic.title}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Lightbox */}
        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="max-w-4xl">
            {selected && (
              <>
                <DialogHeader><DialogTitle>{selected.title}</DialogTitle></DialogHeader>
                <img src={selected.image_url} alt={selected.title} className="w-full max-h-[70vh] object-contain rounded" />
                {selected.description && <p className="text-sm text-muted-foreground">{selected.description}</p>}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(selected.created_at).toLocaleDateString()}</span>
                  {user?.id === selected.user_id && (
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(selected)} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-1" />Delete
                    </Button>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Pictures;
