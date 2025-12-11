
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
        { id: 'commencement', name: 'Commencement Speech' },
        { id: 'eulogy', name: 'Eulogy & Memorial' },
        { id: 'informative', name: 'Informative Speech' },
        { id: 'motivational', name: 'Motivational Speech' },
        { id: 'persuasive', name: 'Persuasive & Protest' },
        { id: 'quotes-poems', name: 'Quotes, Poems, Statements' },
      ]},
    ],
    destination: "Speeches"
  },
};
