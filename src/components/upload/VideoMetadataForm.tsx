
import React from 'react';
import { Input } from '@/components/ui/input';
import { TagInput } from './TagInput';

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
}) => {
  const subcategories = categories.find(cat => cat.id === selectedCategory)?.subcategories || [];

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="video-title" className="block text-sm font-medium mb-2">
          Video Title
        </label>
        <Input
          id="video-title"
          placeholder="Enter video title"
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
          placeholder="Enter video description"
          value={videoDescription}
          onChange={(e) => setVideoDescription(e.target.value)}
          className="w-full p-2 rounded-md border bg-background min-h-[100px]"
        />
      </div>

      {categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category-select" className="block text-sm font-medium mb-2">
              Category
            </label>
            <select
              id="category-select"
              className="w-full p-2 rounded-md border bg-background"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory('');
              }}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {subcategories.length > 0 && (
            <div>
              <label htmlFor="subcategory-select" className="block text-sm font-medium mb-2">
                Subcategory
              </label>
              <select
                id="subcategory-select"
                className="w-full p-2 rounded-md border bg-background"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                disabled={!selectedCategory}
              >
                <option value="">Select a subcategory</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
      
      <TagInput tags={tags} setTags={setTags} />
    </div>
  );
};
