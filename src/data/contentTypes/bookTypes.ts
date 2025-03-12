
import { Book } from 'lucide-react';
import { ContentType } from '@/types/upload';

export const bookContentTypes: Record<string, ContentType> = {
  audiobooks: {
    id: "audiobooks",
    name: "Audiobooks",
    icon: Book,
    description: "Upload audiobooks, narrations, and spoken word content.",
    acceptedTypes: "audio/*,.mp3,.wav,.ogg,.aac",
    supportedFormats: ['MP3', 'WAV', 'OGG', 'AAC', 'M4A'],
    maxSize: "1GB",
    categories: [
      { id: 'fiction', name: 'Fiction', subcategories: [
        { id: 'fantasy', name: 'Fantasy' },
        { id: 'mystery', name: 'Mystery' },
        { id: 'sci-fi', name: 'Science Fiction' },
      ]},
      { id: 'non-fiction', name: 'Non-Fiction', subcategories: [
        { id: 'self-help', name: 'Self-Help' },
        { id: 'biography', name: 'Biography' },
        { id: 'history', name: 'History' },
      ]},
      { id: 'children', name: 'Children', subcategories: [
        { id: 'picture-books', name: 'Picture Books' },
        { id: 'middle-grade', name: 'Middle Grade' },
      ]},
      { id: 'poetry', name: 'Poetry', subcategories: [
        { id: 'classical', name: 'Classical' },
        { id: 'modern', name: 'Modern' },
      ]},
    ],
    destination: "Audiobooks Page"
  },
  educational: {
    id: "educational",
    name: "Educational",
    icon: Book,
    description: "Upload lectures, tutorials, and educational content.",
    acceptedTypes: "video/*,audio/*,.mp4,.mov,.webm,.mp3,.wav",
    supportedFormats: ['MP4', 'MOV', 'WebM', 'MP3', 'WAV'],
    maxSize: "2GB",
    categories: [
      { id: 'academic', name: 'Academic', subcategories: [
        { id: 'math', name: 'Mathematics' },
        { id: 'science', name: 'Science' },
        { id: 'history', name: 'History' },
        { id: 'literature', name: 'Literature' },
      ]},
      { id: 'professional', name: 'Professional Skills', subcategories: [
        { id: 'programming', name: 'Programming' },
        { id: 'business', name: 'Business' },
        { id: 'design', name: 'Design' },
      ]},
      { id: 'languages', name: 'Languages', subcategories: [
        { id: 'english', name: 'English' },
        { id: 'spanish', name: 'Spanish' },
        { id: 'mandarin', name: 'Mandarin' },
      ]},
      { id: 'how-to', name: 'How-to Guides', subcategories: [
        { id: 'crafts', name: 'Crafts' },
        { id: 'cooking', name: 'Cooking' },
        { id: 'diy', name: 'DIY' },
      ]},
    ],
    destination: "Educational Page"
  },
};
