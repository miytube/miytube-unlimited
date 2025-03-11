
import React from 'react';
import { DropZoneContent } from './DropZoneContent';

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
  icon,
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
      <DropZoneContent
        icon={icon}
        uploading={uploading}
        supportedFormats={supportedFormats}
        maxSize={maxSize}
        uploadError={uploadError}
        uploadDestination={uploadDestination}
        uploadedFiles={uploadedFiles}
        handleBrowseClick={handleBrowseClick}
      />
    </div>
  );
};
