
import React, { useState } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryOption {
  id: string;
  name: string;
}

interface CategoryComboboxProps {
  options: CategoryOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  onAddCustom?: (customValue: string) => void;
}

export const CategoryCombobox: React.FC<CategoryComboboxProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  emptyText = "No options found.",
  disabled = false,
  onAddCustom,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const selectedOption = options.find(opt => opt.id === value);
  const displayValue = selectedOption?.name || value || '';

  // Filter options based on input
  const filteredOptions = options.filter(opt =>
    opt.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Check if input matches any existing option exactly
  const exactMatch = options.some(
    opt => opt.name.toLowerCase() === inputValue.toLowerCase()
  );

  const handleAddCustom = () => {
    if (inputValue.trim() && !exactMatch) {
      const customId = inputValue.trim().toLowerCase().replace(/\s+/g, '-');
      onValueChange(customId);
      if (onAddCustom) {
        onAddCustom(inputValue.trim());
      }
      setOpen(false);
      setInputValue('');
    }
  };

  const handleSelect = (optionId: string) => {
    onValueChange(optionId);
    setOpen(false);
    setInputValue('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background border"
          disabled={disabled}
        >
          {displayValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[250px] p-0 bg-popover border z-50" align="start">
        <div className="p-2 border-b">
          <Input
            placeholder="Search or type to add..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="h-9"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue.trim() && !exactMatch) {
                e.preventDefault();
                handleAddCustom();
              }
            }}
          />
        </div>
        
        <ScrollArea className="max-h-[200px]">
          <div className="p-1">
            {filteredOptions.length === 0 && !inputValue.trim() && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyText}
              </div>
            )}
            
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={cn(
                  "flex items-center w-full px-2 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer",
                  value === option.id && "bg-accent"
                )}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.name}
              </button>
            ))}
            
            {/* Always show add option when typing something new */}
            {inputValue.trim() && !exactMatch && (
              <button
                onClick={handleAddCustom}
                className="flex items-center w-full px-2 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer text-primary font-medium"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add "{inputValue.trim()}"
              </button>
            )}
            
            {filteredOptions.length === 0 && inputValue.trim() && exactMatch && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyText}
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
