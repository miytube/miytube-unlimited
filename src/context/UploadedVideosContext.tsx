
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UploadedVideo {
  id: string;
  file: File;
  title: string;
  thumbnail: string; 
  timestamp: string;
  views: string;
  duration: string;
}

interface UploadedVideosContextType {
  uploadedVideos: UploadedVideo[];
  addUploadedVideo: (file: File) => void;
  clearUploadedVideos: () => void;
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

  const addUploadedVideo = (file: File) => {
    const timestamp = new Date().toLocaleDateString();
    
    const newVideo: UploadedVideo = {
      id: `upload-${Date.now()}`,
      file: file,
      title: file.name,
      thumbnail: generateThumbnail(file),
      timestamp: 'Just now',
      views: '0',
      duration: formatDuration(file),
    };
    
    setUploadedVideos((prev) => [newVideo, ...prev]);
  };

  const clearUploadedVideos = () => {
    setUploadedVideos([]);
  };

  return (
    <UploadedVideosContext.Provider
      value={{
        uploadedVideos,
        addUploadedVideo,
        clearUploadedVideos,
      }}
    >
      {children}
    </UploadedVideosContext.Provider>
  );
};
