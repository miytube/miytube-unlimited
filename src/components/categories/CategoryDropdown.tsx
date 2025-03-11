
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Minus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SubcategoryList } from './SubcategoryList';
import { useCategoryManagement } from './useCategoryManagement';

export const CategoryDropdown = () => {
  const {
    categories,
    addCategory,
    addSubcategory,
    removeCategory,
    removeSubcategory,
  } = useCategoryManagement();
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddCategory = () => {
    addCategory(newCategoryName);
    setNewCategoryName('');
  };

  const handleAddSubcategory = (categoryId: string) => {
    addSubcategory(categoryId, newSubcategoryName);
    setNewSubcategoryName('');
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
            onClick={handleAddCategory}
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
                      />
                      <button
                        onClick={() => handleAddSubcategory(category.id)}
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
                <SubcategoryList
                  subcategories={category.subcategories}
                  onRemoveSubcategory={(subcategoryId) =>
                    removeSubcategory(category.id, subcategoryId)
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
