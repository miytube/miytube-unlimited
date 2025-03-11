
import React from 'react';
import { Layout } from '@/components/Layout';
import { CategoryDropdown } from '@/components/categories/CategoryDropdown';
import { Music as MusicIcon, Play, Upload, Clock, Heart, MoreHorizontal } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { useNavigate } from 'react-router-dom';

const Music = () => {
  const { toast } = useToast();
  const { addUploadedVideo } = useUploadedVideos();
  const navigate = useNavigate();
  
  const audioSamples = [
    {
      id: 'audio1',
      title: 'Ambient Electronic',
      artist: 'Sound Waves',
      duration: '3:24',
      plays: '246K',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'audio2',
      title: 'Jazz Ensemble',
      artist: 'Smooth Notes',
      duration: '5:17',
      plays: '128K',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'audio3',
      title: 'Acoustic Guitar',
      artist: 'String Melodies',
      duration: '4:05',
      plays: '352K',
      image: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'audio4',
      title: 'Hip Hop Beat',
      artist: 'Urban Rhythm',
      duration: '2:58',
      plays: '189K',
      image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'audio5',
      title: 'Piano Sonata',
      artist: 'Classic Keys',
      duration: '6:12',
      plays: '275K',
      image: 'https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'audio6',
      title: 'Synthwave Night',
      artist: 'Retro Future',
      duration: '4:32',
      plays: '164K',
      image: 'https://images.unsplash.com/photo-1614149162883-81628d7c9a62?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MusicIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Music</h1>
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
            onClick={() => navigate('/upload')}
          >
            <Upload size={18} />
            <span>Upload Music</span>
          </button>
        </div>
        
        <CategoryDropdown />
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Featured Audio</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {audioSamples.map((audio) => (
              <div key={audio.id} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-card">
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={audio.image} 
                    alt={audio.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                      <Play size={24} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{audio.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{audio.artist}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock size={14} />
                        {audio.duration}
                      </span>
                      <span className="text-muted-foreground">{audio.plays} plays</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-muted-foreground hover:text-primary transition-colors">
                        <Heart size={18} />
                      </button>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Popular Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Music', 'Podcasts', 'Audiobooks', 'Sound Effects', 'Meditation', 'ASMR', 'Speech', 'Educational', 'Gaming', 'Nature Sounds', 'Comedy', 'Interviews'].map((category) => (
              <div key={category} className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <MusicIcon size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">{category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Music;
