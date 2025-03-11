
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

const Upload = () => {
  const [selectedContentType, setSelectedContentType] = useState<string>("video");
  const [key, setKey] = useState<number>(Date.now()); // Add a key to force re-render of FileUploader
  const { handleUpload } = useUploadHandler();
  const { toast } = useToast();
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

  const handleContentTypeChange = (contentType: ContentType) => {
    // Reset the FileUploader component by changing its key
    setKey(Date.now());
    
    // Show a toast to inform the user about the content type change
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
          key={key} // Add a key to force re-render when content type changes
          icon={currentContentType.icon}
          title={`Upload ${currentContentType.name}`}
          description={currentContentType.description}
          acceptedTypes={currentContentType.acceptedTypes}
          supportedFormats={currentContentType.supportedFormats}
          maxSize={currentContentType.maxSize}
          onUpload={onUpload}
          id={`${currentContentType.id}-upload-input-${key}`} // Add key to ensure unique ID
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
