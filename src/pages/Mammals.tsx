import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Dog } from 'lucide-react';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { VideoCard } from '@/components/VideoCard';
import { Pagination } from '@/components/Pagination';
import { filterVideosByCategory } from '@/utils/videoFiltering';
import { sortByName } from '@/lib/sortByName';

const Mammals = () => {
  const { uploadedVideos, isLoading } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 20;

  const subcategories = [
    { id: 'primates', name: 'Primates:', examples: 'Humans, monkeys, apes, lemurs.', path: '/mammals/primates' },
    { id: 'carnivores', name: 'Carnivores:', examples: 'Dogs, cats, lions, seals, bears.', path: '/mammals/carnivores' },
    { id: 'rodents', name: 'Rodents:', examples: 'Mice, rats, squirrels, beavers.', path: '/mammals/rodents' },
    { id: 'marine-mammals', name: 'Marine Mammals:', examples: 'Whales, dolphins, seals, manatees.', path: '/mammals/marine-mammals' },
    { id: 'marsupials', name: 'Marsupials:', examples: 'Kangaroos, koalas, opossums.', path: '/mammals/marsupials' },
    { id: 'bats', name: 'Bats:', examples: 'Unique flying mammals.', path: '/mammals/bats' },
    { id: 'elephants', name: 'Elephants:', examples: 'African and Asian elephants.', path: '/mammals/elephants' },
    { id: 'ungulates', name: 'Ungulates:', examples: 'Deer, bison, pigs, camels.', path: '/mammals/ungulates' },
  ];

  const filteredVideos = filterVideosByCategory(uploadedVideos, 'mammals');

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
          <h1 className="text-3xl font-bold mb-2">MiyTube / Mammals</h1>
          <p className="text-muted-foreground mb-6">Explore videos about mammal species from around the world</p>
          
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

export default Mammals;
