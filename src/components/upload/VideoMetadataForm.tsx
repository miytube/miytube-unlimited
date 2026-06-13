import React, { useEffect, useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { TagInput } from './TagInput';
import { CategoryCombobox } from './CategoryCombobox';
import { getSubcategoryOptionsForCategory } from '@/utils/subcategoryOptions';
import { getKnownParentCategoryOptions } from '@/utils/categoryAssignment';
import { useAIAutoTag } from '@/hooks/useAIAutoTag';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QUALITY_LABELS, type VideoQuality } from '@/utils/videoTranscoder';

interface Category {
  id: string;
  name: string;
  subcategories?: Array<{id: string, name: string}>;
}

interface VideoMetadataFormProps {
  videoTitle: string;
  setVideoTitle: (title: string) => void;
  videoDescription: string;
  setVideoDescription: (description: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (subcategory: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  categories: Category[];
  defaultTitle?: string;
  defaultDescription?: string;
  defaultCategory?: string;
  videoQuality?: VideoQuality;
  setVideoQuality?: (q: VideoQuality) => void;
  showQualitySelector?: boolean;
}

export const VideoMetadataForm: React.FC<VideoMetadataFormProps> = ({
  videoTitle,
  setVideoTitle,
  videoDescription,
  setVideoDescription,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  tags,
  setTags,
  categories,
  defaultTitle,
  defaultDescription,
  defaultCategory,
  videoQuality = 'original',
  setVideoQuality,
  showQualitySelector = false,
}) => {
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [customSubcategories, setCustomSubcategories] = useState<Array<{id: string, name: string}>>([]);
  const { tree: savedCustomCategoryTree } = useCustomCategories();
  const { analyzeContent, isAnalyzing } = useAIAutoTag();

  const handleAIAutoTag = async () => {
    if (!videoTitle.trim()) return;
    const result = await analyzeContent(
      videoTitle,
      videoDescription,
      undefined,
      undefined,
      selectedCategory ? [selectedCategory] : [],
      selectedSubcategory ? [selectedSubcategory] : [],
    );
    if (result) {
      if (result.suggestedTags?.length) setTags([...new Set([...tags, ...result.suggestedTags])]);
      if (result.improvedDescription && !videoDescription.trim()) setVideoDescription(result.improvedDescription);
    }
  };

  // Set default values when props change
  useEffect(() => {
    if (defaultTitle && !videoTitle) setVideoTitle(defaultTitle);
    if (defaultDescription && !videoDescription) setVideoDescription(defaultDescription);
    if (defaultCategory && !selectedCategory) setSelectedCategory(defaultCategory);
  }, [defaultTitle, defaultDescription, defaultCategory, videoTitle, videoDescription, selectedCategory]);

  const savedCustomCategories = useMemo<Category[]>(() => {
    return savedCustomCategoryTree.map((cat) => ({
      id: cat.slug,
      name: cat.name,
      subcategories: cat.subcategories.flatMap((sub) => {
        const watchPages = sub.watch_pages.map((watch) => ({ id: watch.slug, name: watch.name }));
        return [{ id: sub.slug, name: sub.name }, ...watchPages];
      }),
    }));
  }, [savedCustomCategoryTree]);

  // Always include every known parent category (e.g. "Pets & Animals") so the
  // combobox's fuzzy/typo matcher has a complete list to compare against.
  // Without this, hardcoded category props can miss canonical categories and
  // typos like "pets & aniamls" get accepted as new custom categories.
  const knownParentCategories = useMemo<Category[]>(
    () => getKnownParentCategoryOptions().map((c) => ({ id: c.id, name: c.name, subcategories: [] })),
    []
  );

  // Combine built-in, known canonical, saved custom, and newly typed categories
  const allCategories = useMemo(() => {
    const merged = new Map<string, Category>();
    [...categories, ...knownParentCategories, ...savedCustomCategories, ...customCategories].forEach((cat) => {
      const existing = merged.get(cat.id);
      merged.set(cat.id, {
        ...existing,
        ...cat,
        name: existing?.name || cat.name,
        subcategories: [...(existing?.subcategories || []), ...(cat.subcategories || [])],
      });
    });
    return Array.from(merged.values());
  }, [categories, knownParentCategories, savedCustomCategories, customCategories]);
  
  const selectedCategoryObj = allCategories.find(cat => cat.id === selectedCategory);
  const builtInSubcategories = selectedCategoryObj?.subcategories || [];
  
  // Get predefined subcategories from our comprehensive list
  const predefinedSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return getSubcategoryOptionsForCategory(selectedCategory);
  }, [selectedCategory]);
  
