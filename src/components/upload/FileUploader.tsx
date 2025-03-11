
import React, { useState } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { VideoMetadataForm } from './VideoMetadataForm';
import { DropZone } from './DropZone';

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
  icon,
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

  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-8 w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>
      
      {/* Video Selection Zone at the top */}
      <div className="mb-8">
        <DropZone 
          icon={icon}
          isDragging={isDragging}
          uploading={uploading}
          uploadError={uploadError}
          uploadedFiles={uploadedFiles}
          uploadDestination={uploadDestination}
          supportedFormats={supportedFormats}
          maxSize={maxSize}
          handleDrop={handleDrop}
          setIsDragging={setIsDragging}
          handleBrowseClick={handleBrowseClick}
        />
      </div>
      
      {/* Show metadata form only when a file is selected */}
      {uploadedFiles.length > 0 && (
        <div className="mb-8 animate-fade-in">
          <VideoMetadataForm 
            videoTitle={videoTitle}
            setVideoTitle={setVideoTitle}
            videoDescription={videoDescription}
            setVideoDescription={setVideoDescription}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            tags={tags}
            setTags={setTags}
            categories={categories}
          />
          
          {/* Upload button at the bottom */}
          <div className="mt-6 text-center">
            <button
              type="button"
              className={`px-6 py-2 ${uploading ? 'bg-primary/50' : 'bg-primary'} text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-lg font-medium`}
              disabled={uploading || !videoTitle}
              onClick={() => {
                if (fileInputRef.current) {
                  const event = new Event('change', { bubbles: true });
                  fileInputRef.current.dispatchEvent(event);
                }
              }}
            >
              {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </div>
      )}
      
      <input 
        type="file" 
        className="hidden" 
        accept={acceptedTypes}
        onChange={handleFileSelect}
        disabled={uploading}
        id={id}
        ref={fileInputRef}
      />
    </div>
  );
};
