import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { VideoCard } from '@/components/VideoCard';
import { Pagination } from '@/components/Pagination';
import { filterVideosByCategory } from '@/utils/videoFiltering';
import { sortByName } from '@/lib/sortByName';

const Speeches = () => {
  const { uploadedVideos, isLoading } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 20;

  const speechCategories = [
    {
      name: 'Speech Types',
      path: '/speeches',
      subcategories: [
        { name: 'Informative — Educate', path: '/speeches/informative', examples: 'Share knowledge and facts' },
        { name: 'Motivational — Inspire', path: '/speeches/motivational', examples: 'Uplift and energize' },
        { name: 'Entertaining — Amuse', path: '/speeches/entertaining', examples: 'Humor and storytelling' },
        { name: 'Persuasive — Convince', path: '/speeches/persuasive', examples: 'Sway opinions and beliefs' },
        { name: 'Commencement — Celebratory', path: '/speeches/commencement', examples: 'Graduation addresses' },
      ]
    },
    {
      name: 'More Speech Formats',
      path: '/speeches',
      subcategories: [
        { name: 'Eulogy or Funeral — Honor', path: '/speeches/eulogy', examples: 'Tributes and memorials' },
        { name: 'Demonstrative — Teach How-To', path: '/speeches/demonstrative', examples: 'Show how something is done' },
        { name: 'Debate — Rules About a Subject', path: '/speeches/debate', examples: 'Structured argument on a topic' },
        { name: 'Pitch Speech — Support an Idea', path: '/speeches/pitch', examples: 'Win approval for an idea' },
        { name: 'Farewell Speech — Goodbyes', path: '/speeches/farewell', examples: 'Departures and send-offs' },
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
          {sortByName(speechCategories).map((category) => (
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
