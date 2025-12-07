import React from 'react';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangeFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

type PresetKey = 'last7' | 'last30' | 'last90' | 'thisMonth' | 'lastMonth' | 'allTime' | 'custom';

const presets: { key: PresetKey; label: string }[] = [
  { key: 'last7', label: 'Last 7 days' },
  { key: 'last30', label: 'Last 30 days' },
  { key: 'last90', label: 'Last 90 days' },
  { key: 'thisMonth', label: 'This month' },
  { key: 'lastMonth', label: 'Last month' },
  { key: 'allTime', label: 'All time' },
  { key: 'custom', label: 'Custom range' },
];

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateRange,
  onDateRangeChange,
}) => {
  const [selectedPreset, setSelectedPreset] = React.useState<PresetKey>('last30');
  const [isCustomOpen, setIsCustomOpen] = React.useState(false);

  const handlePresetChange = (preset: PresetKey) => {
    setSelectedPreset(preset);
    const today = new Date();
    
    switch (preset) {
      case 'last7':
        onDateRangeChange({ from: subDays(today, 7), to: today });
        break;
      case 'last30':
        onDateRangeChange({ from: subDays(today, 30), to: today });
        break;
      case 'last90':
        onDateRangeChange({ from: subDays(today, 90), to: today });
        break;
      case 'thisMonth':
        onDateRangeChange({ from: startOfMonth(today), to: today });
        break;
      case 'lastMonth':
        const lastMonth = subMonths(today, 1);
        onDateRangeChange({ from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) });
        break;
      case 'allTime':
        onDateRangeChange({ from: undefined, to: undefined });
        break;
      case 'custom':
        setIsCustomOpen(true);
        break;
    }
  };

  const formatDateRange = () => {
    if (!dateRange.from && !dateRange.to) {
      return 'All time';
    }
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
    }
    if (dateRange.from) {
      return `From ${format(dateRange.from, 'MMM d, yyyy')}`;
    }
    return 'Select date range';
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <Select value={selectedPreset} onValueChange={(value) => handlePresetChange(value as PresetKey)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.key} value={preset.key}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedPreset === 'custom' && (
        <div className="flex gap-2">
          <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? format(dateRange.from, 'MMM d, yyyy') : 'Start date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => {
                  onDateRangeChange({ ...dateRange, from: date });
                }}
                disabled={(date) => date > new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange.to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? format(dateRange.to, 'MMM d, yyyy') : 'End date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) => {
                  onDateRangeChange({ ...dateRange, to: date });
                }}
                disabled={(date) => 
                  date > new Date() || (dateRange.from ? date < dateRange.from : false)
                }
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      <span className="text-sm text-muted-foreground hidden md:inline">
        {formatDateRange()}
      </span>
    </div>
  );
};