
import React from 'react';
import { Layout } from '@/components/Layout';
import { Moon, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';

const Meditation = () => {
  // Generate 20 sample meditation videos for 4x5 grid
  const meditationVideos = Array.from({ length: 20 }, (_, i) => ({
    id: `meditation-${i + 1}`,
    title: `Meditation Session ${i + 1} - ${['Mindfulness', 'Sleep', 'Stress Relief', 'Morning', 'Anxiety', 'Focus'][i % 6]} Meditation`,
    thumbnail: `https://images.unsplash.com/photo-${1544367567738 + i * 1000}-b89239b6d5d8?auto=format&fit=crop&w=800&q=80`,
    channelName: `Zen Master ${i + 1}`,
    views: `${Math.floor(Math.random() * 900) + 100}K`,
    timestamp: `${Math.floor(Math.random() * 30) + 1} days ago`,
    duration: `${Math.floor(Math.random() * 45) + 15}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  }));
  
  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-muted-foreground text-sm">MiyTube</span>
          <span className="text-muted-foreground text-sm">/</span>
          <span className="text-sm font-medium">Meditation</span>
        </div>
        
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Moon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Meditation</h1>
            <p className="text-muted-foreground ml-2">
              Find peace and relaxation with meditation audio
            </p>
          </div>
          <Link 
            to="/upload" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload Meditation</span>
          </Link>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Featured Meditation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {meditationVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Popular Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Mindfulness', slug: 'mindfulness' },
              { name: 'Sleep', slug: 'sleep' },
              { name: 'Stress Relief', slug: 'stress-relief' },
              { name: 'Morning', slug: 'morning' },
              { name: 'Anxiety', slug: 'anxiety' },
              { name: 'Focus', slug: 'focus' },
            ].map((category) => (
              <Link key={category.slug} to={`/meditation/${category.slug}`} className="block">
                <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                  <div className="text-center">
                    <Moon size={32} className="mx-auto mb-2 text-primary" />
                    <div className="font-medium">{category.name}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Meditation;
