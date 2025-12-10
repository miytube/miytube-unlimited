import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ShortCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden bg-card">
      {/* Thumbnail skeleton - 9:16 aspect ratio */}
      <Skeleton className="aspect-[9/16]" />
      
      {/* Content skeleton */}
      <div className="p-3 space-y-2">
        {/* Title */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        
        {/* Creator and views */}
        <div className="flex items-center justify-between mt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
};

interface ShortGridSkeletonProps {
  count?: number;
}

export const ShortGridSkeleton: React.FC<ShortGridSkeletonProps> = ({ count = 20 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <ShortCardSkeleton key={index} />
      ))}
    </div>
  );
};
