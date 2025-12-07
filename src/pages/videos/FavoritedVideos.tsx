import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Heart, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';

const FavoritedVideos = () => {
  const { uploadedVideos } = useUploadedVideos();
  
  // Favorited videos - filter by favorited tag
  const favoritedVideos = [...uploadedVideos]
    .filter(video => 
      video.category?.toLowerCase() !== 'shorts' &&
      (video.tags?.some(t => t.toLowerCase() === 'favorited' || t.toLowerCase() === 'favorite') || 
       video.category?.toLowerCase() === 'favorited')
    )
    .reverse()
    .slice(0, 20);

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-semibold text-primary">MiyTube</span> / Video Library / Favorited
        </p>
        
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Favorited Videos</h1>
          <p className="text-muted-foreground ml-2">Your favorite videos collection</p>
          <Link to="/upload/video" className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
            <Upload size={18} />
            <span>Upload Video</span>
          </Link>
        </div>
        
        {favoritedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favoritedVideos.map((video) => (
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
                category={video.category}
                subcategory={video.subcategory}
                tags={video.tags}
              />
            ))}
          </div>
        ) : (
          <div className="p-6 bg-muted/20 rounded-lg text-center">
            <p className="text-muted-foreground mb-4">No favorited videos yet. Tag videos as "favorited" to see them here.</p>
            <Link to="/upload/video" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
              <Upload size={18} />
              <span>Upload Video</span>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FavoritedVideos;
