import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const generateSessionId = (): string => {
  const stored = sessionStorage.getItem('analytics_session_id');
  if (stored) return stored;
  
  const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('analytics_session_id', newId);
  return newId;
};

const getClientIp = async (): Promise<string> => {
  try {
    const { data } = await supabase.functions.invoke('get-client-ip');
    return data?.ip || 'unknown';
  } catch {
    return 'unknown';
  }
};

export const useAnalyticsTracking = () => {
  const location = useLocation();
  const { user } = useAuth();
  const sessionIdRef = useRef<string>(generateSessionId());
  const lastPathRef = useRef<string>('');

  useEffect(() => {
    const trackPageView = async () => {
      // Don't track same path twice in a row
      if (lastPathRef.current === location.pathname) return;
      lastPathRef.current = location.pathname;

      const visitorIp = await getClientIp();

      // Record page view
      await supabase.from('page_views').insert({
        page_path: location.pathname,
        visitor_ip: visitorIp,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        session_id: sessionIdRef.current,
        user_id: user?.id || null,
      });

      // Update active session
      const { error } = await supabase
        .from('active_sessions')
        .upsert({
          session_id: sessionIdRef.current,
          visitor_ip: visitorIp,
          current_page: location.pathname,
          user_id: user?.id || null,
          last_active_at: new Date().toISOString(),
        }, { onConflict: 'session_id' });

      if (error) {
        console.error('Error updating active session:', error);
      }
    };

    trackPageView();

    // Heartbeat to keep session active
    const heartbeat = setInterval(async () => {
      await supabase
        .from('active_sessions')
        .update({ last_active_at: new Date().toISOString() })
        .eq('session_id', sessionIdRef.current);
    }, 30000); // Every 30 seconds

    // Cleanup session on unmount/close
    const cleanup = async () => {
      await supabase
        .from('active_sessions')
        .delete()
        .eq('session_id', sessionIdRef.current);
    };

    window.addEventListener('beforeunload', cleanup);

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [location.pathname, user?.id]);
};
