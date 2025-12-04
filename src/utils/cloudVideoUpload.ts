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

  const { data, error } = await supabase.storage
    .from('videos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Cloud upload error:', error);
    throw new Error(`Failed to upload video: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('videos')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
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
