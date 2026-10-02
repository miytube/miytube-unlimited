import { useCallback, useEffect, useRef, useState } from 'react';
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
} from '@heygen/streaming-avatar';
import { supabase } from '@/integrations/supabase/client';

export type AvatarStatus = 'idle' | 'connecting' | 'connected' | 'unavailable';

const AVATAR_ID = 'Gala_sitting_office_front';

/**
 * Manages a HeyGen streaming avatar session for The Room.
 * Falls back to `unavailable` (text-only mode) when no HeyGen key is
 * configured or the session cannot start — the room keeps working either way.
 */
export const useHeyGenAvatar = () => {
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<AvatarStatus>('idle');

  const stopAvatar = useCallback(async () => {
    const avatar = avatarRef.current;
    avatarRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus('idle');
    if (avatar) {
      try {
        await avatar.stopAvatar();
      } catch {
        // session may already be closed
      }
    }
  }, []);

  const startAvatar = useCallback(async (): Promise<boolean> => {
    if (avatarRef.current) return true;
    setStatus('connecting');
    try {
      const env = (import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined)?.startsWith('pk_live_') ? 'live' : 'sandbox';
      const { data, error } = await supabase.functions.invoke(`the-room-avatar-token?env=${env}`);
      if (error || !data?.token) {
        setStatus('unavailable');
        return false;
      }

      const avatar = new StreamingAvatar({ token: data.token });
      avatarRef.current = avatar;

      avatar.on(StreamingEvents.STREAM_READY, (event) => {
        if (videoRef.current && event.detail) {
          videoRef.current.srcObject = event.detail;
          videoRef.current.play().catch(() => undefined);
        }
        setStatus('connected');
      });
      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        if (videoRef.current) videoRef.current.srcObject = null;
        avatarRef.current = null;
        setStatus('idle');
      });

      await avatar.createStartAvatar({
        avatarName: AVATAR_ID,
        quality: AvatarQuality.High,
      });
      return true;
    } catch (err) {
      console.warn('HeyGen avatar failed to start, falling back to text-only:', err);
      avatarRef.current = null;
      setStatus('unavailable');
      return false;
    }
  }, []);

  const speak = useCallback(async (text: string) => {
    const avatar = avatarRef.current;
    if (!avatar || !text.trim()) return;
    try {
      await avatar.speak({ text, taskType: TaskType.REPEAT });
    } catch (err) {
      console.warn('HeyGen speak failed:', err);
    }
  }, []);

  useEffect(() => () => { void stopAvatar(); }, [stopAvatar]);

  return { videoRef, status, startAvatar, stopAvatar, speak };
};
