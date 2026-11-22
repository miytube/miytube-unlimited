import React from 'react';
import { AvatarFigure } from './AvatarFigure';
import { resolveEquippedItems } from '@/lib/avatar';
import { SavedAvatar, useAvatarCatalog, useSavedAvatars } from '@/hooks/useAvatars';
import { cn } from '@/lib/utils';

interface BubbleProps {
  avatar: SavedAvatar | null | undefined;
  fallback?: React.ReactNode;
  className?: string;
  title?: string;
}

/** Round head-and-shoulders avatar; shows the fallback when none is saved. */
export const AvatarBubble: React.FC<BubbleProps> = ({ avatar, fallback, className, title }) => {
  const catalog = useAvatarCatalog();
  if (!avatar) {
    return <>{fallback ?? null}</>;
  }
  const items = catalog ? resolveEquippedItems(avatar.equipped, catalog) : {};
  return (
    <span className={cn('inline-block overflow-hidden rounded-full bg-secondary ring-1 ring-border', className)}>
      <AvatarFigure config={avatar.config} items={items} crop="head" className="h-full w-full" title={title} />
    </span>
  );
};

/** Convenience wrapper that loads one member's saved avatar. */
export const UserAvatarBubble: React.FC<{ userId: string; fallback?: React.ReactNode; className?: string }> = ({
  userId,
  fallback,
  className,
}) => {
  const avatars = useSavedAvatars([userId]);
  return <AvatarBubble avatar={avatars[userId]} fallback={fallback} className={className} />;
};
