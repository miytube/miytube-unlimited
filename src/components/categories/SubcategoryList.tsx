
import React from 'react';
import { Minus } from 'lucide-react';
import { SubCategory } from './types';

interface SubcategoryListProps {
  subcategories: SubCategory[];
  onRemoveSubcategory: (subcategoryId: string) => void;
}

export const SubcategoryList: React.FC<SubcategoryListProps> = ({
  subcategories,
  onRemoveSubcategory,
}) => {
  if (subcategories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No subcategories yet. Add some using the button above.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {subcategories.map((subcategory) => (
        <li
          key={subcategory.id}
          className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-md"
        >
          <span>{subcategory.name}</span>
          <button
            onClick={() => onRemoveSubcategory(subcategory.id)}
            className="text-destructive hover:text-destructive/90"
          >
            <Minus size={16} />
          </button>
        </li>
      ))}
    </ul>
  );
};
