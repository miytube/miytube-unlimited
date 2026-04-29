import React from 'react';
import { Layout } from '@/components/Layout';
import { Trophy, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosByCategory } from '@/utils/videoFiltering';

const NFLPlayersCoachesPage = () => {
  const { uploadedVideos } = useUploadedVideos();
  const keywords = ['nfl players', 'nfl coaches', 'sports-nfl-players', 'nfl interviews', 'quarterback', 'nfl coach'];
  const videos = filterVideosByCategory(uploadedVideos, 'nfl players coaches', keywords);

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-semibold text-primary">MiyTube</span> / Sports / NFL / NFL Players & Coaches
        </p>
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">NFL Players & Coaches</h1>
            <p className="text-muted-foreground ml-2">Player profiles, coach interviews, and NFL personalities</p>
          </div>
          <Link to="/upload" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
            <Upload size={18} /><span>Upload Video</span>
          </Link>
        </div>
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.slice(0, 20).map((v) => (
              <VideoCard key={v.id} id={v.id} title={v.title} thumbnail={v.thumbnail}
                channelName="Your Channel" views={v.views} timestamp={v.timestamp}
                duration={v.duration} description={v.description} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg">
            <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No NFL Players & Coaches Videos Yet</h3>
            <p className="text-muted-foreground">Be the first to upload player/coach content!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NFLPlayersCoachesPage;
