import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Pagination, PageInfo } from '@/components/Pagination';
import miyTubeLogo from '@/assets/miytube-logo.png';

interface AudioTrack {
  id: string;
  title: string;
  audio_url: string;
  category: string | null;
  views: number;
}

export const UploadedAudioGrid: React.FC = () => {
  const { toast } = useToast();
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tracksPerPage = 25;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('music_videos')
        .select('id, title, video_url, category, views, tags')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) {
        toast({ title: 'Could not load audio', description: error.message, variant: 'destructive' });
        setLoading(false);
        return;
      }
      const audioOnly = (data || [])
        .filter((r: any) => Array.isArray(r.tags) && r.tags.includes('audio-only'))
        .map((r: any) => ({
          id: r.id,
          title: r.title,
          audio_url: r.video_url,
          category: r.category,
          views: r.views,
        }));
      setTracks(audioOnly);
      setLoading(false);
    };
    fetchTracks();
  }, [toast]);

  const togglePlay = (track: AudioTrack) => {
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.audio_url;
        audioRef.current.play().catch(() => {
          toast({ title: 'Playback failed', variant: 'destructive' });
        });
      }
      setPlayingId(track.id);
    }
  };

  const totalPages = Math.ceil(tracks.length / tracksPerPage);
  const startIndex = (currentPage - 1) * tracksPerPage;
  const paginatedTracks = tracks.slice(startIndex, startIndex + tracksPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (tracks.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">Audio</h2>
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {paginatedTracks.map((track) => {
          const isPlaying = playingId === track.id;
          return (
            <div
              key={track.id}
              className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              <button
                onClick={() => togglePlay(track)}
                className="relative aspect-square w-full bg-muted flex items-center justify-center overflow-hidden"
                aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
              >
                <img src={miyTubeLogo} alt="MiyTube" className="w-3/4 h-3/4 object-contain opacity-80" />
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                  </div>
                </div>
              </button>
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate" title={track.title}>{track.title}</h3>
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                  <span className="truncate">{track.category || 'Audio'}</span>
                  <span className="flex-shrink-0 ml-2">{track.views} plays</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <PageInfo currentPage={currentPage} totalPages={totalPages} totalItems={tracks.length} itemLabel="tracks" />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
};
