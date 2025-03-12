
import React from 'react';
import { Layout } from '@/components/Layout';
import { useToast } from "@/hooks/use-toast";
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { MusicHeader } from '@/components/music/MusicHeader';
import { FeaturedAudio } from '@/components/music/FeaturedAudio';
import { MusicCategories } from '@/components/music/MusicCategories';
import { audioSamples, musicCategories } from '@/components/music/musicData';

const Music = () => {
  const { toast } = useToast();
  const { addUploadedVideo } = useUploadedVideos();
  
  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <MusicHeader />
        
        <FeaturedAudio audioTracks={audioSamples} />
        
        <MusicCategories categories={musicCategories} />
      </div>
    </Layout>
  );
};

export default Music;
