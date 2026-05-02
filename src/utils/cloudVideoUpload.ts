import { supabase } from "@/integrations/supabase/client";

const MAX_BROWSER_STORAGE_SIZE = 500 * 1024 * 1024; // 500MB

export const shouldUseCloudStorage = (file: File): boolean => {
  return file.size > MAX_BROWSER_STORAGE_SIZE;
};

async function getSignedS3Url(
  fileName: string,
  contentType: string,
  kind: "video" | "thumbnail"
): Promise<{ upload_url: string; method: string; public_url: string; object_key: string }> {
  const { data, error } = await supabase.functions.invoke("s3-upload-url", {
    body: { fileName, contentType, kind },
  });
  if (error) throw new Error(`Failed to get S3 upload URL: ${error.message}`);
  if (!data?.upload_url) throw new Error("No upload URL returned from server");
  return data;
}

export const uploadVideoToCloud = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user?.id) {
    throw new Error("You must be signed in to upload videos.");
  }

  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(0);
  console.log(`Starting S3 upload: ${file.name} (${fileSizeMB}MB)`);

  const signed = await getSignedS3Url(file.name, file.type || "video/mp4", "video");

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(signed.method || "PUT", signed.upload_url, true);
    xhr.setRequestHeader("Content-Type", file.type || "video/mp4");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log("S3 upload successful:", signed.public_url);
        resolve(signed.public_url);
      } else {
        console.error("S3 upload failed:", xhr.status, xhr.responseText);
        reject(new Error(`S3 upload failed with status ${xhr.status}. Check bucket CORS configuration.`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during S3 upload. Verify bucket CORS allows PUT from this origin."));
    };

    xhr.send(file);
  });
};

export const uploadThumbnailToS3 = async (blob: Blob, fileName = "thumb.jpg"): Promise<string> => {
  const signed = await getSignedS3Url(fileName, blob.type || "image/jpeg", "thumbnail");
  const resp = await fetch(signed.upload_url, {
    method: signed.method || "PUT",
    headers: { "Content-Type": blob.type || "image/jpeg" },
    body: blob,
  });
  if (!resp.ok) {
    throw new Error(`S3 thumbnail upload failed [${resp.status}]. Check bucket CORS.`);
  }
  return signed.public_url;
};

export const deleteVideoFromCloud = async (videoUrl: string): Promise<void> => {
  // Legacy Supabase Storage deletion (for old videos still hosted there)
  const urlParts = videoUrl.split("/videos/");
  if (urlParts.length < 2) return;
  const filePath = urlParts[1];
  const { error } = await supabase.storage.from("videos").remove([filePath]);
  if (error) {
    console.warn("Legacy Supabase delete failed (may be S3-hosted):", error.message);
  }
};
