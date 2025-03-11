
import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Film, Upload, Tv, ListVideo } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { UploadedVideosSection } from '@/components/video/UploadedVideosSection';
import { useUploadedVideos } from '@/context/UploadedVideosContext';

const Videos = () => {
  const { category } = useParams();
  const { uploadedVideos, getVideosByCategory } = useUploadedVideos();
  
  const videoCategories = [
    { id: 'trending', name: 'Trending', icon: <Tv size={24} /> },
    { id: 'news', name: 'News', icon: <ListVideo size={24} /> },
    { id: 'education', name: 'Education', icon: <Film size={24} /> },
    { id: 'technology', name: 'Technology', icon: <Tv size={24} /> },
    { id: 'travel', name: 'Travel', icon: <Film size={24} /> },
    { id: 'howto', name: 'How-to', icon: <ListVideo size={24} /> },
  ];
  
  // Filter videos by category if a category parameter is provided
  const displayedVideos = category 
    ? getVideosByCategory(category)
    : uploadedVideos;
  
  const featuredVideos = [
    {
      id: 'video1',
      title: 'How to Design Beautiful Interfaces',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      channelName: 'Design Masters',
      views: '1.2M',
      timestamp: '3 days ago',
      duration: '14:35',
    },
    {
      id: 'video2',
      title: 'The Future of Technology: AI and Machine Learning Advancements',
      thumbnail: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=800&q=80',
      channelName: 'Tech Insights',
      views: '856K',
      timestamp: '1 week ago',
      duration: '22:15',
    },
    {
      id: 'video3',
      title: 'Beautiful Cinematic Film Making Tutorial',
      thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
      channelName: 'Film Academy',
      views: '2.3M',
      timestamp: '2 months ago',
      duration: '18:42',
    },
    {
      id: 'video4',
      title: 'Morning Routine: Productivity Tips for Entrepreneurs',
      thumbnail: 'https://images.unsplash.com/photo-1507090960745-b32f65d3113a?auto=format&fit=crop&w=800&q=80',
      channelName: 'Productivity Pro',
      views: '4.5M',
      timestamp: '5 months ago',
      duration: '12:18',
    },
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-3 mb-8">
          <Film className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Videos` : 'Video Library'}
          </h1>
          <p className="text-muted-foreground ml-2">
            {category 
              ? `Browse our collection of ${category.toLowerCase()} videos` 
              : 'Discover and enjoy a wide variety of videos in our library'}
          </p>
          <Link to="/upload/video" className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
            <Upload size={18} />
            <span>Upload Video</span>
          </Link>
        </div>
        
        {/* Only show this section on the main videos page */}
        {!category && <UploadedVideosSection />}
        
        {/* Show category-specific videos if on a category page */}
        {category && displayedVideos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">{category.charAt(0).toUpperCase() + category.slice(1)} Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedVideos.map((video) => (
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
                  tags={video.tags}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Categories */}
        {!category && (
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {videoCategories.map((categoryItem) => (
                <Link 
                  key={categoryItem.id} 
                  to={`/videos/${categoryItem.id}`}
                  className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {categoryItem.icon}
                  </div>
                  <span className="font-medium">{categoryItem.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Featured Videos */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Featured Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Videos;
