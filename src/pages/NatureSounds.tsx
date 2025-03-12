
import React from 'react';
import { Layout } from '@/components/Layout';
import { Leaf, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AudioCard } from '@/components/music/AudioCard';
import { audioSamples } from '@/components/music/musicData';

const NatureSounds = () => {
  // Filter audio samples or use all for demonstration
  const natureSoundsSamples = audioSamples.slice(0, 6);
  
  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Leaf className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Nature Sounds</h1>
            <p className="text-muted-foreground ml-2">
              Relax with the sounds of nature
            </p>
          </div>
          <Link 
            to="/upload" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload Nature Sounds</span>
          </Link>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Featured Nature Sounds</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {natureSoundsSamples.map((audio) => (
              <AudioCard key={audio.id} audio={audio} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Types of Nature Sounds</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link to="/nature-sounds/rain" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Leaf size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Rain</div>
                </div>
              </div>
            </Link>
            <Link to="/nature-sounds/ocean" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Leaf size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Ocean</div>
                </div>
              </div>
            </Link>
            <Link to="/nature-sounds/forest" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Leaf size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Forest</div>
                </div>
              </div>
            </Link>
            <Link to="/nature-sounds/birds" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Leaf size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Birds</div>
                </div>
              </div>
            </Link>
            <Link to="/nature-sounds/thunderstorm" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Leaf size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Thunderstorm</div>
                </div>
              </div>
            </Link>
            <Link to="/nature-sounds/waterfall" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Leaf size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Waterfall</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NatureSounds;
