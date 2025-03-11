
import { useState } from 'react';
import { Category } from './types';

export const useCategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Entertainment',
      subcategories: [
        { id: '1-1', name: 'Comedy' },
        { id: '1-2', name: 'Drama' },
        { id: '1-3', name: 'Action' },
      ],
    },
    {
      id: '2',
      name: 'Education',
      subcategories: [
        { id: '2-1', name: 'Tutorials' },
        { id: '2-2', name: 'Lectures' },
        { id: '2-3', name: 'How-to Guides' },
      ],
    },
    {
      id: '3',
      name: 'Music',
      subcategories: [
        { id: '3-1', name: 'Pop' },
        { id: '3-2', name: 'Rock' },
        { id: '3-3', name: 'Classical' },
      ],
    },
  ]);

  const addCategory = (newCategoryName: string) => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: `category-${Date.now()}`,
        name: newCategoryName,
        subcategories: [],
      };
      setCategories([...categories, newCategory]);
    }
  };

  const addSubcategory = (categoryId: string, subcategoryName: string) => {
    if (subcategoryName.trim()) {
      setCategories(
        categories.map((category) => {
          if (category.id === categoryId) {
            return {
              ...category,
              subcategories: [
                ...category.subcategories,
                {
                  id: `subcategory-${Date.now()}`,
                  name: subcategoryName,
                },
              ],
            };
          }
          return category;
        })
      );
    }
  };

  const removeCategory = (categoryId: string) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
  };

  const removeSubcategory = (categoryId: string, subcategoryId: string) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            subcategories: category.subcategories.filter(
              (subcategory) => subcategory.id !== subcategoryId
            ),
          };
        }
        return category;
      })
    );
  };

  return {
    categories,
    addCategory,
    addSubcategory,
    removeCategory,
    removeSubcategory,
  };
};
