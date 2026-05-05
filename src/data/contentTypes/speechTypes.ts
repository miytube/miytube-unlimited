
import { Mic } from 'lucide-react';
import { ContentType } from '@/types/upload';

export const speechContentTypes: Record<string, ContentType> = {
  speech: {
    id: "speech",
    name: "Speech",
    icon: Mic,
    description: "Upload speeches, addresses, quotes, poems, and spoken word content.",
    acceptedTypes: "video/*,audio/*",
    supportedFormats: ['MP4', 'WebM', 'MOV', 'MP3', 'WAV', 'M4A', 'AAC'],
    maxSize: "10GB",
    categories: [
      { id: 'speeches', name: 'Speeches', subcategories: [
        { id: 'informative', name: 'Informative — Educate' },
        { id: 'motivational', name: 'Motivational — Inspire' },
        { id: 'entertaining', name: 'Entertaining — Amuse' },
        { id: 'persuasive', name: 'Persuasive — Convince' },
        { id: 'commencement', name: 'Commencement — Celebratory' },
        { id: 'eulogy', name: 'Eulogy or Funeral — Honor' },
        { id: 'demonstrative', name: 'Demonstrative — Teach' },
        { id: 'debate', name: 'Debate — About a Subject' },
        { id: 'pitch', name: 'Pitch Speech — Support an Idea' },
        { id: 'farewell', name: 'Farewell — Goodbyes' },
        { id: 'quotes-poems', name: 'Quotes, Poems, Statements' },
      ]},
    ],
    destination: "Speeches"
  },
};
