
import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Gamepad2, Upload, Target, Zap, Trophy, Dice1, Sparkles, Ticket, CreditCard, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';

const Gaming = () => {
  const { uploadedVideos } = useUploadedVideos();
  
  // Filter for gaming-related videos
  const gamingVideos = uploadedVideos.filter(video => 
    video.category === 'gaming' || 
    video.subcategory?.toLowerCase().includes('gaming') ||
    video.tags?.some(tag => tag.toLowerCase().includes('gaming') || tag.toLowerCase().includes('game'))
  );

  const gamingCategories = [
    { id: 'game-challenges', name: 'Game Challenges', icon: <Target size={24} />, path: '/gaming/game-challenges' },
    { id: 'game-toys', name: 'Game Toys', icon: <Sparkles size={24} />, path: '/gaming/game-toys' },
    { id: 'arcade-games', name: 'Arcade Games', icon: <Gamepad2 size={24} />, path: '/gaming/arcade-games' },
    { id: 'casino-slots', name: 'Casino Slots', icon: <Dice1 size={24} />, path: '/gaming/casino-slots' },
    { id: 'dominos', name: 'Dominos', icon: <Dice1 size={24} />, path: '/gaming/dominos' },
    { id: 'lottery', name: 'Lottery', icon: <Ticket size={24} />, path: '/gaming/lottery' },
    { id: 'xbox-playstation', name: 'Xbox & PlayStation', icon: <Smartphone size={24} />, path: '/gaming/xbox-playstation' },
    { id: 'gaming-cards', name: 'Gaming Cards', icon: <CreditCard size={24} />, path: '/gaming/gaming-cards' },
    { id: 'magic-tricks', name: 'Magic Tricks', icon: <Sparkles size={24} />, path: '/gaming/magic-tricks' },
    { id: 'fps', name: 'FPS', icon: <Target size={24} />, path: '/gaming/fps' },
    { id: 'moba', name: 'MOBA', icon: <Zap size={24} />, path: '/gaming/moba' },
    { id: 'esports', name: 'Esports', icon: <Trophy size={24} />, path: '/gaming/esports' },
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-muted-foreground text-sm">MiyTube</span>
          <span className="text-muted-foreground text-sm">/</span>
          <span className="text-sm font-medium">Gaming</span>
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Gaming</h1>
          </div>
          <Link to="/upload/video" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
            <Upload size={18} />
            <span>Upload Gaming Video</span>
          </Link>
        </div>
        
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {gamingCategories.map((category) => (
              <Link 
                key={category.id} 
                to={category.path}
                className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {category.icon}
                </div>
                <span className="font-medium text-center">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Gaming Videos */}
        {gamingVideos.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">Gaming Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gamingVideos.slice(0, 20).map((video) => (
                <VideoCard 
                  key={video.id} 
                  id={video.id}
                  title={video.title}
                  thumbnail={video.thumbnail}
                  channelName="Your Channel"
                  views={video.views}
                  timestamp={video.timestamp}
                  duration={video.duration}
                  description={video.description}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg mb-8">
            <Gamepad2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Gaming Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload gaming content!</p>
            <Link 
              to="/upload/video" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Gaming Video</span>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Gaming;
