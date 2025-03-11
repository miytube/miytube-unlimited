import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useLocation } from 'react-router-dom';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { VideoInfo } from '@/components/watch/VideoInfo';
import { RecommendedVideos } from '@/components/watch/RecommendedVideos';
import { CommentsSection } from '@/components/watch/CommentsSection';
import { useUploadedVideos } from '@/context/UploadedVideosContext';

// Mock data for recommended videos
const recommendedVideos = [
  {
    id: 'rec1',
    title: 'How to Build a Responsive Website',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    channelName: 'Code Masters',
    views: '1.4M',
    timestamp: '2 months ago',
    duration: '18:24',
    description: 'Learn the fundamentals of responsive web design',
  },
  {
    id: 'rec2',
    title: 'The Future of Design Systems',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
    channelName: 'UI Designers',
    views: '852K',
    timestamp: '3 weeks ago',
    duration: '24:15',
    description: 'Exploring modern design systems',
  },
  {
    id: 'rec3',
    title: 'Mastering Mobile Photography',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    channelName: 'Photo Pro',
    views: '2.1M',
    timestamp: '5 months ago',
    duration: '12:33',
    description: 'Tips and tricks for mobile photography',
  },
  {
    id: 'rec4',
    title: 'Creating Engaging Content for Social Media',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    channelName: 'Social Media Guru',
    views: '736K',
    timestamp: '1 month ago',
    duration: '15:45',
    description: 'Strategies for social media content',
  },
];

const Watch = () => {
  const location = useLocation();
  const { uploadedVideos } = useUploadedVideos();
  const [videoData, setVideoData] = useState({
    title: 'How to Design Beautiful Interfaces',
    description: 'Learn the fundamentals of interface design with practical examples and case studies. This comprehensive guide will help you understand the principles of good design and how to apply them to your projects.',
    views: '1.2M',
    timestamp: '3 days ago',
    channelName: 'Design Masters',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    tags: [],
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const videoId = params.get('v');
    
    if (videoId) {
      // Check if it's an uploaded video
      const uploadedVideo = uploadedVideos.find(v => v.id === videoId);
      
      if (uploadedVideo) {
        // Set video data from uploaded video
        setVideoData({
          title: uploadedVideo.title,
          description: uploadedVideo.description,
          views: uploadedVideo.views,
          timestamp: uploadedVideo.timestamp,
          channelName: 'Your Channel',
          src: URL.createObjectURL(uploadedVideo.file),
          tags: uploadedVideo.tags,
        });
      }
      // If not an uploaded video, we keep the default mock data
    }
  }, [location.search, uploadedVideos]);

  return (
    <Layout>
      <div className="py-4 grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-[1600px] mx-auto px-2 sm:px-4">
        <div className="lg:col-span-2">
          <VideoPlayer src={videoData.src} />
          <VideoInfo
            title={videoData.title}
            channelName={videoData.channelName}
            views={videoData.views}
            timestamp={videoData.timestamp}
            description={videoData.description}
            tags={videoData.tags}
          />
          <CommentsSection />
        </div>
        <div>
          <RecommendedVideos videos={recommendedVideos} />
        </div>
      </div>
    </Layout>
  );
};

export default Watch;
