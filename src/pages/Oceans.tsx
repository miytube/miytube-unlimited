
import React from 'react';
import { Layout } from '@/components/Layout';
import { Waves, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AudioCard } from '@/components/music/AudioCard';
import { audioSamples } from '@/components/music/musicData';

const Oceans = () => {
  // Filter audio samples or use all for demonstration
  const oceanSamples = audioSamples.slice(0, 6);
  
  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Waves className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Oceans</h1>
            <p className="text-muted-foreground ml-2">
              Explore the sounds of the ocean
            </p>
          </div>
          <Link 
            to="/upload/audio" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload Ocean Sounds</span>
          </Link>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Featured Ocean Sounds</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {oceanSamples.map((audio) => (
              <AudioCard key={audio.id} audio={audio} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Ocean Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link to="/oceans/waves" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Waves size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Waves</div>
                </div>
              </div>
            </Link>
            <Link to="/oceans/seagulls" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Waves size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Seagulls</div>
                </div>
              </div>
            </Link>
            <Link to="/oceans/beach" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Waves size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Beach</div>
                </div>
              </div>
            </Link>
            <Link to="/oceans/underwater" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Waves size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Underwater</div>
                </div>
              </div>
            </Link>
            <Link to="/oceans/sea-life" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Waves size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Sea Life</div>
                </div>
              </div>
            </Link>
            <Link to="/oceans/storms" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Waves size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Storms</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Oceans;
