
import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Link } from 'react-router-dom';
import { Upload, Music } from 'lucide-react';
import { allCategoryMappings } from '@/data/allCategoryMappings';

const MusicGenre = () => {
  const params = useParams();
  const location = window.location.pathname;
  
  // Get genre from path - extract from URL like /music/country
  const pathParts = location.split('/').filter(Boolean);
  const actualGenre = pathParts[pathParts.length - 1] || params.genre || params['*'] || '';
  
  // Get the genre info from mappings
  const genreKey = `music-${actualGenre}`;
  const genreInfo = allCategoryMappings[genreKey] || {
    title: `Music (${actualGenre ? actualGenre.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Genre'})`,
    description: `Explore ${actualGenre || 'music'} content`,
    icon: Music
  };

  const Icon = genreInfo.icon;

  // Generate 20 sample videos for 4x5 grid
  const sampleVideos = Array.from({ length: 20 }, (_, i) => ({
    id: `${genreKey}-${i + 1}`,
    title: `${genreInfo.title} Track ${i + 1}`,
    thumbnail: `https://images.unsplash.com/photo-${1470225620780 + i * 1000}-dba8ba36b745?auto=format&fit=crop&w=800&q=80`,
    channelName: `${genreInfo.title} Artist ${(i % 5) + 1}`,
    views: `${Math.floor(Math.random() * 900) + 100}K`,
    timestamp: `${(i % 7) + 1} days ago`,
    duration: `${Math.floor(Math.random() * 5) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  }));

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        {/* Page Header with MiyTube branding */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-semibold text-primary">MiyTube</span> / Music / {genreInfo.title}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <Icon className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">{genreInfo.title}</h1>
              </div>
              <p className="text-muted-foreground">{genreInfo.description}</p>
            </div>
            <Link 
              to="/upload/music" 
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Music</span>
            </Link>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Featured {genreInfo.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sampleVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Popular in {genreInfo.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sampleVideos.slice(0, 20).map((video, index) => ({
              ...video,
              id: `popular-${index}`,
              title: `Popular ${genreInfo.title} - ${index + 1}`,
            })).map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">About {genreInfo.title}</h2>
          <p className="text-muted-foreground">
            {genreInfo.description}. Explore music videos, performances, and more from artists in this genre.
            If you're a music creator, consider uploading your own content.
          </p>
          <div className="mt-4">
            <Link 
              to="/upload/music" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload {genreInfo.title} Content</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MusicGenre;
