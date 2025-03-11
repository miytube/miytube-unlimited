
import React from 'react';
import { FilePreview } from './FilePreview';

interface DropZoneProps {
  icon: React.ElementType;
  isDragging: boolean;
  uploading: boolean;
  uploadError: string | null;
  uploadedFiles: File[];
  uploadDestination?: string;
  supportedFormats: string[];
  maxSize: string;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  setIsDragging: (isDragging: boolean) => void;
  handleBrowseClick: () => void;
}

export const DropZone: React.FC<DropZoneProps> = ({
  icon: Icon,
  isDragging,
  uploading,
  uploadError,
  uploadedFiles,
  uploadDestination,
  supportedFormats,
  maxSize,
  handleDrop,
  setIsDragging,
  handleBrowseClick,
}) => {
  return (
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
      
      <button 
        type="button"
        className={`px-4 py-2 ${uploading ? 'bg-secondary/50' : 'bg-secondary'} text-foreground rounded-md hover:bg-secondary/80 transition-colors`}
        disabled={uploading}
        onClick={handleBrowseClick}
      >
        {uploading ? 'Uploading...' : 'Select Files'}
      </button>
    </div>
  );
};
