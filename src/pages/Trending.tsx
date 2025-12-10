import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { TrendingUp, ArrowRight, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';
import { ShortCard } from '@/components/ShortCard';
import { TrendingShortVideosSection } from '@/components/video/TrendingShortVideosSection';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { FileUploader } from '@/components/upload/FileUploader';
import { useToast } from '@/hooks/use-toast';
import { Pagination, PageInfo } from '@/components/Pagination';

interface TrendingCategoryProps {
  title: string;
  linkTo: string;
  children: React.ReactNode;
}

const TrendingCategory: React.FC<TrendingCategoryProps> = ({ title, linkTo, children }) => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          {title}
        </h2>
        <Link to={linkTo} className="text-primary flex items-center hover:underline">
          See all <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      {children}
    </div>
  );
};

const Trending: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'videos' | 'music' | 'podcasts'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [musicPage, setMusicPage] = useState(1);
  const [podcastPage, setPodcastPage] = useState(1);
  const videosPerPage = 20;
  const { uploadedVideos, addUploadedVideo, getVideosByCategory } = useUploadedVideos();
  const { toast } = useToast();
  
  const prevVideoCount = useRef(uploadedVideos.length);
  const musicVideosRaw = getVideosByCategory('music');
  const podcastVideosRaw = getVideosByCategory('podcasts');
  const prevMusicCount = useRef(musicVideosRaw.length);
  const prevPodcastCount = useRef(podcastVideosRaw.length);

  // Reset to page 1 when new content is added
  useEffect(() => {
    if (uploadedVideos.length > prevVideoCount.current) {
      setCurrentPage(1);
    }
    prevVideoCount.current = uploadedVideos.length;
  }, [uploadedVideos.length]);

  useEffect(() => {
    if (musicVideosRaw.length > prevMusicCount.current) {
      setMusicPage(1);
    }
    prevMusicCount.current = musicVideosRaw.length;
  }, [musicVideosRaw.length]);

  useEffect(() => {
    if (podcastVideosRaw.length > prevPodcastCount.current) {
      setPodcastPage(1);
    }
    prevPodcastCount.current = podcastVideosRaw.length;
  }, [podcastVideosRaw.length]);

  // ALL uploaded videos appear on trending page (newest first) - including shorts
  const trendingVideos = [...uploadedVideos].reverse().map(video => ({
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnail,
    channelName: 'Your Channel',
    views: video.views,
    timestamp: video.timestamp,
    duration: video.duration,
  }));

  const totalPages = Math.ceil(trendingVideos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const displayVideos = trendingVideos.slice(startIndex, endIndex);

  // Get uploaded music with pagination
  const musicVideos = musicVideosRaw.map(video => ({
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnail,
    creator: 'Your Channel',
    views: video.views,
  }));
  const musicTotalPages = Math.ceil(musicVideos.length / videosPerPage);
  const musicStartIndex = (musicPage - 1) * videosPerPage;
  const displayMusic = musicVideos.slice(musicStartIndex, musicStartIndex + videosPerPage);

  // Get uploaded podcasts with pagination
  const podcastVideos = podcastVideosRaw.map(video => ({
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnail,
    creator: 'Your Channel',
    views: video.views,
  }));
  const podcastTotalPages = Math.ceil(podcastVideos.length / videosPerPage);
  const podcastStartIndex = (podcastPage - 1) * videosPerPage;
  const displayPodcasts = podcastVideos.slice(podcastStartIndex, podcastStartIndex + videosPerPage);

  const handleUpload = (files: File[], title: string, description: string, category?: string, subcategory?: string, tags?: string[]) => {
    files.forEach(file => {
      addUploadedVideo(file, title || file.name, description || '', 'trending', subcategory, tags);
    });
    toast({
      title: "Video uploaded to Trending",
      description: `${files.length} ${files.length === 1 ? 'video' : 'videos'} uploaded successfully.`,
    });
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-semibold text-primary">MiyTube</span> / Trending
          </p>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            Trending Now
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover what's popular across MiyTube - updated hourly
          </p>

          <div className="flex border-b mt-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'videos' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab('videos')}
            >
              Videos
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'music' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab('music')}
            >
              Music
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'podcasts' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab('podcasts')}
            >
              Podcasts
            </button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Upload to Trending</h2>
          </div>
          <FileUploader
            icon={TrendingUp}
            title="Upload Trending Video"
            description="Share your video content to appear in the trending section."
            acceptedTypes="video/*"
            supportedFormats={['MP4', 'MOV', 'WebM', 'AVI']}
            maxSize="10GB"
            onUpload={handleUpload}
            id="trending-upload-input"
            uploadDestination="Trending Section"
          />
        </div>

        {(activeTab === 'all' || activeTab === 'videos') && displayVideos.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Trending Videos
              </h2>
              <PageInfo 
                currentPage={currentPage} 
                totalPages={totalPages} 
                totalItems={trendingVideos.length} 
                itemLabel="videos" 
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayVideos.map(video => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'videos') && <TrendingShortVideosSection />}

        {(activeTab === 'all' || activeTab === 'music') && musicVideos.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Trending Music
              </h2>
              <PageInfo 
                currentPage={musicPage} 
                totalPages={musicTotalPages} 
                totalItems={musicVideos.length} 
                itemLabel="music" 
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayMusic.map(item => (
                <ShortCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  thumbnail={item.thumbnail}
                  creator={item.creator}
                  views={item.views}
                />
              ))}
            </div>
            <Pagination
              currentPage={musicPage}
              totalPages={musicTotalPages}
              onPageChange={setMusicPage}
              scrollToTop={false}
            />
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'podcasts') && podcastVideos.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Trending Podcasts
              </h2>
              <PageInfo 
                currentPage={podcastPage} 
                totalPages={podcastTotalPages} 
                totalItems={podcastVideos.length} 
                itemLabel="podcasts" 
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayPodcasts.map(item => (
                <ShortCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  thumbnail={item.thumbnail}
                  creator={item.creator}
                  views={item.views}
                />
              ))}
            </div>
            <Pagination
              currentPage={podcastPage}
              totalPages={podcastTotalPages}
              onPageChange={setPodcastPage}
              scrollToTop={false}
            />
          </div>
        )}

        {trendingVideos.length === 0 && musicVideos.length === 0 && podcastVideos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No trending content yet. Upload videos to see them here!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Trending;
