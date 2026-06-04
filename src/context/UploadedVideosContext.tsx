import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { uploadVideoToCloud, deleteVideoFromCloud } from '@/utils/cloudVideoUpload';
import { useUploadProgress } from './UploadProgressContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { normalizeCategoryValue } from '@/utils/normalizeCategory';
import { canonicalizeCategoryAssignment } from '@/utils/categoryAssignment';

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
  ) => Promise<void>;
  deleteUploadedVideo: (id: string) => Promise<void>;
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

let initialVideosLoadPromise: Promise<UploadedVideo[]> | null = null;

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

const deleteLegacyVideoDB = async (): Promise<void> => {
  if (typeof indexedDB === 'undefined') return;
  return new Promise((resolve) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onerror = () => resolve();
    request.onblocked = () => resolve();
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

const createLocalVideoId = (): string => {
  const randomPart = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `upload-${Date.now()}-${randomPart}`;
};

// Get client IP address for duplicate detection.
// Hard-capped with a timeout so a slow/failing edge function can never stall
// the upload pipeline (the IP is only used for opportunistic dedup).
const getClientIp = async (): Promise<string> => {
  const timeout = new Promise<string>((resolve) =>
    setTimeout(() => resolve('unknown'), 3000)
  );
  const lookup = (async (): Promise<string> => {
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
  })();
  return Promise.race([lookup, timeout]);
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

  // Normalize category/subcategory into the same parent + child values used by category pages.
  const { category: normalizedCategory, subcategory: normalizedSubcategory } = canonicalizeCategoryAssignment(
    video.category,
    video.subcategory,
    [video.title, video.description, video.fileName, ...video.tags]
  );
  // Check if a video with this local_id already exists to prevent duplicates from same session
  const { data: existingById } = await supabase
    .from('uploaded_videos')
    .select('id')
    .eq('local_id', video.localId)
    .maybeSingle();
  
  if (existingById) {
    console.log('Video already exists in Supabase with local_id:', video.localId);
    await supabase.from('blocked_uploads').insert({
      user_id: userId,
      file_name: video.fileName || video.title,
      file_size: video.fileSize ?? null,
      title: video.title,
      category: normalizedCategory,
      subcategory: normalizedSubcategory,
      reason: 'duplicate_session',
      details: 'Same local_id already exists',
    });
    return { isDuplicate: true, reason: 'session' };
  }
  
  // Check if the EXACT same file (file_name + file_size) was uploaded from the
  // same IP into the same destination. Using file_name + file_size as the
  // fingerprint instead of title prevents false positives for doubleheader /
  // tripleheader games where multiple distinct videos share the same matchup
  // title but are actually different game files.
  if (uploaderIp !== 'unknown' && video.fileSize && video.fileName) {
    let duplicateQuery = supabase
      .from('uploaded_videos')
      .select('id, title, file_name, file_size, category, subcategory')
      .eq('uploader_ip', uploaderIp)
      .eq('file_name', video.fileName)
      .eq('file_size', video.fileSize);

    duplicateQuery = normalizedCategory
      ? duplicateQuery.eq('category', normalizedCategory)
      : duplicateQuery.is('category', null);
    duplicateQuery = normalizedSubcategory
      ? duplicateQuery.eq('subcategory', normalizedSubcategory)
      : duplicateQuery.is('subcategory', null);

    const { data: existingByIpTitle } = await duplicateQuery.maybeSingle();

    if (existingByIpTitle) {
      console.log('Duplicate detected: Same file_name + size from same IP. File:', video.fileName, 'IP:', uploaderIp);
      await supabase.from('blocked_uploads').insert({
        user_id: userId,
        file_name: video.fileName,
        file_size: video.fileSize ?? null,
        title: video.title,
        category: normalizedCategory,
        subcategory: normalizedSubcategory,
        reason: 'duplicate_file',
        details: `Same file_name + size already uploaded from this IP into ${normalizedCategory || 'no-category'}/${normalizedSubcategory || 'no-subcategory'}`,
      });
      return { isDuplicate: true, reason: 'location' };
    }
  }
  
  // Don't pass 'id' - let the database generate UUID automatically
  // Store local_id to maintain URL compatibility
  const { data: insertedVideo, error } = await supabase.from('uploaded_videos').insert({
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
  }).select('id, local_id').single();
  
  if (error) {
    console.error('Error saving video to Supabase:', error);
    throw new Error(`Upload saved to storage, but failed to publish to the video feed: ${error.message}`);
  }

  if (!insertedVideo?.id) {
    throw new Error('Upload saved to storage, but the video feed did not confirm the publish. Please try again.');
  }

  console.log('Saved video to Supabase cloud backup with local_id:', insertedVideo.local_id, 'from IP:', uploaderIp);
  return { isDuplicate: false };
};

  const mapSupabaseRow = (v: any): UploadedVideo => {
  const normalized = canonicalizeCategoryAssignment(v.category, v.subcategory, [v.title, v.description, ...(v.tags || [])]);
  return {
    id: v.local_id || v.id,
    file: null,
    fileDataUrl: '',
    cloudUrl: v.cloud_url || undefined,
    isCloudStored: v.is_cloud_stored || false,
    isYouTubeEmbed: v.is_youtube_embed || false,
    youtubeId: v.youtube_video_id || undefined,
    title: v.title,
    description: v.description || '',
    thumbnail: v.thumbnail_url || '/placeholder.svg',
    timestamp: new Date(v.created_at).toLocaleDateString(),
    createdAt: v.created_at,
    views: String(v.views || 0),
    duration: v.duration || '0:00',
    category: normalized.category || v.category || undefined,
    subcategory: normalized.subcategory || v.subcategory || undefined,
    tags: v.tags || [],
  };
};

const deduplicateRows = (rows: any[]): any[] => {
  const seen = new Set<string>();
  return rows.filter(v => {
    const key = v.local_id || v.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// Load only the first page for the global app shell. Pulling the full video
// library into React state on every refresh can freeze the UI on large sites.
const loadVideosFromSupabase = async (): Promise<{
  firstBatch: UploadedVideo[];
  firstRowKeys: Set<string>;
  loadRemaining: (onChunk: (chunk: UploadedVideo[]) => void) => Promise<number>;
}> => {
  const PAGE_SIZE = 60;
  const CHUNK_SIZE = 1000; // Supabase max per query

  const SELECT_COLS = 'id, local_id, title, description, thumbnail_url, cloud_url, is_cloud_stored, is_youtube_embed, youtube_video_id, duration, category, subcategory, tags, views, created_at';

  const { data, error } = await supabase
    .from('uploaded_videos')
    .select(SELECT_COLS)
    .order('created_at', { ascending: false })
    .range(0, PAGE_SIZE - 1);

  if (error) {
    console.error('Error loading videos from Supabase:', error);
    return {
      firstBatch: [],
      firstRowKeys: new Set(),
      loadRemaining: async () => 0,
    };
  }

  const firstRows = deduplicateRows(data || []);
  const firstBatch = firstRows.map(mapSupabaseRow);
  const seenKeys = new Set<string>(firstRows.map((v: any) => v.local_id || v.id));

  console.log('First batch loaded:', firstBatch.length, 'videos');

  const loadRemaining = async (onChunk: (chunk: UploadedVideo[]) => void): Promise<number> => {
    let from = PAGE_SIZE;
    let total = 0;
    while (true) {
      const to = from + CHUNK_SIZE - 1;
      const { data: chunk, error: chunkErr } = await supabase
        .from('uploaded_videos')
        .select(SELECT_COLS)
        .order('created_at', { ascending: false })
        .range(from, to);
      if (chunkErr) {
        console.error('Error loading remaining videos:', chunkErr);
        break;
      }
      if (!chunk || chunk.length === 0) break;
      const fresh = chunk.filter((v: any) => {
        const k = v.local_id || v.id;
        if (seenKeys.has(k)) return false;
        seenKeys.add(k);
        return true;
      });
      if (fresh.length > 0) {
        const mapped = fresh.map(mapSupabaseRow);
        onChunk(mapped);
        total += mapped.length;
      }
      if (chunk.length < CHUNK_SIZE) break;
      from += CHUNK_SIZE;
    }
    console.log('Loaded remaining videos:', total);
    return total;
  };

  return { firstBatch, firstRowKeys: seenKeys, loadRemaining };
};

const updateVideoInSupabase = async (id: string, updates: Record<string, unknown>): Promise<number> => {
  // Make sure the supabase client is sending the CURRENT user JWT, not the
  // stale anon token. If the session expired silently the row update would be
  // blocked by RLS and look like the title "won't stay".
  const { data: sessionData } = await supabase.auth.getSession();
  let session = sessionData.session;
  if (!session) {
    const { data: refreshed } = await supabase.auth.refreshSession();
    session = refreshed.session;
  }
  if (!session?.user) {
    throw new Error('You are signed out. Please sign in again to save changes.');
  }

  const supabaseUpdates: Record<string, unknown> = {};
  const hasCategory = Object.prototype.hasOwnProperty.call(updates, 'category');
  const hasSubcategory = Object.prototype.hasOwnProperty.call(updates, 'subcategory');
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (updates.title !== undefined) supabaseUpdates.title = updates.title;
  if (updates.description !== undefined) supabaseUpdates.description = updates.description;
  if (hasCategory || hasSubcategory) {
    const currentQuery = supabase
      .from('uploaded_videos')
      .select('category, subcategory')
    const current = isUUID
      ? await currentQuery.eq('id', id).maybeSingle()
      : await currentQuery.eq('local_id', id).maybeSingle();
    const { category, subcategory } = canonicalizeCategoryAssignment(
      hasCategory ? updates.category as string : current.data?.category,
      hasSubcategory ? updates.subcategory as string : current.data?.subcategory
    );
    if (hasCategory) supabaseUpdates.category = category ?? null;
    if (hasSubcategory || (hasCategory && subcategory)) supabaseUpdates.subcategory = subcategory ?? null;
  }
  if (updates.tags !== undefined) supabaseUpdates.tags = updates.tags;
  if (updates.thumbnail !== undefined) supabaseUpdates.thumbnail_url = updates.thumbnail;

  if (Object.keys(supabaseUpdates).length === 0) return 0;

  const query = supabase.from('uploaded_videos').update(supabaseUpdates);
  const { error, data } = isUUID
    ? await query.eq('id', id).select('id, title, user_id')
    : await query.eq('local_id', id).select('id, title, user_id');

  if (error) {
    console.error('Error updating video in Supabase:', error, 'updates:', supabaseUpdates, 'id:', id);
    throw new Error(error.message || 'Failed to update video');
  }
  const rows = data?.length || 0;
  console.log('Updated video in Supabase:', id, 'rows:', rows, 'data:', data);
  if (rows === 0) {
    // The row exists (we render it on screen) but UPDATE returned no rows.
    // That means RLS blocked the write. Look up the owner so we can give a
    // useful error and also confirm whether the current user is the admin or
    // owner that the policy expects.
    const ownerQuery = supabase.from('uploaded_videos').select('user_id');
    const owner = isUUID
      ? await ownerQuery.eq('id', id).maybeSingle()
      : await ownerQuery.eq('local_id', id).maybeSingle();
    const ownerId = (owner.data as { user_id?: string } | null)?.user_id;
    const currentUid = session.user.id;
    const isOwner = !!ownerId && ownerId === currentUid;

    // Re-check admin role server-side via has_role so we don't rely on stale
    // client state.
    let isAdmin = false;
    const { data: adminRow } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', currentUid)
      .eq('role', 'admin')
      .maybeSingle();
    isAdmin = !!adminRow;

    console.warn('Update returned 0 rows (RLS blocked).', {
      id, ownerId, currentUid, isOwner, isAdmin,
    });

    if (isOwner || isAdmin) {
      throw new Error(
        'Save was rejected by the database even though you appear to have permission. Try signing out and back in, then save again.'
      );
    }
    throw new Error(
      "You don't have permission to edit this video. Sign in as the owner or an admin."
    );
  }
  return rows;
};


const normalizeVideoUpdates = (
  updates: Partial<Omit<UploadedVideo, 'id' | 'file'>>
): Partial<Omit<UploadedVideo, 'id' | 'file'>> => {
  const hasCategory = Object.prototype.hasOwnProperty.call(updates, 'category');
  const hasSubcategory = Object.prototype.hasOwnProperty.call(updates, 'subcategory');
  const normalized = canonicalizeCategoryAssignment(updates.category, updates.subcategory);
  return {
    ...updates,
    ...(hasCategory ? { category: normalized.category } : {}),
    ...(hasSubcategory || (hasCategory && normalized.subcategory) ? { subcategory: normalized.subcategory } : {}),
  };
};

const deleteVideoFromSupabase = async (id: string): Promise<{ deletedCount: number; error: string | null }> => {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const query = supabase.from('uploaded_videos').delete().select('id');
  const { data, error } = isUUID ? await query.eq('id', id) : await query.eq('local_id', id);

  if (error) {
    console.error('Error deleting video from Supabase:', error);
    return { deletedCount: 0, error: error.message };
  }
  const count = data?.length ?? 0;
  console.log(`Deleted ${count} video row(s) from Supabase for id:`, id);
  return { deletedCount: count, error: null };
};

export const UploadedVideosProvider: React.FC<UploadedVideosProviderProps> = ({ children }) => {
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasLoadedRef = useRef(false);
  const { startUpload, setUploadStatus, completeUpload, failUpload } = useUploadProgress();

  const mergeAndSort = (localVideos: StoredVideo[], cloudVideos: UploadedVideo[]): UploadedVideo[] => {
    const cloudVideoMap = new Map(cloudVideos.map(v => [v.id, v]));
    
    const localVideoList: UploadedVideo[] = localVideos.flatMap(sv => {
      const cloudVideo = cloudVideoMap.get(sv.id);
      if (sv.isCloudStored && !sv.isYouTubeEmbed && !cloudVideo) {
        deleteVideoFromDB(sv.id).catch(err => console.error('Error clearing orphaned local video:', err));
        return [];
      }
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
    const seenIds = new Set(localVideoList.map(v => v.id));
    for (const cv of cloudVideos) {
      if (!seenIds.has(cv.id)) {
        merged.push(cv);
        seenIds.add(cv.id);
      }
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

  const loadStoredVideos = async (forceRefresh = false) => {
    console.log('Starting to load videos from storage...');
    try {
      localStorage.removeItem('miytube_uploaded_videos');
      deleteLegacyVideoDB().catch(err => console.warn('Legacy video cache cleanup skipped:', err));

      if (forceRefresh) {
        initialVideosLoadPromise = null;
      }

      // Render immediately with first batch, then stream the rest in
      if (!initialVideosLoadPromise) {
        initialVideosLoadPromise = loadVideosFromSupabase().then(({ firstBatch, loadRemaining }) => {
          console.log('First batch cloud videos:', firstBatch.length);
          // Kick off background load of remaining videos
          loadRemaining((chunk) => {
            setUploadedVideos((prev) => {
              const prevById = new Map(prev.map(v => [v.id, v]));
              for (const cv of chunk) prevById.set(cv.id, cv);
              return mergeAndSort([], Array.from(prevById.values()) as UploadedVideo[]);
            });
          }).catch(err => console.error('Background video load failed:', err));
          return mergeAndSort([], firstBatch);
        });
      }

      const initialMerged = await initialVideosLoadPromise;
      setUploadedVideos(initialMerged);
      setIsLoaded(true);
      console.log('Initial render with:', initialMerged.length, 'videos');

      console.log('Initial page load complete');
    } catch (error) {
      console.error('Error loading videos:', error);
    }
    setIsLoaded(true);
  };

  // Load videos from both IndexedDB (local) and Supabase (cloud)
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    loadStoredVideos();
  }, []);

  const refreshVideos = async () => {
    setIsLoaded(false);
    await loadStoredVideos(true);
  };

  // Upload thumbnail to cloud storage and return URL.
  // Returns '' on failure so the row stays without a real thumbnail and the
  // admin "Missing only" regenerator can pick it up later.
  const uploadThumbnailToCloud = async (thumbnailBlob: Blob, fileName: string): Promise<string> => {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) return '';
    const fileExt = 'jpg';
    const filePath = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage
      .from('thumbnails')
      .upload(filePath, thumbnailBlob, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg',
      });

    if (error) {
      console.error('Thumbnail upload error:', error);
      return '';
    }

    const { data: urlData } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(filePath);

    console.log('Thumbnail uploaded to cloud:', urlData.publicUrl);
    return urlData.publicUrl;
  };

  const generateThumbnail = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      // Empty string = no thumbnail yet. The admin "Missing only" regenerator
      // will fill it in from the uploaded video later.
      const fallbackThumbnail = '';
      let hasResolved = false;
      const finish = (thumbnailUrl: string) => {
        if (hasResolved) return;
        hasResolved = true;
        resolve(thumbnailUrl);
      };
      if (file.type.startsWith('video/')) {
        let timeoutId: number | undefined;
        void (async () => {
        try {
          const { captureVideoThumbnail } = await import('@/utils/thumbnailCapture');
          timeoutId = window.setTimeout(() => {
            console.warn('Thumbnail generation timed out after extended wait, publishing without thumbnail:', file.name);
            finish(fallbackThumbnail);
          }, 50000);
          const blob = await captureVideoThumbnail(file);
          window.clearTimeout(timeoutId);
          if (blob) {
            try {
              const thumbnailUrl = await uploadThumbnailToCloud(blob, file.name);
              finish(thumbnailUrl);
            } catch {
              finish(fallbackThumbnail);
            }
          } else {
            finish(fallbackThumbnail);
          }
        } catch (err) {
          console.warn('Thumbnail capture failed:', err);
          if (timeoutId) window.clearTimeout(timeoutId);
          finish(fallbackThumbnail);
        }
        })();
      } else {
        finish(fallbackThumbnail);
      }
    });
  };

  const getVideoDuration = (file: File): Promise<{ formatted: string; seconds: number }> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('video/')) {
        resolve({ formatted: '0:00', seconds: 0 });
        return;
      }

      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(file);

      const finish = (seconds: number) => {
        try { URL.revokeObjectURL(url); } catch { /* ignore revoke cleanup errors */ }
        const safe = isFinite(seconds) && seconds > 0 ? seconds : 0;
        const minutes = Math.floor(safe / 60);
        const secs = Math.floor(safe % 60);
        resolve({
          formatted: safe > 0 ? `${minutes}:${secs < 10 ? '0' : ''}${secs}` : '0:00',
          seconds: safe,
        });
      };

      const tryReadDuration = () => {
        // Some MP4s report Infinity until you seek to the end. This forces the browser
        // to scan the file and report the real duration.
        if (video.duration === Infinity || isNaN(video.duration)) {
          video.currentTime = 1e10;
          video.ontimeupdate = () => {
            video.ontimeupdate = null;
            video.currentTime = 0;
            finish(video.duration);
          };
        } else {
          finish(video.duration);
        }
      };

      video.onloadedmetadata = tryReadDuration;
      video.onerror = () => finish(0);
      // Safety timeout
      setTimeout(() => finish(video.duration || 0), 8000);
      video.src = url;
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
      
      const videoId = createLocalVideoId();
      // Use hqdefault.jpg — it's guaranteed to exist for every YouTube video.
      // maxresdefault.jpg is missing for many videos and YouTube returns a generic
      // red play-button placeholder image instead, which looks broken in the grid.
      const youtubeThumbnail = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
      const normalizedAssignment = canonicalizeCategoryAssignment(category, subcategory, [title, description, ...tags]);
      
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
        category: normalizedAssignment.category,
        subcategory: normalizedAssignment.subcategory,
        tags,
      };
      
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
        const duplicateMessage = duplicateResult.reason === 'location' 
          ? `A video with the title "${newVideo.title}" has already been uploaded from your location.`
          : "This video has already been uploaded.";
        toast({
          title: "Duplicate Video Detected",
          description: duplicateMessage,
          variant: "destructive",
        });
        throw new Error(duplicateMessage);
      }
      
      setUploadedVideos(prev => [newVideo, ...prev]);
      return;
    }
    
    // If URL is provided (non-YouTube), skip file upload and use URL directly
    if (importUrl) {
      console.log(`Importing video from URL: ${importUrl}`);
      
      const videoId = createLocalVideoId();
      const normalizedAssignment = canonicalizeCategoryAssignment(category, subcategory, [title, description, ...tags]);
      const newVideo: UploadedVideo = {
        id: videoId,
        file: null,
        fileDataUrl: '',
        cloudUrl: importUrl,
        isCloudStored: true,
        title: title || 'Imported Video',
        description: description || '',
        thumbnail: '',
        timestamp: 'Just now',
        views: '0',
        duration: '0:00',
        category: normalizedAssignment.category,
        subcategory: normalizedAssignment.subcategory,
        tags,
      };
      
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
        const duplicateMessage = duplicateResult.reason === 'location' 
          ? `A video with the title "${newVideo.title}" has already been uploaded from your location.`
          : "This video has already been uploaded.";
        toast({
          title: "Duplicate Video Detected",
          description: duplicateMessage,
          variant: "destructive",
        });
        throw new Error(duplicateMessage);
      }
      
      setUploadedVideos(prev => [newVideo, ...prev]);
      return;
    }

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(0);
    
    console.log(`Uploading video: ${file.name} (${fileSizeMB}MB) - Always using cloud storage`);

    // Get duration first (fast operation)
    const { formatted: duration, seconds: durationSeconds } = await getVideoDuration(file);

    // Enforce Shorts rule: ≤60 seconds. If it's longer, reclassify to 'video'
    // and preserve any subcategory the user picked. This prevents long videos
    // from showing up under /shorts.
    let effectiveCategory = category;
    if (effectiveCategory === 'shorts' && durationSeconds > 0 && durationSeconds > 60) {
      console.warn(`Reclassifying long upload (${durationSeconds.toFixed(1)}s) from 'shorts' to 'video': ${title || file.name}`);
      effectiveCategory = 'video';
      toast({
        title: 'Moved out of Shorts',
        description: `"${title || file.name}" is ${Math.round(durationSeconds)}s long. Shorts must be 60s or less, so it was published as a regular video instead.`,
      });
    }

    // Upload video to cloud storage (always - never store base64)
    const fileSizeMBNum = Math.round(file.size / (1024 * 1024));
    const estimatedMinutes = Math.max(1, Math.ceil(fileSizeMBNum / 10));
    
    startUpload(file.name, fileSizeMBNum, estimatedMinutes);
    
    let cloudUrl = '';
    try {
      cloudUrl = await uploadVideoToCloud(file);
      console.log("Uploaded video to cloud storage:", cloudUrl);
      setUploadStatus('publishing');
    } catch (error) {
      console.error("Cloud upload error:", error);
      failUpload(error instanceof Error ? error.message : 'Unknown error');
      throw new Error(`Failed to upload video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    try {
      // Generate and upload thumbnail to cloud storage (after video is uploaded)
      const thumbnail = await generateThumbnail(file);
      
      const videoId = createLocalVideoId();
      const normalizedAssignment = canonicalizeCategoryAssignment(effectiveCategory, subcategory, [title, description, file.name, ...tags]);
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
      category: normalizedAssignment.category,
      subcategory: normalizedAssignment.subcategory,
      tags,
    };
    
      // Save to Supabase cloud backup
      const duplicateResult = await saveVideoToSupabase({
      localId: videoId,
      title: newVideo.title,
      description: newVideo.description,
      category: effectiveCategory,
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
        const duplicateMessage = duplicateResult.reason === 'location' 
          ? `A video with the title "${newVideo.title}" has already been uploaded from your location.`
          : "This video has already been uploaded.";
        toast({
          title: "Duplicate Video Detected",
          description: duplicateMessage,
          variant: "destructive",
        });
        // Clean up the already uploaded cloud video
        if (cloudUrl) {
          await deleteVideoFromCloud(cloudUrl).catch(() => {});
        }
        throw new Error(duplicateMessage);
      }

      console.log("Adding new video:", videoId, newVideo.title, "category:", category, "(cloud)");
      setUploadedVideos(prev => [newVideo, ...prev]);
      completeUpload();
    } catch (error) {
      console.error("Video publish error:", error);
      failUpload(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  };

  const updateUploadedVideo = async (
    id: string,
    updates: Partial<Omit<UploadedVideo, 'id' | 'file'>>
  ) => {
    const normalizedUpdates = normalizeVideoUpdates(updates);
    const prevList = uploadedVideos;
    setUploadedVideos(prev =>
      prev.map(video =>
        video.id === id ? { ...video, ...normalizedUpdates } : video
      )
    );
    try {
      await updateVideoInSupabase(id, normalizedUpdates as Record<string, unknown>);
      console.log("Updated video:", id, normalizedUpdates);
    } catch (err) {
      // Revert optimistic local change so the UI matches what's actually saved
      setUploadedVideos(prevList);
      throw err;
    }
  };

  const deleteUploadedVideo = async (id: string) => {
    const videoToDelete = uploadedVideos.find(v => v.id === id);
    const prevList = uploadedVideos;

    // Optimistic UI removal
    setUploadedVideos(prev => prev.filter(video => video.id !== id));

    try {
      // Delete from Supabase first — this is the source of truth
      const { deletedCount, error } = await deleteVideoFromSupabase(id);

      if (error) {
        // Real server/RLS error — revert UI
        console.warn('Video was not deleted on the server. Reverting UI.', { id, error });
        setUploadedVideos(prevList);
        throw new Error(
          /permission|policy|rls/i.test(error)
            ? 'You can only delete videos you uploaded while signed in. Please sign in as the original uploader (or an admin) and try again.'
            : `Server error: ${error}`
        );
      }

      if (deletedCount === 0) {
        // Row doesn't exist on the server (local-only or already deleted).
        // Treat as success and continue cleaning up local + cloud state.
        console.log('No server row found to delete; cleaning up local copy only.', { id });
      }

      // Delete local IndexedDB copy so it doesn't come back on reload
      await deleteVideoFromDB(id).catch(err => console.warn('Local DB delete failed:', err));

      // Delete from cloud storage if applicable
      if (videoToDelete?.isCloudStored && videoToDelete?.cloudUrl) {
        await deleteVideoFromCloud(videoToDelete.cloudUrl).catch(err =>
          console.warn('Cloud storage delete failed (row already removed):', err)
        );
        console.log("Deleted video from cloud storage:", id);
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      throw error;
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
  
  // Tight typo tolerance (Levenshtein) — does NOT match substrings.
  const isCloseTypo = (a: string, b: string): boolean => {
    if (a === b) return true;
    if (!a || !b) return false;
    if (Math.abs(a.length - b.length) > 2) return false;
    const longer = Math.max(a.length, b.length);
    if (longer < 6) return false;
    // Budget of 1 — keeps real typo correction (e.g. "gorros" → "garros") but
    // prevents collisions like "roland-garros-women" matching "roland-garros-men"
    // (which is only 2 deletions apart).
    const budget = 1;
    const m = a.length, n = b.length;
    const dp: number[] = new Array(n + 1);
    for (let j = 0; j <= n; j++) dp[j] = j;
    for (let i = 1; i <= m; i++) {
      let prev = dp[0];
      dp[0] = i;
      for (let j = 1; j <= n; j++) {
        const tmp = dp[j];
        dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
        prev = tmp;
      }
    }
    return dp[n] <= budget;
  };

  // Categories that collide with other real categories under typo tolerance
  // (e.g. "shorts" vs "sports" differ by 1 letter). These require exact match.
  const EXACT_MATCH_CATEGORIES = new Set(['shorts', 'sports']);

  const getVideosByCategory = (category: string, subcategory?: string): UploadedVideo[] => {
    const normalizedRequest = canonicalizeCategoryAssignment(category, subcategory);
    const categoryLower = normalizedRequest.category || normalizeCategoryValue(category) || category.toLowerCase().trim();
    const subcategoryLower = normalizedRequest.subcategory || (subcategory ? normalizeCategoryValue(subcategory) || subcategory.toLowerCase().trim() : undefined);
    const requireExactCategory = EXACT_MATCH_CATEGORIES.has(categoryLower);

    return uploadedVideos.filter(video => {
      const normalizedVideo = canonicalizeCategoryAssignment(video.category, video.subcategory);
      const vidCategory = normalizedVideo.category || normalizeCategoryValue(video.category) || video.category?.toLowerCase().trim() || '';
      const vidSubcategory = normalizedVideo.subcategory || normalizeCategoryValue(video.subcategory) || video.subcategory?.toLowerCase().trim() || '';

      const categoryMatches = requireExactCategory
        ? vidCategory === categoryLower
        : (vidCategory === categoryLower || isCloseTypo(vidCategory, categoryLower));

      if (subcategoryLower) {
        const subcategoryMatches = vidSubcategory === subcategoryLower || isCloseTypo(vidSubcategory, subcategoryLower);
        return categoryMatches && subcategoryMatches;
      }

      // Exact match only — no substring matching, no tag fallback.
      return categoryMatches;
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
