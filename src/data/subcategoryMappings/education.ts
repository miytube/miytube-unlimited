import { GraduationCap, BookOpen, Stethoscope, HeartPulse, School, Gavel } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const educationSubcategories: SubcategoryMapping = {
  'education-science': {
    title: 'Science Education',
    description: 'Educational content about various scientific disciplines',
    icon: GraduationCap,
    parent: {
      route: '/education',
      name: 'Education'
    }
  },
  'education-math': {
    title: 'Mathematics',
    description: 'Educational content about mathematics and numerical concepts',
    icon: GraduationCap,
    parent: {
      route: '/education',
      name: 'Education'
    }
  },
  'education-history': {
    title: 'History',
    description: 'Educational content about historical events and time periods',
    icon: GraduationCap,
    parent: {
      route: '/education',
      name: 'Education'
    }
  },
  'education-medicine': {
    title: 'Medicine & Medication',
    description: 'Educational content about medicine, pharmaceuticals, and healthcare',
    icon: Stethoscope,
    parent: {
      route: '/education',
      name: 'Education'
    }
  },
  'education-religion': {
    title: 'Religion',
    description: 'Educational content about religious studies and theology',
    icon: BookOpen,
    parent: {
      route: '/education',
      name: 'Education'
    }
  },
  'education-nursing': {
    title: 'Nursing & Healthcare',
    description: 'Educational content about nursing (RN, LVN) and healthcare aides',
    icon: HeartPulse,
    parent: {
      route: '/education',
      name: 'Education'
    }
  },
  'education-learn': {
    title: 'Learning Techniques',
    description: 'Educational content about mastering learning techniques and grasping concepts',
    icon: School,
    parent: {
      route: '/education',
      name: 'Education'
    }
  },
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
  'education-doctor': {
    title: 'Doctor & Medical Practice',
    description: 'Medical practice, patient care and clinical education',
    icon: Stethoscope,
    parent: { route: '/education', name: 'Education' }
  },
  'education-lawyer': {
    title: 'Lawyer & Attorney',
    description: 'Legal practice, court procedures and legal education',
    icon: Gavel,
    parent: { route: '/education', name: 'Education' }
  },
};
