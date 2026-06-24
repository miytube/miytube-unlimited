import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Handles legacy/external URL pattern: /v/:id/:slug
 * Tries to find a matching video by slugified title and redirect to /watch/:id.
 * Falls back to search results if no match is found.
 */
const LegacyVideoRedirect = () => {
  const { slug } = useParams<{ id: string; slug: string }>();
  const [target, setTarget] = useState<string | null>(null);

  const query = (slug || "")
    .replace(/-+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!query) {
        setTarget("/");
        return;
      }

      // Build a few keyword variants for matching
      const cleaned = query
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const tokens = cleaned.split(" ").filter((t) => t.length > 2);
      const topTokens = tokens.slice(0, 6);

      try {
        // Try ILIKE on title with each meaningful token combo
        const orClauses = topTokens
          .map((t) => `title.ilike.%${t}%`)
          .join(",");

        if (orClauses) {
          const { data: musicMatches } = await supabase
            .from("music_videos")
            .select("id,title")
            .or(orClauses)
            .limit(20);

          const { data: vidMatches } = await supabase
            .from("uploaded_videos_public")
            .select("id,title")
            .or(orClauses)
            .limit(20);

          const all = [
            ...(vidMatches || []).map((v: any) => ({ ...v, kind: "video" })),
            ...(musicMatches || []).map((v: any) => ({ ...v, kind: "music" })),
          ];

          if (all.length > 0) {
            // Drop common filler words so a match on "the"/"at"/"show" doesn't win.
            const STOP = new Set([
              "the","and","for","with","into","from","that","this","you","your",
              "are","was","were","has","have","had","but","not","all","any",
              "out","get","got","gets","new","old","one","two","day","show",
              "video","official","feat","ft","vs","at","on","in","of","to",
              "a","an","is","it","by","or",
            ]);
            const meaningful = topTokens.filter(
              (t) => t.length > 3 && !STOP.has(t.toLowerCase())
            );
            // Require at least 60% of meaningful slug words to appear in title
            // (and never fewer than 2). Otherwise fall through to /search.
            const required = Math.max(2, Math.ceil(meaningful.length * 0.6));

            const score = (title: string) => {
              const lower = title.toLowerCase();
              return meaningful.reduce(
                (acc, t) => acc + (lower.includes(t.toLowerCase()) ? 1 : 0),
                0
              );
            };
            all.sort((a: any, b: any) => score(b.title) - score(a.title));
            const best = all[0];
            if (best && score(best.title) >= required && !cancelled) {
              const url =
                best.kind === "music"
                  ? `/watch?id=${best.id}&type=music`
                  : `/watch?v=${best.id}`;
              setTarget(url);
              return;
            }
          }
        }
      } catch (err) {
        console.error("LegacyVideoRedirect lookup failed", err);
      }

      if (!cancelled) {
        setTarget(`/search?q=${encodeURIComponent(query)}`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [query]);

  if (!target) return null;
  return <Navigate to={target} replace />;
};

export default LegacyVideoRedirect;
