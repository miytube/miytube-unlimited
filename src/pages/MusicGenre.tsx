
import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Link } from 'react-router-dom';
import { Upload, Music, ChevronLeft, ChevronRight } from 'lucide-react';
import { allCategoryMappings } from '@/data/allCategoryMappings';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosByMusicGenre } from '@/utils/videoFiltering';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 20;

const MusicGenre = () => {
  const params = useParams();
  const location = window.location.pathname;
  const { uploadedVideos } = useUploadedVideos();

  const pathParts = location.split('/').filter(Boolean);
  const actualGenre = pathParts[pathParts.length - 1] || params.genre || params['*'] || '';

  const genreKey = `music-${actualGenre}`;
  const genreInfo = allCategoryMappings[genreKey] || {
    title: `Music (${actualGenre ? actualGenre.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Genre'})`,
    description: `Explore ${actualGenre || 'music'}`,
    icon: Music
  };

  const Icon = genreInfo.icon;

  const genreVideos = useMemo(
    () => filterVideosByMusicGenre(uploadedVideos, actualGenre),
    [uploadedVideos, actualGenre]
  );

  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [actualGenre, genreVideos.length]);

  const totalPages = Math.max(1, Math.ceil(genreVideos.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageVideos = genreVideos.slice(start, start + PAGE_SIZE);

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-semibold text-primary">MiyTube</span> / Music / {genreInfo.title}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <Icon className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">{genreInfo.title}</h1>
              </div>
              <p className="text-muted-foreground">{genreInfo.description}</p>
            </div>
            <Link
              to={`/upload/music?genre=${actualGenre}`}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Music</span>
            </Link>
          </div>
        </div>

        {genreVideos.length > 0 ? (
          <div className="mb-8">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-xl font-medium">{genreInfo.title} Videos</h2>
              <span className="text-sm text-muted-foreground">
                {genreVideos.length} total · Page {safePage} of {totalPages}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pageVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  thumbnail={video.thumbnail}
                  channelName="Your Channel"
                  views={video.views}
                  timestamp={video.timestamp}
                  duration={video.duration}
                  description={video.description}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  {safePage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg mb-8">
            <Icon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No {genreInfo.title} Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload {genreInfo.title.toLowerCase()} content!</p>
            <Link
              to={`/upload/music?genre=${actualGenre}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload {genreInfo.title}</span>
            </Link>
          </div>
        )}

        <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">About {genreInfo.title}</h2>
          <p className="text-muted-foreground">
            {genreInfo.description}. Explore music videos, performances, and more from artists in this genre.
            If you're a music creator, consider uploading your own content.
          </p>
          <div className="mt-4">
            <Link
              to={`/upload/music?genre=${actualGenre}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload {genreInfo.title} Content</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MusicGenre;
