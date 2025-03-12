
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { FileUploader } from '@/components/upload/FileUploader';
import { Music, Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { CategoryDropdown } from '@/components/categories/CategoryDropdown';
import { contentTypes } from '@/data/contentTypes';
import { useUploadHandler } from '@/hooks/useUploadHandler';
import { MusicUploadRequirements } from '@/components/music/UploadRequirements';

const MusicUpload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleUpload } = useUploadHandler();
  const musicContentType = contentTypes.music;
  const audioFormats = musicContentType.supportedFormats;
  
  const onMusicUpload = (
    files: File[], 
    title: string, 
    description: string, 
    category?: string, 
    subcategory?: string, 
    tags?: string[]
  ) => {
    handleUpload(
      "Music", 
      files, 
      title, 
      description, 
      "music",
      musicContentType.destination,
      category, 
      subcategory, 
      tags
    );
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Music className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Upload Music</h1>
          <p className="text-muted-foreground ml-2">
            Share your music tracks with the world
          </p>
        </div>
        
        <div className="mb-8">
          <CategoryDropdown />
        </div>
        
        <MusicUploadRequirements audioFormats={audioFormats} />
        
        <FileUploader
          icon={Music}
          title="Upload Music Track"
          description="Upload your music, tracks, covers, remixes, and audio content."
          acceptedTypes="audio/*,.mp3,.wav,.flac,.aac,.ogg"
          supportedFormats={audioFormats}
          maxSize="10GB"
          onUpload={onMusicUpload}
          id="music-upload-input"
          uploadDestination={musicContentType.destination}
          categories={musicContentType.categories}
        />
      </div>
    </Layout>
  );
};

export default MusicUpload;