  // Merge all subcategory sources: built-in, predefined, and custom
  const allSubcategories = useMemo(() => {
    const merged = new Map<string, { id: string; name: string }>();
    
    // Add built-in subcategories
    builtInSubcategories.forEach(sub => merged.set(sub.id, sub));
    
    // Add predefined subcategories
    predefinedSubcategories.forEach(sub => merged.set(sub.id, sub));
    
    // Add custom subcategories
    customSubcategories.forEach(sub => merged.set(sub.id, sub));
    
    return Array.from(merged.values());
  }, [builtInSubcategories, predefinedSubcategories, customSubcategories]);

  const handleAddCustomCategory = (customName: string) => {
    const newCategory: Category = {
      id: customName.toLowerCase().replace(/\s+/g, '-'),
      name: customName,
      subcategories: []
    };
    setCustomCategories(prev => [...prev, newCategory]);
  };

  const handleAddCustomSubcategory = (customName: string) => {
    const newSubcategory = {
      id: customName.toLowerCase().replace(/\s+/g, '-'),
      name: customName
    };
    setCustomSubcategories(prev => [...prev, newSubcategory]);
  };

  // Reset custom subcategories when category changes
  useEffect(() => {
    setCustomSubcategories([]);
  }, [selectedCategory]);

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="video-title" className="block text-sm font-medium mb-2">
          Video Title
        </label>
        <Input
          id="video-title"
          placeholder={defaultTitle || "Enter video title"}
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="video-description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="video-description"
          placeholder={defaultDescription || "Enter video description"}
          value={videoDescription}
          onChange={(e) => setVideoDescription(e.target.value)}
          className="w-full p-2 rounded-md border bg-background min-h-[100px]"
        />
      </div>

      <div className="flex flex-col md:flex-row md:gap-4">
        <div className="flex-1 mb-4 md:mb-0">
          <label htmlFor="category-select" className="block text-sm font-medium mb-2">
            Category
          </label>
          <CategoryCombobox
            options={allCategories.map(cat => ({ id: cat.id, name: cat.name }))}
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              setSelectedSubcategory('');
            }}
            placeholder="Select or add category..."
            emptyText="No categories found."
            onAddCustom={handleAddCustomCategory}
          />
        </div>
        
        <div className="flex-1">
          <label htmlFor="subcategory-select" className="block text-sm font-medium mb-2">
            Subcategory
          </label>
          <CategoryCombobox
            options={allSubcategories.map(sub => ({ id: sub.id, name: sub.name }))}
            value={selectedSubcategory}
            onValueChange={setSelectedSubcategory}
            placeholder={!selectedCategory ? "Select a category first" : "Select or add subcategory..."}
            emptyText={!selectedCategory ? "Select a category first" : "No subcategories found."}
            disabled={!selectedCategory}
            onAddCustom={handleAddCustomSubcategory}
          />
        </div>
      </div>
      
      <TagInput tags={tags} setTags={setTags} />

      {showQualitySelector && setVideoQuality && (
        <div>
          <label htmlFor="video-quality" className="block text-sm font-medium mb-2">
            Upload Quality
          </label>
          <Select value={videoQuality} onValueChange={(v) => setVideoQuality(v as VideoQuality)}>
            <SelectTrigger id="video-quality" className="w-full">
              <SelectValue placeholder="Choose upload quality" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(QUALITY_LABELS) as VideoQuality[]).map((q) => (
                <SelectItem key={q} value={q}>
                  {QUALITY_LABELS[q]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Lower quality re-encodes the video in your browser before upload — much faster for large files.
          </p>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={handleAIAutoTag}
        disabled={isAnalyzing || !videoTitle.trim()}
        className="w-full flex items-center gap-2"
      >
        {isAnalyzing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4 text-primary" />
        )}
        {isAnalyzing ? 'AI Analyzing...' : 'AI Auto-Tag'}
      </Button>
    </div>
  );
};
