
import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Bike, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';

const IsleOfManTT = () => {
  const { getVideosByCategory } = useUploadedVideos();
  const videos = getVideosByCategory('Isle of Man TT');

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            <Link to="/" className="hover:text-primary">MiyTube</Link>
            {' > '}
            <Link to="/sports" className="hover:text-primary">Sports</Link>
            {' > '}
            <span>Isle of Man TT</span>
          </p>
          <div className="flex items-center gap-3 mb-2">
            <Bike className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Isle of Man TT</h1>
          </div>
          <p className="text-muted-foreground">
            Watch thrilling Isle of Man Tourist Trophy motorcycle racing — the most famous and dangerous road race in the world
          </p>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.slice(0, 20).map((video) => (
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
          <div className="text-center py-16">
            <Bike className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Isle of Man TT Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload Isle of Man TT motorcycle racing content!</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Upload className="h-5 w-5" />
              Upload Video
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default IsleOfManTT;
