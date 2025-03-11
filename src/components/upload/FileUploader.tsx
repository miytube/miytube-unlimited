
import React from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useVideoMetadata } from '@/hooks/useVideoMetadata';
import { VideoMetadataForm } from './VideoMetadataForm';
import { DropZone } from './DropZone';
import { FilePreview } from './FilePreview';
import { UploadActions } from './UploadActions';

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
  const {
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
    setMetadataFromFile
  } = useVideoMetadata();
  
  const {
    isDragging,
    uploading,
    uploadError,
    uploadedFiles,
    fileInputRef,
    setIsDragging,
    handleFileSelect: originalHandleFileSelect,
    handleBrowseClick
  } = useFileUpload({ 
    supportedFormats, 
    maxSize,
    onUpload: (files) => {
      console.log("Files ready for upload:", files);
    },
    id 
  });
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setMetadataFromFile(file);
      
      // Pass to the original file upload handler
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setMetadataFromFile(file);
    }
    
    // Call the original handler
    originalHandleFileSelect(e);
  };
  
  const handleFiles = (files: File[]) => {
    // This is a simplified version that calls the hooks internal handler
    if (fileInputRef.current) {
      fileInputRef.current.files = createFileList(files);
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };
  
  // Helper function to create a FileList from an array of Files
  const createFileList = (files: File[]): FileList => {
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    return dataTransfer.files;
  };

  const handleUploadClick = () => {
    if (uploadedFiles.length > 0 && onUpload) {
      console.log("Uploading files with metadata:", {
        files: uploadedFiles,
        title: videoTitle,
        description: videoDescription,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        tags: tags
      });
      
      onUpload(
        uploadedFiles, 
        videoTitle, 
        videoDescription, 
        selectedCategory, 
        selectedSubcategory, 
        tags
      );
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
        <div className="mt-4 mb-6">
          <FilePreview 
            uploadError={uploadError}
            uploadDestination={uploadDestination}
            uploadedFiles={uploadedFiles}
          />
        </div>
      )}
      
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
            defaultTitle={videoTitle}
            defaultDescription={videoDescription}
            defaultCategory={selectedCategory}
          />
          
          <UploadActions
            uploading={uploading}
            isValid={!!videoTitle}
            onUpload={handleUploadClick}
          />
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
