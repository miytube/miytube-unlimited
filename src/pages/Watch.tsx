
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { VideoInfo } from '@/components/watch/VideoInfo';
import { CommentsSection } from '@/components/watch/CommentsSection';
import { RecommendedVideos } from '@/components/watch/RecommendedVideos';

const mockVideos = [
  {
    id: 'video1',
    title: 'How to Design Beautiful Interfaces',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    channelName: 'Design Masters',
    views: '1.2M',
    timestamp: '3 days ago',
    duration: '14:35',
    description: 'Learn the principles of creating beautiful, functional interfaces that users will love. This tutorial covers color theory, typography, spacing, and more.',
  },
  {
    id: 'video2',
    title: 'The Future of Technology: AI and Machine Learning Advancements',
    thumbnail: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=800&q=80',
    channelName: 'Tech Insights',
    views: '856K',
    timestamp: '1 week ago',
    duration: '22:15',
    description: 'In this video, we explore the latest advancements in artificial intelligence and machine learning. Learn how these technologies are shaping our future.',
  },
  {
    id: 'video3',
    title: 'Beautiful Cinematic Film Making Tutorial',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
    channelName: 'Film Academy',
    views: '2.3M',
    timestamp: '2 months ago',
    duration: '18:42',
    description: 'Master the art of cinematic filmmaking with this comprehensive tutorial. Learn about camera movement, lighting, composition, and editing techniques.',
  },
  {
    id: 'video4',
    title: 'Morning Routine: Productivity Tips for Entrepreneurs',
    thumbnail: 'https://images.unsplash.com/photo-1507090960745-b32f65d3113a?auto=format&fit=crop&w=800&q=80',
    channelName: 'Productivity Pro',
    views: '4.5M',
    timestamp: '5 months ago',
    duration: '12:18',
    description: 'Start your day right with these productivity tips designed specifically for entrepreneurs. Develop habits that will boost your productivity and success.',
  },
  {
    id: 'video5',
    title: 'Learn Web Development in 2023: Complete Roadmap',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    channelName: 'Code Masters',
    views: '1.8M',
    timestamp: '3 weeks ago',
    duration: '32:45',
    description: 'This comprehensive roadmap will guide you through learning web development in 2023. From HTML and CSS to advanced frameworks and backend technologies.',
  },
];

const Watch = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v') || 'video1';
  
  // Find the current video
  const currentVideo = mockVideos.find(video => video.id === videoId) || mockVideos[0];
  
  // Recommended videos (excluding current)
  const recommendedVideos = mockVideos.filter(video => video.id !== videoId);
  
  // Scroll to top on video change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [videoId]);

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto py-4">
        <div className="lg:w-2/3">
          {/* Video Player - Properly sized container */}
          <div className="mb-4 w-full">
            <VideoPlayer videoId={videoId} title={currentVideo.title} />
          </div>
          
          {/* Video Info */}
          <VideoInfo 
            title={currentVideo.title}
            channelName={currentVideo.channelName}
            views={currentVideo.views}
            timestamp={currentVideo.timestamp}
            description={currentVideo.description}
          />
          
          {/* Comments */}
          <CommentsSection />
        </div>
        
        {/* Recommended Videos */}
        <div className="lg:w-1/3">
          <RecommendedVideos videos={recommendedVideos} />
        </div>
      </div>
    </Layout>
  );
};

export default Watch;
