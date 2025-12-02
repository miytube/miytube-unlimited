
import React from 'react';
import { AudioCard, AudioTrack } from './AudioCard';

interface FeaturedAudioProps {
  audioTracks: AudioTrack[];
}

export const FeaturedAudio: React.FC<FeaturedAudioProps> = ({ audioTracks }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">Featured Music</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {audioTracks.map((audio) => (
          <AudioCard key={audio.id} audio={audio} />
        ))}
      </div>
    </div>
  );
};
