import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { FileText, Upload, Download, Loader2, Trash2, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DOC_CATEGORIES = ['All', 'Business', 'Education', 'Legal', 'Financial', 'Medical', 'Research', 'Templates', 'Guides', 'Reports', 'Presentations', 'Other'];

interface Doc {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  category: string | null;
  downloads: number;
  created_at: string;
  user_id: string;
}

const formatBytes = (b: number | null) => {
  if (!b) return '—';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
};

const Documents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Business');
  const [file, setFile] = useState<File | null>(null);
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('documents')
      .select('id, title, description, file_url, file_name, file_type, file_size, category, downloads, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(200);
    setDocs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    if (!file || !title.trim()) {
      toast({ title: 'Title and file required', variant: 'destructive' });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 50MB', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'bin';
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('documents').upload(path, file, { contentType: file.type || 'application/octet-stream' });
      if (upErr) throw upErr;
      const url = supabase.storage.from('documents').getPublicUrl(path).data.publicUrl;

      const { error: insErr } = await supabase.from('documents').insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        file_url: url,
        file_name: file.name,
        file_type: ext.toUpperCase(),
        file_size: file.size,
        category,
      });
      if (insErr) throw insErr;

      toast({ title: 'Document uploaded!' });
      setOpen(false);
      setTitle(''); setDescription(''); setFile(null); setCategory('Business');
      fetch();
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: Doc) => {
    window.open(doc.file_url, '_blank');
    await supabase.from('documents').update({ downloads: doc.downloads + 1 }).eq('id', doc.id);
  };

  const handleDelete = async (doc: Doc) => {
    if (!confirm('Delete this document?')) return;
    const { error } = await supabase.from('documents').delete().eq('id', doc.id);
    if (error) { toast({ title: 'Delete failed', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Document deleted' });
    fetch();
  };

  const filtered = docs.filter((d) => {
    const matchCat = activeCat === 'All' || d.category === activeCat;
    const matchSearch = !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.file_name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <Link to="/" className="font-semibold text-primary">MiyTube</Link> / Documents
        </p>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">MiyTube Documents</h1>
              <p className="text-sm text-muted-foreground">Upload and download community documents</p>
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full"><Upload className="mr-2 h-4 w-4" />Upload Document</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4">
                <div><Label>Title *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} required /></div>
                <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} /></div>
                <div>
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DOC_CATEGORIES.filter(c => c !== 'All').map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>File (PDF, DOC, XLS, PPT, TXT… max 50MB) *</Label>
                  <Input type="file" accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.odt,.csv,.rtf" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
                </div>
                <Button type="submit" disabled={uploading} className="w-full">
                  {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  {uploading ? 'Uploading…' : 'Upload'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search documents…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {DOC_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeCat === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No documents yet</h3>
            <p className="text-muted-foreground">Be the first to upload!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 p-4 bg-card rounded-lg hover:bg-accent/50 transition-colors">
                <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold truncate">{doc.title}</h3>
                  {doc.description && <p className="text-sm text-muted-foreground truncate">{doc.description}</p>}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{doc.file_type}</span>
                    <span>{formatBytes(doc.file_size)}</span>
                    {doc.category && <span className="px-2 py-0.5 rounded-full bg-secondary">{doc.category}</span>}
                    <span>{doc.downloads} downloads</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
                  <Download className="h-4 w-4 mr-1" />Download
                </Button>
                {user?.id === doc.user_id && (
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(doc)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Documents;
