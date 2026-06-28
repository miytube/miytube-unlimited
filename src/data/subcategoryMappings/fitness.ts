
import { Dumbbell } from 'lucide-react';
import { SubcategoryMapping } from './types';

const physicalFitnessParent = { route: '/physical-fitness', name: 'Physical Fitness' };

const physicalFitnessEntries: SubcategoryMapping = {
  'fitness-weight-lifting': { title: 'Weight Lifting', description: 'Weight lifting videos, pranks, and amazing feats', icon: Dumbbell, parent: physicalFitnessParent },
  'fitness-weightlifting-female': { title: 'Weightlifting Female', description: 'Female weightlifting and inspiration', icon: Dumbbell, parent: physicalFitnessParent },
  'fitness-weightlifting-male': { title: 'Weightlifting Male', description: 'Male weightlifting and training', icon: Dumbbell, parent: physicalFitnessParent },
  'fitness-workers': { title: 'Workers', description: 'Amazing workers, great things and physical feats', icon: Dumbbell, parent: physicalFitnessParent },
  'fitness-workout': { title: 'Workout', description: 'Workout videos, weightlifting and fitness', icon: Dumbbell, parent: physicalFitnessParent },
  'fitness-workout-female': { title: 'Workout Female', description: 'Female workout routines and fitness inspiration', icon: Dumbbell, parent: physicalFitnessParent },
  'fitness-workout-fitness': { title: 'Workout Fitness', description: 'General workout and fitness training', icon: Dumbbell, parent: physicalFitnessParent },
  'fitness-workout-male': { title: 'Workout Male', description: 'Male workout routines and fitness training', icon: Dumbbell, parent: physicalFitnessParent },
  'fitness-yoga-workout': { title: 'Yoga Workout', description: 'Yoga workout routines and flexibility training', icon: Dumbbell, parent: physicalFitnessParent },
  'fitness-calisthenics': { title: 'Calisthenics Workout', description: 'Bodyweight exercises, street workouts and calisthenics training', icon: Dumbbell, parent: physicalFitnessParent },
};

// Also expose under full path keys so useSubcategoryInfo recognizes routes like
// /physical-fitness/weight-lifting (which would otherwise redirect back to the parent).
const physicalFitnessPathAliases: SubcategoryMapping = {
  '/physical-fitness/weight-lifting': physicalFitnessEntries['fitness-weight-lifting'],
  '/physical-fitness/weightlifting-female': physicalFitnessEntries['fitness-weightlifting-female'],
  '/physical-fitness/weightlifting-male': physicalFitnessEntries['fitness-weightlifting-male'],
  '/physical-fitness/workers': physicalFitnessEntries['fitness-workers'],
  '/physical-fitness/workout': physicalFitnessEntries['fitness-workout'],
  '/physical-fitness/workout-female': physicalFitnessEntries['fitness-workout-female'],
  '/physical-fitness/workout-fitness': physicalFitnessEntries['fitness-workout-fitness'],
  '/physical-fitness/workout-male': physicalFitnessEntries['fitness-workout-male'],
  '/physical-fitness/yoga-workout': physicalFitnessEntries['fitness-yoga-workout'],
  '/physical-fitness/calisthenics': physicalFitnessEntries['fitness-calisthenics'],
};

export const fitnessSubcategories: SubcategoryMapping = {
  ...physicalFitnessEntries,
  ...physicalFitnessPathAliases,
};