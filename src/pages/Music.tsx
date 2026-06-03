import React from 'react';
import { Layout } from '@/components/Layout';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { MusicHeader } from '@/components/music/MusicHeader';
import { FeaturedMusicVideo } from '@/components/music/FeaturedMusicVideo';
import { MusicCategories } from '@/components/music/MusicCategories';
import { MusicVideosNeedingUpdate } from '@/components/music/MusicVideosNeedingUpdate';
import { UploadedAudioGrid } from '@/components/music/UploadedAudioGrid';
import { musicCategories } from '@/components/music/musicData';
import { VideoCard } from '@/components/VideoCard';
import { filterVideosByCategory } from '@/utils/videoFiltering';
import { usePageSEO } from '@/hooks/usePageSEO';
import { AdSlot } from '@/components/ads/AdSlot';

const Music = () => {
  const { uploadedVideos } = useUploadedVideos();
  usePageSEO({
    title: 'Music on MiyTube — Stream music videos and audio',
    description: 'Listen to music videos and audio on MiyTube across rock, pop, hip-hop, R&B, country, jazz, classical, electronic, and more.',
    path: '/music',
  });
  
  // Get all music-related uploaded videos using strict matching
  const musicKeywords = ['music', 'pop', 'rock', 'hiphop', 'electronic', 'jazz', 'country', 'classical', 'r-and-b', 'soul', 'folk', 'blues', 'music-pop', 'music-rock', 'music-country', 'music-jazz', 'music-classical'];
  const musicVideos = filterVideosByCategory(uploadedVideos, 'music', musicKeywords);
  
  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <MusicHeader />
        
        <MusicVideosNeedingUpdate />
        
        {/* Show uploaded music videos first */}
        {musicVideos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Your Uploaded Music</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {musicVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  thumbnail={video.thumbnail}
                  channelName="Your Channel"
                  views={video.views}
                  timestamp={video.timestamp}
                  duration={video.duration}
                />
              ))}
            </div>
          </div>
        )}
        
        <UploadedAudioGrid />

        <FeaturedMusicVideo />

        <MusicCategories categories={musicCategories} />
      </div>
    </Layout>
  );
};

export default Music;
