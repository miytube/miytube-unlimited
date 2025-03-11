
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const [currentTag, setCurrentTag] = useState('');

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <label htmlFor="video-tags" className="block text-sm font-medium mb-1">
        Tags
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-secondary px-2 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="hover:text-destructive"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <Input
        id="video-tags"
        placeholder="Add tags (press Enter)"
        value={currentTag}
        onChange={(e) => setCurrentTag(e.target.value)}
        onKeyDown={handleAddTag}
        className="w-full"
      />
      <p className="text-xs text-muted-foreground mt-1">
        Press Enter to add a tag
      </p>
    </div>
  );
};
