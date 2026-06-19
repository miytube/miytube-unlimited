
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

  // Proper Levenshtein-based similarity for typo detection.
  // Character-set overlap was too permissive (e.g. "how to" vs "tv shows" shared letters).
  const levenshtein = (a: string, b: string): number => {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[a.length][b.length];
  };

  const getSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    if (s1 === s2) return 1;
    if (!s1 || !s2) return 0;
    if (s1.includes(s2) || s2.includes(s1)) return 0.9;
    const dist = levenshtein(s1, s2);
    const maxLen = Math.max(s1.length, s2.length);
    return 1 - dist / maxLen;
  };

  // Filter and sort options based on input with fuzzy matching.
  const filteredOptions = inputValue.trim() === ''
    ? [...options].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      )
    : options
        .map(opt => ({
          ...opt,
          similarity: getSimilarity(opt.name, inputValue),
          includes: opt.name.toLowerCase().includes(inputValue.toLowerCase())
        }))
        .filter(opt => opt.includes || (inputValue.length > 2 && opt.similarity > 0.6))
        .sort((a, b) => b.similarity - a.similarity);

  const exactMatch = options.some(
    opt => opt.name.toLowerCase() === inputValue.toLowerCase()
  );

  // Only suggest typo correction when lengths are close and edit distance is small.
  // Exclude substring matches — "boats" inside "Tugboats" is not a typo.
  const closeMatch = !exactMatch && inputValue.trim().length > 3
    ? options.find(opt => {
        const a = opt.name.toLowerCase().trim();
        const b = inputValue.toLowerCase().trim();
        if (a.includes(b) || b.includes(a)) return false;
        if (Math.abs(a.length - b.length) > 2) return false;
        const dist = levenshtein(a, b);
        return dist > 0 && dist <= 2;
      })
    : null;

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
            
            {/* Show typo suggestion if close match found */}
            {closeMatch && inputValue.trim() && (
              <div className="px-2 py-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-sm mb-1">
                Did you mean "<button 
                  onClick={() => handleSelect(closeMatch.id)}
                  className="font-medium underline hover:no-underline"
                >{closeMatch.name}</button>"?
              </div>
            )}
            
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
