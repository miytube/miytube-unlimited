
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { ThumbsUp, ThumbsDown, Share, Download, Flag, MessageSquare } from 'lucide-react';

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
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          {/* Video Player */}
          <div className="mb-4">
            <VideoPlayer videoId={videoId} title={currentVideo.title} />
          </div>
          
          {/* Video Info */}
          <div className="mb-6 animate-fade-in">
            <h1 className="text-xl md:text-2xl font-medium mb-2">{currentVideo.title}</h1>
            
            <div className="flex flex-wrap justify-between items-center gap-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg font-bold">
                  {currentVideo.channelName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">{currentVideo.channelName}</h3>
                  <p className="text-sm text-muted-foreground">1.2M subscribers</p>
                </div>
                <button className="ml-4 px-4 py-1.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex rounded-full overflow-hidden bg-secondary">
                  <button className="flex items-center gap-1 px-4 py-1.5 hover:bg-secondary/80 transition-colors">
                    <ThumbsUp size={18} />
                    <span className="text-sm font-medium">24K</span>
                  </button>
                  <div className="w-px bg-border h-full"></div>
                  <button className="flex items-center gap-1 px-4 py-1.5 hover:bg-secondary/80 transition-colors">
                    <ThumbsDown size={18} />
                  </button>
                </div>
                
                <button className="flex items-center gap-1 px-4 py-1.5 bg-secondary rounded-full hover:bg-secondary/80 transition-colors">
                  <Share size={18} />
                  <span className="text-sm font-medium">Share</span>
                </button>
                
                <button className="flex items-center gap-1 px-4 py-1.5 bg-secondary rounded-full hover:bg-secondary/80 transition-colors">
                  <Download size={18} />
                  <span className="text-sm font-medium">Download</span>
                </button>
                
                <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                  <Flag size={18} />
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{currentVideo.views} views</span>
                <span className="text-xs">•</span>
                <span>{currentVideo.timestamp}</span>
              </div>
              <p className="text-sm leading-relaxed">
                {currentVideo.description}
              </p>
            </div>
            
            {/* Comments */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={20} />
                <h3 className="font-medium">Comments</h3>
                <span className="text-sm text-muted-foreground">(643)</span>
              </div>
              
              <div className="flex gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0"></div>
                <div className="w-full">
                  <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    className="w-full bg-transparent border-b outline-none py-2 focus:border-primary transition-colors"
                  />
                </div>
              </div>
              
              {/* Comment examples */}
              <div className="space-y-4">
                {[1, 2, 3].map((comment) => (
                  <div key={comment} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">User Name</span>
                        <span className="text-xs text-muted-foreground">2 days ago</span>
                      </div>
                      <p className="text-sm mt-1">
                        This is an amazing video! I learned so much from this content, thank you for sharing your knowledge.
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <ThumbsUp size={14} />
                          <span>128</span>
                        </button>
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <ThumbsDown size={14} />
                        </button>
                        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Recommended Videos */}
        <div className="lg:w-1/3">
          <h3 className="text-lg font-medium mb-4">Recommended</h3>
          <div className="space-y-3 animate-fade-in">
            {recommendedVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Watch;
