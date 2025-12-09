
import React, { useState, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { FileUploader } from '@/components/upload/FileUploader';
import { Upload as UploadIcon } from 'lucide-react';
import { ContentTypeSelector } from '@/components/upload/ContentTypeSelector';
import { UploadRequirementsDisplay } from '@/components/upload/UploadRequirementsDisplay';
import { useUploadHandler } from '@/hooks/useUploadHandler';
import { contentTypes } from '@/data/contentTypes';
import { ContentType } from '@/types/upload';
import { useToast } from '@/hooks/use-toast';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [selectedContentType, setSelectedContentType] = useState<string>("video");
  const [key, setKey] = useState<number>(Date.now());
  const { handleUpload } = useUploadHandler();
  const { toast } = useToast();
  const { addUploadedVideo } = useUploadedVideos();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const currentContentType = contentTypes[selectedContentType];
  
  const onUpload = (files: File[], title: string, description: string, category?: string, subcategory?: string, tags?: string[]) => {
    handleUpload(
      currentContentType.name,
      files,
      title,
      description,
      currentContentType.id,
      currentContentType.destination,
      category,
      subcategory,
      tags
    );
  };

  const onUrlImport = async (
    url: string,
    title: string,
    description: string,
    category?: string,
    subcategory?: string,
    tags?: string[],
    isYouTube?: boolean,
    youtubeId?: string
  ) => {
    try {
      toast({
        title: "Importing video...",
        description: isYouTube ? "Adding YouTube video to your library" : "Adding video from URL",
      });

      // Create a placeholder file for URL imports
      const placeholderFile = new File([], 'url-import.mp4', { type: 'video/mp4' });

      await addUploadedVideo(
        placeholderFile,
        title || (isYouTube ? 'YouTube Video' : 'Imported Video'),
        description || '',
        category || currentContentType.id,
        subcategory,
        tags,
        url,
        isYouTube,
        youtubeId
      );

      toast({
        title: "Success!",
        description: isYouTube ? "YouTube video added to your library" : "Video imported successfully",
      });

      // Reset the uploader
      setKey(Date.now());

      // Navigate to home or the destination
      navigate('/');
    } catch (error) {
      console.error('URL import error:', error);
      toast({
        title: "Import failed",
        description: "Could not import the video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContentTypeChange = (contentType: ContentType) => {
    setKey(Date.now());
    
    toast({
      title: `Content type changed to ${contentType.name}`,
      description: `Select files to upload: ${contentType.supportedFormats.join(', ')}`,
    });
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full">
        <div className="flex items-center gap-3 mb-8">
          <UploadIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Universal Upload</h1>
          <p className="text-muted-foreground ml-2">
            Upload any type of content to MiyTube
          </p>
        </div>
        
        <ContentTypeSelector 
          contentTypes={contentTypes}
          selectedContentType={selectedContentType}
          setSelectedContentType={setSelectedContentType}
          onContentTypeChange={handleContentTypeChange}
        />
        
        <FileUploader
          key={key}
          icon={currentContentType.icon}
          title={`Upload ${currentContentType.name}`}
          description={currentContentType.description}
          acceptedTypes={currentContentType.acceptedTypes}
          supportedFormats={currentContentType.supportedFormats}
          maxSize={currentContentType.maxSize}
          onUpload={onUpload}
          onUrlImport={onUrlImport}
          id={`${currentContentType.id}-upload-input-${key}`}
          uploadDestination={currentContentType.destination}
          categories={currentContentType.categories}
        />
        
        <UploadRequirementsDisplay 
          selectedContentType={selectedContentType}
          contentTypes={contentTypes}
        />
      </div>
    </Layout>
  );
};

export default Upload;
