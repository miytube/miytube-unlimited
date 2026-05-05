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
import { Check, Plus, ExternalLink, ChevronsUpDown, X } from 'lucide-react';
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
  const [mainPickerOpen, setMainPickerOpen] = useState(false);
  const [mainSearch, setMainSearch] = useState('');
  const [mainSlug, setMainSlug] = useState<string>('');

  const [pageNames, setPageNames] = useState<string[]>([]);
  const [pageInput, setPageInput] = useState('');
  const [pagePickerOpen, setPagePickerOpen] = useState(false);

  const [busy, setBusy] = useState(false);
  const [createdUrls, setCreatedUrls] = useState<{ url: string; name: string }[]>([]);

  // Unified, alphabetized parent list
  const parentOptions = useMemo<ParentOption[]>(() => {
    const map = new Map<string, ParentOption>();
    Object.entries(allCategoryMappings).forEach(([slug, info]) => {
      if (info.parent) return;
      map.set(slug, { slug, name: info.title, source: 'hardcoded' });
    });
    tree.forEach((c) => {
      const existing = map.get(c.slug);
      if (existing) existing.customCategoryId = c.id;
      else map.set(c.slug, { slug: c.slug, name: c.name, source: 'custom', customCategoryId: c.id });
    });
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );
  }, [tree]);

  const filteredMains = useMemo(() => {
    const q = mainSearch.trim().toLowerCase();
    if (!q) return parentOptions;
    return parentOptions.filter(
      (o) => o.name.toLowerCase().includes(q) || o.slug.includes(q)
    );
  }, [parentOptions, mainSearch]);

  const selectedMain = parentOptions.find((o) => o.slug === mainSlug);

  // Existing pages already under selected main (as suggestions)
  const existingPages = useMemo(() => {
    if (!selectedMain) return [] as string[];
    const cat = tree.find((c) => c.slug === selectedMain.slug);
    if (!cat) return [];
    const names = new Set<string>();
    cat.subcategories.forEach((s) => {
      if (s.slug !== 'general') names.add(s.name);
      s.watch_pages.forEach((w) => names.add(w.name));
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [tree, selectedMain]);

  const filteredExisting = useMemo(() => {
    const q = pageInput.trim().toLowerCase();
    const list = existingPages.filter((n) => !pageNames.includes(n));
    if (!q) return list;
    return list.filter((n) => n.toLowerCase().includes(q));
  }, [existingPages, pageInput, pageNames]);

  const exactExists =
    pageInput.trim() &&
    (pageNames.includes(pageInput.trim()) ||
      existingPages.some((n) => n.toLowerCase() === pageInput.trim().toLowerCase()));

  const reset = () => {
    setMainSlug('');
    setMainSearch('');
    setPageNames([]);
    setPageInput('');
    setCreatedUrls([]);
  };

  const addPageName = (n: string) => {
    const trimmed = n.trim();
    if (!trimmed) return;
    if (!pageNames.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      setPageNames((prev) => [...prev, trimmed]);
    }
    setPageInput('');
  };

  const removePageName = (n: string) =>
    setPageNames((prev) => prev.filter((p) => p !== n));

  const ensureCustomCategory = async (
    opt: ParentOption
  ): Promise<{ id: string; slug: string }> => {
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
    if (!selectedMain) {
      toast({ title: 'Pick a main category', variant: 'destructive' });
      return;
    }
    const names = [...pageNames];
    if (pageInput.trim()) names.push(pageInput.trim());
    if (names.length === 0) {
      toast({ title: 'Add at least one page name', variant: 'destructive' });
      return;
    }
    setBusy(true);
    const results: { url: string; name: string }[] = [];
    try {
      const cat = await ensureCustomCategory(selectedMain);
      const sub = await ensureGeneralSub(cat.id);
      for (const n of names) {
        const pageSlug = slugify(n);
        const { data, error } = await supabase
          .from('custom_watch_pages')
          .insert({ subcategory_id: sub.id, name: n, slug: pageSlug })
          .select('slug')
          .single();
        if (error) throw error;
        results.push({ url: `/c/${cat.slug}/${sub.slug}/${data.slug}`, name: n });
      }
      setCreatedUrls(results);
      toast({
        title: `Created ${results.length} ${results.length === 1 ? 'page' : 'pages'} under ${selectedMain.name}`,
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
            Pick a main category, then add one or more page names to save under it.
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
                    <div className="text-xs text-muted-foreground">{r.name}</div>
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
            {/* Main Category */}
            <div className="space-y-2">
              <Label>Main Category</Label>
              <Popover open={mainPickerOpen} onOpenChange={setMainPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    <span className="truncate text-left">
                      {selectedMain ? selectedMain.name : 'Select main category…'}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <div className="p-2 border-b">
                    <Input
                      placeholder="Search…"
                      value={mainSearch}
                      onChange={(e) => setMainSearch(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <ScrollArea className="h-72">
                    <div className="p-1">
                      {filteredMains.length === 0 && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          No categories found.
                        </div>
                      )}
                      {filteredMains.map((opt) => {
                        const checked = mainSlug === opt.slug;
                        return (
                          <button
                            key={opt.slug}
                            onClick={() => {
                              setMainSlug(opt.slug);
                              setMainPickerOpen(false);
                            }}
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
            </div>

            {/* Pages / Categories under the main */}
            <div className="space-y-2">
              <Label>
                Categories / Pages {pageNames.length > 0 && `(${pageNames.length})`}
              </Label>

              {pageNames.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {pageNames.map((n) => (
                    <span
                      key={n}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs"
                    >
                      {n}
                      <button
                        onClick={() => removePageName(n)}
                        className="hover:text-destructive"
                        aria-label={`Remove ${n}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <Popover open={pagePickerOpen} onOpenChange={setPagePickerOpen}>
                <PopoverTrigger asChild>
                  <Input
                    value={pageInput}
                    onChange={(e) => {
                      setPageInput(e.target.value);
                      setPagePickerOpen(true);
                    }}
                    onFocus={() => setPagePickerOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (pageInput.trim() && !exactExists) addPageName(pageInput);
                      }
                    }}
                    placeholder={
                      selectedMain
                        ? 'Type a name and press Enter to add…'
                        : 'Pick a main category first'
                    }
                    disabled={!selectedMain}
                  />
                </PopoverTrigger>
                {selectedMain && (filteredExisting.length > 0 || pageInput.trim()) && (
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <ScrollArea className="max-h-60">
                      <div className="p-1">
                        {filteredExisting.map((n) => (
                          <button
                            key={n}
                            onClick={() => addPageName(n)}
                            className="flex items-center w-full px-2 py-2 text-sm rounded-sm hover:bg-accent text-left"
                          >
                            <Plus className="mr-2 h-4 w-4 shrink-0 opacity-60" />
                            <span className="flex-1 truncate">{n}</span>
                            <span className="text-xs text-muted-foreground ml-2">existing</span>
                          </button>
                        ))}
                        {pageInput.trim() && !exactExists && (
                          <button
                            onClick={() => addPageName(pageInput)}
                            className="flex items-center w-full px-2 py-2 text-sm rounded-sm hover:bg-accent text-left text-primary font-medium"
                          >
                            <Plus className="mr-2 h-4 w-4 shrink-0" />
                            Add "{pageInput.trim()}"
                          </button>
                        )}
                        {filteredExisting.length === 0 && !pageInput.trim() && (
                          <div className="py-4 text-center text-xs text-muted-foreground">
                            Type to add a new page
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                )}
              </Popover>
              <p className="text-xs text-muted-foreground">
                Type any name and press Enter (or click "Add") to save it under{' '}
                {selectedMain ? <strong>{selectedMain.name}</strong> : 'the main category'}.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={busy || !selectedMain}>
                {busy ? 'Creating…' : 'Create'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
