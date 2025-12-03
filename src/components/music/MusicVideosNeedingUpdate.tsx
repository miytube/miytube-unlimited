import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UpdateMusicVideoDialog } from './UpdateMusicVideoDialog';
import { AlertCircle } from 'lucide-react';

interface MusicVideoToUpdate {
  id: string;
  title: string;
  has_video: boolean;
}

export const MusicVideosNeedingUpdate: React.FC = () => {
  const [videosNeedingUpdate, setVideosNeedingUpdate] = useState<MusicVideoToUpdate[]>([]);

  const fetchVideosNeedingUpdate = async () => {
    const { data, error } = await supabase
      .from('music_videos')
      .select('id, title, video_url')
      .is('video_url', null);

    if (error) {
      console.error('Error fetching videos needing update:', error);
      return;
    }

    setVideosNeedingUpdate(
      (data || []).map(v => ({
        id: v.id,
        title: v.title,
        has_video: !!v.video_url,
      }))
    );
  };

  useEffect(() => {
    fetchVideosNeedingUpdate();
  }, []);

  if (videosNeedingUpdate.length === 0) return null;

  return (
    <div className="mb-8 p-4 border border-yellow-500/30 bg-yellow-500/10 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="h-5 w-5 text-yellow-500" />
        <h3 className="font-semibold text-yellow-500">Videos Needing Video File</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        These music videos were uploaded before video playback was fixed. Click "Update Video" to add the video file.
      </p>
      <div className="space-y-2">
        {videosNeedingUpdate.map(video => (
          <div key={video.id} className="flex items-center justify-between p-3 bg-background rounded border">
            <span className="font-medium truncate mr-4">{video.title}</span>
            <UpdateMusicVideoDialog video={video} onUpdated={fetchVideosNeedingUpdate} />
          </div>
        ))}
      </div>
    </div>
  );
};
