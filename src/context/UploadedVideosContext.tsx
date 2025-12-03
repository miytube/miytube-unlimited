
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UploadedVideo {
  id: string;
  file: File | null;
  fileDataUrl?: string; // For persistence
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

interface StoredVideo {
  id: string;
  fileDataUrl: string;
  fileName: string;
  fileType: string;
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

const STORAGE_KEY = 'miytube_uploaded_videos';

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

// Convert File to base64 data URL
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Convert base64 data URL back to File
const dataUrlToFile = (dataUrl: string, fileName: string, fileType: string): File => {
  const arr = dataUrl.split(',');
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: fileType });
};

export const UploadedVideosProvider: React.FC<UploadedVideosProviderProps> = ({ children }) => {
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load videos from localStorage on mount
  useEffect(() => {
    const loadStoredVideos = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const storedVideos: StoredVideo[] = JSON.parse(stored);
          const videos: UploadedVideo[] = storedVideos.map(sv => ({
            id: sv.id,
            file: dataUrlToFile(sv.fileDataUrl, sv.fileName, sv.fileType),
            fileDataUrl: sv.fileDataUrl,
            title: sv.title,
            description: sv.description,
            thumbnail: sv.thumbnail,
            timestamp: sv.timestamp,
            views: sv.views,
            duration: sv.duration,
            category: sv.category,
            subcategory: sv.subcategory,
            tags: sv.tags || [],
          }));
          setUploadedVideos(videos);
        }
      } catch (error) {
        console.error('Error loading videos from localStorage:', error);
      }
      setIsLoaded(true);
    };
    loadStoredVideos();
  }, []);

  // Save videos to localStorage whenever they change
  useEffect(() => {
    if (!isLoaded) return;
    
    const saveVideos = async () => {
      try {
        const storedVideos: StoredVideo[] = await Promise.all(
          uploadedVideos.map(async (video) => ({
            id: video.id,
            fileDataUrl: video.fileDataUrl || (video.file ? await fileToDataUrl(video.file) : ''),
            fileName: video.file?.name || 'video',
            fileType: video.file?.type || 'video/mp4',
            title: video.title,
            description: video.description,
            thumbnail: video.thumbnail,
            timestamp: video.timestamp,
            views: video.views,
            duration: video.duration,
            category: video.category,
            subcategory: video.subcategory,
            tags: video.tags,
          }))
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storedVideos));
      } catch (error) {
        console.error('Error saving videos to localStorage:', error);
      }
    };
    saveVideos();
  }, [uploadedVideos, isLoaded]);

  const generateThumbnail = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        
        video.onloadeddata = () => {
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
    const [thumbnail, duration, fileDataUrl] = await Promise.all([
      generateThumbnail(file),
      getVideoDuration(file),
      fileToDataUrl(file)
    ]);
    
    const newVideo: UploadedVideo = {
      id: `upload-${Date.now()}`,
      file: file,
      fileDataUrl,
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
    
    console.log("Adding new video:", newVideo.id, newVideo.title);
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
    localStorage.removeItem(STORAGE_KEY);
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
