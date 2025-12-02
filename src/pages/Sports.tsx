
import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Trophy, Upload, Activity, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sports = () => {
  const sportsCategories = [
    { id: 'football', name: 'Football', icon: <Trophy size={24} /> },
    { id: 'basketball', name: 'Basketball', icon: <Activity size={24} /> },
    { id: 'baseball', name: 'Baseball', icon: <Trophy size={24} /> },
    { id: 'hockey', name: 'Hockey', icon: <Activity size={24} /> },
    { id: 'soccer', name: 'Soccer', icon: <Trophy size={24} /> },
    { id: 'golf', name: 'Golf', icon: <Dumbbell size={24} /> },
    { id: 'tennis', name: 'Tennis', icon: <Dumbbell size={24} /> },
    { id: 'mma', name: 'MMA', icon: <Activity size={24} /> },
    { id: 'boxing', name: 'Boxing', icon: <Trophy size={24} /> },
    { id: 'wrestling', name: 'Wrestling', icon: <Activity size={24} /> },
    { id: 'cricket', name: 'Cricket', icon: <Trophy size={24} /> },
    { id: 'rugby', name: 'Rugby', icon: <Activity size={24} /> },
    { id: 'track-field', name: 'Track & Field', icon: <Dumbbell size={24} /> },
    { id: 'swimming', name: 'Swimming', icon: <Activity size={24} /> },
    { id: 'gymnastics', name: 'Gymnastics', icon: <Dumbbell size={24} /> },
    { id: 'olympics', name: 'Olympics', icon: <Trophy size={24} /> },
    { id: 'motorsports', name: 'Motorsports', icon: <Activity size={24} /> },
    { id: 'extreme-sports', name: 'Extreme Sports', icon: <Dumbbell size={24} /> },
  ];
  
  const sportsVideos = [
    {
      id: 'sports1',
      title: 'NFL 2023 Top Plays of the Week',
      thumbnail: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=800&q=80',
      channelName: 'SportsCenter',
      views: '3.2M',
      timestamp: '3 days ago',
      duration: '10:15',
    },
    {
      id: 'sports2',
      title: 'NBA Finals 2023 - Game 7 Highlights',
      thumbnail: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=800&q=80',
      channelName: 'NBA Official',
      views: '5.7M',
      timestamp: '1 week ago',
      duration: '15:42',
    },
    {
      id: 'sports3',
      title: 'Champions League Final - Full Match Analysis',
      thumbnail: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=800&q=80',
      channelName: 'Soccer World',
      views: '2.8M',
      timestamp: '5 days ago',
      duration: '22:10',
    },
    {
      id: 'sports4',
      title: 'Wimbledon 2023 - Men\'s Singles Final',
      thumbnail: 'https://images.unsplash.com/photo-1595435934349-5c8a5ef2d2b0?auto=format&fit=crop&w=800&q=80',
      channelName: 'Tennis Channel',
      views: '1.9M',
      timestamp: '2 weeks ago',
      duration: '18:35',
    },
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Sports</h1>
          </div>
          <Link to="/upload/video" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
            <Upload size={18} />
            <span>Upload Sports Video</span>
          </Link>
        </div>
        
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sportsCategories.map((category) => (
              <Link 
                key={category.id} 
                to={`/sports/${category.id}`}
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
        
        {/* Trending Sports Videos */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Trending in Sports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sportsVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sports;
