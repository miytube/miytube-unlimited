
import { Dumbbell } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const fitnessSubcategories: SubcategoryMapping = {
  // Physical Fitness subcategories
  'fitness-weight-lifting': {
    title: 'Weight Lifting',
    description: 'Weight lifting videos, pranks, and amazing feats',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Physical Fitness' }
  },
  'fitness-weightlifting-female': {
    title: 'Weightlifting Female',
    description: 'Female weightlifting and inspiration',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Physical Fitness' }
  },
  'fitness-weightlifting-male': {
    title: 'Weightlifting Male',
    description: 'Male weightlifting and training',
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
    description: 'Workout videos, weightlifting and fitness',
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
    description: 'General workout and fitness training',
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