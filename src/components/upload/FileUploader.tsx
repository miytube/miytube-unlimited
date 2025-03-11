
import React from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { FilePreview } from './FilePreview';

interface FileUploaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
  acceptedTypes: string;
  supportedFormats: string[];
  maxSize?: string;
  onUpload?: (files: File[]) => void;
  id?: string;
  uploadDestination?: string;
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
  uploadDestination
}) => {
  const {
    isDragging,
    uploading,
    uploadError,
    fileInputRef,
    setIsDragging,
    handleDrop,
    handleFileSelect,
    handleBrowseClick
  } = useFileUpload({ supportedFormats, maxSize, onUpload, id });

  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-8 w-full">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-muted-foreground mb-4">{description}</p>
      
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
