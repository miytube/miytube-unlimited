import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemLabel?: string;
  showItemCount?: boolean;
  scrollToTop?: boolean;
  maxVisiblePages?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemLabel = 'items',
  showItemCount = false,
  scrollToTop = true,
  maxVisiblePages = 5,
}) => {
  const [jumpValue, setJumpValue] = useState('');

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    onPageChange(clamped);
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJump = () => {
    const n = parseInt(jumpValue, 10);
    if (!isNaN(n)) {
      handlePageChange(n);
      setJumpValue('');
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="min-w-[40px]"
        >
          {i}
        </Button>
      );
    }
    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        title="First page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      {renderPageNumbers()}

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        title="Last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1 ml-2">
        <span className="text-xs text-muted-foreground">Go to</span>
        <Input
          type="number"
          min={1}
          max={totalPages}
          value={jumpValue}
          onChange={(e) => setJumpValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleJump(); }}
          placeholder={`1-${totalPages}`}
          className="h-8 w-20 text-sm"
        />
        <Button size="sm" variant="outline" onClick={handleJump}>Go</Button>
      </div>
    </div>
  );
};

// Helper component for page info display
export const PageInfo: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemLabel?: string;
}> = ({ currentPage, totalPages, totalItems, itemLabel = 'items' }) => {
  if (totalPages <= 1) return null;
  
  return (
    <span className="text-muted-foreground text-sm">
      Page {currentPage} of {totalPages} ({totalItems} {itemLabel})
    </span>
  );
};
