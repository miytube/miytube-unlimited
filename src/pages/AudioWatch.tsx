import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Music, Play, Pause, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import miyTubeLogo from '@/assets/miytube-logo.png';

interface AudioTrack {
  id: string;
  title: string;
  description: string | null;
  audio_url: string;
  category: string | null;
  views: number;
  created_at: string;
}

const AudioWatch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [related, setRelated] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      const { data: trackRow, error } = await supabase
        .from('music_videos')
        .select('id, title, description, video_url, category, views, created_at, tags')
        .eq('id', id)
        .maybeSingle();
      if (error || !trackRow) {
        toast({ title: 'Audio not found', variant: 'destructive' });
        setLoading(false);
        return;
      }
      const t: AudioTrack = {
        id: trackRow.id,
        title: trackRow.title,
        description: trackRow.description,
        audio_url: trackRow.video_url,
        category: trackRow.category,
        views: trackRow.views,
        created_at: trackRow.created_at,
      };
      setTrack(t);

      // Increment views
      await supabase.from('music_videos').update({ views: (trackRow.views || 0) + 1 }).eq('id', id);

      // Fetch other audio tracks in same category
      const { data: relRows } = await supabase
        .from('music_videos')
        .select('id, title, description, video_url, category, views, created_at, tags')
        .contains('tags', ['audio-only'])
        .eq('category', trackRow.category)
        .neq('id', id)
        .order('created_at', { ascending: false })
        .limit(50);

      setRelated(
        (relRows || []).map((r: any) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          audio_url: r.video_url,
          category: r.category,
          views: r.views,
          created_at: r.created_at,
        }))
      );
      setLoading(false);
    };
    load();
  }, [id, toast]);

  const togglePlay = (t: AudioTrack) => {
    if (playingId === t.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = t.audio_url;
        audioRef.current.play().catch(() => {
          toast({ title: 'Playback failed', variant: 'destructive' });
        });
      }
      setPlayingId(t.id);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!track) {
    return (
      <Layout>
        <div className="text-center py-24">
          <p className="text-muted-foreground mb-4">Audio not found.</p>
          <Link to="/audio" className="text-primary underline">Back to Audio</Link>
        </div>
      </Layout>
    );
  }

  const categoryLabel = track.category || 'Audio';

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <Link to="/" className="font-semibold text-primary">MiyTube</Link> /{' '}
          <Link to="/audio" className="text-primary">Audio</Link> / {categoryLabel} / {track.title}
        </p>

        <button
          onClick={() => navigate('/audio')}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Audio
        </button>

        <audio ref={audioRef} onEnded={() => setPlayingId(null)} />

        {/* Primary track */}
        <div className="bg-card rounded-xl overflow-hidden shadow-md mb-8 flex flex-col md:flex-row">
          <button
            onClick={() => togglePlay(track)}
            className="relative md:w-80 aspect-square bg-muted flex items-center justify-center overflow-hidden flex-shrink-0"
            aria-label={playingId === track.id ? `Pause ${track.title}` : `Play ${track.title}`}
          >
            <img src={miyTubeLogo} alt="MiyTube" className="w-3/4 h-3/4 object-contain opacity-80" />
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${playingId === track.id ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
              <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                {playingId === track.id ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
              </div>
            </div>
          </button>
          <div className="p-6 flex-1">
            <span className="inline-block text-xs px-2 py-1 rounded-full bg-secondary text-foreground mb-2">{categoryLabel}</span>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{track.title}</h1>
            <p className="text-sm text-muted-foreground mb-3">{track.views} plays</p>
            {track.description && (
              <p className="text-sm text-foreground whitespace-pre-wrap">{track.description}</p>
            )}
          </div>
        </div>

        {/* Related audio in same category */}
        <h2 className="text-xl font-semibold mb-4">
          More {categoryLabel} Audio
        </h2>
        {related.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg text-muted-foreground">
            <Music className="h-12 w-12 mx-auto mb-3 opacity-50" />
            No other {categoryLabel} audio yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {related.map((r) => {
              const isPlaying = playingId === r.id;
              return (
                <div key={r.id} className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                  <button
                    onClick={() => navigate(`/audio/track/${r.id}`)}
                    className="relative aspect-square w-full bg-muted flex items-center justify-center overflow-hidden"
                    aria-label={`Open ${r.title}`}
                  >
                    <img src={miyTubeLogo} alt="MiyTube" className="w-3/4 h-3/4 object-contain opacity-80" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                      <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                        <Play className="h-6 w-6 ml-0.5" />
                      </div>
                    </div>
                  </button>
                  <div className="p-3">
                    <Link to={`/audio/track/${r.id}`} className="font-semibold text-sm truncate block hover:text-primary" title={r.title}>
                      {r.title}
                    </Link>
                    <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                      <span className="truncate">{r.category || 'Audio'}</span>
                      <span className="flex-shrink-0 ml-2">{r.views} plays</span>
                    </div>
                    <button
                      onClick={() => togglePlay(r)}
                      className="mt-2 text-xs text-primary hover:underline"
                    >
                      {isPlaying ? 'Pause preview' : 'Quick play'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AudioWatch;
