import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Mic, MessageSquare, BookOpen, Heart, Users, Quote } from 'lucide-react';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { VideoCard } from '@/components/VideoCard';
import { Pagination } from '@/components/Pagination';
import { filterVideosByCategory } from '@/utils/videoFiltering';

const Speeches = () => {
  const { uploadedVideos, isLoading } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 20;

  const subcategories = [
    { id: 'commencement', name: 'Commencement Speech', description: 'Graduation and commencement addresses', path: '/speeches/commencement', icon: BookOpen },
    { id: 'eulogy', name: 'Eulogy & Memorial', description: 'Memorial speeches and tributes', path: '/speeches/eulogy', icon: Heart },
    { id: 'informative', name: 'Informative Speech', description: 'Educational and informative presentations', path: '/speeches/informative', icon: MessageSquare },
    { id: 'motivational', name: 'Motivational Speech', description: 'Inspirational and motivational talks', path: '/speeches/motivational', icon: Mic },
    { id: 'persuasive', name: 'Persuasive & Protest', description: 'Persuasive speeches and protest addresses', path: '/speeches/persuasive', icon: Users },
    { id: 'quotes-poems', name: 'Quotes, Poems, Statements', description: 'Famous quotes, poetry, and statements', path: '/speeches/quotes-poems', icon: Quote },
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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

export default Speeches;
