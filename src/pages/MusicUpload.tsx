import React from 'react';
import { Layout } from '@/components/Layout';
import { FileUploader } from '@/components/upload/FileUploader';
import { Music } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { CategoryDropdown } from '@/components/categories/CategoryDropdown';
import { contentTypes } from '@/data/contentTypes';
import { useUploadHandler } from '@/hooks/useUploadHandler';
import { MusicUploadRequirements } from '@/components/music/UploadRequirements';
import { supabase } from '@/integrations/supabase/client';

const MusicUpload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleUpload } = useUploadHandler();
  const musicContentType = contentTypes.music;
  
  const onMusicUpload = async (
    files: File[], 
    title: string, 
    description: string, 
    category?: string, 
    subcategory?: string, 
    tags?: string[]
  ) => {
    // First, use the existing upload handler for IndexedDB storage
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

    // Generate a thumbnail from video if possible
    let thumbnailUrl: string | null = null;
    const file = files[0];
    if (file && file.type.startsWith('video/')) {
      try {
        thumbnailUrl = await generateThumbnail(file);
      } catch (err) {
        console.error('Thumbnail generation failed:', err);
      }
    }

    // Save to database for analytics tracking
    try {
      const { data: insertedVideo, error: insertError } = await supabase
        .from('music_videos')
        .insert({
          title,
          description,
          category,
          subcategory,
          tags,
          thumbnail_url: thumbnailUrl,
          // Traffic source - mark as organic upload
          traffic_organic: 1,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error saving to database:', insertError);
      } else if (insertedVideo) {
        // Trigger AI analysis
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

  // Generate thumbnail from video file
  const generateThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      video.onloadeddata = () => {
        video.currentTime = Math.min(1, video.duration / 4);
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          URL.revokeObjectURL(video.src);
          resolve(dataUrl);
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error('Video load error'));
      };

      video.src = URL.createObjectURL(file);
    });
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
        />
      </div>
    </Layout>
  );
};

export default MusicUpload;
