
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { Search as SearchIcon, Upload } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { uploadedVideos } = useUploadedVideos();
  
  // Filter videos based on search query
  const filteredVideos = query 
    ? uploadedVideos.filter(video => 
        video.title.toLowerCase().includes(query.toLowerCase()) || 
        video.category?.toLowerCase().includes(query.toLowerCase()) ||
        video.subcategory?.toLowerCase().includes(query.toLowerCase()) ||
        video.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : uploadedVideos;

  return (
    <Layout>
      <div className="py-6 w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-semibold text-primary">MiyTube</span> / Search
        </p>
        
        {query && (
          <h1 className="text-xl font-medium mb-6">
            Search results for <span className="text-primary">"{query}"</span>
          </h1>
        )}
        
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
            {filteredVideos.slice(0, 20).map((video) => (
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
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg">
            <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">
              {query ? 'No results found' : 'No videos uploaded yet'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {query ? 'Try different keywords or check your spelling' : 'Upload videos to search through them'}
            </p>
            <Link 
              to="/upload" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Content</span>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
