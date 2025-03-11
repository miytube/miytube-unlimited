
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UploadedVideo {
  id: string;
  file: File;
  title: string;
  description: string;
  thumbnail: string;
  timestamp: string;
  views: string;
  duration: string;
  category?: string;
  subcategory?: string;
  tags: string[];
}

interface UploadedVideosContextType {
  uploadedVideos: UploadedVideo[];
  addUploadedVideo: (
    file: File, 
    title: string, 
    description: string, 
    category?: string, 
    subcategory?: string,
    tags?: string[]
  ) => void;
  clearUploadedVideos: () => void;
  getVideosByCategory: (category: string, subcategory?: string) => UploadedVideo[];
}

const UploadedVideosContext = createContext<UploadedVideosContextType | undefined>(undefined);

export const useUploadedVideos = () => {
  const context = useContext(UploadedVideosContext);
  if (!context) {
    throw new Error('useUploadedVideos must be used within an UploadedVideosProvider');
  }
  return context;
};

interface UploadedVideosProviderProps {
  children: ReactNode;
}

export const UploadedVideosProvider: React.FC<UploadedVideosProviderProps> = ({ children }) => {
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);

  const generateThumbnail = (file: File): string => {
    // In a real app, we would generate a thumbnail from the video
    // For now, we use a placeholder
    return 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80';
  };

  const formatDuration = (file: File): string => {
    // In a real app, we would extract the duration from the video
    // For now, we return a placeholder
    return '0:30';
  };

  const addUploadedVideo = (
    file: File, 
    title: string, 
    description: string, 
    category?: string, 
    subcategory?: string,
    tags: string[] = []
  ) => {
    const timestamp = new Date().toLocaleDateString();
    
    const newVideo: UploadedVideo = {
      id: `upload-${Date.now()}`,
      file: file,
      title: title || file.name,
      description: description || '',
      thumbnail: generateThumbnail(file),
      timestamp: 'Just now',
      views: '0',
      duration: formatDuration(file),
      category,
      subcategory,
      tags,
    };
    
    console.log("Adding new video:", newVideo);
    console.log("With category:", category);
    
    setUploadedVideos((prev) => [newVideo, ...prev]);
  };

  const clearUploadedVideos = () => {
    setUploadedVideos([]);
  };
  
  const getVideosByCategory = (category: string, subcategory?: string): UploadedVideo[] => {
    console.log("Getting videos by category:", category);
    console.log("Current uploaded videos:", uploadedVideos);
    
    if (subcategory) {
      return uploadedVideos.filter(
        video => video.category === category && video.subcategory === subcategory
      );
    }
    return uploadedVideos.filter(video => video.category === category);
  };

  return (
    <UploadedVideosContext.Provider
      value={{
        uploadedVideos,
        addUploadedVideo,
        clearUploadedVideos,
        getVideosByCategory,
      }}
    >
      {children}
    </UploadedVideosContext.Provider>
  );
};
