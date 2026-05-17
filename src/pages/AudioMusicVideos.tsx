import React from 'react';
import { Navigate } from 'react-router-dom';

// All audio uploads now live on the unified /audio page (reads from music_videos table).
// This legacy route redirects there so the sidebar link always lands on the full list.
const AudioMusicVideos: React.FC = () => <Navigate to="/audio" replace />;

export const AUDIO_MUSIC_GENRES = [
  'Pop', 'Rock', 'Hip Hop', 'Rap', 'R&B', 'Soul', 'Country', 'Jazz', 'Blues',
  'Classical', 'Electronic', 'Reggae', 'Latin', 'Metal', 'Folk', 'Indie',
  'Funk', 'Punk', 'Christian', 'Salsa', 'Mariachi', 'Mandopop', 'Spanish',
  'Soundtracks', 'Parody',
];

export default AudioMusicVideos;
