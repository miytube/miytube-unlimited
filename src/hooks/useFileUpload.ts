
import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UseFileUploadProps {
  supportedFormats: string[];
  maxSize: string;
  onUpload?: (files: File[]) => void;
  id?: string;
}

export const useFileUpload = ({ supportedFormats, maxSize, onUpload, id }: UseFileUploadProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: File[]) => {
    console.log('Validating files:', files);
    setUploadError(null);
    
    if (files.length === 0) {
      console.log('No files selected');
      setUploadError("No files selected");
      return false;
    }

    const validExtensions = supportedFormats.map(format => format.toLowerCase());
    
    for (const file of files) {
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      if (!validExtensions.includes(extension)) {
        const errorMsg = `File type not supported: ${file.name}`;
        console.error(errorMsg);
        setUploadError(errorMsg);
        return false;
      }
      
      const maxSizeInBytes = parseInt(maxSize) * 1048576;
      if (file.size > maxSizeInBytes) {
        const errorMsg = `File too large: ${file.name}`;
        console.error(errorMsg);
        setUploadError(errorMsg);
        return false;
      }
    }

    return true;
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
      setUploadError("Upload failed. Please try again.");
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      const inputElement = document.getElementById(id || '') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
    }
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

  const handleBrowseClick = () => {
    console.log('Browse button clicked');
    fileInputRef.current?.click();
  };

  return {
    isDragging,
    uploading,
    uploadError,
    fileInputRef,
    setIsDragging,
    handleDrop,
    handleFileSelect,
    handleBrowseClick
  };
};
