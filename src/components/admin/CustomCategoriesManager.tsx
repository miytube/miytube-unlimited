import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

export const CustomCategoriesManager: React.FC = () => {
  const { user } = useAuth();
  const { tree, loading, reload } = useCustomCategories(true);
  const { toast } = useToast();

  const [newCat, setNewCat] = useState({ name: '', description: '' });
  const [newSubName, setNewSubName] = useState<Record<string, string>>({});
  const [newWatchName, setNewWatchName] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [expandedSub, setExpandedSub] = useState<Record<string, boolean>>({});

  const addCategory = async () => {
    if (!newCat.name.trim()) return;
    const { error } = await supabase.from('custom_categories').insert({
      name: newCat.name.trim(),
      slug: slugify(newCat.name),
      description: newCat.description.trim() || null,
      created_by: user?.id,
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    setNewCat({ name: '', description: '' });
    toast({ title: 'Category created' });
    reload();
  };

  const addSubcategory = async (categoryId: string) => {
    const name = newSubName[categoryId]?.trim();
    if (!name) return;
    const { error } = await supabase.from('custom_subcategories').insert({
      category_id: categoryId,
      name,
      slug: slugify(name),
      created_by: user?.id,
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    setNewSubName((p) => ({ ...p, [categoryId]: '' }));
    toast({ title: 'Subcategory added' });
    reload();
  };

  const addWatchPage = async (subcategoryId: string) => {
    const name = newWatchName[subcategoryId]?.trim();
    if (!name) return;
    const { error } = await supabase.from('custom_watch_pages').insert({
      subcategory_id: subcategoryId,
      name,
      slug: slugify(name),
      created_by: user?.id,
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    setNewWatchName((p) => ({ ...p, [subcategoryId]: '' }));
    toast({ title: 'Watch page added' });
    reload();
  };

  const remove = async (table: 'custom_categories' | 'custom_subcategories' | 'custom_watch_pages', id: string) => {
    if (!confirm('Delete this entry? Children will be removed too.')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Deleted' });
    reload();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Custom Category</CardTitle>
          <CardDescription>
            Build category → subcategory → watch page hierarchies that appear in the sidebar and
            generate live routes sitewide.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Category name (e.g. 'Drone Racing')"
            value={newCat.name}
            onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
          />
          <Textarea
            placeholder="Description (optional)"
            value={newCat.description}
            onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
          />
          <Button onClick={addCategory}>
            <Plus className="h-4 w-4 mr-1" /> Add Category
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Custom Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : tree.length === 0 ? (
            <p className="text-sm text-muted-foreground">No custom categories yet.</p>
          ) : (
            <div className="space-y-3">
              {tree.map((cat) => (
                <div key={cat.id} className="border rounded-lg">
                  <div className="flex items-center justify-between p-3 bg-muted/30">
                    <button
                      onClick={() =>
                        setExpanded((p) => ({ ...p, [cat.id]: !p[cat.id] }))
                      }
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      {expanded[cat.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span className="font-medium">{cat.name}</span>
                      <Badge variant="outline" className="text-xs">/c/{cat.slug}</Badge>
                      {!cat.is_active && <Badge variant="secondary">inactive</Badge>}
                    </button>
                    <div className="flex items-center gap-1">
                      <Link to={`/c/${cat.slug}`} target="_blank">
                        <Button variant="ghost" size="icon"><ExternalLink className="h-4 w-4" /></Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove('custom_categories', cat.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {expanded[cat.id] && (
                    <div className="p-3 space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="New subcategory name"
                          value={newSubName[cat.id] || ''}
                          onChange={(e) =>
                            setNewSubName((p) => ({ ...p, [cat.id]: e.target.value }))
                          }
                        />
                        <Button onClick={() => addSubcategory(cat.id)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2 pl-2">
                        {cat.subcategories.map((sub) => (
                          <div key={sub.id} className="border rounded-md">
                            <div className="flex items-center justify-between p-2">
                              <button
                                onClick={() =>
                                  setExpandedSub((p) => ({ ...p, [sub.id]: !p[sub.id] }))
                                }
                                className="flex items-center gap-2 flex-1 text-left"
                              >
                                {expandedSub[sub.id] ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )}
                                <span className="text-sm">{sub.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  /{sub.slug}
                                </Badge>
                              </button>
                              <div className="flex items-center gap-1">
                                <Link to={`/c/${cat.slug}/${sub.slug}`} target="_blank">
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => remove('custom_subcategories', sub.id)}
                                >
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              </div>
                            </div>

                            {expandedSub[sub.id] && (
                              <div className="p-2 pl-4 space-y-2 border-t">
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="New watch page name"
                                    className="h-8 text-sm"
                                    value={newWatchName[sub.id] || ''}
                                    onChange={(e) =>
                                      setNewWatchName((p) => ({
                                        ...p,
                                        [sub.id]: e.target.value,
                                      }))
                                    }
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => addWatchPage(sub.id)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                {sub.watch_pages.map((w) => (
                                  <div
                                    key={w.id}
                                    className="flex items-center justify-between p-1.5 bg-muted/30 rounded"
                                  >
                                    <div className="flex items-center gap-2 text-sm">
                                      <span>{w.name}</span>
                                      <Badge variant="outline" className="text-xs">
                                        /{w.slug}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Link
                                        to={`/c/${cat.slug}/${sub.slug}/${w.slug}`}
                                        target="_blank"
                                      >
                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                          <ExternalLink className="h-3 w-3" />
                                        </Button>
                                      </Link>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => remove('custom_watch_pages', w.id)}
                                      >
                                        <Trash2 className="h-3 w-3 text-destructive" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
