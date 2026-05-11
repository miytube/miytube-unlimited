import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { ToastAction } from '@/components/ui/toast';
import { checkVideoCompatibility, getFormatRecommendation } from '@/utils/videoCompatibility';
import { autoCategorize } from '@/utils/autoCategorize';
import { useUploadProgress } from '@/context/UploadProgressContext';

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
      const failed: string[] = [];
      const failedFiles: File[] = [];
      for (const file of files) {
        const fileBaseName = file.name.split('.').slice(0, -1).join('.') || file.name;
        const perFileTitle = isBatch ? fileBaseName : (title || fileBaseName);
        const perFileDescription = isBatch ? '' : (description || '');

        // If the uploader didn't pick a category, try to infer the closest one
        // from the title/description/filename/tags. Their explicit choice (if any)
        // always wins.
        let uploadCategory = category;
        let uploadSubcategory = subcategory;
        if (!uploadCategory) {
          const guess = autoCategorize(perFileTitle, perFileDescription, file.name, tags);
          if (guess) {
            uploadCategory = guess.category;
            if (!uploadSubcategory && guess.subcategory) uploadSubcategory = guess.subcategory;
            console.log(`[auto-category] ${file.name} → ${guess.category}${guess.subcategory ? '/' + guess.subcategory : ''} (matched: ${guess.matchedKeywords.join(', ')})`);
          } else {
            uploadCategory = contentTypeId;
          }
        }

        try {
          await addUploadedVideo(file, perFileTitle, perFileDescription, uploadCategory, uploadSubcategory, tags);
          successCount++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Upload failed';
          failed.push(file.name);
          console.error(`[Upload failed] ${file.name}:`, errorMessage);
          toast({
            title: `Failed: ${file.name}`,
            description: errorMessage,
            variant: "destructive",
            duration: 20000, // keep visible long enough during batch uploads
          });
          // Continue with the rest of the batch instead of aborting
        }
      }

      if (successCount === 0) {
        failUpload(failed.length > 0 ? `Upload failed: ${failed.join(', ')}` : 'No videos were published. Please try again.');
        return; // Nothing succeeded; skip success redirect
      }
      if (failed.length > 0) {
        toast({
          title: `${failed.length} of ${files.length} files failed`,
          description: `Failed: ${failed.join(', ')}`,
          variant: "destructive",
          duration: 30000, // persistent so user can read which files were skipped
        });
      }
    }
    
    setTimeout(() => {
      let redirectPath = '/';
      
      if (contentTypeId === 'shorts') redirectPath = '/shorts';
      else if (contentTypeId === 'music') redirectPath = '/music';
      else if (contentTypeId === 'image') redirectPath = '/images';
      else if (contentTypeId === 'document') redirectPath = '/documents';
      
      const viewText = redirectPath === '/' ? 'Home' : redirectPath.substring(1);
      const altTextValue = `Go to ${redirectPath === '/' ? 'home' : redirectPath.substring(1)} page`;
      
      toast({
        title: "Upload complete",
        description: `Your ${contentTypeName.toLowerCase()} has been processed and is now available.`,
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
      
      navigate(redirectPath);
    }, 2000);
  };

  return { handleUpload };
};

