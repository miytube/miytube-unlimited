import { Utensils, Salad, Apple, Cookie, Scale } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const foodsSubcategories: SubcategoryMapping = {
  'foods-general': {
    title: 'Foods',
    description: 'Content about various types of foods and cuisine',
    icon: Utensils,
    parent: {
      route: '/foods',
      name: 'Foods'
    }
  },
  'foods-cooking': {
    title: 'Cooking & Food Preparation',
    description: 'Content about cooking techniques and food preparation',
    icon: Utensils,
    parent: {
      route: '/foods',
      name: 'Foods'
    }
  },
  'foods-dieting': {
    title: 'Dieting & Weight Loss',
    description: 'Content about dieting, nutrition, and weight loss',
    icon: Scale,
    parent: {
      route: '/foods',
      name: 'Foods'
    }
  },
  'foods-fruits-vegetables': {
    title: 'Fruits & Vegetables',
    description: 'Content about fruits, vegetables, and produce',
    icon: Apple,
    parent: {
      route: '/foods',
      name: 'Foods'
    }
  },
  'foods-gain-weight': {
    title: 'Weight Gain',
    description: 'Content about nutrition for weight gain and muscle building',
    icon: Scale,
    parent: {
      route: '/foods',
      name: 'Foods'
    }
  },
  'foods-sweets': {
    title: 'Sweets & Desserts',
    description: 'Content about cakes, desserts, and sweet foods',
    icon: Cookie,
    parent: {
      route: '/foods',
      name: 'Foods'
    }
  },
  'foods-harvest': {
    title: 'Harvest Foods',
    description: 'Content about harvested foods, seasonal produce, and farming',
    icon: Salad,
    parent: {
      route: '/foods',
      name: 'Foods'
    }
  }
};
