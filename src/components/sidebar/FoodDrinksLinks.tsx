
import React from 'react';
import { Utensils, Pizza, Wine, ChefHat, Apple, Cake } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const FoodDrinksLinks: React.FC = () => {
  const foodDrinksLinks = [
    { 
      id: 'foods', 
      icon: Pizza, 
      label: 'Foods', 
      path: '/foods',
      subItems: [
        { id: 'foods-tuna', label: 'Blue Tuna & Cutting', path: '/foods/tuna' },
        { id: 'foods-cooking', label: 'Cooking & Making', path: '/foods/cooking' },
        { id: 'foods-seafood', label: 'Crab & Shrimp', path: '/foods/seafood' },
        { id: 'foods-dieting', label: 'Dieting & Weight Loss', path: '/foods/dieting' },
        { id: 'foods-fruits', label: 'Fruits & Vegetables', path: '/foods/fruits' },
        { id: 'foods-weight-gain', label: 'Gain Weight', path: '/foods/weight-gain' },
        { id: 'foods-sweets', label: 'Sweets & Cakes', path: '/foods/sweets' },
        { id: 'foods-harvest', label: 'Harvest Foods', path: '/foods/harvest' },
        { id: 'foods-healthy', label: 'Healthy Cooking', path: '/foods/healthy' }
      ]
    },
    { 
      id: 'drinks', 
      icon: Wine, 
      label: 'Drinks', 
      path: '/drinks',
      subItems: [
        { id: 'drinks-alcohol', label: 'Alcohol', path: '/drinks/alcohol' },
        { id: 'drinks-non-alcohol', label: 'Non-Alcohol', path: '/drinks/non-alcohol' }
      ]
    },
    { 
      id: 'restaurants', 
      icon: Utensils, 
      label: 'Restaurants', 
      path: '/restaurants',
      subItems: [
        { id: 'restaurants-fine-dining', label: 'Fine Dining', path: '/restaurants/fine-dining' },
        { id: 'restaurants-fast-food', label: 'Fast Food', path: '/restaurants/fast-food' },
        { id: 'restaurants-reviews', label: 'Restaurant Reviews', path: '/restaurants/reviews' },
        { id: 'restaurants-celebrity-chefs', label: 'Celebrity Chefs', path: '/restaurants/celebrity-chefs' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="FOOD & DRINKS" links={foodDrinksLinks} />;
};
