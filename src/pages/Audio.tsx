import React, { useEffect, useRef, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Music, Upload, Play, Pause, Loader2, Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pagination, PageInfo } from '@/components/Pagination';
import miyTubeLogo from '@/assets/miytube-logo.png';
import { sortByName } from '@/lib/sortByName';

const AUDIO_CATEGORIES = [
  'All',
  'Pop',
  'Rock',
  'Hip Hop',
  'Electronic',
  'Jazz',
  'Classical',
  'Country',
  'R&B / Soul',
  'Folk',
  'Blues',
  'Reggae',
  'Latin',
  'Metal',
  'Indie',
  'Talk / Spoken',
  'Podcast',
  'Other',
];

interface AudioTrack {
  id: string;
  title: string;
  description: string | null;
  audio_url: string;
  category: string | null;
  duration: string | null;
  user_id: string;
  views: number;
  created_at: string;
}

const Audio = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tracksPerPage = 25;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Upload state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Pop');
  const [file, setFile] = useState<File | null>(null);

  const fetchTracks = async () => {
    setLoading(true);
    // Audio tracks are stored in music_videos table (audio-only entries marked by file_type prefix)
    const { data, error } = await supabase
      .from('music_videos')
      .select('id, title, description, video_url, category, duration, user_id, views, created_at, tags')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      toast({ title: 'Could not load audio', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }
    // Filter for audio-only items (we tag them with 'audio-only')
    const audioOnly = (data || [])
      .filter((r: any) => Array.isArray(r.tags) && r.tags.includes('audio-only'))
      .map((r: any) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        audio_url: r.video_url,
        category: r.category,
        duration: r.duration,
        user_id: r.user_id,
        views: r.views,
        created_at: r.created_at,
      }));
    setTracks(audioOnly);
    setLoading(false);
  };

  useEffect(() => { fetchTracks(); }, []);

  const filteredTracks = tracks.filter((t) => {
    const matchesCat = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch = !searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalPages = Math.ceil(filteredTracks.length / tracksPerPage);
  const startIndex = (currentPage - 1) * tracksPerPage;
  const paginatedTracks = filteredTracks.slice(startIndex, startIndex + tracksPerPage);

  useEffect(() => { setCurrentPage(1); }, [activeCategory, searchTerm]);

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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Please sign in to upload', variant: 'destructive' });
      navigate('/auth');
      return;
    }
    if (!file || !title.trim()) {
      toast({ title: 'Title and file are required', variant: 'destructive' });
      return;
    }
    const isAudio = file.type.startsWith('audio/');
    const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v|mkv)$/i.test(file.name);
    if (!isAudio && !isVideo) {
      toast({ title: 'Unsupported file', description: 'Upload audio (mp3, wav, m4a, ogg) or video (mp4, mov, webm).', variant: 'destructive' });
      return;
    }
    const maxSize = isVideo ? 500 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({ title: 'File too large', description: isVideo ? 'Max 500MB for video' : 'Max 100MB for audio', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'mp3';
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      // Upload to videos bucket (existing)
      const { error: upErr } = await supabase.storage.from('videos').upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (upErr) throw upErr;

      const { data: urlData } = supabase.storage.from('videos').getPublicUrl(path);

      const { error: insErr } = await supabase.from('music_videos').insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        category,
        video_url: urlData.publicUrl,
        tags: ['audio-only'],
      });
      if (insErr) throw insErr;

      toast({ title: 'Audio uploaded!' });
      setUploadOpen(false);
      setTitle(''); setDescription(''); setFile(null); setCategory('Pop');
      fetchTracks();
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <Link to="/" className="font-semibold text-primary">MiyTube</Link> / Audio
        </p>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Music className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">MiyTube Audio</h1>
              <p className="text-sm text-muted-foreground">Music & talking audio — listen and upload</p>
            </div>
          </div>

          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <Upload className="mr-2 h-4 w-4" /> Upload Audio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Audio</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} required />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {AUDIO_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Audio or Video file (mp3, wav, m4a, mp4, mov, webm — audio max 100MB, video max 500MB) *</Label>
                  <Input type="file" accept="audio/*,video/*,.mp4,.mov,.webm,.m4v,.mkv" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
                </div>
                <Button type="submit" disabled={uploading} className="w-full">
                  {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  {uploading ? 'Uploading…' : 'Upload'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <audio ref={audioRef} onEnded={() => setPlayingId(null)} />

        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search audio…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {sortByName(AUDIO_CATEGORIES).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTracks.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg">
            <Music className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No audio yet</h3>
            <p className="text-muted-foreground mb-4">
              {activeCategory === 'All' ? 'Be the first to upload!' : `No tracks in ${activeCategory} yet.`}
            </p>
          </div>
        ) : (
          <>
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
                      <img
                        src={miyTubeLogo}
                        alt="MiyTube"
                        className="w-3/4 h-3/4 object-contain opacity-80"
                      />
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

            <div className="flex items-center justify-between mt-6">
              <PageInfo
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredTracks.length}
                itemLabel="tracks"
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Audio;
