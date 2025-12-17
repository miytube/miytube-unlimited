
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Wrench, Building, Zap, FlaskConical, ChevronRight, Upload } from 'lucide-react';
import { VideoCard } from '@/components/VideoCard';
import { Pagination } from '@/components/Pagination';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosByCategory } from '@/utils/videoFiltering';

const EngineeringDisasters = () => {
  const { uploadedVideos } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 20;

  const subcategories = [
    { name: 'Civil', path: '/engineering-disasters/civil', icon: Building, description: 'Bridge collapses, building failures, dam breaks' },
    { name: 'Mechanical', path: '/engineering-disasters/mechanical', icon: Wrench, description: 'Machine failures, vehicle crashes' },
    { name: 'Electrical', path: '/engineering-disasters/electrical', icon: Zap, description: 'Power grid failures, electrical fires' },
    { name: 'Chemical', path: '/engineering-disasters/chemical', icon: FlaskConical, description: 'Chemical spills, plant explosions' },
  ];

  const filteredVideos = filterVideosByCategory(uploadedVideos, 'engineering disasters');
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const displayedVideos = filteredVideos.slice(startIndex, startIndex + videosPerPage);

  return (
    <Layout>
      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
        <span className="font-semibold text-primary">MiyTube</span>
        <ChevronRight size={14} />
        <span className="text-foreground">Engineering Disasters</span>
      </div>

      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Wrench className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Engineering Disasters</h1>
          </div>
          <p className="text-muted-foreground">
            Structural failures, industrial accidents, and engineering catastrophes
          </p>
        </div>
        <Link 
          to="/upload" 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
        >
          <Upload size={18} />
          <span>Upload Content</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {subcategories.map((sub) => (
          <Link
            key={sub.path}
            to={sub.path}
            className="p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
          >
            <sub.icon className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-semibold">{sub.name}</h3>
            <p className="text-sm text-muted-foreground">{sub.description}</p>
          </Link>
        ))}
      </div>

      {displayedVideos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedVideos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                thumbnail={video.thumbnail || '/placeholder.svg'}
                channelName="MiyTube User"
                views={video.views || '0'}
                timestamp={video.timestamp || ''}
                duration={video.duration || ''}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No engineering disaster videos yet. Be the first to upload!</p>
        </div>
      )}
    </Layout>
  );
};

export default EngineeringDisasters;
