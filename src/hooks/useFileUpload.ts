
import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { checkVideoCompatibility, getFormatRecommendation } from "@/utils/videoCompatibility";

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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when the id changes (component is being reused for a different content type)
  useEffect(() => {
    setUploadedFiles([]);
    setUploadError(null);
    setUploading(false);
    setIsDragging(false);

    // Clear the file input when content type changes
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [id]);

  // Adding a browser-compatible way to programmatically open the file picker
  useEffect(() => {
    const openFilePicker = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    // Exposing a method for components to call the file picker
    if (typeof window !== 'undefined') {
      window.openFilePicker = openFilePicker;
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete window.openFilePicker;
      }
    };
  }, []);

  const parseMaxSize = (sizeStr: string): number => {
    const num = parseFloat(sizeStr);
    const unit = sizeStr.replace(/[0-9.]/g, '').toUpperCase();
    
    switch (unit) {
      case 'TB':
        return num * 1024 * 1024 * 1024 * 1024;
      case 'GB':
        return num * 1024 * 1024 * 1024;
      case 'MB':
        return num * 1024 * 1024;
      case 'KB':
        return num * 1024;
      default:
        return num * 1024 * 1024; // Default to MB
    }
  };

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
      
      const maxSizeInBytes = parseMaxSize(maxSize);
      if (file.size > maxSizeInBytes) {
        const errorMsg = `File too large: ${file.name}. Max size is ${maxSize}`;
        console.error(errorMsg);
        setUploadError(errorMsg);
        return false;
      }
    }

    return true;
  };

  const handleFiles = async (files: File[]) => {
    console.log('Handling files...');

    if (!validateFiles(files)) {
      console.log('File validation failed');
      return;
    }

    // Video compatibility check (codec/container) — filter per file so one
    // bad file in a batch never silently drops the good ones.
    const compatibleFiles: File[] = [];
    const skippedFiles: string[] = [];

    for (const file of files) {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const isVideoFile = file.type.startsWith('video/') || ['mp4', 'm4v', 'mov', 'webm', 'ogv', 'ogg', 'mkv', 'avi', 'wmv', 'flv', '3gp', 'mpeg', 'mpg'].includes(extension);

      if (!isVideoFile) {
        compatibleFiles.push(file);
        continue;
      }

      try {
        const compatibility = await checkVideoCompatibility(file);

        if (!compatibility.isCompatible) {
          const message = compatibility.errorMessage || "This video cannot be played in browsers.";
          skippedFiles.push(file.name);
          toast({
            title: `Skipped: ${file.name}`,
            description: message,
            variant: "destructive",
            duration: 10000,
          });
          continue;
        }
        compatibleFiles.push(file);
      } catch (error) {
        console.warn('Video compatibility check failed, accepting file anyway:', error);
        // Don't block the upload on a flaky probe — let the server-side
        // upload + playback path catch any real issue.
        compatibleFiles.push(file);
      }
    }

    if (skippedFiles.length > 0) {
      setTimeout(() => {
        toast({
          title: "How to fix skipped videos",
          description: getFormatRecommendation(),
          duration: 12000,
        });
      }, 500);
    }

    if (compatibleFiles.length === 0) {
      setUploadError("None of the selected videos are playable in browsers.");
      return;
    }

    files = compatibleFiles;

    setUploading(true);

    try {
      console.log('Starting upload process');

      // Simulate upload with a delay
      setTimeout(() => {
        // Add new files to the uploaded files list
        const newFilesArray = [...files];
        setUploadedFiles((prevFiles) => [...prevFiles, ...newFilesArray]);

        if (onUpload) {
          onUpload(newFilesArray);
        }

        console.log('File selected successfully');

        toast({
          title: "File ready to publish",
          description: `${files.length} ${files.length === 1 ? 'file is' : 'files are'} ready. Click the blue "Upload Video" button below to publish.`,
          duration: 8000,
        });

        setUploading(false);
        const inputElement = document.getElementById(id || '') as HTMLInputElement;
        if (inputElement) {
          inputElement.value = '';
        }
      }, 1500); // Simulating network delay
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError("Upload failed. Please try again.");
      setUploading(false);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files.",
        variant: "destructive",
      });

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
    void handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input change event triggered');

    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      void handleFiles(files);
    } else {
      console.log('No files selected from input');
    }
  };

  const handleBrowseClick = () => {
    console.log('Browse button clicked');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return {
    isDragging,
    uploading,
    uploadError,
    uploadedFiles,
    fileInputRef,
    setIsDragging,
    handleDrop,
    handleFileSelect,
    handleBrowseClick,
    clearUploadedFiles: () => setUploadedFiles([])
  };
};

// Add this to window type
declare global {
  interface Window {
    openFilePicker?: () => void;
  }
}
