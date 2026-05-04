import React, { useMemo, useState } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Plus, ExternalLink, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { allCategoryMappings } from '@/data/allCategoryMappings';

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

type ParentOption = {
  slug: string;
  name: string;
  source: 'hardcoded' | 'custom';
  customCategoryId?: string;
};

export const QuickCreatePageWidget: React.FC = () => {
  const { isAdmin } = useAuth();
  const { tree, reload } = useCustomCategories(true);
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [createdUrls, setCreatedUrls] = useState<{ url: string; parent: string }[]>([]);

  // Unified, alphabetized parent list: top-level hardcoded categories + custom categories
  const parentOptions = useMemo<ParentOption[]>(() => {
    const map = new Map<string, ParentOption>();

    Object.entries(allCategoryMappings).forEach(([slug, info]) => {
      if (info.parent) return; // only top-level
      map.set(slug, { slug, name: info.title, source: 'hardcoded' });
    });

    tree.forEach((c) => {
      const existing = map.get(c.slug);
      if (existing) {
        existing.customCategoryId = c.id;
      } else {
        map.set(c.slug, {
          slug: c.slug,
          name: c.name,
          source: 'custom',
          customCategoryId: c.id,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );
  }, [tree]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return parentOptions;
    return parentOptions.filter(
      (o) => o.name.toLowerCase().includes(q) || o.slug.includes(q)
    );
  }, [parentOptions, search]);

  const reset = () => {
    setName('');
    setSearch('');
    setSelectedSlugs([]);
    setCreatedUrls([]);
  };

  const toggleSlug = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const ensureCustomCategory = async (opt: ParentOption): Promise<{ id: string; slug: string }> => {
    if (opt.customCategoryId) return { id: opt.customCategoryId, slug: opt.slug };
    const { data, error } = await supabase
      .from('custom_categories')
      .insert({ name: opt.name, slug: opt.slug })
      .select()
      .single();
    if (error) throw error;
    return { id: data.id, slug: data.slug };
  };

  const ensureGeneralSub = async (categoryId: string): Promise<{ id: string; slug: string }> => {
    const { data: existing } = await supabase
      .from('custom_subcategories')
      .select('id, slug')
      .eq('category_id', categoryId)
      .eq('slug', 'general')
      .maybeSingle();
    if (existing) return existing;
    const { data, error } = await supabase
      .from('custom_subcategories')
      .insert({ category_id: categoryId, name: 'General', slug: 'general' })
      .select('id, slug')
      .single();
    if (error) throw error;
    return data;
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({ title: 'Page name required', variant: 'destructive' });
      return;
    }
    if (selectedSlugs.length === 0) {
      toast({ title: 'Pick at least one category', variant: 'destructive' });
      return;
    }
    setBusy(true);
    const results: { url: string; parent: string }[] = [];
    try {
      const pageSlug = slugify(name);
      for (const slug of selectedSlugs) {
        const opt = parentOptions.find((o) => o.slug === slug);
        if (!opt) continue;
        const cat = await ensureCustomCategory(opt);
        const sub = await ensureGeneralSub(cat.id);
        const { data, error } = await supabase
          .from('custom_watch_pages')
          .insert({ subcategory_id: sub.id, name: name.trim(), slug: pageSlug })
          .select('slug')
          .single();
        if (error) throw error;
        results.push({
          url: `/c/${cat.slug}/${sub.slug}/${data.slug}`,
          parent: opt.name,
        });
      }
      setCreatedUrls(results);
      toast({
        title: `Page created in ${results.length} ${results.length === 1 ? 'category' : 'categories'}`,
      });
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

  if (!isAdmin) return null;

  const selectedNames = parentOptions
    .filter((o) => selectedSlugs.includes(o.slug))
    .map((o) => o.name);

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
          aria-label="Create page"
        >
          <Plus className="h-4 w-4" /> Create Page
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Page</DialogTitle>
          <DialogDescription>
            Pick one or more categories, name the page, and it'll be saved and
            listed alphabetically under each.
          </DialogDescription>
        </DialogHeader>

        {createdUrls.length > 0 ? (
          <div className="space-y-3 py-2">
            <p className="text-sm font-medium">Pages created:</p>
            <div className="space-y-2">
              {createdUrls.map((r) => (
                <Link
                  key={r.url}
                  to={r.url}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">{r.parent}</div>
                    <div className="font-mono text-xs break-all">{r.url}</div>
                  </div>
                </Link>
              ))}
            </div>
            <Button variant="outline" onClick={reset} className="w-full">
              Create another
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Page name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. NBA Playoffs 2025-2026"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label>Categories ({selectedSlugs.length} selected)</Label>
              <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    <span className="truncate text-left">
                      {selectedNames.length === 0
                        ? 'Select categories…'
                        : selectedNames.join(', ')}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <div className="p-2 border-b">
                    <Input
                      placeholder="Search categories…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <ScrollArea className="h-72">
                    <div className="p-1">
                      {filtered.length === 0 && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          No categories found.
                        </div>
                      )}
                      {filtered.map((opt) => {
                        const checked = selectedSlugs.includes(opt.slug);
                        return (
                          <button
                            key={opt.slug}
                            onClick={() => toggleSlug(opt.slug)}
                            className={cn(
                              'flex items-center w-full px-2 py-2 text-sm rounded-sm hover:bg-accent text-left',
                              checked && 'bg-accent'
                            )}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4 shrink-0',
                                checked ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            <span className="flex-1 truncate">{opt.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Pick multiple to save the same page under several categories.
              </p>
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
