import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Music, Upload } from 'lucide-react';
import { useUploadedVideos } from '@/context/UploadedVideosContext';

const GENRES = [
  'Pop', 'Rock', 'Hip Hop', 'Rap', 'R&B', 'Soul', 'Country', 'Jazz', 'Blues',
  'Classical', 'Electronic', 'Reggae', 'Latin', 'Metal', 'Folk', 'Indie',
  'Funk', 'Punk', 'Christian', 'Salsa', 'Mariachi', 'Mandopop', 'Spanish',
  'Soundtracks', 'Parody'
];

const AudioMusicVideos: React.FC = () => {
  const [searchParams] = useSearchParams();
  const genre = searchParams.get('genre') || '';
  const { uploadedVideos } = useUploadedVideos();

  const filtered = useMemo(() => {
    // Strict: only videos whose CATEGORY is music/audio (not just videos that mention music in their description).
    const MUSIC_CATEGORIES = new Set([
      'music', 'audio', 'audio-music-videos', 'audio-music', 'music-videos',
      'pop', 'rock', 'hip-hop', 'hiphop', 'rap', 'r-and-b', 'rnb', 'soul',
      'country', 'jazz', 'blues', 'classical', 'electronic', 'reggae', 'latin',
      'metal', 'folk', 'indie', 'funk', 'punk', 'christian', 'salsa', 'mariachi',
      'mandopop', 'spanish', 'soundtracks', 'parody',
    ]);

    const musicVideos = uploadedVideos.filter((v) => {
      const cat = (v.category || '').toLowerCase().trim();
      const sub = (v.subcategory || '').toLowerCase().trim();
      // Must be tagged as a music category — no fuzzy title/description matching
      return MUSIC_CATEGORIES.has(cat) || MUSIC_CATEGORIES.has(sub) ||
             cat === 'music' || sub === 'music' ||
             cat.startsWith('music-') || sub.startsWith('music-');
    });

    if (!genre) return musicVideos;

    const g = genre.toLowerCase().replace(/\s+/g, '-');
    return musicVideos.filter((v) => {
      const cat = (v.category || '').toLowerCase();
      const sub = (v.subcategory || '').toLowerCase();
      return cat === g || sub === g || cat === `music-${g}` || sub === `music-${g}`;
    });
  }, [uploadedVideos, genre]);


  // 5 columns × 5 rows = 25 videos max
  const videos = filtered.slice(0, 25);

  const pageTitle = genre ? `${genre} Music Videos` : 'Audio Music Videos';

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-semibold text-primary">MiyTube</span> / Audio Music Videos
            {genre && <> / {genre}</>}
          </p>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Music className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">{pageTitle}</h1>
            </div>
            <Link
              to="/upload/music"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Music Video</span>
            </Link>
          </div>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {videos.map((v) => (
              <VideoCard
                key={v.id}
                id={v.id}
                title={v.title}
                thumbnail={v.thumbnail}
                channelName="Your Channel"
                views={v.views}
                timestamp={v.timestamp}
                duration={v.duration}
                description={v.description}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg">
            <Music className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No {genre || 'Audio'} Music Videos Yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Be the first to upload {genre ? `${genre.toLowerCase()} ` : ''}music videos!
            </p>
            <Link
              to="/upload/music"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Music Video</span>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export { GENRES as AUDIO_MUSIC_GENRES };
export default AudioMusicVideos;
