import React from 'react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';
import { Layout } from '@/components/Layout';

const mockVideos = [
  {
    id: 'video1',
    title: 'How to Design Beautiful Interfaces',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    channelName: 'Design Masters',
    views: '1.2M',
    timestamp: '3 days ago',
    duration: '14:35',
  },
  {
    id: 'video2',
    title: 'The Future of Technology: AI and Machine Learning Advancements',
    thumbnail: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=800&q=80',
    channelName: 'Tech Insights',
    views: '856K',
    timestamp: '1 week ago',
    duration: '22:15',
  },
  {
    id: 'video3',
    title: 'Beautiful Cinematic Film Making Tutorial',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
    channelName: 'Film Academy',
    views: '2.3M',
    timestamp: '2 months ago',
    duration: '18:42',
  },
  {
    id: 'video4',
    title: 'Morning Routine: Productivity Tips for Entrepreneurs',
    thumbnail: 'https://images.unsplash.com/photo-1507090960745-b32f65d3113a?auto=format&fit=crop&w=800&q=80',
    channelName: 'Productivity Pro',
    views: '4.5M',
    timestamp: '5 months ago',
    duration: '12:18',
  },
  {
    id: 'video5',
    title: 'Learn Web Development in 2023: Complete Roadmap',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    channelName: 'Code Masters',
    views: '1.8M',
    timestamp: '3 weeks ago',
    duration: '32:45',
  },
  {
    id: 'video6',
    title: 'The Art of Product Photography',
    thumbnail: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80',
    channelName: 'Photo Pro',
    views: '720K',
    timestamp: '2 days ago',
    duration: '15:20',
  },
  {
    id: 'video7',
    title: 'Minimal Home Interior Design Ideas',
    thumbnail: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
    channelName: 'Interior Elegance',
    views: '950K',
    timestamp: '1 month ago',
    duration: '10:05',
  },
  {
    id: 'video8',
    title: 'Mastering Digital Marketing Strategies',
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80',
    channelName: 'Marketing Masters',
    views: '1.1M',
    timestamp: '2 weeks ago',
    duration: '27:30',
  },
];

const Index = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-medium mb-4">Recommended</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockVideos.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-medium mb-4">Trending</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockVideos.slice(4, 8).concat(mockVideos.slice(0, 4)).map((video) => (
            <VideoCard key={`trending-${video.id}`} {...video} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
