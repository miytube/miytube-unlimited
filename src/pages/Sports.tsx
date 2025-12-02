
import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Trophy, Upload, Activity, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sports = () => {
  const sportsCategories = [
    { id: 'sports-nfl-football', name: 'NFL Football', icon: <Trophy size={24} /> },
    { id: 'sports-nba-basketball', name: 'NBA Basketball', icon: <Activity size={24} /> },
    { id: 'sports-mlb-baseball', name: 'MLB Baseball', icon: <Trophy size={24} /> },
    { id: 'sports-nhl-hockey', name: 'NHL Hockey', icon: <Activity size={24} /> },
    { id: 'sports-soccer', name: 'Soccer', icon: <Trophy size={24} /> },
    { id: 'sports-professional-golf', name: 'Golf', icon: <Dumbbell size={24} /> },
    { id: 'sports-tennis-men', name: 'Tennis Men', icon: <Dumbbell size={24} /> },
    { id: 'sports-tennis-women', name: 'Tennis Women', icon: <Dumbbell size={24} /> },
    { id: 'sports-mma-ufc', name: 'MMA/UFC', icon: <Activity size={24} /> },
    { id: 'sports-boxing', name: 'Boxing', icon: <Trophy size={24} /> },
    { id: 'sports-wwe-wrestling', name: 'WWE Wrestling', icon: <Activity size={24} /> },
    { id: 'sports-rugby-cricket', name: 'Rugby & Cricket', icon: <Trophy size={24} /> },
    { id: 'sports-track-field', name: 'Track & Field', icon: <Dumbbell size={24} /> },
    { id: 'sports-volleyball', name: 'Volleyball', icon: <Activity size={24} /> },
    { id: 'sports-olympics-track', name: 'Olympics', icon: <Trophy size={24} /> },
    { id: 'sports-nascar', name: 'NASCAR', icon: <Activity size={24} /> },
    { id: 'sports-formula-one', name: 'Formula One', icon: <Dumbbell size={24} /> },
    { id: 'sports-horse-racing', name: 'Horse Racing', icon: <Trophy size={24} /> },
  ];
  
  // Generate 20 videos for 4x5 grid
  const sportsVideos = Array.from({ length: 20 }, (_, i) => ({
    id: `sports-${i + 1}`,
    title: `${['NFL', 'NBA', 'MLB', 'NHL', 'Soccer'][i % 5]} - ${['Top Plays', 'Highlights', 'Finals', 'Championship', 'Best Moments'][i % 5]} ${i + 1}`,
    thumbnail: `https://images.unsplash.com/photo-${1566577739112 + i * 1000}-5180d4bf9390?auto=format&fit=crop&w=800&q=80`,
    channelName: `Sports Channel ${i + 1}`,
    views: `${Math.floor(Math.random() * 900) + 100}K`,
    timestamp: `${Math.floor(Math.random() * 30) + 1} days ago`,
    duration: `${Math.floor(Math.random() * 20) + 10}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  }));

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">MiyTube / Sports</p>
            <div className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Sports</h1>
            </div>
          </div>
          <Link to="/upload/video" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
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
                to={`/${category.id}`}
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
        
        {/* Trending Sports Videos - 4x5 Grid */}
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
