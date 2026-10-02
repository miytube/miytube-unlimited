import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Opt-in split-screen recorder for The Room: AI host (left) + guest webcam (right).
 * Recording stays in the browser and downloads as a .webm file — nothing is uploaded.
 */
export const useRoomRecorder = (avatarVideoRef: React.RefObject<HTMLVideoElement | null>) => {
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const rafRef = useRef<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supported = typeof window !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';

  const cleanup = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (userVideoRef.current) userVideoRef.current.srcObject = null;
    setIsRecording(false);
  }, []);

  const start = useCallback(async (topic: string) => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 720 }, audio: true });
      streamRef.current = stream;
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
        await userVideoRef.current.play().catch(() => undefined);
      }
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d')!;
      const drawCover = (v: HTMLVideoElement, x: number) => {
        const vw = v.videoWidth, vh = v.videoHeight;
        if (!vw || !vh) return false;
        const scale = Math.max(640 / vw, 720 / vh);
        const sw = 640 / scale, sh = 720 / scale;
        ctx.drawImage(v, (vw - sw) / 2, (vh - sh) / 2, sw, sh, x, 0, 640, 720);
        return true;
      };
      const draw = () => {
        ctx.fillStyle = '#0b0c10';
        ctx.fillRect(0, 0, 1280, 720);
        const av = avatarVideoRef.current;
        if (!(av && av.srcObject && drawCover(av, 0))) {
          ctx.fillStyle = '#45f3ff';
          ctx.font = 'bold 40px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Maya · AI Host', 320, 350);
          ctx.font = '22px sans-serif';
          ctx.fillText(topic, 320, 395);
        }
        if (userVideoRef.current) drawCover(userVideoRef.current, 640);
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('MiyTube · The Room', 20, 700);
        rafRef.current = requestAnimationFrame(draw);
      };
      draw();
      const mixed = canvas.captureStream(30);
      stream.getAudioTracks().forEach((t) => mixed.addTrack(t));
      const mime = ['video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'].find((m) => MediaRecorder.isTypeSupported(m)) ?? '';
      const rec = new MediaRecorder(mixed, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data?.size) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        const type = rec.mimeType || 'video/webm';
        const blob = new Blob(chunksRef.current, { type });
        if (blob.size) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `the-room-${topic.replace(/\W+/g, '-').toLowerCase() || 'interview'}.${type.includes('mp4') ? 'mp4' : 'webm'}`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 5000);
        }
      };
      rec.start(1000);
      recorderRef.current = rec;
      setIsRecording(true);
    } catch {
      cleanup();
      setError('Camera or microphone permission was blocked.');
    }
  }, [avatarVideoRef, cleanup]);

  const stop = useCallback(() => {
    const rec = recorderRef.current;
    recorderRef.current = null;
    if (rec && rec.state !== 'inactive') rec.stop();
    cleanup();
  }, [cleanup]);

  useEffect(() => () => {
    const rec = recorderRef.current;
    if (rec && rec.state !== 'inactive') { rec.ondataavailable = null; rec.onstop = null; rec.stop(); }
    cleanup();
  }, [cleanup]);

  return { supported, userVideoRef, isRecording, error, start, stop };
};
