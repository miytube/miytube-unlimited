
import React from 'react';
import { Layout } from '@/components/Layout';
import { Smile, Upload, Mic, Tv, Laugh, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';

const Comedy = () => {
  // Generate 20 sample videos for 4x5 grid
  const comedyVideos = Array.from({ length: 20 }, (_, i) => ({
    id: `comedy-${i + 1}`,
    title: `Comedy Content ${i + 1}`,
    thumbnail: `https://images.unsplash.com/photo-${1550745165 + i * 1000}-9bc0b252726f?auto=format&fit=crop&w=800&q=80`,
    channelName: `Comedy Creator ${(i % 5) + 1}`,
    views: `${Math.floor(Math.random() * 900) + 100}K`,
    timestamp: `${(i % 7) + 1} days ago`,
    duration: `${Math.floor(Math.random() * 20) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  }));

  const comedyCategories = [
    { name: 'SNL, Saturday Night Live', icon: Tv, route: '/comedy-snl' },
    { name: 'Stand-up Comedy', icon: Mic, route: '/comedy-standup' },
    { name: 'Comedy Roasts', icon: Laugh, route: '/comedy-roasts' },
    { name: 'Funny Pranks', icon: Laugh, route: '/comedy-funny-pranks' },
    { name: 'Sitcoms', icon: Tv, route: '/comedy-sitcom' },
    { name: 'Bloopers', icon: Film, route: '/bloopers' },
    { name: 'Comedian Interviews', icon: Mic, route: '/comedians-interviews' },
    { name: 'Jokes & Pranks', icon: Laugh, route: '/comedy-jokes-pranks' },
  ];
  
  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-semibold text-primary">MiyTube</span> / Comedy
        </p>
        
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Smile className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Comedy</h1>
            <p className="text-muted-foreground ml-2">
              Laugh with our comedy content
            </p>
          </div>
          <Link 
            to="/upload" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload Comedy</span>
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Comedy Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {comedyCategories.map((category, index) => (
              <Link key={index} to={category.route} className="block">
                <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                  <div className="text-center p-2">
                    <category.icon size={32} className="mx-auto mb-2 text-primary" />
                    <div className="font-medium text-xs">{category.name}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Featured Comedy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {comedyVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Popular Comedy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {comedyVideos.slice(0, 20).map((video, index) => ({
              ...video,
              id: `popular-comedy-${index}`,
              title: `Popular Comedy - ${index + 1}`,
            })).map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">About Comedy</h2>
          <p className="text-muted-foreground">
            This category features comedy content including stand-up performances, sketches, pranks, and more.
            Explore videos from comedians and creators specializing in making you laugh.
          </p>
          <div className="mt-4">
            <Link to="/upload" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              <Upload size={18} />
              <span>Upload Comedy Content</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Comedy;
