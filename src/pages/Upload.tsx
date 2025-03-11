
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { FileUploader } from '@/components/upload/FileUploader';
import { Upload as UploadIcon } from 'lucide-react';
import { ContentTypeSelector } from '@/components/upload/ContentTypeSelector';
import { UploadRequirementsDisplay } from '@/components/upload/UploadRequirementsDisplay';
import { useUploadHandler } from '@/hooks/useUploadHandler';
import { contentTypes } from '@/data/contentTypes';

const Upload = () => {
  const [selectedContentType, setSelectedContentType] = useState<string>("video");
  const { handleUpload } = useUploadHandler();
  
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
        />
        
        <FileUploader
          icon={currentContentType.icon}
          title={`Upload ${currentContentType.name}`}
          description={currentContentType.description}
          acceptedTypes={currentContentType.acceptedTypes}
          supportedFormats={currentContentType.supportedFormats}
          maxSize={currentContentType.maxSize}
          onUpload={onUpload}
          id={`${currentContentType.id}-upload-input`}
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
