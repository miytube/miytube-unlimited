import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { ToastAction } from '@/components/ui/toast';
import { checkVideoCompatibility, getFormatRecommendation } from '@/utils/videoCompatibility';

export const useUploadHandler = () => {
  const { toast } = useToast();
  const { addUploadedVideo } = useUploadedVideos();
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
      try {
        const isBatch = files.length > 1;
        for (const file of files) {
          // Use category from form, or fall back to contentTypeId
          const uploadCategory = category || contentTypeId;
          // For batch uploads, derive title per-file from filename so each video gets its own name.
          // For single uploads, honor the user-entered title.
          const fileBaseName = file.name.split('.').slice(0, -1).join('.') || file.name;
          const perFileTitle = isBatch ? fileBaseName : (title || fileBaseName);
          const perFileDescription = isBatch ? '' : (description || '');
          await addUploadedVideo(file, perFileTitle, perFileDescription, uploadCategory, subcategory, tags);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        toast({
          title: "Upload failed",
          description: errorMessage,
          variant: "destructive",
        });
        return; // Don't continue with success flow
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

