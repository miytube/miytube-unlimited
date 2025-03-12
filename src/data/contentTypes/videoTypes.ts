
import { Film, Video } from 'lucide-react';
import { ContentType } from '@/types/upload';

export const videoContentTypes: Record<string, ContentType> = {
  video: {
    id: "video",
    name: "Regular Video",
    icon: Video,
    description: "Upload your full-length videos, tutorials, and other video content.",
    acceptedTypes: "video/*",
    supportedFormats: ['MP4', 'MOV', 'WebM', 'AVI', 'FLV', 'MKV'],
    maxSize: "128GB",
    categories: [
      { id: 'music', name: 'Music', subcategories: [
        { id: 'pop', name: 'Pop' },
        { id: 'rock', name: 'Rock' },
        { id: 'hiphop', name: 'Hip Hop' },
      ]},
      { id: 'gaming', name: 'Gaming', subcategories: [
        { id: 'fps', name: 'FPS Games' },
        { id: 'rpg', name: 'RPG Games' },
        { id: 'strategy', name: 'Strategy Games' },
      ]},
      { id: 'education', name: 'Education', subcategories: [
        { id: 'science', name: 'Science' },
        { id: 'math', name: 'Mathematics' },
        { id: 'history', name: 'History' },
      ]},
    ],
    destination: "Your Videos on Home Page and Selected Category"
  },
  shorts: {
    id: "shorts",
    name: "Shorts",
    icon: Film,
    description: "Upload short-form vertical videos. Perfect for quick, engaging content under 60 seconds.",
    acceptedTypes: "video/*",
    supportedFormats: ['MP4', 'MOV', 'WebM'],
    maxSize: "10GB",
    categories: [
      { id: 'trending', name: 'Trending', subcategories: [
        { id: 'challenge', name: 'Challenge' },
        { id: 'dance', name: 'Dance' },
      ]},
      { id: 'comedy', name: 'Comedy', subcategories: [
        { id: 'prank', name: 'Prank' },
        { id: 'skit', name: 'Skit' },
      ]},
    ],
    destination: "Shorts Feed"
  },
};
