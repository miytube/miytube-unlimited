
import { Film, Video, Music, Image, FileText } from 'lucide-react';
import { ContentType } from '@/types/upload';

export const contentTypes: Record<string, ContentType> = {
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
  music: {
    id: "music",
    name: "Music",
    icon: Music,
    description: "Upload your music tracks, covers, remixes, and audio content.",
    acceptedTypes: "audio/*",
    supportedFormats: ['MP4', 'WAV', 'AAC', 'FLAC', 'OGG'],
    maxSize: "10GB",
    categories: [
      { id: 'pop', name: 'Pop', subcategories: [
        { id: 'dance-pop', name: 'Dance Pop' },
        { id: 'indie-pop', name: 'Indie Pop' },
      ]},
      { id: 'rock', name: 'Rock', subcategories: [
        { id: 'alt-rock', name: 'Alternative Rock' },
        { id: 'classic-rock', name: 'Classic Rock' },
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
  image: {
    id: "image",
    name: "Image",
    icon: Image,
    description: "Upload your photos, illustrations, graphics, and visual content.",
    acceptedTypes: "image/*",
    supportedFormats: ['JPG', 'PNG', 'GIF', 'SVG', 'WebP'],
    maxSize: "50MB",
    categories: [
      { id: 'photography', name: 'Photography', subcategories: [
        { id: 'portrait', name: 'Portrait' },
        { id: 'landscape', name: 'Landscape' },
        { id: 'street', name: 'Street' },
      ]},
      { id: 'graphic', name: 'Graphic Design', subcategories: [
        { id: 'illustration', name: 'Illustration' },
        { id: 'typography', name: 'Typography' },
      ]},
    ],
    destination: "Images Gallery"
  },
  document: {
    id: "document",
    name: "Document",
    icon: FileText,
    description: "Upload your documents, articles, presentations, and written content.",
    acceptedTypes: ".pdf,.doc,.docx,.txt,.ppt,.pptx,.odt",
    supportedFormats: ['PDF', 'DOC', 'DOCX', 'TXT', 'PPT', 'PPTX'],
    maxSize: "500MB",
    categories: [
      { id: 'academic', name: 'Academic', subcategories: [
        { id: 'research', name: 'Research Paper' },
        { id: 'thesis', name: 'Thesis' },
      ]},
      { id: 'business', name: 'Business', subcategories: [
        { id: 'presentation', name: 'Presentation' },
        { id: 'report', name: 'Report' },
      ]},
    ],
    destination: "Documents Library"
  },
};
