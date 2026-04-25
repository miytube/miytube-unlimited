
import React from 'react';
import { VideoMetadataForm } from './VideoMetadataForm';
import { UploadActions } from './UploadActions';
import { FilePreview } from './FilePreview';
import type { VideoQuality } from '@/utils/videoTranscoder';

interface MetadataFormSectionProps {
  uploadedFiles: File[];
  uploadError: string | null;
  uploadDestination?: string;
  uploading: boolean;
  videoTitle: string;
  setVideoTitle: (title: string) => void;
  videoDescription: string;
  setVideoDescription: (description: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (subcategory: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  categories: Array<{id: string, name: string, subcategories?: Array<{id: string, name: string}>}>;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultCategory?: string;
  videoQuality?: VideoQuality;
  setVideoQuality?: (q: VideoQuality) => void;
  showQualitySelector?: boolean;
  handleUploadClick: () => void;
}

export const MetadataFormSection: React.FC<MetadataFormSectionProps> = ({
  uploadedFiles,
  uploadError,
  uploadDestination,
  uploading,
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
  categories,
  defaultTitle,
  defaultDescription,
  defaultCategory,
  handleUploadClick
}) => {
  if (uploadedFiles.length === 0) return null;
  
  return (
    <div className="animate-fade-in">
      <div className="mt-4 mb-6">
        <FilePreview 
          uploadError={uploadError}
          uploadDestination={uploadDestination}
          uploadedFiles={uploadedFiles}
        />
      </div>
      
      <div className="mb-8">
        <VideoMetadataForm 
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
          defaultTitle={defaultTitle}
          defaultDescription={defaultDescription}
          defaultCategory={defaultCategory}
        />
        
        <UploadActions
          uploading={uploading}
          isValid={!!videoTitle}
          onUpload={handleUploadClick}
        />
      </div>
    </div>
  );
};
