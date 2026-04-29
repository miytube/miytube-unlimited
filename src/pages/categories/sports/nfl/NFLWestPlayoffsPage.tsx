import React from 'react';
import { Layout } from '@/components/Layout';
import { Trophy, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosByCategory } from '@/utils/videoFiltering';

const NFLWestPlayoffsPage = () => {
  const { uploadedVideos } = useUploadedVideos();
  const keywords = ['nfl west', 'afc west', 'nfc west', 'nfl west playoffs', 'west playoffs', 'nfl playoffs west'];
  const videos = filterVideosByCategory(uploadedVideos, 'nfl west playoffs', keywords);

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-semibold text-primary">MiyTube</span> / Sports / NFL / NFL West Playoffs
        </p>
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">NFL West Playoffs</h1>
            <p className="text-muted-foreground ml-2">AFC/NFC West division playoff coverage</p>
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
            <h3 className="text-xl font-semibold mb-2">No NFL West Playoffs Videos Yet</h3>
            <p className="text-muted-foreground">Be the first to upload West Playoffs content!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NFLWestPlayoffsPage;
