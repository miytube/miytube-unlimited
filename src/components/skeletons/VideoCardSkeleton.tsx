import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const VideoCardSkeleton: React.FC = () => {
  return (
    <article className="w-full">
      {/* Thumbnail skeleton */}
      <Skeleton className="aspect-video rounded-lg" />
      
      {/* Content skeleton */}
      <div className="mt-2 space-y-2">
        {/* Title */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        
        {/* Channel name */}
        <Skeleton className="h-3 w-1/2 mt-1" />
        
        {/* Views and timestamp */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </article>
  );
};

interface VideoGridSkeletonProps {
  count?: number;
}

export const VideoGridSkeleton: React.FC<VideoGridSkeletonProps> = ({ count = 20 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <VideoCardSkeleton key={index} />
      ))}
    </div>
  );
};
