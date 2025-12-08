import { Utensils, Salad, Apple, Cookie, Scale } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const foodsSubcategories: SubcategoryMapping = {
  'foods-general': {
    title: 'Foods',
    description: 'Various types of foods and cuisine',
    icon: Utensils,
    parent: {
      route: '/foods',
      name: 'Foods'
    }
  },
  'foods-cooking': {
    title: 'Cooking & Food Preparation',
    description: 'Cooking techniques and food preparation',
    icon: Utensils,
    parent: {
      route: '/foods',
      name: 'Foods'
    }
  },
  'foods-dieting': {
    title: 'Dieting & Weight Loss',
    description: 'Dieting, nutrition, and weight loss',
    icon: Scale,
    parent: {
      route: '/foods',
      name: 'Foods'
    }
  },
  'foods-fruits-vegetables': {
    title: 'Fruits & Vegetables',
    description: 'Fruits, vegetables, and produce',
    icon: Apple,
    parent: {
      route: '/foods',
      name: 'Foods'
    }
  },
  'foods-gain-weight': {
    title: 'Weight Gain',
    description: 'Nutrition for weight gain and muscle building',
    icon: Scale,
    parent: {
      route: '/foods',
      name: 'Foods'
    }
  },
  'foods-sweets': {
    title: 'Sweets & Desserts',
    description: 'Cakes, desserts, and sweet foods',
    icon: Cookie,
    parent: {
      route: '/foods',
      name: 'Foods'
    }
  },
  'foods-harvest': {
    title: 'Harvest Foods',
    description: 'Harvested foods, seasonal produce, and farming',
    icon: Salad,
    parent: {
      route: '/foods',
      name: 'Foods'
    }
  }
};