import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { uploadVideoToCloud } from '@/utils/cloudVideoUpload';

interface MusicVideoToUpdate {
  id: string;
  title: string;
  has_video: boolean;
}

interface UpdateMusicVideoDialogProps {
  video: MusicVideoToUpdate;
  onUpdated: () => void;
}

export const UpdateMusicVideoDialog: React.FC<UpdateMusicVideoDialogProps> = ({ video, onUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadThumbnailToCloud = async (thumbnailBlob: Blob): Promise<string> => {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) {
      return 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80';
    }
    const filePath = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    
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
      const videoEl = document.createElement('video');
      videoEl.preload = 'metadata';
      videoEl.muted = true;
      videoEl.playsInline = true;

      videoEl.onloadeddata = () => {
        videoEl.currentTime = Math.min(1, videoEl.duration / 4);
      };

      videoEl.onseeked = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoEl.videoWidth || 640;
        canvas.height = videoEl.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(videoEl.src);
          
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

      videoEl.onerror = () => {
        URL.revokeObjectURL(videoEl.src);
        resolve('https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80');
      };

      videoEl.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Upload video to cloud storage
      console.log('Uploading video to cloud storage...');
      const videoUrl = await uploadVideoToCloud(selectedFile);
      console.log('Video uploaded:', videoUrl);
      
      // Generate and upload thumbnail
      let thumbnailUrl: string | null = null;
      if (selectedFile.type.startsWith('video/')) {
        thumbnailUrl = await generateThumbnail(selectedFile);
      }

      const { error } = await supabase
        .from('music_videos')
        .update({
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl || undefined,
        })
        .eq('id', video.id);

      if (error) throw error;

      toast({
        title: "Video Updated",
        description: `"${video.title}" now has playable video.`,
      });

      setIsOpen(false);
      setSelectedFile(null);
      onUpdated();
    } catch (err) {
      console.error('Update error:', err);
      toast({
        title: "Update Failed",
        description: "Could not update the video file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Update Video
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Video File for "{video.title}"</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            This video entry exists but has no playable video file. Upload the video file to make it playable.
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full gap-2"
          >
            <Upload className="h-4 w-4" />
            {selectedFile ? selectedFile.name : 'Select Video/Audio File'}
          </Button>

          {selectedFile && (
            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? 'Uploading...' : 'Upload & Update'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSelectedFile(null)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
