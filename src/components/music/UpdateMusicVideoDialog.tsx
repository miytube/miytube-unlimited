import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const generateThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const videoEl = document.createElement('video');
      videoEl.preload = 'metadata';
      videoEl.muted = true;
      videoEl.playsInline = true;

      videoEl.onloadeddata = () => {
        videoEl.currentTime = Math.min(1, videoEl.duration / 4);
      };

      videoEl.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoEl.videoWidth;
        canvas.height = videoEl.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          URL.revokeObjectURL(videoEl.src);
          resolve(dataUrl);
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };

      videoEl.onerror = () => {
        URL.revokeObjectURL(videoEl.src);
        reject(new Error('Video load error'));
      };

      videoEl.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const videoDataUrl = await fileToDataUrl(selectedFile);
      
      let thumbnailUrl: string | null = null;
      if (selectedFile.type.startsWith('video/')) {
        try {
          thumbnailUrl = await generateThumbnail(selectedFile);
        } catch (err) {
          console.error('Thumbnail generation failed:', err);
        }
      }

      const { error } = await supabase
        .from('music_videos')
        .update({
          video_url: videoDataUrl,
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
