
import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Link } from 'react-router-dom';
import { Upload, LucideIcon } from 'lucide-react';
import { useUploadedVideos } from '@/context/UploadedVideosContext';

interface GenericCategoryPageProps {
  title: string;
  description?: string;
  Icon?: LucideIcon;
}

const GenericCategoryPage: React.FC<GenericCategoryPageProps> = ({
  title,
  description = `Explore our collection of ${title.toLowerCase()} content`,
  Icon,
}) => {
  const { getVideosByCategory } = useUploadedVideos();
  
  // Filter videos for this category using the context's improved matching
  const categoryVideos = getVideosByCategory(title);

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        {/* Page Header with MiyTube branding */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-semibold text-primary">MiyTube</span> / {title}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                {Icon && <Icon className="h-8 w-8 text-primary" />}
                <h1 className="text-3xl font-bold">{title}</h1>
              </div>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <Link 
              to="/upload" 
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload</span>
            </Link>
          </div>
        </div>
        
        {categoryVideos.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">{title} Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...categoryVideos].reverse().slice(0, 20).map((video) => (
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
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg mb-8">
            {Icon && <Icon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />}
            <h3 className="text-xl font-semibold mb-2">No {title} Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload {title.toLowerCase()} content!</p>
            <Link 
              to="/upload" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload {title} Content</span>
            </Link>
          </div>
        )}
        
        <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">About {title}</h2>
          <p className="text-muted-foreground">
            This category features content related to {title.toLowerCase()}.
            Explore videos, shorts, and more from creators specializing in this area.
            If you're a content creator in this space, consider uploading your own content.
          </p>
          <div className="mt-4">
            <Link 
              to="/upload" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload {title} Content</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GenericCategoryPage;
