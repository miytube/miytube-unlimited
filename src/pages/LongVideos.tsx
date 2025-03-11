
import React from 'react';
import { Layout } from '@/components/Layout';
import { Film } from 'lucide-react';
import { FileUploader } from '@/components/FileUploader';
import { useToast } from "@/hooks/use-toast";
import { LongVideosHeader } from '@/components/longVideos/LongVideosHeader';
import { UploadRequirements } from '@/components/longVideos/UploadRequirements';
import { FeaturedLongVideos } from '@/components/longVideos/FeaturedLongVideos';
import { VideoCategories } from '@/components/longVideos/VideoCategories';
import { 
  featuredLongVideos, 
  supportedVideoFormats, 
  supportedAudioFormats,
  videoCategories 
} from '@/components/longVideos/longVideosData';

const LongVideos = () => {
  const { toast } = useToast();
  
  const handleUpload = (files: File[]) => {
    toast({
      title: "Video uploaded",
      description: `${files.length} ${files.length === 1 ? 'video' : 'videos'} uploaded successfully.`,
    });
  };

  const handleUploadClick = () => {
    document.getElementById('video-upload-input')?.click();
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in">
        <LongVideosHeader onUploadClick={handleUploadClick} />
        
        <FileUploader
          icon={Film}
          title="Upload Long-Form Content"
          description="MiyTube supports videos up to 10 hours in length with no storage restrictions. Perfect for lectures, concerts, documentaries, and other long-form content."
          acceptedTypes="video/*"
          supportedFormats={supportedVideoFormats}
          maxSize="128GB"
          onUpload={handleUpload}
        />
        
        <UploadRequirements 
          videoFormats={supportedVideoFormats}
          audioFormats={supportedAudioFormats}
        />
        
        <FeaturedLongVideos videos={featuredLongVideos} />
        
        <VideoCategories categories={videoCategories} />
      </div>
    </Layout>
  );
};

export default LongVideos;
