
import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { 
  Car, GraduationCap, Film, Scissors, HeartHandshake, Users, Dog, 
  Microscope, Plane, Pizza, Utensils, Quote, Clapperboard, Star, 
  Gavel, Ship, UserRound, House, Anchor, Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Upload } from 'lucide-react';

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

  // Sample videos for demo purposes - each category will show these
  const sampleVideos = [
    {
      id: 'sample1',
      title: `Popular ${category} Content`,
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      channelName: 'Content Creator',
      views: '1.2M',
      timestamp: '3 days ago',
      duration: '14:35',
    },
    {
      id: 'sample2',
      title: `Trending in ${category}`,
      thumbnail: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=800&q=80',
      channelName: 'Trending Channel',
      views: '856K',
      timestamp: '1 week ago',
      duration: '22:15',
    },
    {
      id: 'sample3',
      title: `Best of ${category} 2023`,
      thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
      channelName: 'Top Picks',
      views: '2.3M',
      timestamp: '2 months ago',
      duration: '18:42',
    },
    {
      id: 'sample4',
      title: `${category} Highlights`,
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
        
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Featured {category} Content</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sampleVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Popular in {category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sampleVideos.map((video, index) => ({
              ...video,
              id: `popular-${index}`,
              title: `Popular ${category} - ${index + 1}`,
            })).map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
        
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
