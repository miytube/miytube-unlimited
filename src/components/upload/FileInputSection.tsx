
import React from 'react';
import { DropZone } from './DropZone';

interface FileInputSectionProps {
  icon: React.ElementType;
  uploading: boolean;
  uploadError: string | null;
  uploadedFiles: File[];
  uploadDestination?: string;
  supportedFormats: string[];
  maxSize: string;
  isDragging: boolean;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  setIsDragging: (isDragging: boolean) => void;
  handleBrowseClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  acceptedTypes: string;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
}

export const FileInputSection: React.FC<FileInputSectionProps> = ({
  icon,
  uploading,
  uploadError,
  uploadedFiles,
  uploadDestination,
  supportedFormats,
  maxSize,
  isDragging,
  handleDrop,
  setIsDragging,
  handleBrowseClick,
  fileInputRef,
  acceptedTypes,
  handleFileSelect,
  id
}) => {
  return (
    <>
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
      
      <input 
        type="file" 
        className="hidden" 
        accept={acceptedTypes}
        onChange={handleFileSelect}
        disabled={uploading}
        id={id}
        ref={fileInputRef}
        multiple={false}
      />
    </>
  );
};
