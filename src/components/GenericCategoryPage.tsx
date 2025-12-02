
import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Link } from 'react-router-dom';
import { Upload, LucideIcon } from 'lucide-react';

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
  // Generate 20 sample videos for 4x5 grid
  const sampleVideos = Array.from({ length: 20 }, (_, i) => ({
    id: `${title.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
    title: `${title} Content ${i + 1}`,
    thumbnail: `https://images.unsplash.com/photo-${1550745165 + i * 1000}-9bc0b252726f?auto=format&fit=crop&w=800&q=80`,
    channelName: `${title} Creator ${(i % 5) + 1}`,
    views: `${Math.floor(Math.random() * 900) + 100}K`,
    timestamp: `${(i % 7) + 1} days ago`,
    duration: `${Math.floor(Math.random() * 20) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  }));

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-3 mb-8">
          {Icon && <Icon className="h-8 w-8 text-primary" />}
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground ml-2">{description}</p>
          <Link 
            to="/upload" 
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload</span>
          </Link>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Featured {title} Content</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sampleVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Popular in {title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sampleVideos.map((video, index) => ({
              ...video,
              id: `popular-${index}`,
              title: `Popular ${title} - ${index + 1}`,
            })).slice(0, 20).map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
        
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
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
