import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Vignette / wallpaper takeover ad — renders behind page content
 * in the left/right gutters, ESPN-style.
 *
 * Rules:
 *  - Hidden on the actual video player (/watch) and /watchlist
 *  - Up to 3 impressions per browser session
 *  - Desktop-only (needs ≥1280px viewport so gutters are visible)
 *  - Image OR muted/looping video background
 *  - No close button — it IS the page background
 */

const SESSION_KEY = "miytube:vignette:impressions";
const SESSION_AD_KEY = "miytube:vignette:current";
const MAX_IMPRESSIONS_PER_SESSION = 3;
// Layout: 240px sidebar + 1400px max content column. Gutters appear above ~1640px.
const MIN_VIEWPORT_WIDTH = 1640;

type VignetteCampaign = {
  id: string;
  business_name: string;
  headline: string;
  destination_url: string;
  media_url: string | null;
  thumbnail_url: string | null;
};

const isVideo = (url: string) =>
  /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);

const isExcludedRoute = (pathname: string) => {
  // Hide on the actual video player and the user's watchlist
  if (pathname === "/watch" || pathname.startsWith("/watch?")) return true;
  if (pathname.startsWith("/watchlist")) return true;
  // Hide on auth + admin
  if (pathname.startsWith("/auth")) return true;
  if (pathname.startsWith("/admin")) return true;
  return false;
};

export const VignetteAd = () => {
  const location = useLocation();
  const [ad, setAd] = useState<VignetteCampaign | null>(null);
  const [viewportOk, setViewportOk] = useState(
    typeof window !== "undefined" ? window.innerWidth >= MIN_VIEWPORT_WIDTH : false
  );

  const excluded = useMemo(() => isExcludedRoute(location.pathname), [location.pathname]);

  // Track viewport size — vignette only shows when there are visible gutters
  useEffect(() => {
    const onResize = () => setViewportOk(window.innerWidth >= MIN_VIEWPORT_WIDTH);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Pick + cache a vignette ad for the session
  useEffect(() => {
    if (excluded || !viewportOk) return;

    let cancelled = false;

    (async () => {
      // Re-use the same ad already chosen this session (so all 3 impressions are the same advertiser)
      const cached = sessionStorage.getItem(SESSION_AD_KEY);
      if (cached) {
        try {
          setAd(JSON.parse(cached));
          return;
        } catch {
          /* fall through to fetch */
        }
      }

      const { data, error } = await supabase
        .from("ad_campaigns")
        .select("id, business_name, headline, destination_url, media_url, thumbnail_url")
        .eq("ad_format", "vignette" as any)
        .eq("status", "active" as any)
        .eq("payment_status", "paid")
        .limit(20);

      if (cancelled || error || !data || data.length === 0) return;

      const eligible = data.filter((c) => c.media_url || c.thumbnail_url);
      if (eligible.length === 0) return;

      const picked = eligible[Math.floor(Math.random() * eligible.length)];
      sessionStorage.setItem(SESSION_AD_KEY, JSON.stringify(picked));
      setAd(picked);
    })();

    return () => {
      cancelled = true;
    };
  }, [excluded, viewportOk]);

  // Track impression on each route the ad shows on, capped at MAX
  useEffect(() => {
    if (!ad || excluded || !viewportOk) return;

    const count = Number(sessionStorage.getItem(SESSION_KEY) || "0");
    if (count >= MAX_IMPRESSIONS_PER_SESSION) {
      setAd(null);
      return;
    }
    sessionStorage.setItem(SESSION_KEY, String(count + 1));

    // Fire-and-forget impression tracking
    supabase
      .rpc as any; // no-op typing
    supabase
      .from("ad_campaigns")
      .select("impressions")
      .eq("id", ad.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        supabase
          .from("ad_campaigns")
          .update({ impressions: (data.impressions || 0) + 1 })
          .eq("id", ad.id)
          .then(() => {});
      });
  }, [ad, location.pathname, excluded, viewportOk]);

  // Toggle <html class="vignette-active"> so global CSS makes the body transparent
  const isShowing = !!ad && !excluded && viewportOk;
  useEffect(() => {
    const root = document.documentElement;
    if (isShowing) root.classList.add("vignette-active");
    else root.classList.remove("vignette-active");
    return () => root.classList.remove("vignette-active");
  }, [isShowing]);

  if (!isShowing) return null;

  const mediaUrl = ad.media_url || ad.thumbnail_url!;
  const handleClick = () => {
    // Track click
    supabase
      .from("ad_campaigns")
      .select("clicks")
      .eq("id", ad.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        supabase
          .from("ad_campaigns")
          .update({ clicks: (data.clicks || 0) + 1 })
          .eq("id", ad.id)
          .then(() => {});
      });
    window.open(ad.destination_url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      aria-hidden="false"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Background media fills the whole viewport */}
      {isVideo(mediaUrl) ? (
        <video
          src={mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          className="pointer-events-auto absolute inset-0 h-full w-full cursor-pointer object-cover"
          onClick={handleClick}
          aria-label={`Advertisement: ${ad.business_name}`}
        />
      ) : (
        <button
          type="button"
          onClick={handleClick}
          aria-label={`Advertisement: ${ad.business_name} — ${ad.headline}`}
          className="pointer-events-auto absolute inset-0 h-full w-full cursor-pointer border-0 bg-cover bg-center bg-no-repeat p-0"
          style={{ backgroundImage: `url(${mediaUrl})` }}
        />
      )}

      {/* Subtle "Ad" label so users know it's sponsored */}
      <div className="pointer-events-none absolute left-3 top-3 rounded bg-background/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
        Ad · {ad.business_name}
      </div>
    </div>
  );
};

export default VignetteAd;
