import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { ToastAction } from '@/components/ui/toast';
import { checkVideoCompatibility, getFormatRecommendation } from '@/utils/videoCompatibility';
import { useUploadProgress } from '@/context/UploadProgressContext';
import { getUploadDestinationRoute } from '@/utils/categoryRoute';
import { supabase } from '@/integrations/supabase/client';
import { getPerFileUploadMetadata, getPerFileTags } from '@/utils/uploadMetadata';

export const useUploadHandler = () => {
  const { toast } = useToast();
  const { addUploadedVideo } = useUploadedVideos();
  const { failUpload } = useUploadProgress();
  const navigate = useNavigate();
  
  const handleUpload = async (
    contentTypeName: string,
    files: File[], 
    title: string, 
    description: string, 
    contentTypeId: string,
    destination: string,
    category?: string, 
    subcategory?: string, 
    tags?: string[]
  ) => {
    console.log(`${contentTypeName} upload initiated:`, files, "Title:", title, "Description:", description, "Category:", category, "Subcategory:", subcategory, "Tags:", tags);
    
    // Check video compatibility before uploading
    const videoContentTypes = ['video', 'shorts', 'music', 'comedy', 'news', 'podcast', 'audiobook', 'asmr', 'meditation', 'nature-sounds', 'sound-effects'];
    const isVideoUpload = videoContentTypes.includes(contentTypeId) || contentTypeId.includes('video') || files.some(f => f.type.startsWith('video/'));
    
    // Filter out incompatible video files instead of blocking the entire batch
    const compatibleFiles: File[] = [];
    const skippedFiles: string[] = [];

    if (isVideoUpload) {
      for (const file of files) {
        if (!file.type.startsWith('video/')) {
          compatibleFiles.push(file);
          continue;
        }

        try {
          const compatibility = await checkVideoCompatibility(file);
          if (!compatibility.isCompatible) {
            skippedFiles.push(file.name);
            const { data: authData } = await supabase.auth.getUser();
            await supabase.from('blocked_uploads').insert({
              user_id: authData?.user?.id ?? null,
              file_name: file.name,
              file_size: file.size,
              title: title || file.name,
              category: category ?? null,
              subcategory: subcategory ?? null,
              reason: 'incompatible_format',
              details: compatibility.errorMessage || 'Video format not playable in browsers',
            });
            toast({
              title: `Skipped: ${file.name}`,
              description: compatibility.errorMessage || "This video cannot be played in browsers.",
              variant: "destructive",
              duration: 8000,
            });
            continue;
          }
          compatibleFiles.push(file);
        } catch (error) {
          console.warn('Video compatibility check failed, proceeding with upload:', error);
          compatibleFiles.push(file);
        }
      }

      if (skippedFiles.length > 0) {
        setTimeout(() => {
          toast({
            title: "How to fix skipped videos",
            description: getFormatRecommendation(),
            duration: 12000,
          });
        }, 500);
      }

      if (compatibleFiles.length === 0) {
        return; // Nothing to upload
      }
    } else {
      compatibleFiles.push(...files);
    }

    files = compatibleFiles;


    toast({
      title: `${contentTypeName} upload started`,
      description: `Processing ${files.length} ${files.length === 1 ? 'file' : 'files'} ${category ? `in category: ${category}` : ''}${subcategory ? `, subcategory: ${subcategory}` : ''}`,
    });
    
    // Store uploads in context - save ALL video/audio content types
    if (isVideoUpload || files.some(f => f.type.startsWith('audio/'))) {
      const isBatch = files.length > 1;
      let successCount = 0;

      type PendingUpload = {
        file: File;
        perFileTitle: string;
        perFileDescription: string;
        perFileTags: string[];
        uploadCategory: string | undefined;
        uploadSubcategory: string | undefined;
      };

      // Pre-compute per-file metadata so retries reuse the same values
      const pending: PendingUpload[] = files.map((file) => {
        const { title: perFileTitle, description: perFileDescription } = getPerFileUploadMetadata(
          file,
          title,
          description,
          files.length,
        );
        const perFileTags = getPerFileTags(file, perFileTitle, tags, files.length);

        let uploadCategory = category;
        let uploadSubcategory = subcategory;
        if (!uploadCategory) {
          uploadCategory = contentTypeId;
        }
        return { file, perFileTitle, perFileDescription, perFileTags, uploadCategory, uploadSubcategory };
      });

      const MAX_ATTEMPTS = 3;
      let queue = pending;
      const finalFailed: { name: string; error: string }[] = [];

      for (let attempt = 1; attempt <= MAX_ATTEMPTS && queue.length > 0; attempt++) {
        const nextQueue: PendingUpload[] = [];
        if (attempt > 1) {
          toast({
            title: `Retrying ${queue.length} failed ${queue.length === 1 ? 'file' : 'files'}`,
            description: `Attempt ${attempt} of ${MAX_ATTEMPTS}…`,
            duration: 5000,
          });
          // small backoff between retry passes
          await new Promise((r) => setTimeout(r, 1500 * (attempt - 1)));
        }

        for (const item of queue) {
          try {
            await addUploadedVideo(
              item.file,
              item.perFileTitle,
              item.perFileDescription,
              item.uploadCategory,
              item.uploadSubcategory,
              item.perFileTags,
            );
            successCount++;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            console.error(`[Upload failed attempt ${attempt}] ${item.file.name}:`, errorMessage);
            if (attempt < MAX_ATTEMPTS) {
              nextQueue.push(item);
            } else {
              finalFailed.push({ name: item.file.name, error: errorMessage });
              toast({
                title: `Failed: ${item.file.name}`,
                description: `${errorMessage} (gave up after ${MAX_ATTEMPTS} attempts)`,
                variant: "destructive",
                duration: 20000,
              });
            }
          }
        }
        queue = nextQueue;
      }

      if (successCount === 0) {
        failUpload(
          finalFailed.length > 0
            ? `Upload failed: ${finalFailed.map((f) => f.name).join(', ')}`
            : 'No videos were published. Please try again.',
        );
        return;
      }
      if (finalFailed.length > 0) {
        toast({
          title: `${finalFailed.length} of ${files.length} files failed`,
          description: `Failed after ${MAX_ATTEMPTS} attempts: ${finalFailed.map((f) => f.name).join(', ')}`,
          variant: "destructive",
          duration: 30000,
        });
      }
    }
    
    let redirectPath = getUploadDestinationRoute(category, subcategory);
    if (contentTypeId === 'shorts') redirectPath = '/shorts';
    else if (contentTypeId === 'music') redirectPath = '/music';
    else if (contentTypeId === 'image') redirectPath = '/images';
    else if (contentTypeId === 'document') redirectPath = '/documents';

    const viewText = redirectPath === '/' ? 'Home' : redirectPath.substring(1);
    const altTextValue = `Go to ${redirectPath === '/' ? 'home' : redirectPath.substring(1)} page`;

    toast({
      title: "Upload complete",
      description: `Your ${contentTypeName.toLowerCase()} has been processed. You can keep uploading more.`,
      duration: 8000,
      action: (
        <ToastAction
          className="flex items-center gap-1"
          onClick={() => navigate(redirectPath)}
          aria-label={altTextValue}
          altText={altTextValue}
        >
          View {viewText}
        </ToastAction>
      )
    });
    // No auto-redirect — stay on the upload page so batch uploads aren't interrupted.
  };

  return { handleUpload };
};

