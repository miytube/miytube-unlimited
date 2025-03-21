
import { Dumbbell } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const fitnessSubcategories: SubcategoryMapping = {
  // Fitness subcategories
  'fitness-calisthenics': {
    title: 'Calisthenics Workout',
    description: 'Bodyweight exercises, street workouts and calisthenics training',
    icon: Dumbbell,
    parent: { route: '/fitness', name: 'Fitness' }
  },
};
