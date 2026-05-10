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
import { getSidebarMainCategoryRoute, sidebarMainCategoryOptions } from '@/data/sidebarMainCategories';

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
  const [pendingMain, setPendingMain] = useState<ParentOption | null>(null);

  // Step 2: page names (each becomes one sub-category page)
  const [pageNames, setPageNames] = useState<string[]>([]);
  const [pageInput, setPageInput] = useState('');
  const [subPickerOpen, setSubPickerOpen] = useState(false);
  const [subSearch, setSubSearch] = useState('');

  const [busy, setBusy] = useState(false);
  const [createdUrls, setCreatedUrls] = useState<{ url: string; name: string }[]>([]);

  const parentOptions = useMemo<ParentOption[]>(() => {
    const map = new Map<string, ParentOption>();
    sidebarMainCategoryOptions.forEach((option) => {
      map.set(option.slug, { slug: option.slug, name: option.name, source: 'hardcoded' });
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

  // Existing sub-categories under the selected main (for the step-2 dropdown)
  const existingSubs = useMemo(() => {
    if (!selectedMain) return [] as { name: string; slug: string }[];
    const cat = tree.find((c) => c.slug === selectedMain.slug);
    if (!cat) return [];
    return cat.subcategories.map((s) => ({ name: s.name, slug: s.slug }));
  }, [tree, selectedMain]);

  const filteredSubs = useMemo(() => {
    const q = subSearch.trim().toLowerCase();
    if (!q) return existingSubs;
    return existingSubs.filter(
      (s) => s.name.toLowerCase().includes(q) || s.slug.includes(q)
    );
  }, [existingSubs, subSearch]);

  const reset = () => {
    setMainSlug('');
    setMainSearch('');
    setPendingMain(null);
    setPageNames([]);
    setPageInput('');
    setSubSearch('');
    setCreatedUrls([]);
  };

  const addPageName = (n: string) => {
    const trimmed = n.trim();
    if (!trimmed) return;
    const slug = slugify(trimmed);
    if (!pageNames.some((p) => slugify(p) === slug || p.toLowerCase() === trimmed.toLowerCase())) {
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
    // Look up by slug first to avoid creating a duplicate of an existing category
    const { data: existing } = await supabase
      .from('custom_categories')
      .select('id, slug')
      .eq('slug', opt.slug)
      .maybeSingle();
    if (existing) return { id: existing.id, slug: existing.slug };
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
  ): Promise<{ id: string; slug: string; existed: boolean }> => {
    const slug = slugify(name);
    const { data: existing } = await supabase
      .from('custom_subcategories')
      .select('id, slug')
      .eq('category_id', categoryId)
      .eq('slug', slug)
      .maybeSingle();
    if (existing) return { id: existing.id, slug: existing.slug, existed: true };
    const { data, error } = await supabase
      .from('custom_subcategories')
      .insert({ category_id: categoryId, name, slug })
      .select('id, slug')
      .single();
    if (error) throw error;
    return { id: data.id, slug: data.slug, existed: false };
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
    const existed: string[] = [];
    try {
      const cat = await ensureCustomCategory(selectedMain);
      for (const n of names) {
        // Each name creates or reuses one sub-category page. Do not create a
        // duplicate watch-page row with the exact same slug as its sub-category.
        const sub = await ensureSubcategory(cat.id, n);
        const baseUrl = getSidebarMainCategoryRoute(cat.slug)
          ? `${getSidebarMainCategoryRoute(cat.slug)}/${sub.slug}`
          : `/c/${cat.slug}/${sub.slug}`;
        if (sub.existed) existed.push(n);
        results.push({ url: baseUrl, name: n });
      }
      results.sort((a, b) => a.name.localeCompare(b.name));
      setCreatedUrls(results);
      const newCount = results.length - existed.length;
      toast({
        title:
          existed.length === results.length
            ? `Already exists under ${selectedMain.name}`
            : `Created ${newCount} ${newCount === 1 ? 'page' : 'pages'} under ${selectedMain.name}${existed.length ? ` (${existed.length} already existed)` : ''}`,
      });
      reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create page';
      toast({
        title: 'Error',
        description: message,
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
            Select an existing main category from the list. Only create a new main category if it's not already there. Step 2 creates the sub-category page.
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
            {/* Step 1: Main Category */}
            <div className="space-y-2">
              <Label>1. Main Category (pick existing — only create new if missing)</Label>
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
                      {(() => {
                        const q = mainSearch.trim();
                        const exists =
                          q &&
                          filteredMains.some(
                            (o) => o.name.toLowerCase() === q.toLowerCase()
                          );
                        if (q && !exists) {
                          return (
                            <div className="px-2 py-2 border-b mb-1">
                              <p className="text-[11px] text-muted-foreground mb-1.5">
                                Not in the list? Create it as a new main category:
                              </p>
                              <button
                                onClick={() => {
                                  const slug = slugify(q);
                                  if (!slug) return;
                                  const newOpt: ParentOption = {
                                    slug,
                                    name: q,
                                    source: 'custom',
                                  };
                                  setPendingMain(newOpt);
                                  setMainSlug(slug);
                                  setMainPickerOpen(false);
                                }}
                                className="flex items-center w-full px-2 py-2 text-sm rounded-sm hover:bg-accent text-left border border-dashed"
                              >
                                <Plus className="mr-2 h-4 w-4 shrink-0 opacity-60" />
                                Create new main category "{q}"
                              </button>
                            </div>
                          );
                        }
                        return null;
                      })()}
                      {filteredMains.length === 0 && !mainSearch.trim() && (
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
                            {opt.source === 'custom' && !opt.customCategoryId && (
                              <span className="ml-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                                new
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>

            {/* Step 2: Page name(s) */}
            <div className="space-y-2">
              <Label>
                2. Sub-Category Page {pageNames.length > 0 && `(${pageNames.length})`}
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

              <Popover
                open={subPickerOpen && !!selectedMain}
                onOpenChange={(o) => setSubPickerOpen(o && !!selectedMain)}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={!selectedMain}
                    className="w-full justify-between font-normal"
                  >
                    <span className="truncate text-left text-muted-foreground">
                      {selectedMain
                        ? 'Pick existing sub-category or type a new one…'
                        : 'Pick main category first'}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <div className="p-2 border-b">
                    <Input
                      placeholder="Search or type new name…"
                      value={subSearch}
                      onChange={(e) => setSubSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const q = subSearch.trim();
                          if (!q) return;
                          const slug = slugify(q);
                          const dupe = existingSubs.some(
                            (s) => s.slug === slug || s.name.toLowerCase() === q.toLowerCase()
                          );
                          if (dupe) {
                            toast({
                              title: 'Already exists',
                              description: `"${q}" already exists under ${selectedMain?.name}.`,
                            });
                            return;
                          }
                          addPageName(q);
                          setSubSearch('');
                        }
                      }}
                      className="h-9"
                    />
                  </div>
                  <ScrollArea className="h-72">
                    <div className="p-1">
                      {(() => {
                        const q = subSearch.trim();
                        const slug = slugify(q);
                        const dupeExisting = q && existingSubs.some(
                          (s) => s.slug === slug || s.name.toLowerCase() === q.toLowerCase()
                        );
                        const dupePending = q && pageNames.some(
                          (n) => n.toLowerCase() === q.toLowerCase()
                        );
                        if (q && !dupeExisting && !dupePending) {
                          return (
                            <div className="px-2 py-2 border-b mb-1">
                              <p className="text-[11px] text-muted-foreground mb-1.5">
                                Not in the list? Create it as a new sub-category:
                              </p>
                              <button
                                onClick={() => {
                                  addPageName(q);
                                  setSubSearch('');
                                }}
                                className="flex items-center w-full px-2 py-2 text-sm rounded-sm hover:bg-accent text-left border border-dashed"
                              >
                                <Plus className="mr-2 h-4 w-4 shrink-0 opacity-60" />
                                Create new sub-category "{q}"
                              </button>
                            </div>
                          );
                        }
                        if (q && dupeExisting) {
                          return (
                            <div className="px-2 py-2 text-xs text-muted-foreground border-b mb-1">
                              "{q}" already exists under {selectedMain?.name}.
                            </div>
                          );
                        }
                        return null;
                      })()}
                      {existingSubs.length === 0 && !subSearch.trim() && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          No sub-categories yet. Type a name above to create one.
                        </div>
                      )}
                      {filteredSubs.map((s) => {
                        const alreadyQueued = pageNames.some(
                          (n) => slugify(n) === s.slug
                        );
                        return (
                          <div
                            key={s.slug}
                            className="flex items-center w-full px-2 py-2 text-sm rounded-sm text-left text-muted-foreground"
                          >
                            <Check className="mr-2 h-4 w-4 shrink-0 opacity-60" />
                            <span className="flex-1 truncate">{s.name}</span>
                            <span className="ml-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                              {alreadyQueued ? 'queued' : 'exists'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Existing sub-categories are shown so you don't create duplicates. Type a new name and press Enter to add it under{' '}
                {selectedMain ? <strong>{selectedMain.name}</strong> : 'main'}.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={
                  busy || !selectedMain || (pageNames.length === 0 && !pageInput.trim())
                }
              >
                {busy ? 'Creating…' : 'Create'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
