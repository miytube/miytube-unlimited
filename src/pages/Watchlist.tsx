import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useAuth } from '@/hooks/useAuth';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { VideoCard } from '@/components/VideoCard';
import { VideoCardSkeleton } from '@/components/skeletons';
import { Clock, ListVideo } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Watchlist = () => {
  const { user } = useAuth();
  const { watchlist, loading } = useWatchlist(user?.id);
  const { uploadedVideos } = useUploadedVideos();
  const [watchlistVideos, setWatchlistVideos] = useState<any[]>([]);

  useEffect(() => {
    if (watchlist.length > 0) {
      const videos = watchlist.map(item => {
        const video = uploadedVideos.find(v => v.id === item.video_id);
        if (video) {
          return { ...video, watchlistType: item.video_type };
        }
        return null;
      }).filter(Boolean);
      setWatchlistVideos(videos);
    } else {
      setWatchlistVideos([]);
    }
  }, [watchlist, uploadedVideos]);

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <ListVideo className="w-16 h-16 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Sign in to view your Watchlist</h1>
            <p className="text-muted-foreground mb-6">
              Save videos to watch later by signing in to your account
            </p>
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">MiyTube / Watchlist</h1>
            <p className="text-muted-foreground">Videos you've saved to watch later</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        ) : watchlistVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <ListVideo className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
            <p className="text-muted-foreground">
              Add videos to your watchlist by clicking the bookmark icon on any video
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {watchlistVideos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                thumbnail={video.thumbnail || '/placeholder.svg'}
                channelName={video.channelName || 'Unknown'}
                views={video.views || 0}
                timestamp={video.timestamp || video.created_at}
                duration={video.duration}
                description={video.description}
                tags={video.tags}
                category={video.category}
                subcategory={video.subcategory}
              />
            ))}
          </div>
        )}

        <div className="mt-6 text-sm text-muted-foreground">
          {watchlistVideos.length} video{watchlistVideos.length !== 1 ? 's' : ''} in watchlist
        </div>
      </div>
    </Layout>
  );
};

export default Watchlist;
