import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { VideoCard } from '@/components/VideoCard';
import { Pagination } from '@/components/Pagination';
import { filterVideosByCategory } from '@/utils/videoFiltering';

const Speeches = () => {
  const { uploadedVideos, isLoading } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 20;

  const speechCategories = [
    {
      name: 'Speech',
      path: '/speeches',
      subcategories: [
        { name: 'Commencement Speech', path: '/speeches/commencement', examples: 'Graduation addresses, university ceremonies' },
        { name: 'Eulogy & Memorial', path: '/speeches/eulogy', examples: 'Memorial tributes, funeral speeches' },
        { name: 'Informative Speech', path: '/speeches/informative', examples: 'Educational presentations, lectures' },
        { name: 'Motivational Speech', path: '/speeches/motivational', examples: 'Inspirational talks, TED-style speeches' },
        { name: 'Persuasive & Protest', path: '/speeches/persuasive', examples: 'Political speeches, activist addresses' },
      ]
    },
    {
      name: 'Quotes, Poems & Statements',
      path: '/speeches/quotes-poems',
      subcategories: [
        { name: 'Famous Quotes', path: '/speeches/quotes-poems', examples: 'Historical quotes, memorable sayings' },
        { name: 'Poetry Readings', path: '/speeches/quotes-poems', examples: 'Spoken word, poetry performances' },
        { name: 'Public Statements', path: '/speeches/quotes-poems', examples: 'Official announcements, declarations' },
      ]
    }
  ];

  const filteredVideos = filterVideosByCategory(uploadedVideos, 'speeches');

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
          <h1 className="text-3xl font-bold mb-2">MiyTube / Speeches</h1>
          <p className="text-muted-foreground">Explore commencement addresses, eulogies, motivational talks, and more</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {speechCategories.map((category) => (
            <div key={category.name} className="bg-card rounded-lg border p-6">
              <Link to={category.path}>
                <h2 className="text-xl font-bold mb-4 hover:text-primary transition-colors">
                  {category.name}
                </h2>
              </Link>
              <ul className="space-y-3">
                {category.subcategories.map((sub) => (
                  <li key={sub.name}>
                    <Link 
                      to={sub.path}
                      className="text-primary hover:underline font-medium"
                    >
                      {sub.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{sub.examples}</p>
                  </li>
                ))}
              </ul>
            </div>
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

export default Speeches;
