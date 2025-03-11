
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
  const [defaultTitle, setDefaultTitle] = useState<string>('');
  const [defaultDescription, setDefaultDescription] = useState<string>('');
  const [defaultCategory, setDefaultCategory] = useState<string>('');
  
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
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const fileName = file.name.split('.').slice(0, -1).join('.');
      setDefaultTitle(fileName);
      
      // Set basic description based on filename
      setDefaultDescription(`Video about ${fileName}`);
      
      // Extract potential tags from filename
      const potentialTags = fileName
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .split(' ')
        .filter(word => word.length > 3)
        .slice(0, 3);
      
      if (potentialTags.length > 0) {
        setTags(potentialTags);
      }
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    originalHandleFileSelect(e);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileName = file.name.split('.').slice(0, -1).join('.');
      setDefaultTitle(fileName);
      
      // Set basic description based on filename
      setDefaultDescription(`Video about ${fileName}`);
      
      // Extract potential tags from filename
      const potentialTags = fileName
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .split(' ')
        .filter(word => word.length > 3)
        .slice(0, 3);
      
      if (potentialTags.length > 0) {
        setTags(potentialTags);
      }
    }
  };

  const handleUploadClick = () => {
    if (uploadedFiles.length > 0) {
      // Directly call the onUpload function with the current form values
      if (onUpload) {
        onUpload(uploadedFiles, videoTitle, videoDescription, selectedCategory, selectedSubcategory, tags);
      }
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-8 w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>
      
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
            defaultTitle={defaultTitle}
            defaultDescription={defaultDescription}
            defaultCategory={defaultCategory}
          />
          
          <div className="mt-6 text-center">
            <button
              type="button"
              className={`px-6 py-2 ${uploading ? 'bg-primary/50' : 'bg-primary'} text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-lg font-medium`}
              disabled={uploading || !videoTitle}
              onClick={handleUploadClick}
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
