
import { MockVideo } from '@/data/mockVideos';

export const generateSampleVideos = (categoryKey: string, pageTitle: string): MockVideo[] => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `${categoryKey}-${i + 1}`,
    title: `${pageTitle} Content ${i + 1}`,
    thumbnail: `https://images.unsplash.com/photo-${1550745165 + i * 1000}-9bc0b252726f?auto=format&fit=crop&w=800&q=80`,
    channelName: `${pageTitle} Creator ${(i % 5) + 1}`,
    views: `${Math.floor(Math.random() * 900) + 100}K`,
    timestamp: `${(i % 7) + 1} days ago`,
    duration: `${Math.floor(Math.random() * 20) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  }));
};
