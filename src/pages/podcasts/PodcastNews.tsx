import React from 'react';
import { Layout } from '@/components/Layout';
import { Newspaper, Upload, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosBySubcategory } from '@/utils/videoFiltering';
import VideoContent from '@/components/subcategory/VideoContent';

const PodcastNews = () => {
  const { uploadedVideos } = useUploadedVideos();
  const videos = filterVideosBySubcategory(uploadedVideos, 'News', 'podcasts-news');

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-semibold text-primary">MiyTube</span> / Podcasts / News
        </p>
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <Link to="/podcasts" className="hover:text-primary">Podcasts</Link>
          <ChevronRight size={14} />
          <span className="text-foreground">News</span>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <Newspaper className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">News Podcasts</h1>
          <p className="text-muted-foreground ml-2">
            Daily news, current events, and political commentary podcasts
          </p>
          <Link
            to="/upload"
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload</span>
          </Link>
        </div>

        {videos.length > 0 ? (
          <VideoContent
            title="News Podcasts"
            videos={videos.map(v => ({
              id: v.id,
              title: v.title,
              thumbnail: v.thumbnail,
              channelName: 'Your Channel',
              views: v.views,
              timestamp: v.timestamp,
              duration: v.duration,
            }))}
          />
        ) : (
          <div className="text-center py-12 bg-card rounded-lg mb-8">
            <Newspaper className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No News Podcasts Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload a news podcast!</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload News Podcast</span>
            </Link>
          </div>
        )}

        <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">About News Podcasts</h2>
          <p className="text-muted-foreground">
            News podcasts deliver daily updates, in-depth analysis, and political commentary from
            around the world. Stay informed on breaking stories, trending topics, and expert
            opinions on the events shaping our world.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PodcastNews;
