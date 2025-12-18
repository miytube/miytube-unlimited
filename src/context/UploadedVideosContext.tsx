
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { shouldUseCloudStorage, uploadVideoToCloud, deleteVideoFromCloud } from '@/utils/cloudVideoUpload';
import { useUploadProgress } from './UploadProgressContext';
import { supabase } from '@/integrations/supabase/client';

export interface UploadedVideo {
  id: string;
  file: File | null;
  fileDataUrl?: string;
  cloudUrl?: string;
  isCloudStored?: boolean;
  isYouTubeEmbed?: boolean;
  youtubeId?: string;
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
  cloudUrl?: string;
  isCloudStored?: boolean;
  isYouTubeEmbed?: boolean;
  youtubeId?: string;
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
  isLoading: boolean;
  addUploadedVideo: (
    file: File, 
    title: string, 
    description: string, 
    category?: string, 
    subcategory?: string,
    tags?: string[],
    importUrl?: string,
    isYouTube?: boolean,
    youtubeId?: string
  ) => Promise<void>;
  updateUploadedVideo: (
    id: string,
    updates: Partial<Omit<UploadedVideo, 'id' | 'file'>>
  ) => void;
  deleteUploadedVideo: (id: string) => void;
  clearUploadedVideos: () => void;
  getVideosByCategory: (category: string, subcategory?: string) => UploadedVideo[];
  isUploadedVideo: (id: string) => boolean;
  refreshVideos: () => Promise<void>;
}

const UploadedVideosContext = createContext<UploadedVideosContextType | undefined>(undefined);

const DB_NAME = 'miytube_videos_db';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

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

// IndexedDB helpers
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

const saveVideoToDB = async (video: StoredVideo): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(video);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

const getAllVideosFromDB = async (): Promise<StoredVideo[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
};

const deleteVideoFromDB = async (id: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

const clearDB = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

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

// Supabase cloud backup helpers
const saveVideoToSupabase = async (video: {
  localId: string; // Local IndexedDB ID for logging
  title: string;
  description: string;
  category?: string;
  subcategory?: string;
  tags: string[];
  duration: string;
  thumbnail: string;
  cloudUrl?: string;
  isCloudStored?: boolean;
  isYouTubeEmbed?: boolean;
  youtubeId?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}): Promise<void> => {
  // Don't pass 'id' - let Supabase generate UUID automatically
  const { error } = await supabase.from('uploaded_videos').insert({
    title: video.title,
    description: video.description,
    category: video.category,
    subcategory: video.subcategory,
    tags: video.tags,
    duration: video.duration,
    thumbnail_url: video.thumbnail,
    cloud_url: video.cloudUrl,
    is_cloud_stored: video.isCloudStored || false,
    is_youtube_embed: video.isYouTubeEmbed || false,
    youtube_video_id: video.youtubeId,
    file_name: video.fileName,
    file_size: video.fileSize,
    file_type: video.fileType,
  });
  
  if (error) {
    console.error('Error saving video to Supabase:', error);
  } else {
    console.log('Saved video to Supabase cloud backup:', video.localId);
  }
};

const loadVideosFromSupabase = async (): Promise<UploadedVideo[]> => {
  const { data, error } = await supabase
    .from('uploaded_videos')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error loading videos from Supabase:', error);
    return [];
  }
  
  return (data || []).map(v => ({
    id: v.id,
    file: null,
    fileDataUrl: '',
    cloudUrl: v.cloud_url || undefined,
    isCloudStored: v.is_cloud_stored || false,
    isYouTubeEmbed: v.is_youtube_embed || false,
    youtubeId: v.youtube_video_id || undefined,
    title: v.title,
    description: v.description || '',
    thumbnail: v.thumbnail_url || 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80',
    timestamp: new Date(v.created_at).toLocaleDateString(),
    views: String(v.views || 0),
    duration: v.duration || '0:00',
    category: v.category || undefined,
    subcategory: v.subcategory || undefined,
    tags: v.tags || [],
  }));
};

