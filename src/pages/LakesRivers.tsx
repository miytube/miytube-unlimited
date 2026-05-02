import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Waves, Droplets, Ship, Mountain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosByCategory } from '@/utils/videoFiltering';
import { VideoCard } from '@/components/VideoCard';
import { Pagination, PageInfo } from '@/components/Pagination';
import { sortByName } from '@/lib/sortByName';

const subcategories = [
  { name: 'Freshwater Lakes', path: '/lakes-rivers/freshwater-lakes', icon: Droplets, description: 'Beautiful freshwater lakes from around the world' },
  { name: 'Rivers', path: '/lakes-rivers/rivers', icon: Waves, description: 'Majestic rivers and waterways' },
  { name: 'Seas', path: '/lakes-rivers/seas', icon: Ship, description: 'Seas and coastal waters around the globe' },
  { name: 'Waterfalls', path: '/lakes-rivers/waterfalls', icon: Mountain, description: 'Stunning waterfalls and cascades' },
];

const VIDEOS_PER_PAGE = 20;

const LakesRivers = () => {
  const { uploadedVideos } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  
  const lakesRiversVideos = filterVideosByCategory(uploadedVideos, 'lakes-rivers', ['freshwater', 'lakes', 'rivers', 'seas', 'waterfalls', 'water', 'ocean']);
  
  const totalPages = Math.ceil(lakesRiversVideos.length / VIDEOS_PER_PAGE);
  const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
  const displayVideos = lakesRiversVideos.slice(startIndex, startIndex + VIDEOS_PER_PAGE);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Waves className="h-8 w-8 text-primary" />
            MiyTube / Lakes & Rivers
          </h1>
          <p className="text-muted-foreground">Explore freshwater lakes, rivers, seas, and waterfalls from around the world</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {sortByName(subcategories).map((sub) => (
            <Link
              key={sub.path}
              to={sub.path}
              className="p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <sub.icon className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-foreground">{sub.name}</h3>
              <p className="text-sm text-muted-foreground">{sub.description}</p>
            </Link>
          ))}
        </div>

        {lakesRiversVideos.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Lakes & Rivers Videos</h2>
              <PageInfo 
                currentPage={currentPage} 
                totalPages={totalPages} 
                totalItems={lakesRiversVideos.length} 
                itemLabel="videos" 
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  thumbnail={video.thumbnail || '/placeholder.svg'}
                  channelName="MiyTube Creator"
                  views={String(video.views || 0)}
                  timestamp={video.timestamp}
                  duration={video.duration || '0:00'}
                  description={video.description}
                  tags={video.tags}
                  category={video.category}
                  subcategory={video.subcategory}
                />
              ))}
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LakesRivers;
