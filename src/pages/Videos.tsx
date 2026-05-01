import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { ShortCard } from '@/components/ShortCard';
import { Film, Upload, Tv, ListVideo, Clock, Lock, User, Megaphone, Star, Eye, Heart, ThumbsUp, MessageSquare, Reply, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useParams } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { Pagination, PageInfo } from '@/components/Pagination';

const Videos = () => {
  const { category } = useParams();
  const { uploadedVideos, getVideosByCategory, refreshVideos } = useUploadedVideos();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 20;
  const prevVideoCount = useRef(uploadedVideos.length);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshVideos();
    setCurrentPage(1);
    setIsRefreshing(false);
  };

  // Reset to page 1 when new videos are added
  useEffect(() => {
    if (uploadedVideos.length > prevVideoCount.current) {
      setCurrentPage(1);
    }
    prevVideoCount.current = uploadedVideos.length;
  }, [uploadedVideos.length]);
  
  // Debug: Log all video categories to understand what's stored
  console.log('All uploaded videos:', uploadedVideos.map(v => ({ id: v.id, title: v.title, category: v.category, subcategory: v.subcategory })));
  
  // ALL videos go to video library (except shorts which have their own section)
  const allRegularVideos = uploadedVideos.filter(video => 
    video.category?.toLowerCase() !== 'shorts'
  );
  
  // Shorts for the shorts section
  const allShortVideos = getVideosByCategory('shorts');
  console.log('Shorts found:', allShortVideos.length, allShortVideos.map(v => v.title));
  
  // Filter by category if a specific category is selected in URL
  const displayedRegularVideos = category 
    ? getVideosByCategory(category).filter(v => v.category?.toLowerCase() !== 'shorts')
    : allRegularVideos;
    
  const displayedShortVideos = category
    ? allShortVideos.filter(v => 
        v.subcategory?.toLowerCase() === category.toLowerCase() ||
        v.tags?.some(t => t.toLowerCase() === category.toLowerCase())
      )
    : allShortVideos;
  
  const videoCategories = [
    { id: 'trending', name: 'Trending', icon: <Tv size={24} /> },
    { id: 'news', name: 'News', icon: <ListVideo size={24} /> },
    { id: 'education', name: 'Education', icon: <Film size={24} /> },
    { id: 'technology', name: 'Technology', icon: <Tv size={24} /> },
    { id: 'travel', name: 'Travel', icon: <Film size={24} /> },
    { id: 'howto', name: 'How-to', icon: <ListVideo size={24} /> },
  ];

  // Library filter categories
  const libraryCategories = [
    { id: 'latest', name: 'Latest', icon: <Clock size={18} /> },
    { id: 'private', name: 'Private', icon: <Lock size={18} /> },
    { id: 'personal', name: 'Personal', icon: <User size={18} /> },
    { id: 'promoted', name: 'Promoted', icon: <Megaphone size={18} /> },
    { id: 'featured', name: 'Featured', icon: <Star size={18} /> },
    { id: 'most-viewed', name: 'Most Viewed', icon: <Eye size={18} /> },
    { id: 'favorited', name: 'Favorited', icon: <Heart size={18} /> },
    { id: 'liked', name: 'Liked', icon: <ThumbsUp size={18} /> },
    { id: 'commented', name: 'Commented', icon: <MessageSquare size={18} /> },
    { id: 'responded', name: 'Responded', icon: <Reply size={18} /> },
  ];

  // Newest first with pagination
  const allVideosToShow = displayedRegularVideos;
  const totalPages = Math.ceil(allVideosToShow.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const videosToShow = allVideosToShow.slice(startIndex, startIndex + videosPerPage);
  const shortsToShow = displayedShortVideos.slice(0, 8);

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-semibold text-primary">MiyTube</span> / {category ? `Videos / ${category.charAt(0).toUpperCase() + category.slice(1)}` : 'Video Library'}
        </p>
        
        <div className="flex items-center gap-3 mb-8">
          <Film className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Videos` : 'Video Library'}
          </h1>
          <p className="text-muted-foreground ml-2">
            {category 
              ? `Browse our collection of ${category.toLowerCase()} videos` 
              : 'Discover and enjoy a wide variety of videos in our library'}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Link to="/upload/video" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
              <Upload size={18} />
              <span>Upload Video</span>
            </Link>
          </div>
        </div>
        
        {!category && (
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {videoCategories.map((categoryItem) => (
                <Link 
                  key={categoryItem.id} 
                  to={`/videos/${categoryItem.id}`}
                  className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {categoryItem.icon}
                  </div>
                  <span className="font-medium">{categoryItem.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Library Filter Buttons */}
        {!category && (
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">Filter By</h2>
            <div className="flex flex-wrap gap-2">
              {libraryCategories.map((libCat) => (
                <Link 
                  key={libCat.id} 
                  to={`/videos/${libCat.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {libCat.icon}
                  <span className="text-sm font-medium">{libCat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
        {/* Regular Videos Section - 4 columns, 20 per page */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Videos` : 'All Videos'}
          </h2>
          {videosToShow.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {videosToShow.map((video) => (
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
                    category={video.category}
                    subcategory={video.subcategory}
                    tags={video.tags}
                  />
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <PageInfo 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  totalItems={allVideosToShow.length} 
                  itemLabel="videos" 
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          ) : (
            <div className="p-6 bg-muted/20 rounded-lg text-center">
              <p className="text-muted-foreground mb-4">
                No videos uploaded yet. Be the first to upload!
              </p>
              <Link to="/upload/video" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                <Upload size={18} />
                <span>Upload Video</span>
              </Link>
            </div>
          )}
        </div>
        
        {/* Shorts Section - 4 columns */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Shorts</h2>
            <Link to="/shorts" className="text-primary text-sm hover:underline">
              View all
            </Link>
          </div>
          {shortsToShow.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {shortsToShow.slice(0, 8).map((video) => (
                <ShortCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  thumbnail={video.thumbnail}
                  creator="Your Channel"
                  views={video.views}
                  description={video.description}
                  category={video.category}
                  subcategory={video.subcategory}
                  tags={video.tags}
                />
              ))}
            </div>
          ) : (
            <div className="p-6 bg-muted/20 rounded-lg text-center">
              <p className="text-muted-foreground mb-4">
                No shorts uploaded yet. Upload your first short video!
              </p>
              <Link to="/shorts" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                <Upload size={18} />
                <span>Upload Short</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Videos;
