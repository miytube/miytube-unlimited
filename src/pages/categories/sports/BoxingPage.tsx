
import React from 'react';
import { Layout } from '@/components/Layout';
import { Trophy, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';

const BoxingPage = () => {
  // Sample videos for demo purposes
  const boxingVideos = [
    {
      id: 'boxing-1',
      title: 'Professional Boxing Highlights',
      thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80',
      channelName: 'Boxing Channel',
      views: '1.2M',
      timestamp: '3 days ago',
      duration: '14:35',
    },
    {
      id: 'boxing-2',
      title: 'Street Fighting Techniques',
      thumbnail: 'https://images.unsplash.com/photo-1590056764316-9c5aeb61e2e9?auto=format&fit=crop&w=800&q=80',
      channelName: 'Fight Training',
      views: '856K',
      timestamp: '1 week ago',
      duration: '22:15',
    },
    {
      id: 'boxing-3',
      title: 'Best Boxing Matches 2023',
      thumbnail: 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?auto=format&fit=crop&w=800&q=80',
      channelName: 'Sports Highlights',
      views: '2.3M',
      timestamp: '2 months ago',
      duration: '18:42',
    },
    {
      id: 'boxing-4',
      title: 'Boxing Training for Beginners',
      thumbnail: 'https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?auto=format&fit=crop&w=800&q=80',
      channelName: 'Training Hub',
      views: '4.5M',
      timestamp: '5 months ago',
      duration: '12:18',
    },
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Boxing</h1>
            <p className="text-muted-foreground ml-2">
              Professional boxing, street fighting, and combat sports
            </p>
          </div>
          <Link 
            to="/upload" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload Boxing Content</span>
          </Link>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Featured Boxing Content</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boxingVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Boxing Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link to="/sports/boxing/professional" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Trophy size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Professional</div>
                </div>
              </div>
            </Link>
            <Link to="/sports/boxing/street-fighting" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Trophy size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Street Fighting</div>
                </div>
              </div>
            </Link>
            <Link to="/sports/boxing/training" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Trophy size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Training</div>
                </div>
              </div>
            </Link>
            <Link to="/sports/boxing/amateur" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Trophy size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Amateur</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BoxingPage;
