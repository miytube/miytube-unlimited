
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
  ) => Promise<void>;
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

  const generateThumbnail = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        
        video.onloadeddata = () => {
          // Seek to 1 second or 10% of video duration
          video.currentTime = Math.min(1, video.duration * 0.1);
        };
        
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
            URL.revokeObjectURL(video.src);
            resolve(thumbnailUrl);
          } else {
            resolve('https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80');
          }
        };
        
        video.onerror = () => {
          resolve('https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80');
        };
        
        video.src = URL.createObjectURL(file);
        video.load();
      } else {
        // For non-video files, use placeholder
        resolve('https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80');
      }
    });
  };

  const getVideoDuration = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        video.onloadedmetadata = () => {
          const duration = video.duration;
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60);
          URL.revokeObjectURL(video.src);
          resolve(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        };
        
        video.onerror = () => {
          resolve('0:00');
        };
        
        video.src = URL.createObjectURL(file);
      } else {
        resolve('0:00');
      }
    });
  };

  const addUploadedVideo = async (
    file: File, 
    title: string, 
    description: string, 
    category?: string, 
    subcategory?: string,
    tags: string[] = []
  ) => {
    const [thumbnail, duration] = await Promise.all([
      generateThumbnail(file),
      getVideoDuration(file)
    ]);
    const newVideo: UploadedVideo = {
      id: `upload-${Date.now()}`,
      file: file,
      title: title || file.name,
      description: description || '',
      thumbnail,
      timestamp: 'Just now',
      views: '0',
      duration,
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
