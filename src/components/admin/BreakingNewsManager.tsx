import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, AlertTriangle, Newspaper } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string | null;
  source: string | null;
  source_url: string | null;
  category: string | null;
  is_active: boolean;
  is_breaking: boolean;
  priority: number;
  created_at: string;
  expires_at: string | null;
}

const NEWS_CATEGORIES = [
  'general',
  'entertainment',
  'sports',
  'politics',
  'technology',
  'business',
  'science',
  'health',
];

export const BreakingNewsManager = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    source: '',
    source_url: '',
    category: 'general',
    is_active: true,
    is_breaking: false,
    priority: 0,
    expires_at: '',
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('breaking_news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch news', variant: 'destructive' });
    } else {
      setNews(data || []);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      source: '',
      source_url: '',
      category: 'general',
      is_active: true,
      is_breaking: false,
      priority: 0,
      expires_at: '',
    });
    setEditingNews(null);
  };

  const openEditDialog = (item: NewsItem) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      content: item.content || '',
      source: item.source || '',
      source_url: item.source_url || '',
      category: item.category || 'general',
      is_active: item.is_active,
      is_breaking: item.is_breaking,
      priority: item.priority,
      expires_at: item.expires_at ? item.expires_at.slice(0, 16) : '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({ title: 'Error', description: 'Title is required', variant: 'destructive' });
      return;
    }

    const payload = {
      title: formData.title.trim(),
      content: formData.content.trim() || null,
      source: formData.source.trim() || null,
      source_url: formData.source_url.trim() || null,
      category: formData.category,
      is_active: formData.is_active,
      is_breaking: formData.is_breaking,
      priority: formData.priority,
      expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
    };

    if (editingNews) {
      const { error } = await supabase
        .from('breaking_news')
        .update(payload)
        .eq('id', editingNews.id);

      if (error) {
        toast({ title: 'Error', description: 'Failed to update news', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'News updated successfully' });
        fetchNews();
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('breaking_news')
        .insert(payload);

      if (error) {
        toast({ title: 'Error', description: 'Failed to create news', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'News created successfully' });
        fetchNews();
        setIsDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    const { error } = await supabase
      .from('breaking_news')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete news', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'News deleted successfully' });
      fetchNews();
    }
  };

  const toggleActive = async (item: NewsItem) => {
    const { error } = await supabase
      .from('breaking_news')
      .update({ is_active: !item.is_active })
      .eq('id', item.id);

    if (!error) {
      fetchNews();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Breaking News Manager
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add News
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingNews ? 'Edit News' : 'Add Breaking News'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Breaking news headline..."
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Additional details..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="CNN, BBC, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="source_url">Source URL</Label>
                  <Input
                    id="source_url"
                    value={formData.source_url}
                    onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {NEWS_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority (0-10)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min={0}
                    max={10}
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="expires_at">Expires At (optional)</Label>
                <Input
                  id="expires_at"
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_breaking"
                    checked={formData.is_breaking}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_breaking: checked })}
                  />
                  <Label htmlFor="is_breaking" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Breaking
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>{editingNews ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : news.length === 0 ? (
          <p className="text-muted-foreground">No news items yet. Click "Add News" to create one.</p>
        ) : (
          <div className="space-y-3">
            {news.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg border flex items-center justify-between gap-4 ${
                  !item.is_active ? 'opacity-50' : ''
                } ${item.is_breaking ? 'border-destructive/50 bg-destructive/5' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {item.is_breaking && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    <span className="font-medium truncate">{item.title}</span>
                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.source && <span>{item.source} • </span>}
                    Priority: {item.priority}
                    {item.expires_at && ` • Expires: ${new Date(item.expires_at).toLocaleDateString()}`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.is_active}
                    onCheckedChange={() => toggleActive(item)}
                  />
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
