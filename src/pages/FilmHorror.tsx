import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Skull, Ghost, Eye, Brain, Axe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { VideoCard } from '@/components/VideoCard';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosByCategory } from '@/utils/videoFiltering';
import { VideoGridSkeleton } from '@/components/skeletons';
import { Pagination, PageInfo } from '@/components/Pagination';
import { sortByName } from '@/lib/sortByName';

const horrorSubcategories = [
  { path: '/film/horror-terror', label: 'Terror', icon: Skull, description: 'Intense terror and psychological horror films' },
  { path: '/film/horror-fear', label: 'Fear', icon: Ghost, description: 'Fear-inducing horror movies and thrillers' },
  { path: '/film/horror-fright', label: 'Fright', icon: Eye, description: 'Frightening supernatural and creature features' },
  { path: '/film/horror-dread', label: 'Dread', icon: Brain, description: 'Atmospheric dread and slow-burn horror' },
  { path: '/film/horror-slasher', label: 'Slasher', icon: Axe, description: 'Classic and modern slasher films' },
];

const VIDEOS_PER_PAGE = 20;

const FilmHorror: React.FC = () => {
  const { uploadedVideos, isLoading } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  
  const horrorVideos = filterVideosByCategory(uploadedVideos, 'horror', ['film horror', 'terror', 'fear', 'fright', 'dread', 'slasher']);
  const totalPages = Math.ceil(horrorVideos.length / VIDEOS_PER_PAGE);
  const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
  const displayVideos = horrorVideos.slice(startIndex, startIndex + VIDEOS_PER_PAGE);

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">MiyTube / Film Horror</h1>
          <p className="text-muted-foreground">
            Explore terrifying horror films from psychological thrillers to slasher classics
          </p>
        </div>

        {/* Subcategory Navigation */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Horror Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {sortByName(horrorSubcategories).map((subcategory) => {
              const IconComponent = subcategory.icon;
              return (
                <Link key={subcategory.path} to={subcategory.path}>
                  <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <IconComponent className="h-8 w-8 mb-2 text-primary" />
                      <h3 className="font-medium">{subcategory.label}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{subcategory.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Video Content Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Horror Videos</h2>
            {horrorVideos.length > VIDEOS_PER_PAGE && (
              <PageInfo
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={horrorVideos.length}
                itemLabel="videos"
              />
            )}
          </div>
          {isLoading ? (
            <VideoGridSkeleton count={20} />
          ) : displayVideos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    id={video.id}
                    title={video.title}
                    thumbnail={video.thumbnail}
                    duration={video.duration}
                    views={video.views}
                    channelName="MiyTube Creator"
                    timestamp={new Date().toISOString()}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Skull className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No horror videos uploaded yet. Be the first to upload!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FilmHorror;
