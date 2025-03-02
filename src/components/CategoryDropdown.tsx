
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Minus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Category {
  id: string;
  name: string;
  subcategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
}

export const CategoryDropdown = () => {
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

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: `category-${Date.now()}`,
        name: newCategoryName,
        subcategories: [],
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
    }
  };

  const addSubcategory = (categoryId: string) => {
    if (newSubcategoryName.trim()) {
      setCategories(
        categories.map((category) => {
          if (category.id === categoryId) {
            return {
              ...category,
              subcategories: [
                ...category.subcategories,
                {
                  id: `subcategory-${Date.now()}`,
                  name: newSubcategoryName,
                },
              ],
            };
          }
          return category;
        })
      );
      setNewSubcategoryName('');
      setActiveCategoryId(null);
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

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Content Categories</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="px-3 py-1 border rounded-md"
          />
          <button
            onClick={addCategory}
            className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="border rounded-md overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-muted/50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {expandedCategories.includes(category.id) ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90">
                      <Plus size={16} /> Subcategory
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 p-2">
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={newSubcategoryName}
                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                        placeholder="New subcategory name"
                        className="w-full px-3 py-1 border rounded-md"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={() => addSubcategory(category.id)}
                        className="w-full flex items-center justify-center gap-1 px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90"
                      >
                        <Plus size={16} /> Add
                      </button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  onClick={() => removeCategory(category.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
                >
                  <Minus size={16} /> Remove
                </button>
              </div>
            </div>

            {expandedCategories.includes(category.id) && (
              <div className="p-3 bg-background border-t">
                {category.subcategories.length > 0 ? (
                  <ul className="space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <li
                        key={subcategory.id}
                        className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-md"
                      >
                        <span>{subcategory.name}</span>
                        <button
                          onClick={() =>
                            removeSubcategory(category.id, subcategory.id)
                          }
                          className="text-destructive hover:text-destructive/90"
                        >
                          <Minus size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No subcategories yet. Add some using the button above.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
