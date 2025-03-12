
import React from 'react';
import { Layout } from '@/components/Layout';
import { Smile, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AudioCard } from '@/components/music/AudioCard';
import { audioSamples } from '@/components/music/musicData';

const Comedy = () => {
  // Filter audio samples or use all for demonstration
  const comedySamples = audioSamples.slice(0, 6);
  
  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Smile className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Comedy</h1>
            <p className="text-muted-foreground ml-2">
              Laugh with our comedy content
            </p>
          </div>
          <Link 
            to="/upload/audio" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload Comedy</span>
          </Link>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Featured Comedy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {comedySamples.map((audio) => (
              <AudioCard key={audio.id} audio={audio} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Comedy Styles</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link to="/comedy/standup" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Smile size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Stand-up</div>
                </div>
              </div>
            </Link>
            <Link to="/comedy/sketches" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Smile size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Sketches</div>
                </div>
              </div>
            </Link>
            <Link to="/comedy/improv" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Smile size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Improv</div>
                </div>
              </div>
            </Link>
            <Link to="/comedy/satire" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Smile size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Satire</div>
                </div>
              </div>
            </Link>
            <Link to="/comedy/parody" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Smile size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Parody</div>
                </div>
              </div>
            </Link>
            <Link to="/comedy/interviews" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Smile size={32} className="mx-auto mb-2 text-primary" />
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

export default Comedy;
