
import React from 'react';
import { Layout } from '@/components/Layout';
import { Music, Play, Upload, Clock, Heart, MoreHorizontal } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { VideoCard } from '@/components/VideoCard';
import { filterVideosByCategory } from '@/utils/videoFiltering';

const Audio = () => {
  const navigate = useNavigate();
  const { uploadedVideos } = useUploadedVideos();
  
  // Filter for audio-related content using strict matching
  const audioKeywords = ['audio', 'music', 'podcast', 'sound', 'asmr', 'meditation', 'audiobook', 'sound-effects', 'nature-sounds'];
  const audioVideos = filterVideosByCategory(uploadedVideos, 'audio', audioKeywords);

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-semibold text-primary">MiyTube</span> / Audio
        </p>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Music className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">MiyTube Audio</h1>
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
            onClick={() => navigate('/upload')}
          >
            <Upload size={18} />
            <span>Upload Audio</span>
          </button>
        </div>
        
        {audioVideos.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Audio Content</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {audioVideos.slice(0, 20).map((video) => (
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
            <Music className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Audio Content Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload audio content!</p>
            <button 
              onClick={() => navigate('/upload')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Audio</span>
            </button>
          </div>
        )}
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Popular Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Music', 'Podcasts', 'Audiobooks', 'Sound Effects', 'Meditation', 'ASMR', 'Speech', 'Educational', 'Gaming', 'Nature Sounds', 'Comedy', 'Interviews'].map((category) => (
              <Link key={category} to={`/${category.toLowerCase().replace(' ', '-')}`} className="block">
                <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                  <div className="text-center">
                    <Music size={32} className="mx-auto mb-2 text-primary" />
                    <div className="font-medium">{category}</div>
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

export default Audio;
