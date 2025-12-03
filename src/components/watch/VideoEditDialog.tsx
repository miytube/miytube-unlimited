import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CategoryCombobox } from '@/components/upload/CategoryCombobox';
import { TagInput } from '@/components/upload/TagInput';
import { allCategoryMappings } from '@/data/allCategoryMappings';

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
  const [category, setCategory] = useState(video.category || '');
  const [subcategory, setSubcategory] = useState(video.subcategory || '');
  const [tags, setTags] = useState<string[]>(video.tags || []);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [customSubcategories, setCustomSubcategories] = useState<string[]>([]);

  const categoryOptions = useMemo(() => {
    // Get main categories (those without a parent)
    const baseCategories = Object.entries(allCategoryMappings)
      .filter(([_, info]) => !info.parent)
      .map(([key, info]) => ({
        id: key,
        name: info.title
      }));
    const custom = customCategories.map(c => ({ id: c.toLowerCase().replace(/\s+/g, '-'), name: c }));
    return [...baseCategories, ...custom];
  }, [customCategories]);

  const subcategoryOptions = useMemo(() => {
    // Get subcategories that have the selected category as parent
    const baseSubcats = Object.entries(allCategoryMappings)
      .filter(([_, info]) => info.parent?.route === `/${category}`)
      .map(([key, info]) => ({
        id: key,
        name: info.title
      }));
    const custom = customSubcategories.map(c => ({ id: c.toLowerCase().replace(/\s+/g, '-'), name: c }));
    return [...baseSubcats, ...custom];
  }, [category, customSubcategories]);

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
      category: category || undefined,
      subcategory: subcategory || undefined,
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
              onValueChange={setCategory}
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
