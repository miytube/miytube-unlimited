
import { GraduationCap } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const educationSubcategories: SubcategoryMapping = {
  // Education Routes
  'education-anatomy': {
    title: 'Anatomy',
    description: 'Human body structure, function and medical information',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
  'education-countries-history': {
    title: 'Countries & History',
    description: 'National histories, historical events and timeline',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
  'education-immigration': {
    title: 'Immigration',
    description: 'Immigration processes, questions and guidance',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
  'education-geography': {
    title: 'Geography',
    description: 'World geography, maps and geographical features',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
  'education-laws': {
    title: 'Laws & Constitution',
    description: 'Legal education, constitutional principles and rights',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
};
