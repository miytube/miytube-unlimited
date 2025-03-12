
import { CloudSun, Music } from 'lucide-react';
import { ContentType } from '@/types/upload';

export const relaxationContentTypes: Record<string, ContentType> = {
  meditation: {
    id: "meditation",
    name: "Meditation",
    icon: Music,
    description: "Upload meditation guides, mindfulness sessions, and relaxation audio.",
    acceptedTypes: "audio/*,.mp3,.wav,.ogg,.aac",
    supportedFormats: ['MP3', 'WAV', 'OGG', 'AAC', 'M4A'],
    maxSize: "500MB",
    categories: [
      { id: 'guided', name: 'Guided Meditation', subcategories: [
        { id: 'sleep', name: 'Sleep' },
        { id: 'stress', name: 'Stress Relief' },
        { id: 'mindfulness', name: 'Mindfulness' },
      ]},
      { id: 'music', name: 'Meditation Music', subcategories: [
        { id: 'ambient', name: 'Ambient' },
        { id: 'binaural', name: 'Binaural Beats' },
      ]},
      { id: 'nature', name: 'Nature Sounds', subcategories: [
        { id: 'rain', name: 'Rain' },
        { id: 'forest', name: 'Forest' },
      ]},
      { id: 'breathing', name: 'Breathing Exercises', subcategories: [
        { id: 'deep', name: 'Deep Breathing' },
        { id: 'box', name: 'Box Breathing' },
      ]},
    ],
    destination: "Meditation Page"
  },
  nature: {
    id: "nature",
    name: "Nature Sounds",
    icon: Music,
    description: "Upload recordings of nature sounds, ambient environments, and natural phenomena.",
    acceptedTypes: "audio/*,.mp3,.wav,.ogg,.aac",
    supportedFormats: ['MP3', 'WAV', 'OGG', 'AAC', 'M4A'],
    maxSize: "500MB",
    categories: [
      { id: 'forests', name: 'Forests', subcategories: [
        { id: 'rainforest', name: 'Rainforest' },
        { id: 'pine', name: 'Pine Forest' },
      ]},
      { id: 'water', name: 'Water', subcategories: [
        { id: 'ocean-waves', name: 'Ocean Waves' },
        { id: 'rivers', name: 'Rivers' },
        { id: 'rain', name: 'Rain' },
      ]},
      { id: 'animals', name: 'Animals', subcategories: [
        { id: 'birds', name: 'Birds' },
        { id: 'insects', name: 'Insects' },
      ]},
      { id: 'seasons', name: 'Seasons', subcategories: [
        { id: 'summer', name: 'Summer' },
        { id: 'winter', name: 'Winter' },
      ]},
    ],
    destination: "Nature Sounds Page"
  },
  weather: {
    id: "weather",
    name: "Weather",
    icon: CloudSun,
    description: "Upload weather forecasts, storm tracking, and weather phenomena footage.",
    acceptedTypes: "video/*,audio/*,.mp4,.mov,.webm,.mp3,.wav",
    supportedFormats: ['MP4', 'MOV', 'WebM', 'MP3', 'WAV'],
    maxSize: "2GB",
    categories: [
      { id: 'forecasts', name: 'Forecasts', subcategories: [
        { id: 'daily', name: 'Daily' },
        { id: 'weekly', name: 'Weekly' },
        { id: 'seasonal', name: 'Seasonal' },
      ]},
      { id: 'storms', name: 'Storms', subcategories: [
        { id: 'hurricanes', name: 'Hurricanes' },
        { id: 'tornadoes', name: 'Tornadoes' },
        { id: 'thunderstorms', name: 'Thunderstorms' },
      ]},
      { id: 'phenomena', name: 'Phenomena', subcategories: [
        { id: 'aurora', name: 'Aurora' },
        { id: 'rainbows', name: 'Rainbows' },
        { id: 'fog', name: 'Fog' },
      ]},
      { id: 'climate', name: 'Climate', subcategories: [
        { id: 'change', name: 'Climate Change' },
        { id: 'patterns', name: 'Weather Patterns' },
      ]},
    ],
    destination: "Weather Page"
  },
};
