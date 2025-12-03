
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "./use-toast";
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { ToastAction } from '@/components/ui/toast';

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
    
    toast({
      title: `${contentTypeName} upload started`,
      description: `Processing ${files.length} ${files.length === 1 ? 'file' : 'files'} ${category ? `in category: ${category}` : ''}${subcategory ? `, subcategory: ${subcategory}` : ''}`,
    });
    
    // Store uploads in context - save ALL video/audio content types
    const videoContentTypes = ['video', 'shorts', 'music', 'comedy', 'news', 'podcast', 'audiobook', 'asmr', 'meditation', 'nature-sounds', 'sound-effects'];
    if (videoContentTypes.includes(contentTypeId) || contentTypeId.includes('video') || files.some(f => f.type.startsWith('video/') || f.type.startsWith('audio/'))) {
      for (const file of files) {
        // Use category from form, or fall back to contentTypeId
        const uploadCategory = category || contentTypeId;
        await addUploadedVideo(file, title || file.name, description || '', uploadCategory, subcategory, tags);
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
