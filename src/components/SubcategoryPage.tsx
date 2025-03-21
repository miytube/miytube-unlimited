
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
  // Sample videos for demo purposes
  const sampleVideos = [
    {
      id: `${subcategory.toLowerCase().replace(/\s+/g, '-')}-1`,
      title: `Popular ${subcategory} Content`,
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      channelName: 'Content Creator',
      views: '1.2M',
      timestamp: '3 days ago',
      duration: '14:35',
    },
    {
      id: `${subcategory.toLowerCase().replace(/\s+/g, '-')}-2`,
      title: `Trending in ${subcategory}`,
      thumbnail: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=800&q=80',
      channelName: 'Trending Channel',
      views: '856K',
      timestamp: '1 week ago',
      duration: '22:15',
    },
    {
      id: `${subcategory.toLowerCase().replace(/\s+/g, '-')}-3`,
      title: `Best of ${subcategory} 2023`,
      thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
      channelName: 'Top Picks',
      views: '2.3M',
      timestamp: '2 months ago',
      duration: '18:42',
    },
    {
      id: `${subcategory.toLowerCase().replace(/\s+/g, '-')}-4`,
      title: `${subcategory} Highlights`,
      thumbnail: 'https://images.unsplash.com/photo-1507090960745-b32f65d3113a?auto=format&fit=crop&w=800&q=80',
      channelName: 'Featured Channel',
      views: '4.5M',
      timestamp: '5 months ago',
      duration: '12:18',
    },
  ];

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
