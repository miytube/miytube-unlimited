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

  // Step 1: main category
  const [mainPickerOpen, setMainPickerOpen] = useState(false);
  const [mainSearch, setMainSearch] = useState('');
  const [mainSlug, setMainSlug] = useState<string>('');
  // Pending new main category typed by admin (not yet in DB)
  const [pendingMain, setPendingMain] = useState<ParentOption | null>(null);

  // Step 2: subcategory (pick existing or type new)
  const [subPickerOpen, setSubPickerOpen] = useState(false);
  const [subSearch, setSubSearch] = useState('');
  const [subName, setSubName] = useState<string>('');

  // Step 3: watch page names
  const [pageNames, setPageNames] = useState<string[]>([]);
  const [pageInput, setPageInput] = useState('');

  const [busy, setBusy] = useState(false);
  const [createdUrls, setCreatedUrls] = useState<{ url: string; name: string }[]>([]);

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
    const list = Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );
    if (pendingMain && !map.has(pendingMain.slug)) list.unshift(pendingMain);
    return list;
  }, [tree, pendingMain]);

  const filteredMains = useMemo(() => {
    const q = mainSearch.trim().toLowerCase();
    if (!q) return parentOptions;
    return parentOptions.filter(
      (o) => o.name.toLowerCase().includes(q) || o.slug.includes(q)
    );
  }, [parentOptions, mainSearch]);

  const selectedMain = parentOptions.find((o) => o.slug === mainSlug);

  // Existing subcategories under selected main
  const existingSubs = useMemo(() => {
    if (!selectedMain) return [] as { name: string; slug: string }[];
    const cat = tree.find((c) => c.slug === selectedMain.slug);
    if (!cat) return [];
    return cat.subcategories
      .map((s) => ({ name: s.name, slug: s.slug }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tree, selectedMain]);

  const filteredSubs = useMemo(() => {
    const q = subSearch.trim().toLowerCase();
    if (!q) return existingSubs;
    return existingSubs.filter((s) => s.name.toLowerCase().includes(q));
  }, [existingSubs, subSearch]);

  const reset = () => {
    setMainSlug('');
    setMainSearch('');
    setPendingMain(null);
    setSubName('');
    setSubSearch('');
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

  const ensureSubcategory = async (
    categoryId: string,
    name: string
  ): Promise<{ id: string; slug: string }> => {
    const slug = slugify(name);
    // Look up existing
    const { data: existing } = await supabase
      .from('custom_subcategories')
      .select('id, slug')
      .eq('category_id', categoryId)
      .eq('slug', slug)
      .maybeSingle();
    if (existing) return { id: existing.id, slug: existing.slug };
    const { data, error } = await supabase
      .from('custom_subcategories')
      .insert({ category_id: categoryId, name, slug })
      .select('id, slug')
      .single();
    if (error) throw error;
    return { id: data.id, slug: data.slug };
  };

  const handleCreate = async () => {
    if (!selectedMain) {
      toast({ title: 'Pick a main category', variant: 'destructive' });
      return;
    }
    if (!subName.trim()) {
      toast({ title: 'Pick or enter a sub-category', variant: 'destructive' });
      return;
    }
    const names = [...pageNames];
    if (pageInput.trim()) names.push(pageInput.trim());
    if (names.length === 0) {
      toast({ title: 'Add at least one watch page name', variant: 'destructive' });
      return;
    }
    setBusy(true);
    const results: { url: string; name: string }[] = [];
    const existed: string[] = [];
    try {
      const cat = await ensureCustomCategory(selectedMain);
      const sub = await ensureSubcategory(cat.id, subName.trim());
      for (const n of names) {
        const watchSlug = slugify(n);
        const { error } = await supabase
          .from('custom_watch_pages')
          .insert({ subcategory_id: sub.id, name: n, slug: watchSlug });
        if (error) {
          if ((error as any).code === '23505' || /duplicate key/i.test(error.message)) {
            existed.push(n);
            results.push({ url: `/c/${cat.slug}/${sub.slug}/${watchSlug}`, name: n });
            continue;
          }
          throw error;
        }
        results.push({ url: `/c/${cat.slug}/${sub.slug}/${watchSlug}`, name: n });
      }
      results.sort((a, b) => a.name.localeCompare(b.name));
      setCreatedUrls(results);
      const newCount = results.length - existed.length;
      toast({
        title:
          existed.length === results.length
            ? `Already exists under ${selectedMain.name} / ${subName}`
            : `Created ${newCount} watch ${newCount === 1 ? 'page' : 'pages'} under ${selectedMain.name} / ${subName}${existed.length ? ` (${existed.length} already existed)` : ''}`,
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
          <DialogTitle>Create Watch Page</DialogTitle>
          <DialogDescription>
            Pick a main category, then a sub-category, then add watch page name(s).
          </DialogDescription>
        </DialogHeader>

        {createdUrls.length > 0 ? (
          <div className="space-y-3 py-2">
            <p className="text-sm font-medium">Watch pages created:</p>
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
                              setSubName('');
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

            {/* Watch pages */}
            <div className="space-y-2">
              <Label>
                Watch Page {pageNames.length > 0 && `(${pageNames.length})`}
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

              <Input
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (pageInput.trim()) addPageName(pageInput);
                  }
                }}
                placeholder={
                  selectedMain
                    ? 'Type watch page name and press Enter…'
                    : 'Pick main category first'
                }
                disabled={!selectedMain}
              />
              <p className="text-xs text-muted-foreground">
                Press Enter to add. Click Create to save under{' '}
                {selectedMain ? <strong>{selectedMain.name}</strong> : 'main'} /{' '}
                {subName ? <strong>{subName}</strong> : 'sub'}.
              </p>
            </div>

            {/* Sub-category */}
            <div className="space-y-2">
              <Label>Sub-Category</Label>
              <Popover open={subPickerOpen} onOpenChange={setSubPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={!selectedMain}
                    className="w-full justify-between font-normal"
                  >
                    <span className="truncate text-left">
                      {subName
                        ? subName
                        : selectedMain
                          ? 'Pick existing or type new…'
                          : 'Pick main category first'}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <div className="p-2 border-b">
                    <Input
                      placeholder="Search or type a new sub-category…"
                      value={subSearch}
                      onChange={(e) => setSubSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && subSearch.trim()) {
                          e.preventDefault();
                          setSubName(subSearch.trim());
                          setSubPickerOpen(false);
                        }
                      }}
                      className="h-9"
                    />
                  </div>
                  <ScrollArea className="max-h-60">
                    <div className="p-1">
                      {subSearch.trim() &&
                        !filteredSubs.some(
                          (s) => s.name.toLowerCase() === subSearch.trim().toLowerCase()
                        ) && (
                          <button
                            onClick={() => {
                              setSubName(subSearch.trim());
                              setSubPickerOpen(false);
                            }}
                            className="flex items-center w-full px-2 py-2 text-sm rounded-sm hover:bg-accent text-left"
                          >
                            <Plus className="mr-2 h-4 w-4 shrink-0 opacity-60" />
                            Create "{subSearch.trim()}"
                          </button>
                        )}
                      {filteredSubs.map((s) => {
                        const checked = subName === s.name;
                        return (
                          <button
                            key={s.slug}
                            onClick={() => {
                              setSubName(s.name);
                              setSubPickerOpen(false);
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
                            <span className="flex-1 truncate">{s.name}</span>
                          </button>
                        );
                      })}
                      {!subSearch.trim() && filteredSubs.length === 0 && (
                        <div className="py-4 text-center text-xs text-muted-foreground">
                          No sub-categories yet — type a name above to create one.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={busy || !selectedMain || !subName}>
                {busy ? 'Creating…' : 'Create Watch Page'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
