
import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { 
  Car, GraduationCap, Film, Scissors, HeartHandshake, Users, Dog, 
  Microscope, Plane, Pizza, Utensils, Quote, Clapperboard, Star, 
  Gavel, Ship, UserRound, House, Anchor, Truck, Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';

interface CategoryPageProps {
  category: string;
  icon: string;
}

const icons = {
  Car: Car,
  GraduationCap: GraduationCap,
  Film: Film,
  Scissors: Scissors,
  HeartHandshake: HeartHandshake,
  Users: Users,
  Dog: Dog,
  Microscope: Microscope,
  Plane: Plane,
  Pizza: Pizza,
  Utensils: Utensils,
  Quote: Quote,
  Clapperboard: Clapperboard,
  Star: Star,
  Gavel: Gavel,
  Ship: Ship,
  UserRound: UserRound,
  House: House,
  Anchor: Anchor,
  Truck: Truck
};

const CategoryPage: React.FC<CategoryPageProps> = ({ category, icon }) => {
  const IconComponent = icons[icon as keyof typeof icons] || Film;
  const { getVideosByCategory } = useUploadedVideos();
  
  // Filter videos for this category using the context's improved matching
  const categoryVideos = getVideosByCategory(category);

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-semibold text-primary">MiyTube</span> / {category}
        </p>
        
        <div className="flex items-center gap-3 mb-8">
          <IconComponent className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{category}</h1>
          <p className="text-muted-foreground ml-2">
            Discover and enjoy {category.toLowerCase()} content
          </p>
          <Link to="/upload" className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
            <Upload size={18} />
            <span>Upload</span>
          </Link>
        </div>
        
        {categoryVideos.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">{category} Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryVideos.slice(0, 20).map((video) => (
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
            <IconComponent className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No {category} Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload {category.toLowerCase()} content!</p>
            <Link 
              to="/upload" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload {category} Content</span>
            </Link>
          </div>
        )}
        
        <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">About {category}</h2>
          <p className="text-muted-foreground">
            This category features content related to {category.toLowerCase()}.
            Explore videos, shorts, and more from creators specializing in this area.
            If you're a content creator in this space, consider uploading your own content.
          </p>
          <div className="mt-4">
            <Link to="/upload" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              <Upload size={18} />
              <span>Upload {category} Content</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
