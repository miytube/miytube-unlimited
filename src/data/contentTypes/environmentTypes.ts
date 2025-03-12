
import { Waves, AlertTriangle } from 'lucide-react';
import { ContentType } from '@/types/upload';

export const environmentContentTypes: Record<string, ContentType> = {
  oceans: {
    id: "oceans",
    name: "Oceans",
    icon: Waves,
    description: "Upload ocean sounds, marine life footage, and underwater content.",
    acceptedTypes: "video/*,audio/*,.mp4,.mov,.webm,.mp3,.wav",
    supportedFormats: ['MP4', 'MOV', 'WebM', 'MP3', 'WAV'],
    maxSize: "2GB",
    categories: [
      { id: 'waves', name: 'Waves', subcategories: [
        { id: 'beach', name: 'Beach' },
        { id: 'reef', name: 'Reef' },
        { id: 'coast', name: 'Coastline' },
      ]},
      { id: 'marine-life', name: 'Marine Life', subcategories: [
        { id: 'fish', name: 'Fish' },
        { id: 'mammals', name: 'Marine Mammals' },
        { id: 'coral', name: 'Coral Reefs' },
      ]},
      { id: 'underwater', name: 'Underwater', subcategories: [
        { id: 'diving', name: 'Diving' },
        { id: 'exploration', name: 'Exploration' },
      ]},
      { id: 'boats', name: 'Boating', subcategories: [
        { id: 'sailing', name: 'Sailing' },
        { id: 'cruising', name: 'Cruising' },
      ]},
    ],
    destination: "Oceans Page"
  },
  disasters: {
    id: "disasters",
    name: "Disasters",
    icon: AlertTriangle,
    description: "Upload footage of natural disasters, emergency response, and safety information.",
    acceptedTypes: "video/*,audio/*,.mp4,.mov,.webm,.mp3,.wav",
    supportedFormats: ['MP4', 'MOV', 'WebM', 'MP3', 'WAV'],
    maxSize: "2GB",
    categories: [
      { id: 'natural', name: 'Natural Disasters', subcategories: [
        { id: 'earthquakes', name: 'Earthquakes' },
        { id: 'floods', name: 'Floods' },
        { id: 'wildfires', name: 'Wildfires' },
        { id: 'volcanic', name: 'Volcanic Eruptions' },
      ]},
      { id: 'response', name: 'Emergency Response', subcategories: [
        { id: 'rescue', name: 'Rescue Operations' },
        { id: 'relief', name: 'Relief Efforts' },
      ]},
      { id: 'preparation', name: 'Preparation', subcategories: [
        { id: 'drills', name: 'Drills' },
        { id: 'planning', name: 'Planning' },
      ]},
      { id: 'recovery', name: 'Recovery', subcategories: [
        { id: 'rebuilding', name: 'Rebuilding' },
        { id: 'community', name: 'Community Support' },
      ]},
    ],
    destination: "Disasters Page"
  },
};
