import React, { useState } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { FilePreview } from './FilePreview';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface FileUploaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
  acceptedTypes: string;
  supportedFormats: string[];
  maxSize?: string;
  onUpload?: (files: File[], title: string, description: string, category?: string, subcategory?: string, tags?: string[]) => void;
  id?: string;
  uploadDestination?: string;
  categories?: Array<{id: string, name: string, subcategories?: Array<{id: string, name: string}>}>;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  icon: Icon,
  title,
  description,
  acceptedTypes,
  supportedFormats,
  maxSize = "50MB",
  onUpload,
  id,
  uploadDestination,
  categories = []
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  
  const {
    isDragging,
    uploading,
    uploadError,
    uploadedFiles,
    fileInputRef,
    setIsDragging,
    handleDrop: originalHandleDrop,
    handleFileSelect: originalHandleFileSelect,
    handleBrowseClick
  } = useFileUpload({ 
    supportedFormats, 
    maxSize, 
    onUpload: (files) => {
      if (onUpload) {
        onUpload(files, videoTitle, videoDescription, selectedCategory, selectedSubcategory, tags);
      }
    }, 
    id 
  });
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    originalHandleDrop(e);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    originalHandleFileSelect(e);
  };
  
  const subcategories = categories.find(cat => cat.id === selectedCategory)?.subcategories || [];

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
    <div className="bg-card p-6 rounded-lg shadow-md mb-8 w-full">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-muted-foreground mb-4">{description}</p>
      
      <div className="mb-6 grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="video-title" className="block text-sm font-medium mb-1">
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
          <label htmlFor="video-description" className="block text-sm font-medium mb-1">
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
      </div>
      
      {categories.length > 0 && (
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category-select" className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              id="category-select"
              className="w-full p-2 rounded-md border bg-background"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory(''); // Reset subcategory when category changes
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
              <label htmlFor="subcategory-select" className="block text-sm font-medium mb-1">
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
      
      <div className="mb-6">
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
      
      <div 
        className={`border-2 border-dashed ${isDragging ? 'border-primary' : 'border-border'} rounded-lg p-8 text-center`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
      >
        <Icon size={48} className="mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground mb-2">
          {uploading ? 'Uploading...' : 'Drag and drop files here, or click to browse'}
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Supported formats: {supportedFormats.join(', ')} up to {maxSize}
        </p>
        
        <FilePreview 
          uploadError={uploadError}
          uploadDestination={uploadDestination}
          uploadedFiles={uploadedFiles}
        />
        
        <input 
          type="file" 
          className="hidden" 
          accept={acceptedTypes}
          onChange={handleFileSelect}
          disabled={uploading}
          id={id}
          ref={fileInputRef}
        />
        <button 
          type="button"
          className={`px-4 py-2 ${uploading ? 'bg-secondary/50' : 'bg-secondary'} text-foreground rounded-md hover:bg-secondary/80 transition-colors`}
          disabled={uploading}
          onClick={handleBrowseClick}
        >
          {uploading ? 'Uploading...' : 'Select Files'}
        </button>
      </div>
    </div>
  );
};
