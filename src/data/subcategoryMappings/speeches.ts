import { SubcategoryMapping } from './types';
import { Mic, MessageSquare, BookOpen, Heart, Users, Quote } from 'lucide-react';

export const speechesSubcategories: SubcategoryMapping = {
  'speeches/commencement': {
    title: 'Commencement Speech',
    description: 'Graduation and commencement addresses',
    icon: BookOpen,
    parent: { route: '/speeches', name: 'Speeches' }
  },
  'speeches/eulogy': {
    title: 'Eulogy & Memorial',
    description: 'Memorial speeches and tributes',
    icon: Heart,
    parent: { route: '/speeches', name: 'Speeches' }
  },
  'speeches/informative': {
    title: 'Informative Speech',
    description: 'Educational and informative presentations',
    icon: MessageSquare,
    parent: { route: '/speeches', name: 'Speeches' }
  },
  'speeches/motivational': {
    title: 'Motivational Speech',
    description: 'Inspirational and motivational talks',
    icon: Mic,
    parent: { route: '/speeches', name: 'Speeches' }
  },
  'speeches/persuasive': {
    title: 'Persuasive & Protest',
    description: 'Persuasive speeches and protest addresses',
    icon: Users,
    parent: { route: '/speeches', name: 'Speeches' }
  },
  'speeches/quotes-poems': {
    title: 'Quotes, Poems, Statements',
    description: 'Famous quotes, poetry, and statements',
    icon: Quote,
    parent: { route: '/speeches', name: 'Speeches' }
  },
};
