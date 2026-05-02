import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Leaf, Carrot, Flower2, TreePine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosByCategory } from '@/utils/videoFiltering';
import { VideoCard } from '@/components/VideoCard';
import { Pagination, PageInfo } from '@/components/Pagination';
import { sortByName } from '@/lib/sortByName';

const subcategories = [
  { name: 'Herbs', path: '/plants/herbs', icon: Leaf, description: 'Medicinal and culinary herbs' },
  { name: 'Vegetables', path: '/plants/vegetables', icon: Carrot, description: 'Vegetable gardens and farming' },
  { name: 'Flowers', path: '/plants/flowers', icon: Flower2, description: 'Beautiful flowers and arrangements' },
  { name: 'Trees', path: '/plants/trees', icon: TreePine, description: 'Forests and woodland ecosystems' },
];

const VIDEOS_PER_PAGE = 20;

const Plants = () => {
  const { uploadedVideos } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  
  const plantsVideos = filterVideosByCategory(uploadedVideos, 'plants', ['herbs', 'vegetables', 'flowers', 'trees', 'gardening', 'botanical']);
  
  const totalPages = Math.ceil(plantsVideos.length / VIDEOS_PER_PAGE);
  const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
  const displayVideos = plantsVideos.slice(startIndex, startIndex + VIDEOS_PER_PAGE);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">MiyTube / Plants</h1>
          <p className="text-muted-foreground">Explore plant life including herbs, vegetables, flowers, and trees</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {sortByName(subcategories).map((sub) => (
            <Link
              key={sub.path}
              to={sub.path}
              className="group p-6 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
            >
              <sub.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-semibold text-foreground mb-2">{sub.name}</h2>
              <p className="text-sm text-muted-foreground">{sub.description}</p>
            </Link>
          ))}
        </div>

        {plantsVideos.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Plants Videos</h2>
              <PageInfo 
                currentPage={currentPage} 
                totalPages={totalPages} 
                totalItems={plantsVideos.length} 
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

export default Plants;