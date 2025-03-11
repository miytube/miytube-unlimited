
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
    <div className="bg-card p-6 rounded-lg shadow-md mb-8 w-full">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-muted-foreground mb-4">{description}</p>
      
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
