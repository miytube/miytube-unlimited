
import React from 'react';
import { Dumbbell, Heart, Activity, Brain, Stethoscope, Apple } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const FitnessHealthLinks: React.FC = () => {
  const fitnessHealthLinks = [
    { 
      id: 'fitness', 
      icon: Dumbbell, 
      label: 'Fitness & Workout', 
      path: '/physical-fitness',
      subItems: [
        { id: 'fitness-calisthenics', label: 'Calisthenics Workout', path: '/fitness/calisthenics' },
        { id: 'fitness-weightlifting-prank', label: 'Weight Lifting Pranks', path: '/fitness/weightlifting-prank' },
        { id: 'fitness-weightlifting-female', label: 'Weightlifting Female', path: '/fitness/weightlifting-female' },
        { id: 'fitness-weightlifting-male', label: 'Weightlifting Male', path: '/fitness/weightlifting-male' },
        { id: 'fitness-workout', label: 'Workout & Fitness', path: '/fitness/workout' },
        { id: 'fitness-workout-female', label: 'Workout Female', path: '/fitness/workout-female' },
        { id: 'fitness-workout-male', label: 'Workout Male', path: '/fitness/workout-male' },
        { id: 'fitness-yoga', label: 'Yoga Workout', path: '/fitness/yoga' }
      ]
    },
    { 
      id: 'martial-arts', 
      icon: Activity, 
      label: 'Martial Arts', 
      path: '/martial-arts',
      subItems: [
        { id: 'martial-arts-self-defense', label: 'Self Defense', path: '/martial-arts/self-defense' },
        { id: 'martial-arts-training', label: 'Training', path: '/martial-arts/training' }
      ]
    },
    { 
      id: 'health', 
      icon: Heart, 
      label: 'Health', 
      path: '/health',
      subItems: [
        { id: 'health-reproductive', label: 'Reproductive Systems', path: '/health/reproductive' },
        { id: 'health-mental', label: 'Mental Health', path: '/health/mental' }
      ]
    },
    { 
      id: 'meditation-wellness', 
      icon: Brain, 
      label: 'Meditation', 
      path: '/meditation',
      subItems: [
        { id: 'meditation-guided', label: 'Guided Meditation', path: '/meditation/guided' },
        { id: 'meditation-sleep', label: 'Sleep Meditation', path: '/meditation/sleep' },
        { id: 'meditation-music', label: 'Meditation Music', path: '/music-meditation' },
        { id: 'meditation-nature', label: 'Nature Sounds', path: '/nature-sounds' }
      ]
    },
    { 
      id: 'success', 
      icon: Activity, 
      label: 'Success & Achievement', 
      path: '/success',
      subItems: [
        { id: 'success-achieve', label: 'Achieve Success', path: '/success/achieve' },
        { id: 'success-motivation', label: 'Self-Empowerment', path: '/success/motivation' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="FITNESS & HEALTH" links={fitnessHealthLinks} />;
};
