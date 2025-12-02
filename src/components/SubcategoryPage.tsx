
import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Link } from 'react-router-dom';
import { Upload, ChevronRight } from 'lucide-react';

interface SubcategoryPageProps {
  category: string;
  subcategory: string;
  parentCategory?: string;
  parentIcon?: React.ElementType;
  icon?: React.ElementType;
}

const SubcategoryPage: React.FC<SubcategoryPageProps> = ({
  category,
  subcategory,
  parentCategory,
  parentIcon: ParentIcon,
  icon: Icon,
}) => {
  // Generate 20 sample videos for 4x5 grid
  const sampleVideos = Array.from({ length: 20 }, (_, i) => ({
    id: `${subcategory.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
    title: `${subcategory} Content ${i + 1}`,
    thumbnail: `https://images.unsplash.com/photo-${1550745165 + i * 1000}-9bc0b252726f?auto=format&fit=crop&w=800&q=80`,
    channelName: `${subcategory} Creator ${(i % 5) + 1}`,
    views: `${Math.floor(Math.random() * 900) + 100}K`,
    timestamp: `${(i % 7) + 1} days ago`,
    duration: `${Math.floor(Math.random() * 20) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  }));

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          {parentCategory && (
            <>
              <Link to={`/${parentCategory.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary">
                {parentCategory}
              </Link>
              <ChevronRight size={14} />
            </>
          )}
          <Link to={`/${category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary">
            {category}
          </Link>
          <ChevronRight size={14} />
          <span className="text-foreground">{subcategory}</span>
        </div>

        <div className="flex items-center gap-3 mb-8">
          {Icon && <Icon className="h-8 w-8 text-primary" />}
          <h1 className="text-3xl font-bold">{subcategory}</h1>
          <p className="text-muted-foreground ml-2">
            Discover and enjoy {subcategory.toLowerCase()} content
          </p>
          <Link to="/upload" className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
            <Upload size={18} />
            <span>Upload</span>
          </Link>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Featured {subcategory} Content</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sampleVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Popular in {subcategory}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sampleVideos.map((video, index) => ({
              ...video,
              id: `popular-${index}`,
              title: `Popular ${subcategory} - ${index + 1}`,
            })).map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">About {subcategory}</h2>
          <p className="text-muted-foreground">
            This category features content related to {subcategory.toLowerCase()}.
            Explore videos, shorts, and more from creators specializing in this area.
            If you're a content creator in this space, consider uploading your own content.
          </p>
          <div className="mt-4">
            <Link to="/upload" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              <Upload size={18} />
              <span>Upload {subcategory} Content</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubcategoryPage;
