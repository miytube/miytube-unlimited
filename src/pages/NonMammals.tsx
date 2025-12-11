import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Fish, Bird, Bug, Shell, Snail } from 'lucide-react';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { VideoCard } from '@/components/VideoCard';
import { Pagination } from '@/components/Pagination';
import { filterVideosByCategory } from '@/utils/videoFiltering';

const NonMammals = () => {
  const { uploadedVideos, isLoading } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 20;

  const subcategories = [
    { id: 'fish', name: 'Fish', description: 'Sharks, tuna, salmon, eels, lampreys', path: '/non-mammals/fish', icon: Fish },
    { id: 'birds', name: 'Birds', description: 'Eagles, penguins, hummingbirds, ducks, ostriches', path: '/non-mammals/birds', icon: Bird },
    { id: 'reptiles', name: 'Reptiles', description: 'Snakes, lizards, turtles, crocodiles, alligators', path: '/non-mammals/reptiles', icon: Snail },
    { id: 'amphibians', name: 'Amphibians', description: 'Frogs, toads, salamanders, caecilians', path: '/non-mammals/amphibians', icon: Snail },
    { id: 'arthropods', name: 'Arthropods', description: 'Insects, arachnids, crustaceans', path: '/non-mammals/arthropods', icon: Bug },
    { id: 'mollusks', name: 'Mollusks', description: 'Snails, clams, oysters, squid, octopuses', path: '/non-mammals/mollusks', icon: Shell },
    { id: 'echinoderms', name: 'Echinoderms', description: 'Starfish, sea urchins, sea cucumbers', path: '/non-mammals/echinoderms', icon: Shell },
    { id: 'invertebrates', name: 'Other Invertebrates', description: 'Jellyfish, sponges, corals, worms', path: '/non-mammals/invertebrates', icon: Shell },
  ];

  const filteredVideos = filterVideosByCategory(uploadedVideos, 'non-mammals');

  useEffect(() => {
    setCurrentPage(1);
  }, [uploadedVideos.length]);

  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const currentVideos = filteredVideos.slice(startIndex, startIndex + videosPerPage);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">MiyTube / Non-Mammals</h1>
          <p className="text-muted-foreground">Explore videos about fish, birds, reptiles, and other non-mammal species</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              to={sub.path}
              className="p-4 bg-card rounded-lg border hover:border-primary transition-colors"
            >
              <sub.icon className="h-6 w-6 mb-2 text-primary" />
              <h3 className="font-semibold">{sub.name}</h3>
              <p className="text-xs text-muted-foreground">{sub.description}</p>
            </Link>
          ))}
        </div>

        {currentVideos.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  thumbnail={video.thumbnail || '/placeholder.svg'}
                  channelName="MiyTube"
                  views={video.views?.toString() || '0'}
                  timestamp="Recently"
                  duration={video.duration || '0:00'}
                  category={video.category}
                  subcategory={video.subcategory}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default NonMammals;
