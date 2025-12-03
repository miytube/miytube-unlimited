
import { useState, useCallback } from 'react';

// Empty array - no placeholder videos
const allVideos: any[] = [];

export const useVideos = () => {
  const [videos] = useState(allVideos);
  
  const getVideoById = useCallback((id: string) => {
    return videos.find(video => video.id === id);
  }, [videos]);
  
  const getVideosByTag = useCallback((tag: string) => {
    return videos.filter(video => video.tags?.includes(tag));
  }, [videos]);
  
  return {
    videos,
    getVideoById,
    getVideosByTag,
  };
};
