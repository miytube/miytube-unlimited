import React from 'react';
import { Layout } from '@/components/Layout';
import { Trophy, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosByCategory } from '@/utils/videoFiltering';

const NFLFootballPage = () => {
  const { uploadedVideos } = useUploadedVideos();

  const nflKeywords = [
    'nfl',
    'sports-nfl',
    'sports-nfl-football',
    'sports-nfl-superbowl',
    'sports-nfl-players',
  ];
  const nflVideos = filterVideosByCategory(uploadedVideos, 'nfl football', nflKeywords);

  const subcategories = [
    { label: 'Super Bowl', path: '/sports/nfl/superbowl' },
    { label: 'NFL Players & Coaches', path: '/sports/nfl/players' },
    { label: 'NFL Highlights', path: '/sports/nfl-football' },
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-semibold text-primary">MiyTube</span> / Sports / NFL Football
        </p>

        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">NFL Football</h1>
            <p className="text-muted-foreground ml-2">
              National Football League games, highlights, players, and Super Bowl coverage
            </p>
          </div>
          <Link
            to="/upload"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload NFL Video</span>
          </Link>
        </div>

        {nflVideos.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">NFL Football Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {nflVideos.slice(0, 20).map((video) => (
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
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg mb-8">
            <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No NFL Football Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload NFL content!</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload NFL Content</span>
            </Link>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-semibold mb-4">NFL Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {subcategories.map((s) => (
              <Link key={s.path} to={s.path} className="block">
                <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                  <div className="text-center px-2">
                    <Trophy size={32} className="mx-auto mb-2 text-primary" />
                    <div className="font-medium text-sm">{s.label}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NFLFootballPage;
