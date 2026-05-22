import { Link } from 'react-router-dom';
import { Upload, Sparkles } from 'lucide-react';

/**
 * Fallback house ad shown to visitors where Google AdSense is unavailable
 * (e.g. mainland China, where AdSense is blocked by the Great Firewall).
 * Promotes MiyTube itself instead of showing blank ad space.
 */
interface HouseAdProps {
  className?: string;
}

export const HouseAd = ({ className = '' }: HouseAdProps) => {
  return (
    <div
      className={`w-full overflow-hidden rounded-md border border-border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 text-center ${className}`}
      aria-label="MiyTube promotion"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          Welcome to MiyTube · 欢迎来到 MiyTube
        </h3>
        <p className="max-w-md text-sm text-muted-foreground">
          Share your videos with a global audience. Free uploads, no algorithm —
          your content, your way.
          <br />
          <span className="text-xs opacity-80">
            分享您的视频给全球观众。免费上传，无算法推荐。
          </span>
        </p>
        <Link
          to="/upload"
          className="mt-1 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Upload className="h-4 w-4" />
          Upload a video
        </Link>
      </div>
    </div>
  );
};
