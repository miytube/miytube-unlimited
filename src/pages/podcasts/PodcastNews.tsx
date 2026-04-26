import React from 'react';
import { Layout } from '@/components/Layout';
import { Newspaper, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosBySubcategory } from '@/utils/videoFiltering';
import VideoContent from '@/components/subcategory/VideoContent';
import { FileUploader } from '@/components/upload/FileUploader';
import { useToast } from '@/hooks/use-toast';

const CATEGORY_ID = 'podcasts';
const SUBCATEGORY_ID = 'news';
const SUBCATEGORY_NAME = 'News';

const podcastCategories = [
  {
    id: CATEGORY_ID,
    name: 'Podcasts',
    subcategories: [
      { id: 'news', name: 'News' },
      { id: 'gossip', name: 'Gossip' },
    ],
  },
];

const PodcastNews = () => {
  const { uploadedVideos, addUploadedVideo } = useUploadedVideos();
  const { toast } = useToast();
  const videos = filterVideosBySubcategory(uploadedVideos, SUBCATEGORY_NAME, 'podcasts-news');

  const handleUpload = async (
    files: File[],
    title: string,
    description: string,
    category?: string,
    subcategory?: string,
    tags?: string[]
  ) => {
    try {
      for (const file of files) {
        await addUploadedVideo(
          file,
          title || file.name,
          description || '',
          category || CATEGORY_ID,
          subcategory || SUBCATEGORY_ID,
          tags
        );
      }
      toast({ title: 'Upload complete', description: 'Your podcast is now available in News.' });
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleUrlImport = async (
    url: string,
    title: string,
    description: string,
    category?: string,
    subcategory?: string,
    tags?: string[],
    isYouTube?: boolean,
    youtubeId?: string
  ) => {
    try {
      await addUploadedVideo(
        new File([], title || 'Imported Podcast', { type: 'video/mp4' }),
        title || (isYouTube ? 'YouTube Podcast' : 'Imported Podcast'),
        description || '',
        category || CATEGORY_ID,
        subcategory || SUBCATEGORY_ID,
        tags,
        url,
        isYouTube,
        youtubeId
      );
      toast({ title: 'Import complete', description: 'Podcast added to News.' });
    } catch (err) {
      toast({
        title: 'Import failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

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
        </div>

        <FileUploader
          icon={Newspaper}
          title="Upload News Podcast"
          description="Upload a podcast video or import from a URL. It will be tagged automatically as a News Podcast."
          acceptedTypes="video/*,audio/*"
          supportedFormats={['MP4', 'MOV', 'WebM', 'MP3', 'WAV', 'M4A']}
          maxSize="10GB"
          onUpload={handleUpload}
          onUrlImport={handleUrlImport}
          id="podcast-news-upload"
          uploadDestination="News Podcasts"
          categories={podcastCategories}
          showUrlImport={true}
          defaultSubcategory={SUBCATEGORY_ID}
        />

        {videos.length > 0 ? (
          <VideoContent
            title="News Podcasts"
            videos={videos.map((v) => ({
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
            <p className="text-muted-foreground">Upload above to be the first!</p>
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
