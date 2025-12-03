
import { Dumbbell } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const fitnessSubcategories: SubcategoryMapping = {
  // Physical Fitness subcategories
  'fitness-weight-lifting': {
    title: 'Weight Lifting',
    description: 'Weight lifting videos, pranks, and amazing content',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Physical Fitness' }
  },
  'fitness-weightlifting-female': {
    title: 'Weightlifting Female',
    description: 'Female weightlifting content and inspiration',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Physical Fitness' }
  },
  'fitness-weightlifting-male': {
    title: 'Weightlifting Male',
    description: 'Male weightlifting content and training',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Physical Fitness' }
  },
  'fitness-workers': {
    title: 'Workers',
    description: 'Amazing workers, great things and physical feats',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Physical Fitness' }
  },
  'fitness-workout': {
    title: 'Workout',
    description: 'Workout videos, weightlifting and fitness content',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Physical Fitness' }
  },
  'fitness-workout-female': {
    title: 'Workout Female',
    description: 'Female workout routines and fitness inspiration',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Physical Fitness' }
  },
  'fitness-workout-fitness': {
    title: 'Workout Fitness',
    description: 'General workout and fitness training content',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Physical Fitness' }
  },
  'fitness-workout-male': {
    title: 'Workout Male',
    description: 'Male workout routines and fitness training',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Physical Fitness' }
  },
  'fitness-yoga-workout': {
    title: 'Yoga Workout',
    description: 'Yoga workout routines and flexibility training',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Physical Fitness' }
  },
  'fitness-calisthenics': {
    title: 'Calisthenics Workout',
    description: 'Bodyweight exercises, street workouts and calisthenics training',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Physical Fitness' }
  },
};
