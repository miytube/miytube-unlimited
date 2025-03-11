import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useParams } from 'react-router-dom';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { RecommendedVideos } from '@/components/watch/RecommendedVideos';
import { VideoComments } from '@/components/watch/VideoComments';
import { VideoInfo } from '@/components/watch/VideoInfo';
import { VideoDescription } from '@/components/watch/VideoDescription';
import { useVideos } from '@/hooks/useVideos';
import { useUploadedVideos } from '@/context/UploadedVideosContext';

const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const { getVideoById } = useVideos();
  const { uploadedVideos } = useUploadedVideos();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      // Check if it's an uploaded video first
      const uploadedVideo = uploadedVideos.find(v => v.id === id);
      
      if (uploadedVideo) {
        setVideo({
          id: uploadedVideo.id,
          title: uploadedVideo.title,
          description: uploadedVideo.description,
          channelName: 'Your Channel',
          channelAvatar: 'https://ui-avatars.com/api/?name=Your+Channel&background=random',
          views: '0 views',
          timestamp: 'Just now',
          likes: '0',
          subscribers: '0',
          file: uploadedVideo.file,
          tags: uploadedVideo.tags || []
        });
        setLoading(false);
      } else {
        // Otherwise fetch from mock API
        const fetchedVideo = getVideoById(id);
        if (fetchedVideo) {
          setVideo(fetchedVideo);
        }
        setLoading(false);
      }
    }
  }, [id, getVideoById, uploadedVideos]);
  
  // Mock recommended videos
  const recommendedVideos = [
    {
      id: 'rec1',
      title: 'How to Build a Website with React',
      thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&q=80',
      channelName: 'React Masters',
      views: '1.2M views',
      timestamp: '2 months ago',
      duration: '15:24',
      description: 'Learn how to build a modern website using React and Tailwind CSS.'
    },
    {
      id: 'rec2',
      title: 'Advanced JavaScript Techniques',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      channelName: 'JS Wizards',
      views: '856K views',
      timestamp: '3 weeks ago',
      duration: '22:15',
      description: 'Master advanced JavaScript concepts and patterns.'
    },
    {
      id: 'rec3',
      title: 'CSS Grid Layout Tutorial',
      thumbnail: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=800&q=80',
      channelName: 'CSS Experts',
      views: '450K views',
      timestamp: '1 month ago',
      duration: '18:30',
      description: 'Learn how to create responsive layouts with CSS Grid.'
    },
    {
      id: 'rec4',
      title: 'TypeScript for Beginners',
      thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80',
      channelName: 'TypeScript Tutorials',
      views: '325K views',
      timestamp: '2 weeks ago',
      duration: '25:42',
      description: 'Get started with TypeScript and learn how to use it in your projects.'
    },
  ];
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }
  
  if (!video) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Video not found</h2>
            <p className="text-muted-foreground">The video you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="py-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg overflow-hidden shadow-md">
              <VideoPlayer videoFile={video.file} title={video.title} />
            </div>
            
            <VideoInfo 
              title={video.title}
              channelName={video.channelName}
              channelAvatar={video.channelAvatar}
              subscribers={video.subscribers}
              views={video.views}
              timestamp={video.timestamp}
              likes={video.likes}
              tags={video.tags}
            />
            
            <VideoDescription description={video.description} />
            
            <VideoComments videoId={video.id} />
          </div>
          
          <div>
            <RecommendedVideos videos={recommendedVideos} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Watch;
