import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

const ROOT = '__root__';
const NEW_CAT = '__new_cat__';
const NONE = '__none__';

export const QuickCreatePageWidget: React.FC = () => {
  const { isAdmin } = useAuth();
  const { tree, reload } = useCustomCategories(true);
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [pageType, setPageType] = useState<'subcategory' | 'watch'>('watch');
  const [parentCatId, setParentCatId] = useState<string>(ROOT);
  const [newParentName, setNewParentName] = useState('');
  const [parentSubId, setParentSubId] = useState<string>(NONE);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);

  if (!isAdmin) return null;

  const reset = () => {
    setName('');
    setNewParentName('');
    setParentCatId(ROOT);
    setParentSubId(NONE);
    setPageType('watch');
    setCreatedUrl(null);
  };

  const selectedCat = tree.find((c) => c.id === parentCatId);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({ title: 'Page name required', variant: 'destructive' });
      return;
    }
    setBusy(true);
    try {
      // Resolve / create parent category if needed
      let categoryId = parentCatId;
      let categorySlug = selectedCat?.slug || '';

      if (parentCatId === NEW_CAT || parentCatId === ROOT) {
        const catName =
          parentCatId === NEW_CAT ? newParentName.trim() : name.trim();
        if (parentCatId === NEW_CAT && !catName) {
          toast({ title: 'New category name required', variant: 'destructive' });
          setBusy(false);
          return;
        }
        // For ROOT + watch, we still need a parent — fall back to a "General" category
        const parentName = parentCatId === ROOT ? 'General' : catName;
        const parentSlug = slugify(parentName);
        const existing = tree.find((c) => c.slug === parentSlug);
        if (existing) {
          categoryId = existing.id;
          categorySlug = existing.slug;
        } else {
          const { data, error } = await supabase
            .from('custom_categories')
            .insert({ name: parentName, slug: parentSlug })
            .select()
            .single();
          if (error) throw error;
          categoryId = data.id;
          categorySlug = data.slug;
        }
      }

      // If creating a top-level subcategory page, the category itself is the page
      if (pageType === 'subcategory' && parentCatId === ROOT) {
        // Treat as creating a brand-new top-level category
        const slug = slugify(name);
        const { data, error } = await supabase
          .from('custom_categories')
          .insert({ name: name.trim(), slug })
          .select()
          .single();
        if (error) throw error;
        setCreatedUrl(`/c/${data.slug}`);
        toast({ title: 'Category page created' });
        reload();
        setBusy(false);
        return;
      }

      if (pageType === 'subcategory') {
        const slug = slugify(name);
        const { data, error } = await supabase
          .from('custom_subcategories')
          .insert({ category_id: categoryId, name: name.trim(), slug })
          .select()
          .single();
        if (error) throw error;
        setCreatedUrl(`/c/${categorySlug}/${data.slug}`);
        toast({ title: 'Sub-category page created' });
      } else {
        // watch page
        let subId = parentSubId;
        let subSlug = '';

        if (subId === NONE || !subId) {
          // Create or reuse a "General" subcategory under this category
          const reuse = selectedCat?.subcategories.find((s) => s.slug === 'general');
          if (reuse) {
            subId = reuse.id;
            subSlug = reuse.slug;
          } else {
            const { data, error } = await supabase
              .from('custom_subcategories')
              .insert({ category_id: categoryId, name: 'General', slug: 'general' })
              .select()
              .single();
            if (error) throw error;
            subId = data.id;
            subSlug = data.slug;
          }
        } else {
          subSlug =
            selectedCat?.subcategories.find((s) => s.id === subId)?.slug || '';
        }

        const slug = slugify(name);
        const { data, error } = await supabase
          .from('custom_watch_pages')
          .insert({ subcategory_id: subId, name: name.trim(), slug })
          .select()
          .single();
        if (error) throw error;
        setCreatedUrl(`/c/${categorySlug}/${subSlug}/${data.slug}`);
        toast({ title: 'Watch page created' });
      }

      reload();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create page',
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full h-12 px-4 gap-2"
          aria-label="Quick create page"
        >
          <Plus className="h-4 w-4" /> New Page
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Create Page</DialogTitle>
          <DialogDescription>
            Spin up a new sub-category or watch page anywhere on the site.
          </DialogDescription>
        </DialogHeader>

        {createdUrl ? (
          <div className="space-y-3 py-2">
            <p className="text-sm">Your page is live at:</p>
            <Link
              to={createdUrl}
              className="flex items-center gap-2 text-primary hover:underline"
              onClick={() => setOpen(false)}
            >
              <ExternalLink className="h-4 w-4" />
              <span className="font-mono text-sm break-all">{createdUrl}</span>
            </Link>
            <Button variant="outline" onClick={reset} className="w-full">
              Create another
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Page type</Label>
              <Select
                value={pageType}
                onValueChange={(v) => setPageType(v as 'subcategory' | 'watch')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="watch">
                    Watch page (just videos)
                  </SelectItem>
                  <SelectItem value="subcategory">
                    Sub-category page (can hold more pages)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Parent category</Label>
              <Select value={parentCatId} onValueChange={setParentCatId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ROOT}>
                    {pageType === 'subcategory'
                      ? 'None — make it top-level'
                      : 'None — put under "General"'}
                  </SelectItem>
                  {tree.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                  <SelectItem value={NEW_CAT}>+ Create new parent…</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {parentCatId === NEW_CAT && (
              <div className="space-y-2">
                <Label>New parent category name</Label>
                <Input
                  value={newParentName}
                  onChange={(e) => setNewParentName(e.target.value)}
                  placeholder="e.g. NBA Basketball"
                />
              </div>
            )}

            {pageType === 'watch' &&
              selectedCat &&
              selectedCat.subcategories.length > 0 && (
                <div className="space-y-2">
                  <Label>Sub-category (optional)</Label>
                  <Select value={parentSubId} onValueChange={setParentSubId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>
                        None — put under "General"
                      </SelectItem>
                      {selectedCat.subcategories.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

            <div className="space-y-2">
              <Label>Page name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Basketball Shoes"
                autoFocus
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={busy}>
                {busy ? 'Creating…' : 'Create page'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
