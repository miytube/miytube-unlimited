import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface WatchlistButtonProps {
  videoId: string;
  videoType?: string;
  variant?: 'icon' | 'full';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const WatchlistButton = ({ 
  videoId, 
  videoType = 'video',
  variant = 'icon',
  size = 'default',
  className 
}: WatchlistButtonProps) => {
  const { user } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist(user?.id);
  
  const inWatchlist = isInWatchlist(videoId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWatchlist(videoId, videoType);
  };

  if (variant === 'full') {
    return (
      <Button
        variant={inWatchlist ? "secondary" : "outline"}
        size={size}
        onClick={handleClick}
        className={cn("gap-2", className)}
      >
        {inWatchlist ? (
          <>
            <BookmarkCheck className="w-4 h-4" />
            In Watchlist
          </>
        ) : (
          <>
            <Bookmark className="w-4 h-4" />
            Add to Watchlist
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={cn(
        "hover:bg-accent",
        inWatchlist && "text-primary",
        className
      )}
      title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
    >
      {inWatchlist ? (
        <BookmarkCheck className="w-5 h-5" />
      ) : (
        <Bookmark className="w-5 h-5" />
      )}
    </Button>
  );
};

export default WatchlistButton;
