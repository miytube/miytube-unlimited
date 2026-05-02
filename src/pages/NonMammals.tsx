import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Fish } from 'lucide-react';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { VideoCard } from '@/components/VideoCard';
import { Pagination } from '@/components/Pagination';
import { filterVideosByCategory } from '@/utils/videoFiltering';
import { sortByName } from '@/lib/sortByName';

const NonMammals = () => {
  const { uploadedVideos, isLoading } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 20;

  const subcategories = [
    { id: 'fish', name: 'Fish:', examples: 'Sharks, tuna, salmon, eels, lampreys (jawless fish).', path: '/non-mammals/fish' },
    { id: 'birds', name: 'Birds:', examples: 'Eagles, penguins, hummingbirds, ducks, ostriches (all have feathers and lay eggs).', path: '/non-mammals/birds' },
    { id: 'reptiles', name: 'Reptiles:', examples: 'Snakes, lizards, turtles, crocodiles, alligators (have scales, cold-blooded).', path: '/non-mammals/reptiles' },
    { id: 'amphibians', name: 'Amphibians:', examples: 'Frogs, toads, salamanders, caecilians (moist skin, often start aquatic, transition to land).', path: '/non-mammals/amphibians' },
    { id: 'arthropods', name: 'Arthropods:', examples: 'Insects (butterflies, beetles), arachnids (spiders, scorpions), crustaceans (crabs, shrimp).', path: '/non-mammals/arthropods' },
    { id: 'mollusks', name: 'Mollusks:', examples: 'Snails, clams, oysters, squid, octopuses.', path: '/non-mammals/mollusks' },
    { id: 'echinoderms', name: 'Echinoderms:', examples: 'Starfish, sea urchins, sea cucumbers.', path: '/non-mammals/echinoderms' },
    { id: 'invertebrates', name: 'Other Invertebrates:', examples: 'Jellyfish, sponges, corals, worms (nematodes, annelids).', path: '/non-mammals/invertebrates' },
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
          <p className="text-muted-foreground mb-6">Explore videos about fish, birds, reptiles, and other non-mammal species</p>
          
          <div className="bg-card rounded-lg border p-6 space-y-3">
            {sortByName(subcategories).map((sub) => (
              <Link
                key={sub.id}
                to={sub.path}
                className="block hover:text-primary transition-colors"
              >
                <span className="font-semibold">{sub.name}</span>{' '}
                <span className="text-muted-foreground">{sub.examples}</span>
              </Link>
            ))}
          </div>
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
