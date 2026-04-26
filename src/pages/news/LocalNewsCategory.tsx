import React from 'react';
import { Layout } from '@/components/Layout';
import { MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosBySubcategory } from '@/utils/videoFiltering';
import VideoContent from '@/components/subcategory/VideoContent';
import { FileUploader } from '@/components/upload/FileUploader';
import { useToast } from '@/hooks/use-toast';

const NEWS_CATEGORY_ID = 'news-politics';
const SUBCATEGORY_ID = 'local-news';
const SUBCATEGORY_NAME = 'Local News';

const newsCategories = [
  {
    id: NEWS_CATEGORY_ID,
    name: 'News & Politics',
    subcategories: [
      { id: 'breaking-news', name: 'Breaking News' },
      { id: 'politics', name: 'Politics' },
      { id: 'world-news', name: 'World News' },
      { id: 'local-news', name: 'Local News' },
    ],
  },
];

const LocalNewsCategory = () => {
  const { uploadedVideos, addUploadedVideo } = useUploadedVideos();
  const { toast } = useToast();
  const videos = filterVideosBySubcategory(uploadedVideos, SUBCATEGORY_NAME, 'news-local');

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
          category || NEWS_CATEGORY_ID,
          subcategory || SUBCATEGORY_ID,
          tags
        );
      }
      toast({ title: 'Upload complete', description: 'Your video is now available in Local News.' });
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
        new File([], title || 'Imported Video', { type: 'video/mp4' }),
        title || (isYouTube ? 'YouTube Video' : 'Imported Video'),
        description || '',
        category || NEWS_CATEGORY_ID,
        subcategory || SUBCATEGORY_ID,
        tags,
        url,
        isYouTube,
        youtubeId
      );
      toast({ title: 'Import complete', description: 'Video added to Local News.' });
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
          <span className="font-semibold text-primary">MiyTube</span> / News &amp; Politics / Local News
        </p>
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <Link to="/news" className="hover:text-primary">News &amp; Politics</Link>
          <ChevronRight size={14} />
          <span className="text-foreground">Local News</span>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <MapPin className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Local News</h1>
          <p className="text-muted-foreground ml-2">
            Community stories and regional reporting
          </p>
        </div>

        <FileUploader
          icon={MapPin}
          title="Upload Local News Video"
          description="Upload a video or import from a URL. It will be tagged automatically as Local News."
          acceptedTypes="video/*"
          supportedFormats={['MP4', 'MOV', 'WebM', 'AVI', 'MKV']}
          maxSize="10GB"
          onUpload={handleUpload}
          onUrlImport={handleUrlImport}
          id="local-news-upload"
          uploadDestination="Local News"
          categories={newsCategories}
          showUrlImport={true}
          defaultSubcategory={SUBCATEGORY_ID}
        />

        {videos.length > 0 ? (
          <VideoContent
            title="Local News"
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
            <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Local News Yet</h3>
            <p className="text-muted-foreground">Upload above to be the first!</p>
          </div>
        )}

        <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">About Local News</h2>
          <p className="text-muted-foreground">
            Local news covers community stories, city council meetings, regional events,
            neighborhood reporting and stories that matter to your hometown.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LocalNewsCategory;
