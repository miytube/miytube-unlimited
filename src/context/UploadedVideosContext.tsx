import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { uploadVideoToCloud, deleteVideoFromCloud } from '@/utils/cloudVideoUpload';
import { useUploadProgress } from './UploadProgressContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { normalizeCategoryValue } from '@/utils/normalizeCategory';

type DuplicateCheckResult = { isDuplicate: false } | { isDuplicate: true; reason: 'session' | 'location' };

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
  createdAt?: string;
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

// Get client IP address for duplicate detection
const getClientIp = async (): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-client-ip');
    if (error) {
      console.error('Error getting client IP:', error);
      return 'unknown';
    }
    return data?.ip || 'unknown';
  } catch (err) {
    console.error('Failed to get client IP:', err);
    return 'unknown';
  }
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
}): Promise<DuplicateCheckResult> => {
  const [{ data: authData }, uploaderIp] = await Promise.all([
    supabase.auth.getUser(),
    getClientIp(),
  ]);
  const userId = authData?.user?.id;

  if (!userId) {
    throw new Error('You must be signed in to save uploaded videos.');
  }

  // Normalize category/subcategory to canonical lower-hyphen form before insert
  const normalizedCategory = normalizeCategoryValue(video.category);
  const normalizedSubcategory = normalizeCategoryValue(video.subcategory);
  // Check if a video with this local_id already exists to prevent duplicates from same session
  const { data: existingById } = await supabase
    .from('uploaded_videos')
    .select('id')
    .eq('local_id', video.localId)
    .maybeSingle();
  
  if (existingById) {
    console.log('Video already exists in Supabase with local_id:', video.localId);
    return { isDuplicate: true, reason: 'session' };
  }
  
  // Check if same title was uploaded from same IP (same location duplicate check)
  if (uploaderIp !== 'unknown') {
    const { data: existingByIpTitle } = await supabase
      .from('uploaded_videos')
      .select('id, title')
      .eq('uploader_ip', uploaderIp)
      .eq('title', video.title)
      .maybeSingle();
    
    if (existingByIpTitle) {
      console.log('Duplicate detected: Same title from same IP address. Title:', video.title, 'IP:', uploaderIp);
      return { isDuplicate: true, reason: 'location' };
    }
  }
  
  // Don't pass 'id' - let the database generate UUID automatically
  // Store local_id to maintain URL compatibility
  const { error } = await supabase.from('uploaded_videos').insert({
    local_id: video.localId, // Store the local ID for URL lookups
    user_id: userId,
    title: video.title,
    description: video.description,
    category: normalizedCategory,
    subcategory: normalizedSubcategory,
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
    uploader_ip: uploaderIp,
  });
  
  if (error) {
    console.error('Error saving video to Supabase:', error);
    throw new Error(`Upload saved to storage, but failed to publish to the video feed: ${error.message}`);
  }

  console.log('Saved video to Supabase cloud backup with local_id:', video.localId, 'from IP:', uploaderIp);
  return { isDuplicate: false };
};

const mapSupabaseRow = (v: any): UploadedVideo => ({
  id: v.local_id || v.id,
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
  createdAt: v.created_at,
  views: String(v.views || 0),
  duration: v.duration || '0:00',
  category: v.category || undefined,
  subcategory: v.subcategory || undefined,
  tags: v.tags || [],
});

