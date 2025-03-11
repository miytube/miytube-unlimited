
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
  acceptedTypes: string;
  supportedFormats: string[];
  maxSize?: string;
  onUpload?: (files: File[]) => void;
  id?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  icon: Icon,
  title,
  description,
  acceptedTypes,
  supportedFormats,
  maxSize = "50MB",
  onUpload,
  id
}) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
    console.log('File being dragged over dropzone');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    console.log('File drag left dropzone');
  };

  const validateFiles = (files: File[]) => {
    console.log('Validating files:', files);
    
    if (files.length === 0) {
      console.log('No files selected');
      return false;
    }

    // Log file details
    files.forEach(file => {
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
    });

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    console.log('File dropped');
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input change event triggered');
    
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    } else {
      console.log('No files selected from input');
    }
  };

  const handleFiles = (files: File[]) => {
    console.log('Handling files...');
    
    if (!validateFiles(files)) {
      console.log('File validation failed');
      return;
    }

    setUploading(true);
    
    try {
      console.log('Starting upload process');
      
      if (onUpload) {
        onUpload(files);
      }
      
      console.log('Upload completed successfully');
      
      toast({
        title: "Files uploaded successfully",
        description: `${files.length} ${files.length === 1 ? 'file' : 'files'} uploaded.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Clear the input
      const inputElement = document.getElementById(id || '') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-8 w-full">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-muted-foreground mb-4">
        {description}
      </p>
      <div 
        className={`border-2 border-dashed ${isDragging ? 'border-primary' : 'border-border'} rounded-lg p-8 text-center`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Icon size={48} className="mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground mb-2">
          {uploading ? 'Uploading...' : 'Drag and drop files here, or click to browse'}
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Supported formats: {supportedFormats.join(', ')} up to {maxSize}
        </p>
        <label>
          <input 
            type="file" 
            className="hidden" 
            accept={acceptedTypes}
            onChange={handleFileSelect}
            disabled={uploading}
            id={id}
          />
          <button 
            type="button"
            className={`px-4 py-2 ${uploading ? 'bg-secondary/50' : 'bg-secondary'} text-foreground rounded-md hover:bg-secondary/80 transition-colors`}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Select Files'}
          </button>
        </label>
      </div>
    </div>
  );
};
