
import React from 'react';
import { UploadRequirements } from '@/components/longVideos/UploadRequirements';
import { MusicUploadRequirements } from '@/components/music/UploadRequirements';
import { ImageUploadRequirements } from '@/components/upload/ImageUploadRequirements';
import { DocumentUploadRequirements } from '@/components/upload/DocumentUploadRequirements';
import { ContentType } from '@/types/upload';

interface UploadRequirementsDisplayProps {
  selectedContentType: string;
  contentTypes: Record<string, ContentType>;
}

export const UploadRequirementsDisplay: React.FC<UploadRequirementsDisplayProps> = ({
  selectedContentType,
  contentTypes
}) => {
  // Return requirements based on content type
  if (selectedContentType === 'video' || selectedContentType === 'shorts') {
    return (
      <UploadRequirements 
        videoFormats={contentTypes.video.supportedFormats}
        audioFormats={contentTypes.music.supportedFormats}
      />
    );
  }
  
  if (selectedContentType === 'music') {
    return (
      <MusicUploadRequirements 
        audioFormats={contentTypes.music.supportedFormats}
      />
    );
  }
  
  if (selectedContentType === 'image') {
    return (
      <ImageUploadRequirements 
        imageFormats={contentTypes.image.supportedFormats}
      />
    );
  }
  
  if (selectedContentType === 'document') {
    return (
      <DocumentUploadRequirements 
        documentFormats={contentTypes.document.supportedFormats}
      />
    );
  }
  
  return null;
};
