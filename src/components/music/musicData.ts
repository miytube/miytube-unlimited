
import { AudioTrack } from './AudioCard';

// Generate 20 audio samples for 4x5 grid
export const audioSamples: AudioTrack[] = Array.from({ length: 20 }, (_, i) => ({
  id: `audio${i + 1}`,
  title: `Music Track ${i + 1}`,
  artist: `Artist ${(i % 5) + 1}`,
  duration: `${Math.floor(Math.random() * 5) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  plays: `${Math.floor(Math.random() * 900) + 100}K`,
  image: `https://images.unsplash.com/photo-${1470225620780 + i * 1000}-dba8ba36b745?auto=format&fit=crop&w=800&q=80`,
}));

export const musicCategories: string[] = [
  'Music', 'Podcasts', 'Audiobooks', 'Sound Effects', 
  'Meditation', 'ASMR', 'Speech', 'Educational', 
  'Gaming', 'Nature Sounds', 'Comedy', 'Interviews'
];
