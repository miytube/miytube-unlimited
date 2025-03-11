
import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Music as MusicIcon, Upload, Play, Disc3, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

const Music = () => {
  const musicCategories = [
    { id: 'pop', name: 'Pop', icon: <MusicIcon size={24} /> },
    { id: 'rock', name: 'Rock', icon: <Disc3 size={24} /> },
    { id: 'hip-hop', name: 'Hip Hop', icon: <Headphones size={24} /> },
    { id: 'electronic', name: 'Electronic', icon: <Play size={24} /> },
    { id: 'jazz', name: 'Jazz', icon: <MusicIcon size={24} /> },
    { id: 'classical', name: 'Classical', icon: <Disc3 size={24} /> },
  ];
  
  const musicVideos = [
    {
      id: 'music1',
      title: 'Top Summer Hits 2023 - Official Music Video',
      thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      channelName: 'Music Masters',
      views: '1.5M',
      timestamp: '2 weeks ago',
      duration: '4:35',
    },
    {
      id: 'music2',
      title: 'Classical Piano Sonata in D Minor - Live Performance',
      thumbnail: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80',
      channelName: 'Classical Channel',
      views: '850K',
      timestamp: '1 month ago',
      duration: '12:18',
    },
    {
      id: 'music3',
      title: 'Electronic Dance Music Festival Highlights',
      thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80',
      channelName: 'EDM World',
      views: '2.3M',
      timestamp: '3 days ago',
      duration: '8:42',
    },
    {
      id: 'music4',
      title: 'Jazz Quartet Live at Blue Note',
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      channelName: 'Jazz Lovers',
      views: '620K',
      timestamp: '2 months ago',
      duration: '15:30',
    },
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <MusicIcon className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Music</h1>
          </div>
          <Link to="/upload/video" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
            <Upload size={18} />
            <span>Upload Music Video</span>
          </Link>
        </div>
        
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {musicCategories.map((category) => (
              <Link 
                key={category.id} 
                to={`/music/${category.id}`}
                className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {category.icon}
                </div>
                <span className="font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Trending Music Videos */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Trending Music Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {musicVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Music;
