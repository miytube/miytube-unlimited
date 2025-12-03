
import React from 'react';
import { Layout } from '@/components/Layout';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { MusicHeader } from '@/components/music/MusicHeader';
import { FeaturedAudio } from '@/components/music/FeaturedAudio';
import { MusicCategories } from '@/components/music/MusicCategories';
import { audioSamples, musicCategories } from '@/components/music/musicData';
import { VideoCard } from '@/components/VideoCard';

const Music = () => {
  const { uploadedVideos } = useUploadedVideos();
  
  // Get all music-related uploaded videos
  const musicVideos = uploadedVideos.filter(video => {
    const category = video.category?.toLowerCase() || '';
    // Match any music-related categories
    return category === 'music' || 
           category === 'pop' || 
           category === 'rock' || 
           category === 'hiphop' || 
           category === 'electronic' ||
           category === 'jazz' ||
           category === 'country' ||
           category === 'classical' ||
           category === 'rnb' ||
           category === 'soul' ||
           category === 'folk' ||
           category === 'blues';
  });
  
  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <MusicHeader />
        
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
        
        <FeaturedAudio audioTracks={audioSamples} />
        
        <MusicCategories categories={musicCategories} />
      </div>
    </Layout>
  );
};

export default Music;
