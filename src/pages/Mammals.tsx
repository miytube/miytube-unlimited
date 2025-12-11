import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Dog, Cat, Rabbit, Fish, Bird, TreeDeciduous } from 'lucide-react';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { VideoCard } from '@/components/VideoCard';
import { Pagination } from '@/components/Pagination';
import { filterVideosByCategory } from '@/utils/videoFiltering';

const Mammals = () => {
  const { uploadedVideos, isLoading } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 20;

  const subcategories = [
    { id: 'primates', name: 'Primates', description: 'Humans, monkeys, apes, lemurs', path: '/mammals/primates', icon: Dog },
    { id: 'carnivores', name: 'Carnivores', description: 'Dogs, cats, lions, seals, bears', path: '/mammals/carnivores', icon: Cat },
    { id: 'rodents', name: 'Rodents', description: 'Mice, rats, squirrels, beavers', path: '/mammals/rodents', icon: Rabbit },
    { id: 'marine-mammals', name: 'Marine Mammals', description: 'Whales, dolphins, seals, manatees', path: '/mammals/marine-mammals', icon: Fish },
    { id: 'marsupials', name: 'Marsupials', description: 'Kangaroos, koalas, opossums', path: '/mammals/marsupials', icon: Dog },
    { id: 'bats', name: 'Bats', description: 'Unique flying mammals', path: '/mammals/bats', icon: Bird },
    { id: 'elephants', name: 'Elephants', description: 'African and Asian elephants', path: '/mammals/elephants', icon: TreeDeciduous },
    { id: 'ungulates', name: 'Ungulates', description: 'Deer, bison, pigs, camels', path: '/mammals/ungulates', icon: Dog },
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
          <p className="text-muted-foreground">Explore videos about mammal species from around the world</p>
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

export default Mammals;
