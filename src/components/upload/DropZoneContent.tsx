
import React from 'react';
import { FilePreview } from './FilePreview';
import { Button } from '@/components/ui/button';

interface DropZoneContentProps {
  icon: React.ElementType;
  uploading: boolean;
  supportedFormats: string[];
  maxSize: string;
  uploadError: string | null;
  uploadDestination?: string;
  uploadedFiles: File[];
  handleBrowseClick: () => void;
}

export const DropZoneContent: React.FC<DropZoneContentProps> = ({
  icon: Icon,
  uploading,
  supportedFormats,
  maxSize,
  uploadError,
  uploadDestination,
  uploadedFiles,
  handleBrowseClick,
}) => {
  return (
    <>
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
      
      <Button 
        type="button"
        variant="secondary"
        className={uploading ? 'opacity-50' : ''}
        disabled={uploading}
        onClick={handleBrowseClick}
      >
        {uploading ? 'Uploading...' : 'Select Files'}
      </Button>
    </>
  );
};
