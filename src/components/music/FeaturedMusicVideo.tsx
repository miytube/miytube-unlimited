import React from 'react';
import { Play, Eye, Heart, Share2, TrendingUp, Sparkles } from 'lucide-react';
import { useFeaturedMusicVideo } from '@/hooks/useFeaturedMusicVideo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

export const FeaturedMusicVideo: React.FC = () => {
  const { featuredVideo, loading, trackView, trackLike, trackShare } = useFeaturedMusicVideo();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Featured Music Video
        </h2>
        <Skeleton className="w-full h-[400px] rounded-xl" />
      </div>
    );
  }

  if (!featuredVideo) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Featured Music Video
        </h2>
        <div className="bg-card rounded-xl p-8 text-center border border-border">
          <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No featured video yet. Upload music to get started!</p>
        </div>
      </div>
    );
  }

  const handlePlay = () => {
    trackView(featuredVideo.id);
    if (featuredVideo.video_url) {
      navigate(`/watch?id=${featuredVideo.id}&type=music`);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackLike(featuredVideo.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackShare(featuredVideo.id);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary" />
        Featured Music Video
      </h2>
      
      <div 
        className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 cursor-pointer group"
        onClick={handlePlay}
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* Thumbnail Section */}
          <div className="relative aspect-video md:aspect-auto md:h-[400px]">
            {featuredVideo.thumbnail_url ? (
              <img 
                src={featuredVideo.thumbnail_url} 
                alt={featuredVideo.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                <Play className="h-20 w-20 text-foreground/50" />
              </div>
            )}
            
            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                <Play className="h-10 w-10 text-primary-foreground fill-current ml-1" />
              </div>
            </div>

            {/* Duration badge */}
            {featuredVideo.duration && (
              <Badge className="absolute bottom-4 right-4 bg-black/70 text-white">
                {featuredVideo.duration}
              </Badge>
            )}
          </div>

          {/* Info Section */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <Badge variant="secondary" className="mb-3">
                <TrendingUp className="h-3 w-3 mr-1" />
                Featured
              </Badge>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-3 line-clamp-2">
                {featuredVideo.title}
              </h3>
              
              {featuredVideo.description && (
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {featuredVideo.description}
                </p>
              )}
              
              {featuredVideo.category && (
                <Badge variant="outline" className="mb-4">
                  {featuredVideo.category}
                </Badge>
              )}
            </div>

            {/* Stats & Actions */}
            <div>
              {/* Analytics Stats */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {featuredVideo.views.toLocaleString()} views
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {featuredVideo.likes.toLocaleString()} likes
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                  {featuredVideo.shares.toLocaleString()} shares
                </span>
              </div>

              {/* Quality Scores */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                <div className="bg-background/50 rounded-lg p-2 text-center">
                  <div className="font-bold text-primary">{featuredVideo.thumbnail_quality_score}%</div>
                  <div className="text-muted-foreground">Thumbnail</div>
                </div>
                <div className="bg-background/50 rounded-lg p-2 text-center">
                  <div className="font-bold text-primary">{featuredVideo.content_clarity_score}%</div>
                  <div className="text-muted-foreground">Clarity</div>
                </div>
                <div className="bg-background/50 rounded-lg p-2 text-center">
                  <div className="font-bold text-primary">{featuredVideo.title_effectiveness_score}%</div>
                  <div className="text-muted-foreground">Title</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button size="lg" className="flex-1" onClick={handlePlay}>
                  <Play className="h-5 w-5 mr-2" />
                  Watch Now
                </Button>
                <Button size="lg" variant="outline" onClick={handleLike}>
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
