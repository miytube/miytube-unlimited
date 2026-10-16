import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Layout } from '@/components/Layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { Play, Volume2, VolumeX, ThumbsUp, MessageCircle, Share, Film, ChevronUp, ChevronDown, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { trackEngagement } from '@/hooks/useTrackEngagement';
import { useVideoViewCounts } from '@/hooks/useVideoViewCounts';

/**
 * Full-screen swipe-up Shorts feed (Instagram Reels style).
 * One short fills the screen; scroll/swipe to the next. Autoplays the
 * visible short, pauses the rest.
 */
const ShortsFeed = () => {
  const { uploadedVideos, isLoading } = useUploadedVideos();
  const shorts = uploadedVideos.filter((v) => v.category === 'shorts');
  const [searchParams] = useSearchParams();
  const startId = searchParams.get('v');
  const jumpedRef = useRef(false);

  // Open the feed at the short the visitor clicked or was sent (?v=<id>)
  useEffect(() => {
    if (jumpedRef.current || !startId || shorts.length === 0) return;
    const el = document.getElementById(`short-${startId}`);
    if (el) {
      jumpedRef.current = true;
      el.scrollIntoView({ behavior: 'auto' });
    }
  }, [startId, shorts.length]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <p className="text-muted-foreground">Loading shorts…</p>
        </div>
      </Layout>
    );
  }

  if (shorts.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-[calc(100vh-80px)] gap-3 text-center px-4">
          <Film className="h-10 w-10 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No shorts yet</h2>
          <p className="text-muted-foreground text-sm">Upload a short and it will appear in the feed here.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="h-[calc(100vh-64px)] overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {shorts.map((short) => (
          <ShortSlide key={short.id} short={short} />
        ))}
      </div>
    </Layout>
  );
};

const ShortSlide: React.FC<{ short: any }> = ({ short }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [userLiked, setUserLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const { viewsFor } = useVideoViewCounts([short.id]);
  const viewsCount = viewsFor(short.id);
  const viewRecordedRef = useRef(false);

  // Load like count, view count + user's like status
  useEffect(() => {
    (async () => {
      const { data: counts } = await supabase.rpc('get_video_like_counts', {
        _video_ids: [short.id],
      });
      setLikesCount(Number((counts || [])[0]?.likes ?? 0));
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: own } = await supabase
          .from('video_likes')
          .select('is_like')
          .eq('video_id', short.id)
          .eq('user_id', user.id)
          .maybeSingle();
        setUserLiked(!!(own && own.is_like));
      }
    })();
  }, [short.id]);

  // Autoplay when visible, pause when scrolled away
  useEffect(() => {
    const el = containerRef.current;
    const vid = videoRef.current;
    if (!el || !vid) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          vid.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          // Count one view per short per visit, the first time it comes on screen
          if (!viewRecordedRef.current) {
            viewRecordedRef.current = true;
            trackEngagement(short.id, 'view');
          }
        } else {
          vid.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isPlaying) {
      vid.pause();
      setIsPlaying(false);
    } else {
      vid.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to like.', variant: 'destructive' });
      return;
    }
    if (userLiked) {
      await supabase.from('video_likes').delete().eq('video_id', short.id).eq('user_id', user.id);
      setUserLiked(false);
      setLikesCount((c) => Math.max(0, c - 1));
    } else {
      const { error } = await supabase
        .from('video_likes')
        .upsert({ video_id: short.id, user_id: user.id, is_like: true }, { onConflict: 'user_id,video_id' });
      if (!error) {
        setUserLiked(true);
        setLikesCount((c) => c + 1);
        trackEngagement(short.id, 'like');
      }
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/shorts/feed?v=${short.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: short.title || 'Short', url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: 'Link copied', description: 'Share link copied to clipboard.' });
      }
      trackEngagement(short.id, 'share');
    } catch {
      /* cancelled */
    }
  };

  const scrollToNeighbor = useCallback((dir: 1 | -1) => {
    const el = containerRef.current;
    if (!el) return;
    const target = dir === 1 ? el.nextElementSibling : el.previousElementSibling;
    target?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const src = short.isCloudStored && short.cloudUrl
    ? short.cloudUrl
    : short.fileDataUrl || undefined;

  return (
    <div
      ref={containerRef}
      id={`short-${short.id}`}
      className="relative h-[calc(100vh-64px)] snap-start flex items-center justify-center bg-black"
    >
      <div className="relative h-full max-h-full aspect-[9/16] max-w-full">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          loop
          playsInline
          muted={isMuted}
          onClick={togglePlay}
        />

        {!isPlaying && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
            onClick={togglePlay}
          >
            <Play className="h-16 w-16 text-white" fill="white" />
          </div>
        )}

        {/* Bottom gradient + info */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-4 right-16 text-white">
          <h3 className="font-semibold text-lg line-clamp-2">{short.title}</h3>
          <div className="flex items-center gap-1.5 mt-1 text-sm opacity-80">
            <Eye className="h-3.5 w-3.5" />
            <span>{viewsCount} view{viewsCount === 1 ? '' : 's'}</span>
          </div>
          {short.description && (
            <p className="text-sm opacity-70 mt-1 line-clamp-2">{short.description}</p>
          )}
        </div>

        {/* Side actions */}
        <div className="absolute right-3 bottom-20 flex flex-col gap-4">
          <button className="flex flex-col items-center text-white" onClick={handleLike} aria-label="Like">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${userLiked ? 'bg-primary' : 'bg-white/20'}`}>
              <ThumbsUp className="h-5 w-5" fill={userLiked ? 'currentColor' : 'none'} />
            </div>
            <span className="text-xs mt-1">{likesCount > 0 ? likesCount : 'Like'}</span>
          </button>
          <button
            className="flex flex-col items-center text-white"
            onClick={() => navigate(`/shorts/${short.id}`)}
            aria-label="Comments"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1">Comment</span>
          </button>
          <button className="flex flex-col items-center text-white" onClick={handleShare} aria-label="Share">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Share className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1">Share</span>
          </button>
          <button className="flex flex-col items-center text-white" onClick={toggleMute} aria-label="Toggle sound">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </div>
            <span className="text-xs mt-1">{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>
        </div>

        {/* Desktop up/down hints */}
        <div className="absolute right-3 top-4 hidden md:flex flex-col gap-2">
          <button
            className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
            onClick={() => scrollToNeighbor(-1)}
            aria-label="Previous short"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          <button
            className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
            onClick={() => scrollToNeighbor(1)}
            aria-label="Next short"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortsFeed;
