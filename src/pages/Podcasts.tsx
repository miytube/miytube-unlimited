
import React from 'react';
import { Layout } from '@/components/Layout';
import { Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AudioCard } from '@/components/music/AudioCard';
import { audioSamples } from '@/components/music/musicData';

const Podcasts = () => {
  // Filter audio samples or use all for demonstration
  const podcastSamples = audioSamples.slice(0, 6);
  
  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Music className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Podcasts</h1>
            <p className="text-muted-foreground ml-2">
              Discover and enjoy podcasts
            </p>
          </div>
          <Link 
            to="/upload/music" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <span>Upload Podcast</span>
          </Link>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Featured Podcasts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {podcastSamples.map((audio) => (
              <AudioCard key={audio.id} audio={audio} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Popular Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link to="/podcasts/news" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Music size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">News & Politics</div>
                </div>
              </div>
            </Link>
            <Link to="/podcasts/comedy" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Music size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Comedy</div>
                </div>
              </div>
            </Link>
            <Link to="/podcasts/education" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Music size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Educational</div>
                </div>
              </div>
            </Link>
            <Link to="/podcasts/true-crime" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Music size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">True Crime</div>
                </div>
              </div>
            </Link>
            <Link to="/podcasts/business" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Music size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Business</div>
                </div>
              </div>
            </Link>
            <Link to="/podcasts/interviews" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Music size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Interviews</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Podcasts;
