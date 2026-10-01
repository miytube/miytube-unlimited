import { useCallback, useEffect, useRef, useState } from 'react';

/** Browser speech-to-text for The Room. Free, runs locally; unsupported browsers hide the mic. */
export const useSpeechInput = (onText: (text: string) => void) => {
  const recRef = useRef<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const Ctor = typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : undefined;
  const supported = !!Ctor;
  const onTextRef = useRef(onText);
  onTextRef.current = onText;

  const stop = useCallback(() => {
    recRef.current?.stop();
    recRef.current = null;
    setIsRecording(false);
  }, []);

  const start = useCallback(() => {
    if (!Ctor || recRef.current) return;
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = navigator.language || 'en-US';
    rec.onresult = (e: any) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      onTextRef.current(text.trim());
    };
    rec.onerror = () => stop();
    rec.onend = () => { recRef.current = null; setIsRecording(false); };
    recRef.current = rec;
    try { rec.start(); setIsRecording(true); } catch { stop(); }
  }, [Ctor, stop]);

  useEffect(() => () => recRef.current?.stop(), []);

  return { supported, isRecording, start, stop, toggle: () => (isRecording ? stop() : start()) };
};
