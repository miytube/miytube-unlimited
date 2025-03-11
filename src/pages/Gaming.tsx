
import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Gamepad2, Upload, Target, Zap, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const Gaming = () => {
  const gamingCategories = [
    { id: 'fps', name: 'FPS', icon: <Target size={24} /> },
    { id: 'moba', name: 'MOBA', icon: <Zap size={24} /> },
    { id: 'rpg', name: 'RPG', icon: <Gamepad2 size={24} /> },
    { id: 'strategy', name: 'Strategy', icon: <Target size={24} /> },
    { id: 'simulation', name: 'Simulation', icon: <Gamepad2 size={24} /> },
    { id: 'esports', name: 'Esports', icon: <Trophy size={24} /> },
  ];
  
  const gamingVideos = [
    {
      id: 'gaming1',
      title: 'Call of Duty: Modern Warfare 3 - Full Gameplay Walkthrough',
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      channelName: 'GamersUnite',
      views: '4.5M',
      timestamp: '1 week ago',
      duration: '45:12',
    },
    {
      id: 'gaming2',
      title: 'League of Legends World Championship Finals Highlights',
      thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      channelName: 'Esports Central',
      views: '2.1M',
      timestamp: '3 days ago',
      duration: '22:38',
    },
    {
      id: 'gaming3',
      title: 'Minecraft Building Tips and Tricks for Beginners',
      thumbnail: 'https://images.unsplash.com/photo-1632749042901-936b337902df?auto=format&fit=crop&w=800&q=80',
      channelName: 'BlockMaster',
      views: '980K',
      timestamp: '2 weeks ago',
      duration: '18:25',
    },
    {
      id: 'gaming4',
      title: 'The Elder Scrolls VI - Official Trailer Analysis',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      channelName: 'RPG World',
      views: '3.7M',
      timestamp: '5 days ago',
      duration: '15:40',
    },
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Gaming</h1>
          </div>
          <Link to="/upload/video" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
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
                to={`/gaming/${category.id}`}
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
        
        {/* Trending Gaming Videos */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Trending in Gaming</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gamingVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Gaming;