const updateVideoInSupabase = async (id: string, updates: Record<string, unknown>): Promise<void> => {
  const supabaseUpdates: Record<string, unknown> = {};
  if (updates.title !== undefined) supabaseUpdates.title = updates.title;
  if (updates.description !== undefined) supabaseUpdates.description = updates.description;
  if (updates.category !== undefined) supabaseUpdates.category = updates.category;
  if (updates.subcategory !== undefined) supabaseUpdates.subcategory = updates.subcategory;
  if (updates.tags !== undefined) supabaseUpdates.tags = updates.tags;
  if (updates.thumbnail !== undefined) supabaseUpdates.thumbnail_url = updates.thumbnail;
  
  if (Object.keys(supabaseUpdates).length > 0) {
    const { error } = await supabase
      .from('uploaded_videos')
      .update(supabaseUpdates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating video in Supabase:', error);
    } else {
      console.log('Updated video in Supabase:', id);
    }
  }
};

const deleteVideoFromSupabase = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('uploaded_videos')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting video from Supabase:', error);
  } else {
    console.log('Deleted video from Supabase:', id);
  }
};

export const UploadedVideosProvider: React.FC<UploadedVideosProviderProps> = ({ children }) => {
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { startUpload, completeUpload, failUpload } = useUploadProgress();

  const loadStoredVideos = async () => {
    console.log('Starting to load videos from storage...');
    try {
      // Clear old localStorage data (migration cleanup)
      localStorage.removeItem('miytube_uploaded_videos');
      
      // Load from both sources in parallel
      const [localVideos, cloudVideos] = await Promise.all([
        getAllVideosFromDB(),
        loadVideosFromSupabase()
      ]);
      
      console.log('Local IndexedDB videos:', localVideos.length);
      console.log('Cloud Supabase videos:', cloudVideos.length);
      
      // Create a map of cloud videos by ID for deduplication
      const cloudVideoMap = new Map(cloudVideos.map(v => [v.id, v]));
      
      // Process local videos
      const localVideoList: UploadedVideo[] = localVideos.map(sv => ({
        id: sv.id,
        file: sv.isCloudStored || sv.isYouTubeEmbed ? null : (sv.fileDataUrl ? dataUrlToFile(sv.fileDataUrl, sv.fileName, sv.fileType) : null),
        fileDataUrl: sv.fileDataUrl,
        cloudUrl: sv.cloudUrl,
        isCloudStored: sv.isCloudStored,
        isYouTubeEmbed: sv.isYouTubeEmbed,
        youtubeId: sv.youtubeId,
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
      
      // Merge: local videos take priority (they have file data), add cloud-only videos
      const mergedVideos: UploadedVideo[] = [...localVideoList];
      const localIds = new Set(localVideoList.map(v => v.id));
      
      // Add cloud videos that aren't in local storage
      for (const cloudVideo of cloudVideos) {
        if (!localIds.has(cloudVideo.id)) {
          mergedVideos.push(cloudVideo);
        }
      }
      
      // Sort by most recent first using timestamp or ID
      mergedVideos.sort((a, b) => {
        // Try to extract timestamp from ID for local uploads (upload-{timestamp} format)
        const aIdTime = a.id.startsWith('upload-') ? parseInt(a.id.replace('upload-', '')) : 0;
        const bIdTime = b.id.startsWith('upload-') ? parseInt(b.id.replace('upload-', '')) : 0;
        
        // If both have ID timestamps, compare them
        if (aIdTime && bIdTime) {
          return bIdTime - aIdTime;
        }
        
        // For cloud videos (UUID format), parse the timestamp string
        const parseTimestamp = (ts: string): number => {
          if (ts === 'Just now') return Date.now();
          // Try to parse date strings like "12/12/2024"
          const parsed = Date.parse(ts);
          return isNaN(parsed) ? 0 : parsed;
        };
        
        const aTime = aIdTime || parseTimestamp(a.timestamp);
        const bTime = bIdTime || parseTimestamp(b.timestamp);
        
        return bTime - aTime;
      });
      
      setUploadedVideos(mergedVideos);
      console.log('Total videos loaded:', mergedVideos.length, 
        'local:', localVideoList.length, 
        'cloud-only:', mergedVideos.length - localVideoList.length);
    } catch (error) {
      console.error('Error loading videos:', error);
    }
    setIsLoaded(true);
  };

  // Load videos from both IndexedDB (local) and Supabase (cloud)
  useEffect(() => {
    loadStoredVideos();
  }, []);

  const refreshVideos = async () => {
    setIsLoaded(false);
    await loadStoredVideos();
  };

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
    tags: string[] = [],
    importUrl?: string,
    isYouTube?: boolean,
    youtubeId?: string
  ): Promise<void> => {
    // Handle YouTube embed
    if (isYouTube && youtubeId) {
      console.log(`Adding YouTube embed: ${youtubeId}`);
      
      const videoId = `upload-${Date.now()}`;
      const youtubeThumbnail = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
      
      const newVideo: UploadedVideo = {
        id: videoId,
        file: null,
        fileDataUrl: '',
        cloudUrl: importUrl || `https://www.youtube.com/watch?v=${youtubeId}`,
        isCloudStored: false,
        isYouTubeEmbed: true,
        youtubeId: youtubeId,
        title: title || 'YouTube Video',
        description: description || '',
        thumbnail: youtubeThumbnail,
        timestamp: 'Just now',
        views: '0',
        duration: '0:00',
        category,
        subcategory,
        tags,
      };
      
      // Save to IndexedDB
      try {
        await saveVideoToDB({
          id: videoId,
          fileDataUrl: '',
          cloudUrl: newVideo.cloudUrl,
          isCloudStored: false,
          isYouTubeEmbed: true,
          youtubeId: youtubeId,
          fileName: title || 'youtube-video',
          fileType: 'video/youtube',
          title: newVideo.title,
          description: newVideo.description,
          thumbnail: youtubeThumbnail,
          timestamp: newVideo.timestamp,
          views: newVideo.views,
          duration: newVideo.duration,
          category,
          subcategory,
          tags,
        });
        console.log("Saved YouTube embed to IndexedDB:", videoId);
      } catch (error) {
        console.error("Error saving YouTube embed to IndexedDB:", error);
      }
      
      // Save to Supabase cloud backup
      await saveVideoToSupabase({
        localId: videoId,
        title: newVideo.title,
        description: newVideo.description,
        category,
        subcategory,
        tags,
        duration: newVideo.duration,
        thumbnail: youtubeThumbnail,
        cloudUrl: newVideo.cloudUrl,
        isCloudStored: false,
        isYouTubeEmbed: true,
        youtubeId,
      });
      
      setUploadedVideos(prev => [newVideo, ...prev]);
      return;
    }
    
    // If URL is provided (non-YouTube), skip file upload and use URL directly
    if (importUrl) {
      console.log(`Importing video from URL: ${importUrl}`);
      
      const videoId = `upload-${Date.now()}`;
      const newVideo: UploadedVideo = {
        id: videoId,
        file: null,
        fileDataUrl: '',
        cloudUrl: importUrl,
        isCloudStored: true,
        title: title || 'Imported Video',
        description: description || '',
        thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80',
        timestamp: 'Just now',
        views: '0',
        duration: '0:00',
        category,
        subcategory,
        tags,
      };
      
      // Save to IndexedDB
      try {
        await saveVideoToDB({
          id: videoId,
          fileDataUrl: '',
          cloudUrl: importUrl,
          isCloudStored: true,
          fileName: title || 'imported-video',
          fileType: 'video/mp4',
          title: newVideo.title,
          description: newVideo.description,
          thumbnail: newVideo.thumbnail,
          timestamp: newVideo.timestamp,
          views: newVideo.views,
          duration: newVideo.duration,
          category,
          subcategory,
          tags,
        });
        console.log("Saved URL import to IndexedDB:", videoId);
      } catch (error) {
        console.error("Error saving URL import to IndexedDB:", error);
      }
      
      // Save to Supabase cloud backup
      await saveVideoToSupabase({
        localId: videoId,
        title: newVideo.title,
        description: newVideo.description,
        category,
        subcategory,
        tags,
        duration: newVideo.duration,
        thumbnail: newVideo.thumbnail,
        cloudUrl: importUrl,
        isCloudStored: true,
      });
      
      setUploadedVideos(prev => [newVideo, ...prev]);
      return;
    }

    const useCloud = shouldUseCloudStorage(file);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(0);
    
    console.log(`Uploading video: ${file.name} (${fileSizeMB}MB) - ${useCloud ? 'Cloud storage' : 'Browser storage'}`);

    const [thumbnail, duration] = await Promise.all([
      generateThumbnail(file),
      getVideoDuration(file),
    ]);
    
    let fileDataUrl = '';
    let cloudUrl = '';
    
    if (useCloud) {
      // Upload to Supabase Storage for large files
      const fileSizeMB = Math.round(file.size / (1024 * 1024));
      const estimatedMinutes = Math.ceil(fileSizeMB / 10);
      
      startUpload(file.name, fileSizeMB, estimatedMinutes);
      
      try {
        cloudUrl = await uploadVideoToCloud(file);
        console.log("Uploaded to cloud storage:", cloudUrl);
        completeUpload();
      } catch (error) {
        console.error("Cloud upload error:", error);
        failUpload(error instanceof Error ? error.message : 'Unknown error');
        throw new Error(`Failed to upload large video: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      // Convert file to data URL for browser storage (fast local playback)
      try {
        fileDataUrl = await fileToDataUrl(file);
      } catch (error) {
        console.error("Error converting file to data URL:", error);
        throw new Error("Failed to process video file. The file may be too large.");
      }

      // ALSO upload to cloud storage so videos remain available across refresh/devices
      const fileSizeMB = Math.round(file.size / (1024 * 1024));
      const estimatedMinutes = Math.max(1, Math.ceil(fileSizeMB / 10));
      
      startUpload(file.name, fileSizeMB, estimatedMinutes);
      
      try {
        cloudUrl = await uploadVideoToCloud(file);
        console.log("Uploaded to cloud storage (backup):", cloudUrl);
        completeUpload();
      } catch (error) {
        console.warn("Cloud backup upload failed (video will only be available locally):", error);
        failUpload(error instanceof Error ? error.message : 'Cloud backup failed');
      }
    }
    
    const videoId = `upload-${Date.now()}`;
    const newVideo: UploadedVideo = {
      id: videoId,
      file: useCloud ? null : file,
      fileDataUrl: useCloud ? '' : fileDataUrl,
      cloudUrl: cloudUrl || undefined,
      isCloudStored: useCloud,
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
    
    // Save to IndexedDB
    try {
       await saveVideoToDB({
         id: videoId,
         fileDataUrl: useCloud ? '' : fileDataUrl,
         cloudUrl: cloudUrl || undefined,
         isCloudStored: useCloud,
         fileName: file.name,
        fileType: file.type,
        title: newVideo.title,
        description: newVideo.description,
        thumbnail,
        timestamp: newVideo.timestamp,
        views: newVideo.views,
        duration,
        category,
        subcategory,
        tags,
      });
      console.log("Saved video metadata to IndexedDB:", videoId);
    } catch (error) {
      console.error("Error saving video to IndexedDB:", error);
      if (useCloud && cloudUrl) {
        await deleteVideoFromCloud(cloudUrl).catch(() => {});
      }
      throw new Error("Failed to save video metadata.");
    }
    
    // Save to Supabase cloud backup
    await saveVideoToSupabase({
      localId: videoId,
      title: newVideo.title,
      description: newVideo.description,
      category,
      subcategory,
      tags,
      duration,
      thumbnail,
       cloudUrl: cloudUrl || undefined,
       isCloudStored: useCloud,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
    
    console.log("Adding new video:", videoId, newVideo.title, "category:", category, useCloud ? "(cloud)" : "(local)");
    setUploadedVideos(prev => [newVideo, ...prev]);
  };

  const updateUploadedVideo = async (
    id: string,
    updates: Partial<Omit<UploadedVideo, 'id' | 'file'>>
  ) => {
    setUploadedVideos(prev => {
      const updated = prev.map(video => 
        video.id === id ? { ...video, ...updates } : video
      );
      
      // Update in IndexedDB
      const videoToUpdate = updated.find(v => v.id === id);
      if (videoToUpdate) {
        saveVideoToDB({
          id: videoToUpdate.id,
          fileDataUrl: videoToUpdate.fileDataUrl || '',
          cloudUrl: videoToUpdate.cloudUrl,
          isCloudStored: videoToUpdate.isCloudStored,
          fileName: videoToUpdate.file?.name || 'video',
          fileType: videoToUpdate.file?.type || 'video/mp4',
          title: videoToUpdate.title,
          description: videoToUpdate.description,
          thumbnail: videoToUpdate.thumbnail,
          timestamp: videoToUpdate.timestamp,
          views: videoToUpdate.views,
          duration: videoToUpdate.duration,
          category: videoToUpdate.category,
          subcategory: videoToUpdate.subcategory,
          tags: videoToUpdate.tags,
        }).catch(err => console.error('Error updating video in IndexedDB:', err));
        
        // Update in Supabase
        updateVideoInSupabase(id, updates as Record<string, unknown>);
      }
      
      return updated;
    });
    console.log("Updated video:", id, updates);
  };

  const deleteUploadedVideo = async (id: string) => {
    const videoToDelete = uploadedVideos.find(v => v.id === id);
    
    setUploadedVideos(prev => prev.filter(video => video.id !== id));
    
    try {
      // Delete from cloud storage if applicable
      if (videoToDelete?.isCloudStored && videoToDelete?.cloudUrl) {
        await deleteVideoFromCloud(videoToDelete.cloudUrl);
        console.log("Deleted video from cloud storage:", id);
      }
      
      // Delete from IndexedDB
      await deleteVideoFromDB(id);
      console.log("Deleted video from IndexedDB:", id);
      
      // Delete from Supabase
      await deleteVideoFromSupabase(id);
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const clearUploadedVideos = async () => {
    setUploadedVideos([]);
    try {
      await clearDB();
    } catch (error) {
      console.error("Error clearing IndexedDB:", error);
    }
  };
  
  // Fuzzy matching helper for typos
  const isFuzzyMatch = (input: string, target: string, threshold = 0.75): boolean => {
    const s1 = input.toLowerCase().trim();
    const s2 = target.toLowerCase().trim();
    if (s1 === s2) return true;
    if (s1.includes(s2) || s2.includes(s1)) return 0.9 >= threshold;
    const chars1 = new Set(s1.split(''));
    const chars2 = new Set(s2.split(''));
    const intersection = [...chars1].filter(c => chars2.has(c)).length;
    const union = new Set([...chars1, ...chars2]).size;
    return (intersection / union) >= threshold;
  };

  const getVideosByCategory = (category: string, subcategory?: string): UploadedVideo[] => {
    const categoryLower = category.toLowerCase().trim();
    
    return uploadedVideos.filter(video => {
      const vidCategory = video.category?.toLowerCase().trim() || '';
      const vidSubcategory = video.subcategory?.toLowerCase().trim() || '';
      
      if (subcategory) {
        const subLower = subcategory.toLowerCase().trim();
        const categoryMatches = vidCategory === categoryLower || isFuzzyMatch(vidCategory, categoryLower);
        const subcategoryMatches = vidSubcategory === subLower || isFuzzyMatch(vidSubcategory, subLower);
        return categoryMatches && subcategoryMatches;
      }
      
      return vidCategory === categoryLower || isFuzzyMatch(vidCategory, categoryLower);
    });
  };

  const isUploadedVideo = (id: string): boolean => {
    return uploadedVideos.some(video => video.id === id);
  };

  return (
    <UploadedVideosContext.Provider
      value={{
        uploadedVideos,
        isLoading: !isLoaded,
        addUploadedVideo,
        updateUploadedVideo,
        deleteUploadedVideo,
        clearUploadedVideos,
        getVideosByCategory,
        isUploadedVideo,
        refreshVideos,
      }}
    >
      {children}
    </UploadedVideosContext.Provider>
  );
};
