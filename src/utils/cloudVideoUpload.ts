import { supabase } from "@/integrations/supabase/client";

const MAX_BROWSER_STORAGE_SIZE = 500 * 1024 * 1024; // 500MB

export const shouldUseCloudStorage = (file: File): boolean => {
  return file.size > MAX_BROWSER_STORAGE_SIZE;
};

export const uploadVideoToCloud = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;
  
  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(0);
  console.log(`Starting cloud upload: ${file.name} (${fileSizeMB}MB) to path: ${filePath}`);

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
      });
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
