import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Legacy route — redirects to /audio while preserving query params (?genre=Salsa, etc.)
// so traffic from Google Search keeps landing on the intended genre.
const AudioMusicVideos: React.FC = () => {
  const { search, hash } = useLocation();
  return <Navigate to={`/audio${search}${hash}`} replace />;
};

export const AUDIO_MUSIC_GENRES = [
  'Pop', 'Rock', 'Hip Hop', 'Rap', 'R&B', 'Soul', 'Country', 'Jazz', 'Blues',
  'Classical', 'Electronic', 'Reggae', 'Latin', 'Metal', 'Folk', 'Indie',
  'Funk', 'Punk', 'Christian', 'Salsa', 'Mariachi', 'Mandopop', 'Spanish',
  'Soundtracks', 'Parody',
];

export default AudioMusicVideos;
