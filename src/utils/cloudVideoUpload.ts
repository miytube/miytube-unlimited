import { supabase } from "@/integrations/supabase/client";

const MAX_BROWSER_STORAGE_SIZE = 500 * 1024 * 1024; // 500MB

export const shouldUseCloudStorage = (file: File): boolean => {
  return file.size > MAX_BROWSER_STORAGE_SIZE;
};

export const uploadVideoToCloud = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  // Require authenticated user; storage policies enforce folder-based ownership
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;
  if (!userId) {
    throw new Error('You must be signed in to upload videos.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;
  
  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(0);
  const fileSizeGB = (file.size / (1024 * 1024 * 1024)).toFixed(2);
  const estimatedMinutes = Math.ceil(file.size / (1024 * 1024) / 10);
  
  console.log(`Starting cloud upload: ${file.name} (${fileSizeMB}MB / ${fileSizeGB}GB) to path: ${filePath}`);
  console.log(`Estimated upload time: ${estimatedMinutes} minutes (depends on your connection speed)`);

  try {
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Cloud upload error details:', {
        message: error.message,
        name: error.name,
        statusCode: (error as any).statusCode,
        cause: (error as any).cause,
      });
      
      // Provide more specific error messages
      if (error.message.includes('Payload too large')) {
        throw new Error('File too large for upload. Maximum size is 10GB.');
      } else if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        throw new Error('Upload timed out. Please try again with a stable internet connection.');
      } else if (error.message.includes('network') || error.message.includes('Network')) {
        throw new Error('Network error during upload. Please check your connection and try again.');
      }
      
      throw new Error(`Failed to upload video: ${error.message}`);
    }

    console.log('Cloud upload successful, getting public URL...');

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);

    console.log('Video uploaded successfully:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (err) {
    console.error('Cloud upload exception:', err);
    
    // Check for specific browser/network errors
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Network connection lost during upload. Please try again.');
    }
    
    throw err instanceof Error ? err : new Error('Unknown upload error occurred');
  }
};

export const deleteVideoFromCloud = async (videoUrl: string): Promise<void> => {
  // Extract file path from URL
  const urlParts = videoUrl.split('/videos/');
  if (urlParts.length < 2) return;
  
  const filePath = urlParts[1];
  
  const { error } = await supabase.storage
    .from('videos')
    .remove([filePath]);

  if (error) {
    console.error('Failed to delete video from cloud:', error);
  }
};
