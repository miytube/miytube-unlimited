
import { Music } from 'lucide-react';
import { ContentType } from '@/types/upload';

export const musicContentTypes: Record<string, ContentType> = {
  music: {
    id: "music",
    name: "Music",
    icon: Music,
    description: "Upload your music tracks, covers, remixes, and audio content.",
    acceptedTypes: "video/*,.mp4,.mov,.webm,.avi,.flv,.mkv",
    supportedFormats: ['MP4', 'MOV', 'WebM', 'AVI', 'FLV', 'MKV'],
    maxSize: "10GB",
    categories: [
      { id: 'pop', name: 'Pop', subcategories: [
        { id: 'dance-pop', name: 'Dance Pop' },
        { id: 'indie-pop', name: 'Indie Pop' },
      ]},
      { id: 'rock', name: 'Rock', subcategories: [
        { id: 'alt-rock', name: 'Alternative Rock' },
        { id: 'classic-rock', name: 'Classic Rock' },
        { id: 'grunge', name: 'Grunge' },
        { id: 'hard-rock', name: 'Hard Rock' },
        { id: 'punk-rock', name: 'Punk Rock' },
        { id: 'progressive-rock', name: 'Progressive Rock' },
      ]},
      { id: 'alternative', name: 'Alternative', subcategories: [
        { id: 'indie-alternative', name: 'Indie Alternative' },
        { id: 'post-punk', name: 'Post-Punk' },
        { id: 'shoegaze', name: 'Shoegaze' },
        { id: 'new-wave', name: 'New Wave' },
      ]},
      { id: 'hiphop', name: 'Hip Hop', subcategories: [
        { id: 'trap', name: 'Trap' },
        { id: 'lofi', name: 'Lo-Fi' },
      ]},
      { id: 'electronic', name: 'Electronic', subcategories: [
        { id: 'house', name: 'House' },
        { id: 'techno', name: 'Techno' },
        { id: 'ambient', name: 'Ambient' },
      ]},
    ],
    destination: "Music Page and Player"
  },
};
