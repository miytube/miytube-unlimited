
import React, { useEffect, useState } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useVideoMetadata } from '@/hooks/useVideoMetadata';
import { FileInputSection } from './FileInputSection';
import { MetadataFormSection } from './MetadataFormSection';
import { UrlImportSection } from './UrlImportSection';
import { triggerFileInputChangeEvent } from '@/utils/fileUploadUtils';
import { transcodeVideoFile, type VideoQuality } from '@/utils/videoTranscoder';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
  acceptedTypes: string;
  supportedFormats: string[];
  maxSize?: string;
  onUpload?: (files: File[], title: string, description: string, category?: string, subcategory?: string, tags?: string[]) => void;
  onUrlImport?: (url: string, title: string, description: string, category?: string, subcategory?: string, tags?: string[], isYouTube?: boolean, youtubeId?: string) => void;
  id?: string;
  uploadDestination?: string;
  categories?: Array<{id: string, name: string, subcategories?: Array<{id: string, name: string}>}>;
  showUrlImport?: boolean;
  defaultSubcategory?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  icon,
  title,
  description,
  acceptedTypes,
  supportedFormats,
  maxSize = "50MB",
  onUpload,
  onUrlImport,
  id,
  uploadDestination,
  categories = [],
  showUrlImport = true,
  defaultSubcategory = ''
}) => {
  const [importedUrl, setImportedUrl] = useState<string | null>(null);
  const [isYouTubeImport, setIsYouTubeImport] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('original');
  const [isTranscoding, setIsTranscoding] = useState(false);
  const { toast } = useToast();
  
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
  
  // Initialize the selected category if categories are provided and we're on the music component
  useEffect(() => {
    if (categories.length > 0 && acceptedTypes.includes('audio') && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, acceptedTypes, selectedCategory, setSelectedCategory]);

  // Set default subcategory from URL params (e.g., for music genre pages)
  useEffect(() => {
    if (defaultSubcategory && !selectedSubcategory) {
      setSelectedSubcategory(defaultSubcategory);
    }
  }, [defaultSubcategory, selectedSubcategory, setSelectedSubcategory]);
  
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
    setImportedUrl(null); // Clear URL if user drops a file
    
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setMetadataFromFile(file);
      
      // Pass to the original file upload handler
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportedUrl(null); // Clear URL if user selects a file
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setMetadataFromFile(file);
    }
    
    // Call the original handler
    originalHandleFileSelect(e);
  };
  
  const handleFiles = (files: File[]) => {
    // Trigger file input change event with the selected files
    triggerFileInputChangeEvent(fileInputRef, files);
  };

  const handleUrlImport = (url: string, isYouTube?: boolean, youtubeId?: string) => {
    setImportedUrl(url);
    setIsYouTubeImport(isYouTube || false);
    setYoutubeVideoId(youtubeId || null);
    
    // Extract title from URL if no title set
    if (!videoTitle) {
      if (isYouTube) {
        setVideoTitle('YouTube Video');
      } else {
        try {
          const urlObj = new URL(url);
          const pathParts = urlObj.pathname.split('/');
          const filename = pathParts[pathParts.length - 1];
          if (filename) {
            const nameWithoutExt = filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
            setVideoTitle(decodeURIComponent(nameWithoutExt));
          }
        } catch {
          // Ignore URL parsing errors
        }
      }
    }
  };

  const handleUploadClick = () => {
    // Handle URL import
    if (importedUrl && onUrlImport) {
      console.log("Importing from URL:", {
        url: importedUrl,
        title: videoTitle,
        description: videoDescription,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        tags: tags,
        isYouTube: isYouTubeImport,
        youtubeId: youtubeVideoId
      });
      
      onUrlImport(
        importedUrl,
        videoTitle,
        videoDescription,
        selectedCategory,
        selectedSubcategory,
        tags,
        isYouTubeImport,
        youtubeVideoId || undefined
      );
      setImportedUrl(null);
      setIsYouTubeImport(false);
      setYoutubeVideoId(null);
      return;
    }
    
    // Handle file upload
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

  const hasContent = uploadedFiles.length > 0 || importedUrl;

  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-8 w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>
      
      <FileInputSection
        icon={icon}
        uploading={uploading}
        uploadError={uploadError}
        uploadedFiles={uploadedFiles}
        uploadDestination={uploadDestination}
        supportedFormats={supportedFormats}
        maxSize={maxSize}
        isDragging={isDragging}
        handleDrop={handleDrop}
        setIsDragging={setIsDragging}
        handleBrowseClick={handleBrowseClick}
        fileInputRef={fileInputRef}
        acceptedTypes={acceptedTypes}
        handleFileSelect={handleFileSelect}
        id={id}
      />
      
      {showUrlImport && (
        <UrlImportSection
          onUrlImport={handleUrlImport}
          disabled={uploading}
        />
      )}
      
      {importedUrl && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium text-foreground">URL Ready to Import:</p>
          <p className="text-xs text-muted-foreground truncate">{importedUrl}</p>
        </div>
      )}
      
      <MetadataFormSection
        uploadedFiles={hasContent ? (uploadedFiles.length > 0 ? uploadedFiles : [new File([], 'url-import')]) : []}
        uploadError={uploadError}
        uploadDestination={uploadDestination}
        uploading={uploading}
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
        handleUploadClick={handleUploadClick}
      />
    </div>
  );
};
