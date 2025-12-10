import React, { useState } from 'react';
import { VideoCard } from '@/components/VideoCard';
import { MockVideo } from '@/data/mockVideos';
import { Pagination, PageInfo } from '@/components/Pagination';

interface VideoContentProps {
  title: string;
  videos: MockVideo[];
  videosPerPage?: number;
}

const VideoContent: React.FC<VideoContentProps> = ({ title, videos, videosPerPage = 20 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(videos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const displayVideos = videos.slice(startIndex, endIndex);
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <PageInfo 
          currentPage={currentPage} 
          totalPages={totalPages} 
          totalItems={videos.length} 
          itemLabel="videos" 
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayVideos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default VideoContent;
