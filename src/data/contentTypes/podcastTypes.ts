
import { Mic } from 'lucide-react';
import { ContentType } from '@/types/upload';

export const podcastContentTypes: Record<string, ContentType> = {
  podcasts: {
    id: "podcasts",
    name: "Podcasts",
    icon: Mic,
    description: "Upload your podcast episodes, interviews, and talk shows.",
    acceptedTypes: "audio/*,.mp3,.wav,.ogg,.aac",
    supportedFormats: ['MP3', 'WAV', 'OGG', 'AAC', 'M4A'],
    maxSize: "500MB",
    categories: [
      { id: 'news', name: 'News & Politics', subcategories: [
        { id: 'daily-news', name: 'Daily News' },
        { id: 'political-commentary', name: 'Political Commentary' },
      ]},
      { id: 'comedy', name: 'Comedy', subcategories: [
        { id: 'standup', name: 'Stand-up' },
        { id: 'panel', name: 'Panel Shows' },
      ]},
      { id: 'education', name: 'Educational', subcategories: [
        { id: 'science', name: 'Science' },
        { id: 'history', name: 'History' },
      ]},
      { id: 'interviews', name: 'Interviews', subcategories: [
        { id: 'celebrity', name: 'Celebrity' },
        { id: 'expert', name: 'Expert' },
      ]},
      { id: 'true-crime', name: 'True Crime', subcategories: [
        { id: 'investigative', name: 'Investigative' },
        { id: 'documentary', name: 'Documentary' },
      ]},
      { id: 'business', name: 'Business', subcategories: [
        { id: 'startup', name: 'Startup' },
        { id: 'finance', name: 'Finance' },
      ]},
    ],
    destination: "Podcasts Page"
  },
};
