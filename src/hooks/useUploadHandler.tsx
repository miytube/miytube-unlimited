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
    
    if (isVideoUpload) {
      for (const file of files) {
        if (file.type.startsWith('video/')) {
          toast({
            title: "Checking video compatibility...",
            description: `Verifying ${file.name} can play in browsers.`,
          });
          
          try {
            const compatibility = await checkVideoCompatibility(file);
            
            if (!compatibility.isCompatible) {
              toast({
                title: "Video format not supported",
                description: compatibility.errorMessage || "This video cannot be played in browsers.",
                variant: "destructive",
                duration: 10000,
              });
              
              // Show additional help toast
              setTimeout(() => {
                toast({
                  title: "How to fix",
                  description: getFormatRecommendation(),
                  duration: 15000,
                });
              }, 500);
              
              return; // Block the upload
            }
            
            console.log('Video compatibility check passed:', {
              file: file.name,
              details: compatibility.details,
            });
          } catch (error) {
            console.warn('Video compatibility check failed, proceeding with upload:', error);
            // Don't block upload if check itself fails - let the player handle it
          }
        }
      }
    }
    
    toast({
      title: `${contentTypeName} upload started`,
      description: `Processing ${files.length} ${files.length === 1 ? 'file' : 'files'} ${category ? `in category: ${category}` : ''}${subcategory ? `, subcategory: ${subcategory}` : ''}`,
    });
    
    // Store uploads in context - save ALL video/audio content types
    if (isVideoUpload || files.some(f => f.type.startsWith('audio/'))) {
      try {
        for (const file of files) {
          // Use category from form, or fall back to contentTypeId
          const uploadCategory = category || contentTypeId;
          await addUploadedVideo(file, title || file.name, description || '', uploadCategory, subcategory, tags);
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

