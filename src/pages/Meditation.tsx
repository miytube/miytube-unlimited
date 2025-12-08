
import React from 'react';
import { Layout } from '@/components/Layout';
import { Moon, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosByCategory } from '@/utils/videoFiltering';

const Meditation = () => {
  const { uploadedVideos } = useUploadedVideos();
  
  // Filter for meditation-related videos using strict matching
  const meditationKeywords = ['meditation', 'mindfulness', 'meditation-mindfulness', 'meditation-sleep', 'meditation-stress-relief', 'meditation-morning', 'meditation-anxiety', 'meditation-focus'];
  const meditationVideos = filterVideosByCategory(uploadedVideos, 'meditation', meditationKeywords);
  
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
        
        {meditationVideos.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Meditation Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {meditationVideos.slice(0, 20).map((video) => (
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
            <Moon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Meditation Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload meditation content!</p>
            <Link 
              to="/upload" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Meditation Content</span>
            </Link>
          </div>
        )}

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
