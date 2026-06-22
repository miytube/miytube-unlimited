import { supabase } from "@/integrations/supabase/client";

const MAX_BROWSER_STORAGE_SIZE = 500 * 1024 * 1024; // 500MB

export const shouldUseCloudStorage = (file: File): boolean => {
  return file.size > MAX_BROWSER_STORAGE_SIZE;
};

const sanitizeFileName = (name: string): string =>
  name.trim().replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 180) || "upload";

/**
 * Request a signed S3 upload URL from the edge function.
 */
const getS3UploadUrl = async (
  fileName: string,
  contentType: string,
  kind: "video" | "thumbnail"
): Promise<{ upload_url: string; public_url: string; method: string }> => {
  const { data, error } = await supabase.functions.invoke("s3-upload-url", {
    body: { fileName, contentType, kind },
  });
  if (error) throw new Error(error.message);
  if (!data?.upload_url) throw new Error("No upload URL returned");
  return data;
};

/**
 * PUT a blob to a signed S3 URL with progress reporting via XHR.
 */
const putToS3 = (
  uploadUrl: string,
  blob: Blob | File,
  contentType: string,
  onProgress?: (progress: number) => void
): Promise<void> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`S3 PUT failed [${xhr.status}]: ${xhr.responseText}`));
    };
    xhr.onerror = () => reject(new Error("S3 upload network error"));
    xhr.send(blob);
  });

/**
 * Supabase Storage fallback uploader (used if S3 fails or user isn't signed in).
 */
const uploadVideoToSupabase = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;
  if (!userId) throw new Error("You must be signed in to upload videos.");

  const safeName = sanitizeFileName(file.name);
  const filePath = `${userId}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}-${safeName}`;

  if (onProgress) onProgress(1);
  const { error } = await supabase.storage
    .from("videos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "video/mp4",
    });
  if (error) throw new Error(`Supabase upload failed: ${error.message}`);
  if (onProgress) onProgress(100);

  const { data: urlData } = supabase.storage.from("videos").getPublicUrl(filePath);
  return urlData.publicUrl;
};

/**
 * DEFAULT video uploader — uploads directly to AWS S3 to keep Lovable Cloud
 * storage/bandwidth usage near zero. Falls back to Supabase Storage if the
 * S3 signed-URL request or upload fails for any reason.
 */
export const uploadVideoToCloud = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user?.id) {
    throw new Error("You must be signed in to upload videos.");
  }

  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(0);
  const contentType = file.type || "video/mp4";

  try {
    console.log(`Starting S3 upload: ${file.name} (${fileSizeMB}MB)`);
    if (onProgress) onProgress(1);
    const { upload_url, public_url } = await getS3UploadUrl(file.name, contentType, "video");
    await putToS3(upload_url, file, contentType, onProgress);
    console.log("S3 upload successful:", public_url);
    return public_url;
  } catch (s3Err) {
    console.warn("S3 upload failed, falling back to Supabase:", s3Err);
    return uploadVideoToSupabase(file, onProgress);
  }
};

/**
 * DEFAULT thumbnail uploader — also S3-first, Supabase fallback.
 */
export const uploadThumbnailToS3 = async (
  blob: Blob,
  fileName = "thumb.jpg"
): Promise<string> => {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;
  if (!userId) throw new Error("You must be signed in to upload thumbnails.");

  const contentType = blob.type || "image/jpeg";

  try {
    const { upload_url, public_url } = await getS3UploadUrl(fileName, contentType, "thumbnail");
    await putToS3(upload_url, blob, contentType);
    return public_url;
  } catch (s3Err) {
    console.warn("S3 thumbnail upload failed, falling back to Supabase:", s3Err);
    const safeName = sanitizeFileName(fileName);
    const filePath = `${userId}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 9)}-${safeName}`;
    const { error } = await supabase.storage
      .from("thumbnails")
      .upload(filePath, blob, {
        cacheControl: "3600",
        upsert: false,
        contentType,
      });
    if (error) throw new Error(`Supabase thumbnail upload failed: ${error.message}`);
    const { data: urlData } = supabase.storage.from("thumbnails").getPublicUrl(filePath);
    return urlData.publicUrl;
  }
};

export const deleteVideoFromCloud = async (videoUrl: string): Promise<void> => {
  // Only Supabase Storage URLs can be deleted from the client; S3 deletion
  // happens server-side via admin tooling.
  if (!videoUrl.includes("supabase.co/storage")) return;
  const urlParts = videoUrl.split("/videos/");
  if (urlParts.length < 2) return;
  const filePath = urlParts[1];
  const { error } = await supabase.storage.from("videos").remove([filePath]);
  if (error) console.warn("Supabase delete failed:", error.message);
};
