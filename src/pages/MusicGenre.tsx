
import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Link } from 'react-router-dom';
import { Upload, Music } from 'lucide-react';
import { allCategoryMappings } from '@/data/allCategoryMappings';
import { useUploadedVideos } from '@/context/UploadedVideosContext';

const MusicGenre = () => {
  const params = useParams();
  const location = window.location.pathname;
  const { uploadedVideos } = useUploadedVideos();
  
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

  // Filter for music videos matching this genre
  const genreVideos = uploadedVideos.filter(video => 
    video.category === 'music' ||
    video.category === actualGenre ||
    video.subcategory?.toLowerCase().includes(actualGenre) ||
    video.tags?.some(tag => tag.toLowerCase().includes(actualGenre) || tag.toLowerCase().includes('music'))
  );

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
        
        {genreVideos.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">{genreInfo.title} Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {genreVideos.slice(0, 20).map((video) => (
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
            <Icon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No {genreInfo.title} Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload {genreInfo.title.toLowerCase()} content!</p>
            <Link 
              to="/upload/music" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload {genreInfo.title}</span>
            </Link>
          </div>
        )}
        
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
