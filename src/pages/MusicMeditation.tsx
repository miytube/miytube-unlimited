
import React from 'react';
import { Layout } from '@/components/Layout';
import { Music, Moon, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';
import { useUploadedVideos } from '@/context/UploadedVideosContext';

const MusicMeditation = () => {
  const { uploadedVideos } = useUploadedVideos();
  
  // Filter for meditation music videos
  const meditationMusicVideos = uploadedVideos.filter(video => 
    (video.category === 'meditation' || video.category === 'music') &&
    (video.subcategory?.toLowerCase().includes('meditation') ||
     video.title?.toLowerCase().includes('meditation') ||
     video.tags?.some(tag => 
       tag.toLowerCase().includes('meditation') || 
       tag.toLowerCase().includes('relaxation') ||
       tag.toLowerCase().includes('calm')
     ))
  );
  
  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-muted-foreground text-sm">MiyTube</span>
          <span className="text-muted-foreground text-sm">/</span>
          <span className="text-muted-foreground text-sm">Music</span>
          <span className="text-muted-foreground text-sm">/</span>
          <span className="text-sm font-medium">Meditation Music</span>
        </div>
        
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Music className="h-8 w-8 text-primary" />
              <Moon className="h-4 w-4 text-primary absolute -bottom-1 -right-1" />
            </div>
            <h1 className="text-3xl font-bold">Meditation Music</h1>
            <p className="text-muted-foreground ml-2">
              Relaxing music for meditation, sleep, and mindfulness
            </p>
          </div>
          <Link 
            to="/upload" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload Music</span>
          </Link>
        </div>
        
        {meditationMusicVideos.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Meditation Music Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {meditationMusicVideos.slice(0, 20).map((video) => (
                <VideoCard 
                  key={video.id} 
                  id={video.id}
                  title={video.title}
                  thumbnail={video.thumbnail}
                  channelName="Your Channel"
                  views={video.views}
                  timestamp={video.timestamp}
                  duration={video.duration}
                  description={video.description}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg mb-8">
            <div className="relative inline-block mb-4">
              <Music className="h-16 w-16 text-muted-foreground" />
              <Moon className="h-8 w-8 text-muted-foreground absolute -bottom-2 -right-2" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Meditation Music Yet</h3>
            <p className="text-muted-foreground mb-4">Upload relaxing music for meditation and mindfulness!</p>
            <Link 
              to="/upload" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Meditation Music</span>
            </Link>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-semibold mb-4">Browse by Mood</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Deep Sleep', slug: 'deep-sleep' },
              { name: 'Calm', slug: 'calm' },
              { name: 'Focus', slug: 'focus' },
              { name: 'Healing', slug: 'healing' },
              { name: 'Spa', slug: 'spa' },
              { name: 'Zen', slug: 'zen' },
            ].map((category) => (
              <Link key={category.slug} to={`/music-meditation/${category.slug}`} className="block">
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

export default MusicMeditation;