const deduplicateRows = (rows: any[]): any[] => {
  const seen = new Set<string>();
  return rows.filter(v => {
    const key = v.local_id || v.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// Load first batch quickly, returns { firstBatch, loadRemaining }
const loadVideosFromSupabase = async (): Promise<{ firstBatch: UploadedVideo[]; loadRemaining: () => Promise<UploadedVideo[]> }> => {
  const PAGE_SIZE = 1000;

  const { data, error } = await supabase
    .from('uploaded_videos')
    .select('*')
    .order('created_at', { ascending: false })
    .range(0, PAGE_SIZE - 1);

  if (error) {
    console.error('Error loading videos from Supabase:', error);
    return { firstBatch: [], loadRemaining: async () => [] };
  }

  const firstRows = deduplicateRows(data || []);
  const firstBatch = firstRows.map(mapSupabaseRow);
  const hasMore = (data || []).length === PAGE_SIZE;

  console.log('First batch loaded:', firstBatch.length, 'videos');

  const loadRemaining = async (): Promise<UploadedVideo[]> => {
    if (!hasMore) return [];

    let allRemaining: any[] = [];
    let from = PAGE_SIZE;
    let keepGoing = true;

    while (keepGoing) {
      const { data: pageData, error: pageError } = await supabase
        .from('uploaded_videos')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, from + PAGE_SIZE - 1);

      if (pageError) {
        console.error('Error loading remaining videos:', pageError);
        break;
      }

      if (pageData && pageData.length > 0) {
        allRemaining = allRemaining.concat(pageData);
        from += PAGE_SIZE;
        keepGoing = pageData.length === PAGE_SIZE;
      } else {
        keepGoing = false;
      }
    }

    // Deduplicate remaining against first batch keys
    const existingKeys = new Set(firstRows.map((v: any) => v.local_id || v.id));
    const uniqueRemaining = allRemaining.filter(v => {
      const key = v.local_id || v.id;
      if (existingKeys.has(key)) return false;
      existingKeys.add(key);
      return true;
    });

    console.log('Remaining batches loaded:', uniqueRemaining.length, 'additional videos');
    return uniqueRemaining.map(mapSupabaseRow);
  };

  return { firstBatch, loadRemaining };
};

const updateVideoInSupabase = async (id: string, updates: Record<string, unknown>): Promise<void> => {
  const supabaseUpdates: Record<string, unknown> = {};
  if (updates.title !== undefined) supabaseUpdates.title = updates.title;
  if (updates.description !== undefined) supabaseUpdates.description = updates.description;
  if (updates.category !== undefined) supabaseUpdates.category = normalizeCategoryValue(updates.category as string);
  if (updates.subcategory !== undefined) supabaseUpdates.subcategory = normalizeCategoryValue(updates.subcategory as string);
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
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const query = supabase.from('uploaded_videos').delete();
  const { error } = isUUID ? await query.eq('id', id) : await query.eq('local_id', id);

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

  const mergeAndSort = (localVideos: StoredVideo[], cloudVideos: UploadedVideo[]): UploadedVideo[] => {
    const cloudVideoMap = new Map(cloudVideos.map(v => [v.id, v]));
    
    const localVideoList: UploadedVideo[] = localVideos.map(sv => {
      const cloudVideo = cloudVideoMap.get(sv.id);
      return {
        id: sv.id,
        file: sv.isCloudStored || sv.isYouTubeEmbed ? null : (sv.fileDataUrl ? dataUrlToFile(sv.fileDataUrl, sv.fileName, sv.fileType) : null),
        fileDataUrl: sv.fileDataUrl,
        cloudUrl: cloudVideo?.cloudUrl || sv.cloudUrl,
        isCloudStored: cloudVideo?.isCloudStored ?? sv.isCloudStored,
        isYouTubeEmbed: cloudVideo?.isYouTubeEmbed ?? sv.isYouTubeEmbed,
        youtubeId: cloudVideo?.youtubeId || sv.youtubeId,
        title: cloudVideo?.title || sv.title,
        description: cloudVideo?.description ?? sv.description,
        thumbnail: cloudVideo?.thumbnail || sv.thumbnail,
        timestamp: cloudVideo?.timestamp || sv.timestamp,
        createdAt: cloudVideo?.createdAt,
        views: cloudVideo?.views || sv.views,
        duration: cloudVideo?.duration || sv.duration,
        category: cloudVideo?.category ?? sv.category,
        subcategory: cloudVideo?.subcategory ?? sv.subcategory,
        tags: cloudVideo?.tags?.length ? cloudVideo.tags : (sv.tags || []),
      };
    });
    
    const merged: UploadedVideo[] = [...localVideoList];
    const localIds = new Set(localVideoList.map(v => v.id));
    for (const cv of cloudVideos) {
      if (!localIds.has(cv.id)) merged.push(cv);
    }
    
    merged.sort((a, b) => {
      // Resolve a sortable timestamp for each video, preferring ISO created_at,
      // then the local upload-<timestamp> id, then the human timestamp string.
      const resolveTime = (v: UploadedVideo): number => {
        if (v.createdAt) {
          const t = Date.parse(v.createdAt);
          if (!isNaN(t)) return t;
        }
        if (v.id?.startsWith('upload-')) {
          const t = parseInt(v.id.replace('upload-', ''), 10);
          if (!isNaN(t)) return t;
        }
        if (v.timestamp === 'Just now') return Date.now();
        const parsed = Date.parse(v.timestamp);
        return isNaN(parsed) ? 0 : parsed;
      };
      return resolveTime(b) - resolveTime(a);
    });
    
    return merged;
  };

  const loadStoredVideos = async () => {
    console.log('Starting to load videos from storage...');
    try {
      localStorage.removeItem('miytube_uploaded_videos');
      
      // Load first batch + local in parallel for fast initial render
      const [localVideos, { firstBatch, loadRemaining }] = await Promise.all([
        getAllVideosFromDB(),
        loadVideosFromSupabase()
      ]);
      
      console.log('Local IndexedDB videos:', localVideos.length);
      console.log('First batch cloud videos:', firstBatch.length);
      
      // Render immediately with first batch
      const initialMerged = mergeAndSort(localVideos, firstBatch);
      setUploadedVideos(initialMerged);
      setIsLoaded(true);
      console.log('Initial render with:', initialMerged.length, 'videos');
      
      // Load remaining in background
      const remaining = await loadRemaining();
      if (remaining.length > 0) {
        const allCloud = [...firstBatch, ...remaining];
        const fullMerged = mergeAndSort(localVideos, allCloud);
        setUploadedVideos(fullMerged);
        console.log('Full load complete:', fullMerged.length, 'total videos');
      }
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

  // Upload thumbnail to cloud storage and return URL
  const uploadThumbnailToCloud = async (thumbnailBlob: Blob, fileName: string): Promise<string> => {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) {
      return 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80';
    }
    const fileExt = 'jpg';
    const filePath = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('thumbnails')
      .upload(filePath, thumbnailBlob, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg',
      });

    if (error) {
      console.error('Thumbnail upload error:', error);
      // Return a default thumbnail URL on failure
      return 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80';
    }

    const { data: urlData } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(filePath);

    console.log('Thumbnail uploaded to cloud:', urlData.publicUrl);
    return urlData.publicUrl;
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
        
        video.onseeked = async () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(video.src);
            
            // Convert canvas to blob and upload to cloud storage
            canvas.toBlob(async (blob) => {
              if (blob) {
                const thumbnailUrl = await uploadThumbnailToCloud(blob, file.name);
                resolve(thumbnailUrl);
              } else {
                resolve('https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80');
              }
            }, 'image/jpeg', 0.8);
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
      const duplicateResult = await saveVideoToSupabase({
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
      
      if (duplicateResult.isDuplicate) {
        toast({
          title: "Duplicate Video Detected",
          description: duplicateResult.reason === 'location' 
            ? `A video with the title "${newVideo.title}" has already been uploaded from your location.`
            : "This video has already been uploaded.",
          variant: "destructive",
        });
        return;
      }
      
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
      const duplicateResult = await saveVideoToSupabase({
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
      
      if (duplicateResult.isDuplicate) {
        toast({
          title: "Duplicate Video Detected",
          description: duplicateResult.reason === 'location' 
            ? `A video with the title "${newVideo.title}" has already been uploaded from your location.`
            : "This video has already been uploaded.",
          variant: "destructive",
        });
        return;
      }
      
      setUploadedVideos(prev => [newVideo, ...prev]);
      return;
    }

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(0);
    
    console.log(`Uploading video: ${file.name} (${fileSizeMB}MB) - Always using cloud storage`);

    // Get duration first (fast operation)
    const duration = await getVideoDuration(file);
    
    // Upload video to cloud storage (always - never store base64)
    const fileSizeMBNum = Math.round(file.size / (1024 * 1024));
    const estimatedMinutes = Math.max(1, Math.ceil(fileSizeMBNum / 10));
    
    startUpload(file.name, fileSizeMBNum, estimatedMinutes);
    
    let cloudUrl = '';
    try {
      cloudUrl = await uploadVideoToCloud(file);
      console.log("Uploaded video to cloud storage:", cloudUrl);
      completeUpload();
    } catch (error) {
      console.error("Cloud upload error:", error);
      failUpload(error instanceof Error ? error.message : 'Unknown error');
      throw new Error(`Failed to upload video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Generate and upload thumbnail to cloud storage (after video is uploaded)
    const thumbnail = await generateThumbnail(file);
    
    const videoId = `upload-${Date.now()}`;
    const newVideo: UploadedVideo = {
      id: videoId,
      file: null,
      fileDataUrl: '', // Never store base64
      cloudUrl: cloudUrl,
      isCloudStored: true, // Always cloud stored
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
    
    // Save to IndexedDB (metadata only, no base64)
    try {
       await saveVideoToDB({
         id: videoId,
         fileDataUrl: '', // Never store base64
         cloudUrl: cloudUrl,
         isCloudStored: true,
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
      if (cloudUrl) {
        await deleteVideoFromCloud(cloudUrl).catch(() => {});
      }
      throw new Error("Failed to save video metadata.");
    }
    
    // Save to Supabase cloud backup
    const duplicateResult = await saveVideoToSupabase({
      localId: videoId,
      title: newVideo.title,
      description: newVideo.description,
      category,
      subcategory,
      tags,
      duration,
      thumbnail,
      cloudUrl: cloudUrl,
      isCloudStored: true,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
    
    if (duplicateResult.isDuplicate) {
      toast({
        title: "Duplicate Video Detected",
        description: duplicateResult.reason === 'location' 
          ? `A video with the title "${newVideo.title}" has already been uploaded from your location.`
          : "This video has already been uploaded.",
        variant: "destructive",
      });
      // Clean up the already uploaded cloud video
      if (cloudUrl) {
        await deleteVideoFromCloud(cloudUrl).catch(() => {});
      }
      return;
    }
    
    console.log("Adding new video:", videoId, newVideo.title, "category:", category, "(cloud)");
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
