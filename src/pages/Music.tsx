
import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { useParams } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { Music as MusicIcon } from 'lucide-react';

const Music = () => {
  const { category } = useParams<{ category: string }>();
  const { getVideosByCategory, uploadedVideos } = useUploadedVideos();
  
  const musicVideos = category 
    ? getVideosByCategory('music', category)
    : getVideosByCategory('music');
  
  console.log("Music videos:", musicVideos);
  
  const mockMusicVideos = [
    {
      id: 'music1',
      title: 'Summer Vibes Mix 2023',
      thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      channelName: 'Mix Masters',
      views: '1.8M',
      timestamp: '2 weeks ago',
      duration: '58:24',
    },
    {
      id: 'music2',
      title: 'Acoustic Coffee Shop Playlist',
      thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80',
      channelName: 'Acoustic Vibes',
      views: '765K',
      timestamp: '1 month ago',
      duration: '1:12:30',
    },
    {
      id: 'music3',
      title: 'Classical Piano Masterpieces',
      thumbnail: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80',
      channelName: 'Classical Channel',
      views: '450K',
      timestamp: '3 weeks ago',
      duration: '45:12',
    },
    {
      id: 'music4',
      title: 'Electronic Dance Music 2023',
      thumbnail: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80',
      channelName: 'EDM World',
      views: '2.1M',
      timestamp: '5 days ago',
      duration: '1:05:45',
    },
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <MusicIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Music` : 'Music Channel'}
          </h1>
          <p className="text-muted-foreground ml-2">
            Discover and enjoy the latest music videos and trending tracks
          </p>
        </div>
        
        {/* Display uploaded music videos if any */}
        {musicVideos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">Your Music Uploads</h2>
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
                  tags={video.tags}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Display popular music videos */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Popular Music</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockMusicVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Music;
