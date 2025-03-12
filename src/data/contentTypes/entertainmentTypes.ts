
import { Video } from 'lucide-react';
import { ContentType } from '@/types/upload';

export const entertainmentContentTypes: Record<string, ContentType> = {
  comedy: {
    id: "comedy",
    name: "Comedy",
    icon: Video,
    description: "Upload stand-up, sketches, and other comedy content.",
    acceptedTypes: "video/*,audio/*,.mp4,.mov,.webm,.mp3,.wav",
    supportedFormats: ['MP4', 'MOV', 'WebM', 'MP3', 'WAV'],
    maxSize: "2GB",
    categories: [
      { id: 'standup', name: 'Stand-up', subcategories: [
        { id: 'specials', name: 'Specials' },
        { id: 'open-mic', name: 'Open Mic' },
      ]},
      { id: 'sketches', name: 'Sketches', subcategories: [
        { id: 'short-form', name: 'Short Form' },
        { id: 'character', name: 'Character Comedy' },
      ]},
      { id: 'improv', name: 'Improv', subcategories: [
        { id: 'games', name: 'Games' },
        { id: 'scenes', name: 'Scenes' },
      ]},
      { id: 'satire', name: 'Satire', subcategories: [
        { id: 'political', name: 'Political' },
        { id: 'social', name: 'Social' },
      ]},
      { id: 'parody', name: 'Parody', subcategories: [
        { id: 'music', name: 'Music Parody' },
        { id: 'movie', name: 'Movie Parody' },
      ]},
    ],
    destination: "Comedy Page"
  },
  news: {
    id: "news",
    name: "News & Politics",
    icon: Video,
    description: "Upload news segments, political discussions, and current events analysis.",
    acceptedTypes: "video/*,audio/*,.mp4,.mov,.webm,.mp3,.wav",
    supportedFormats: ['MP4', 'MOV', 'WebM', 'MP3', 'WAV'],
    maxSize: "2GB",
    categories: [
      { id: 'daily', name: 'Daily News', subcategories: [
        { id: 'morning', name: 'Morning Briefing' },
        { id: 'evening', name: 'Evening Recap' },
      ]},
      { id: 'politics', name: 'Politics', subcategories: [
        { id: 'domestic', name: 'Domestic' },
        { id: 'international', name: 'International' },
      ]},
      { id: 'business', name: 'Business News', subcategories: [
        { id: 'market', name: 'Market Updates' },
        { id: 'economy', name: 'Economy' },
      ]},
      { id: 'analysis', name: 'Analysis', subcategories: [
        { id: 'commentary', name: 'Commentary' },
        { id: 'interviews', name: 'Interviews' },
      ]},
    ],
    destination: "News & Politics Page"
  },
};
