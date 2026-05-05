import { SubcategoryMapping } from './types';
import { Mic, MessageSquare, BookOpen, Heart, Users, Quote, Smile, Wrench, Scale, Megaphone, Hand } from 'lucide-react';

const parent = { route: '/speeches', name: 'Speeches' };

export const speechesSubcategories: SubcategoryMapping = {
  'speeches/informative': { title: 'Informative Speech', description: 'Educate — share knowledge and facts', icon: MessageSquare, parent },
  'speeches/motivational': { title: 'Motivational Speech', description: 'Inspire — uplift and energize', icon: Mic, parent },
  'speeches/entertaining': { title: 'Entertaining Speech', description: 'Amuse — engage with humor and stories', icon: Smile, parent },
  'speeches/persuasive': { title: 'Persuasive Speech', description: 'Convince — sway opinions and beliefs', icon: Users, parent },
  'speeches/commencement': { title: 'Commencement Speech', description: 'Celebratory — graduation addresses', icon: BookOpen, parent },
  'speeches/eulogy': { title: 'Eulogy or Funeral Speech', description: 'Honor — tributes and memorials', icon: Heart, parent },
  'speeches/demonstrative': { title: 'Demonstrative Speech', description: 'Teach — how-to and demonstrations', icon: Wrench, parent },
  'speeches/debate': { title: 'Debate Speech', description: 'Rules-based discussion about a subject', icon: Scale, parent },
  'speeches/pitch': { title: 'Pitch Speech', description: 'Support or approval of an idea', icon: Megaphone, parent },
  'speeches/farewell': { title: 'Farewell Speech', description: 'Goodbyes and leaving', icon: Hand, parent },
  'speeches/quotes-poems': { title: 'Quotes, Poems, Statements', description: 'Famous quotes, poetry, and statements', icon: Quote, parent },
};
