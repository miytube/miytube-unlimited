
import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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

  // Check if input matches any existing option
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
      <PopoverContent className="w-full p-0 bg-popover border z-50" align="start">
        <Command>
          <CommandInput 
            placeholder={`Search or type to add...`}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              <div className="p-2 text-center">
                <p className="text-sm text-muted-foreground mb-2">{emptyText}</p>
                {inputValue.trim() && !exactMatch && (
                  <Button
                    size="sm"
                    onClick={handleAddCustom}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add "{inputValue.trim()}"
                  </Button>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => {
                    onValueChange(option.id);
                    setOpen(false);
                    setInputValue('');
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
              {inputValue.trim() && !exactMatch && filteredOptions.length > 0 && (
                <CommandItem
                  value={`add-${inputValue}`}
                  onSelect={handleAddCustom}
                  className="text-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add "{inputValue.trim()}" as new category
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
