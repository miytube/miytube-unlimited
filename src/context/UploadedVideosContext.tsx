
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
}

interface UploadedVideosContextType {
  uploadedVideos: UploadedVideo[];
  addUploadedVideo: (file: File, title: string, description: string, category?: string, subcategory?: string) => void;
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
    // For now, return a placeholder thumbnail
    // In a real app, you would generate a real thumbnail from the video
    return 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80';
  };

  const formatDuration = (file: File): string => {
    // In a real app, you would get the actual duration from the video file
    // For now, return a placeholder duration
    return '0:30';
  };

  const addUploadedVideo = (file: File, title: string, description: string, category?: string, subcategory?: string) => {
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
    };
    
    setUploadedVideos((prev) => [newVideo, ...prev]);
  };

  const clearUploadedVideos = () => {
    setUploadedVideos([]);
  };
  
  const getVideosByCategory = (category: string, subcategory?: string): UploadedVideo[] => {
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
