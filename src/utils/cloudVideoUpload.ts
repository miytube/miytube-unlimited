import { supabase } from "@/integrations/supabase/client";

const MAX_BROWSER_STORAGE_SIZE = 500 * 1024 * 1024; // 500MB

export const shouldUseCloudStorage = (file: File): boolean => {
  return file.size > MAX_BROWSER_STORAGE_SIZE;
};

const sanitizeFileName = (name: string): string =>
  name.trim().replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 180) || "upload";

/**
 * Default uploader — uploads to Supabase Storage `videos` bucket.
 * S3 is reserved for explicit admin migration to keep AWS costs down.
 */
export const uploadVideoToCloud = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;
  if (!userId) {
    throw new Error("You must be signed in to upload videos.");
  }

  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(0);
  const safeName = sanitizeFileName(file.name);
  const filePath = `${userId}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}-${safeName}`;

  console.log(`Starting Supabase upload: ${file.name} (${fileSizeMB}MB) -> ${filePath}`);

  // Supabase JS doesn't expose progress; emit start/end ticks.
  if (onProgress) onProgress(1);

  const { error } = await supabase.storage
    .from("videos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "video/mp4",
    });

  if (error) {
    console.error("Supabase upload failed:", error);
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  if (onProgress) onProgress(100);

  const { data: urlData } = supabase.storage.from("videos").getPublicUrl(filePath);
  console.log("Supabase upload successful:", urlData.publicUrl);
  return urlData.publicUrl;
};

/**
 * Thumbnails — also stored in Supabase by default (small files, cheap).
 */
export const uploadThumbnailToS3 = async (blob: Blob, fileName = "thumb.jpg"): Promise<string> => {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;
  if (!userId) throw new Error("You must be signed in to upload thumbnails.");

  const safeName = sanitizeFileName(fileName);
  const filePath = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${safeName}`;

  const { error } = await supabase.storage
    .from("thumbnails")
    .upload(filePath, blob, {
      cacheControl: "3600",
      upsert: false,
      contentType: blob.type || "image/jpeg",
    });

  if (error) throw new Error(`Supabase thumbnail upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage.from("thumbnails").getPublicUrl(filePath);
  return urlData.publicUrl;
};

export const deleteVideoFromCloud = async (videoUrl: string): Promise<void> => {
  // Supabase Storage deletion
  const urlParts = videoUrl.split("/videos/");
  if (urlParts.length < 2) return;
  const filePath = urlParts[1];
  const { error } = await supabase.storage.from("videos").remove([filePath]);
  if (error) {
    console.warn("Supabase delete failed (may be S3-hosted):", error.message);
  }
};
