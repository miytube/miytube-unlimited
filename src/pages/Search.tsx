
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';

const mockVideos = [
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
  {
    id: 'video5',
    title: 'Learn Web Development in 2023: Complete Roadmap',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    channelName: 'Code Masters',
    views: '1.8M',
    timestamp: '3 weeks ago',
    duration: '32:45',
  },
];

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  // Filter videos based on search query
  const filteredVideos = query 
    ? mockVideos.filter(video => 
        video.title.toLowerCase().includes(query.toLowerCase()) || 
        video.channelName.toLowerCase().includes(query.toLowerCase())
      )
    : mockVideos;

  return (
    <Layout>
      <div className="py-2">
        {query && (
          <h1 className="text-xl font-medium mb-6">
            Search results for <span className="text-primary">"{query}"</span>
          </h1>
        )}
        
        {filteredVideos.length > 0 ? (
          <div className="space-y-4 animate-fade-in">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">No results found</h2>
            <p className="text-muted-foreground">
              Try different keywords or check your spelling
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
