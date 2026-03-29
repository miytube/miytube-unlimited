import React from 'react';
import { Layout } from '@/components/Layout';
import { FileUploader } from '@/components/upload/FileUploader';
import { Music } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CategoryDropdown } from '@/components/categories/CategoryDropdown';
import { contentTypes } from '@/data/contentTypes';
import { useUploadHandler } from '@/hooks/useUploadHandler';
import { MusicUploadRequirements } from '@/components/music/UploadRequirements';
import { supabase } from '@/integrations/supabase/client';
import { uploadVideoToCloud } from '@/utils/cloudVideoUpload';

const MusicUpload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleUpload } = useUploadHandler();
  const musicContentType = contentTypes.music;
  
  const genreFromUrl = searchParams.get('genre') || '';

  const uploadThumbnailToCloud = async (thumbnailBlob: Blob): Promise<string> => {
    const filePath = `thumbnails/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    
    const { data, error } = await supabase.storage
      .from('thumbnails')
      .upload(filePath, thumbnailBlob, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg',
      });

    if (error) {
      console.error('Thumbnail upload error:', error);
      return 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80';
    }

    const { data: urlData } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const generateThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      video.onloadeddata = () => {
        video.currentTime = Math.min(1, video.duration / 4);
      };

      video.onseeked = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(video.src);
          
          canvas.toBlob(async (blob) => {
            if (blob) {
              const thumbnailUrl = await uploadThumbnailToCloud(blob);
              resolve(thumbnailUrl);
            } else {
              resolve('https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80');
            }
          }, 'image/jpeg', 0.8);
        } else {
          resolve('https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80');
        }
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        resolve('https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80');
      };

      video.src = URL.createObjectURL(file);
    });
  };
  
  const onMusicUpload = async (
    files: File[], 
    title: string, 
    description: string, 
    category?: string, 
    subcategory?: string, 
    tags?: string[]
  ) => {
    handleUpload(
      "Music", 
      files, 
      title, 
      description, 
      "music",
      musicContentType.destination,
      category, 
      subcategory, 
      tags
    );

    let thumbnailUrl: string | null = null;
    let videoUrl: string | null = null;
    const file = files[0];
    
    if (file) {
      try {
        console.log('Uploading music video to cloud storage...');
        videoUrl = await uploadVideoToCloud(file);
        console.log('Music video uploaded:', videoUrl);
        
        if (file.type.startsWith('video/')) {
          thumbnailUrl = await generateThumbnail(file);
        }
      } catch (err) {
        console.error('Upload failed:', err);
        toast({
          title: "Upload Error",
          description: "Failed to upload music file to cloud storage.",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: insertedVideo, error: insertError } = await supabase
        .from('music_videos')
        .insert({
          title,
          description,
          category,
          subcategory,
          tags,
          thumbnail_url: thumbnailUrl,
          video_url: videoUrl,
          traffic_organic: 1,
          user_id: user?.id,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error saving to database:', insertError);
      } else if (insertedVideo) {
        console.log('Triggering AI analysis for:', insertedVideo.id);
        
        const { error: analysisError } = await supabase.functions.invoke('analyze-music-video', {
          body: {
            videoId: insertedVideo.id,
            title,
            description,
            thumbnailUrl,
          }
        });

        if (analysisError) {
          console.error('AI analysis error:', analysisError);
        } else {
          toast({
            title: "AI Analysis Complete",
            description: "Your music video has been analyzed for featured eligibility.",
          });
        }
      }
    } catch (err) {
      console.error('Database error:', err);
    }
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Music className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Upload Music</h1>
          <p className="text-muted-foreground ml-2">
            Share your music tracks with the world
          </p>
        </div>
        
        <div className="mb-8">
          <CategoryDropdown />
        </div>
        
        <MusicUploadRequirements audioFormats={musicContentType.supportedFormats} />
        
        <FileUploader
          icon={Music}
          title="Upload Music or Music Video"
          description="Upload your music tracks, music videos, covers, remixes, and audio/video content."
          acceptedTypes={musicContentType.acceptedTypes}
          supportedFormats={musicContentType.supportedFormats}
          maxSize={musicContentType.maxSize}
          onUpload={onMusicUpload}
          id="music-upload-input"
          uploadDestination={musicContentType.destination}
          categories={musicContentType.categories}
          defaultSubcategory={genreFromUrl}
        />
      </div>
    </Layout>
  );
};

export default MusicUpload;
