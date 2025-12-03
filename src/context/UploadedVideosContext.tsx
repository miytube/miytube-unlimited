
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UploadedVideo {
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
  updateUploadedVideo: (
    id: string,
    updates: Partial<Omit<UploadedVideo, 'id' | 'file'>>
  ) => void;
  deleteUploadedVideo: (id: string) => void;
  clearUploadedVideos: () => void;
  getVideosByCategory: (category: string, subcategory?: string) => UploadedVideo[];
  isUploadedVideo: (id: string) => boolean;
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
    return 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80';
  };

  const formatDuration = (file: File): string => {
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
    setUploadedVideos(prev => [newVideo, ...prev]);
  };

  const updateUploadedVideo = (
    id: string,
    updates: Partial<Omit<UploadedVideo, 'id' | 'file'>>
  ) => {
    setUploadedVideos(prev => 
      prev.map(video => 
        video.id === id ? { ...video, ...updates } : video
      )
    );
    console.log("Updated video:", id, updates);
  };

  const deleteUploadedVideo = (id: string) => {
    setUploadedVideos(prev => prev.filter(video => video.id !== id));
    console.log("Deleted video:", id);
  };

  const clearUploadedVideos = () => {
    setUploadedVideos([]);
  };
  
  const getVideosByCategory = (category: string, subcategory?: string): UploadedVideo[] => {
    if (subcategory) {
      return uploadedVideos.filter(
        video => video.category?.toLowerCase() === category.toLowerCase() && 
                video.subcategory?.toLowerCase() === subcategory.toLowerCase()
      );
    }
    return uploadedVideos.filter(
      video => video.category?.toLowerCase() === category.toLowerCase()
    );
  };

  const isUploadedVideo = (id: string): boolean => {
    return uploadedVideos.some(video => video.id === id);
  };

  return (
    <UploadedVideosContext.Provider
      value={{
        uploadedVideos,
        addUploadedVideo,
        updateUploadedVideo,
        deleteUploadedVideo,
        clearUploadedVideos,
        getVideosByCategory,
        isUploadedVideo,
      }}
    >
      {children}
    </UploadedVideosContext.Provider>
  );
};
