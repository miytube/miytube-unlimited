import React, { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CategoryCombobox } from '@/components/upload/CategoryCombobox';
import { TagInput } from '@/components/upload/TagInput';
import { allCategoryMappings } from '@/data/allCategoryMappings';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { normalizeCategoryValue } from '@/utils/normalizeCategory';

interface VideoEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: {
    id: string;
    title: string;
    description: string;
    category?: string;
    subcategory?: string;
    tags?: string[];
  };
  onSave: (updates: {
    title: string;
    description: string;
    category?: string;
    subcategory?: string;
    tags: string[];
  }) => void;
}

export const VideoEditDialog: React.FC<VideoEditDialogProps> = ({
  open,
  onOpenChange,
  video,
  onSave,
}) => {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [category, setCategory] = useState(normalizeCategoryValue(video.category) || '');
  const [subcategory, setSubcategory] = useState(normalizeCategoryValue(video.subcategory) || '');
  const [tags, setTags] = useState<string[]>(video.tags || []);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [customSubcategories, setCustomSubcategories] = useState<string[]>([]);

  const { tree: customTree } = useCustomCategories();

  useEffect(() => {
    if (!open) return;
    setTitle(video.title);
    setDescription(video.description);
    setCategory(normalizeCategoryValue(video.category) || '');
    setSubcategory(normalizeCategoryValue(video.subcategory) || '');
    setTags(video.tags || []);
  }, [open, video.id, video.title, video.description, video.category, video.subcategory, video.tags]);

  const categoryOptions = useMemo(() => {
    // Get main categories (those without a parent)
    const baseCategories = Object.entries(allCategoryMappings)
      .filter(([_, info]) => !info.parent)
      .map(([key, info]) => ({
        id: key,
        name: info.title
      }));
    const fromDb = customTree.map(c => ({ id: c.slug, name: c.name }));
    const custom = customCategories.map(c => ({ id: c.toLowerCase().replace(/\s+/g, '-'), name: c }));
    // De-duplicate by id, prefer DB names
    const merged = new Map<string, { id: string; name: string }>();
    [...baseCategories, ...fromDb, ...custom].forEach(o => {
      if (!merged.has(o.id)) merged.set(o.id, o);
    });
    return Array.from(merged.values());
  }, [customCategories, customTree]);

  const subcategoryOptions = useMemo(() => {
    // Get subcategories that have the selected category as parent
    const baseSubcats = Object.entries(allCategoryMappings)
      .filter(([_, info]) => info.parent?.route === `/${category}`)
      .map(([key, info]) => ({
        id: key,
        name: info.title
      }));
    const dbCat = customTree.find(c => c.slug === category);
    const fromDb = (dbCat?.subcategories || []).map(s => ({ id: s.slug, name: s.name }));
    const custom = customSubcategories.map(c => ({ id: c.toLowerCase().replace(/\s+/g, '-'), name: c }));
    const merged = new Map<string, { id: string; name: string }>();
    [...baseSubcats, ...fromDb, ...custom].forEach(o => {
      if (!merged.has(o.id)) merged.set(o.id, o);
    });
    return Array.from(merged.values());
  }, [category, customSubcategories, customTree]);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setSubcategory('');
  };

  const handleAddCustomCategory = (name: string) => {
    setCustomCategories(prev => [...prev, name]);
  };

  const handleAddCustomSubcategory = (name: string) => {
    setCustomSubcategories(prev => [...prev, name]);
  };

  const handleSave = () => {
    onSave({
      title,
      description,
      category: normalizeCategoryValue(category) || undefined,
      subcategory: normalizeCategoryValue(subcategory) || undefined,
      tags,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Video</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Video description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Category</Label>
            <CategoryCombobox
              options={categoryOptions}
              value={category}
              onValueChange={handleCategoryChange}
              placeholder="Select or enter category"
              onAddCustom={handleAddCustomCategory}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Subcategory</Label>
            <CategoryCombobox
              options={subcategoryOptions}
              value={subcategory}
              onValueChange={setSubcategory}
              placeholder="Select or enter subcategory"
              onAddCustom={handleAddCustomSubcategory}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Tags</Label>
            <TagInput tags={tags} setTags={setTags} />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
