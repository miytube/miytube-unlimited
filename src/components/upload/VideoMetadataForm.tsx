import React, { useEffect, useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { TagInput } from './TagInput';
import { CategoryCombobox } from './CategoryCombobox';
import { getSubcategoryOptionsForCategory } from '@/utils/subcategoryOptions';
import { useAIAutoTag } from '@/hooks/useAIAutoTag';
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
  const { analyzeContent, isAnalyzing } = useAIAutoTag();

  const handleAIAutoTag = async () => {
    if (!videoTitle.trim()) return;
    const result = await analyzeContent(videoTitle, videoDescription);
    if (result) {
      if (result.suggestedTags?.length) setTags([...new Set([...tags, ...result.suggestedTags])]);
      if (result.suggestedCategory) setSelectedCategory(result.suggestedCategory.toLowerCase().replace(/\s+/g, '-'));
      if (result.suggestedSubcategory) setSelectedSubcategory(result.suggestedSubcategory.toLowerCase().replace(/\s+/g, '-'));
      if (result.improvedDescription && !videoDescription.trim()) setVideoDescription(result.improvedDescription);
    }
  };

  // Set default values when props change
  useEffect(() => {
    if (defaultTitle && !videoTitle) setVideoTitle(defaultTitle);
    if (defaultDescription && !videoDescription) setVideoDescription(defaultDescription);
    if (defaultCategory && !selectedCategory) setSelectedCategory(defaultCategory);
  }, [defaultTitle, defaultDescription, defaultCategory, videoTitle, videoDescription, selectedCategory]);

  // Combine built-in and custom categories
  const allCategories = [...categories, ...customCategories];
  
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

      {/* AI Auto-Tag Button */}
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
        {isAnalyzing ? 'AI Analyzing...' : 'AI Auto-Tag & Categorize'}
      </Button>
    </div>
  );
};
