import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { isLikelyBot } from '@/utils/botDetection';

const generateSessionId = (): string => {
  const stored = sessionStorage.getItem('analytics_session_id');
  if (stored) return stored;
  
  const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('analytics_session_id', newId);
  return newId;
};

// Build a Supabase client wrapper that always sends x-session-id so RLS can
// scope active_sessions writes to the caller's own session row.
const sessionScopedRequest = (sessionId: string) =>
  supabase.functions.setAuth ? supabase : supabase; // placeholder for typing

export const useAnalyticsTracking = () => {
  const location = useLocation();
  const { user } = useAuth();
  const sessionIdRef = useRef<string>(generateSessionId());
  const lastPathRef = useRef<string>('');
  const isBotRef = useRef<boolean>(isLikelyBot());
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current user is admin — skip all tracking for admins
  useEffect(() => {
    if (!user?.id) {
      setIsAdmin(false);
      return;
    }
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user?.id]);

  useEffect(() => {
    // Skip all analytics for bots/crawlers — keeps quality signals clean
    // for AdSense (high bounce rate from bots reduces ad fill rate).
    if (isBotRef.current) return;

    // Skip tracking for admin users so owner visits don't inflate stats
    if (isAdmin) return;

    const sessionId = sessionIdRef.current;

    // Helper: a per-call PostgREST request with x-session-id header so RLS
    // policies can verify ownership of the active_sessions row.
    const upsertSession = async (currentPage: string) => {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/active_sessions?on_conflict=session_id`;
      const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || apikey;

      try {
        await fetch(url, {
          method: 'POST',
          headers: {
            'apikey': apikey,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates,return=minimal',
            'x-session-id': sessionId,
          },
          body: JSON.stringify({
            session_id: sessionId,
            current_page: currentPage,
            user_id: user?.id || null,
            last_active_at: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error('Error updating active session:', err);
      }
    };

    const trackPageView = async () => {
      if (lastPathRef.current === location.pathname) return;
      lastPathRef.current = location.pathname;

      // Send page_view to Google Analytics (GA4) on each SPA route change
      // @ts-ignore
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        // @ts-ignore
        (window as any).gtag('event', 'page_view', {
          page_path: location.pathname + location.search,
          page_location: window.location.href,
          page_title: document.title,
        });
      }

      // Record page view (no IP captured client-side anymore)
      await supabase.from('page_views').insert({
        page_path: location.pathname,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        session_id: sessionId,
        user_id: user?.id || null,
      });

      await upsertSession(location.pathname);
    };

    trackPageView();

    // Heartbeat to keep session active
    const heartbeat = setInterval(() => {
      upsertSession(location.pathname);
    }, 30000);

    // Cleanup session on unmount/close
    const cleanup = async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/active_sessions?session_id=eq.${encodeURIComponent(sessionId)}`;
        const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token || apikey;
        await fetch(url, {
          method: 'DELETE',
          headers: {
            'apikey': apikey,
            'Authorization': `Bearer ${accessToken}`,
            'x-session-id': sessionId,
          },
          keepalive: true,
        });
      } catch {
        // ignore
      }
    };

    window.addEventListener('beforeunload', cleanup);

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [location.pathname, user?.id, isAdmin]);
};
