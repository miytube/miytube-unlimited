// Maya's voice: ElevenLabs server-side TTS when configured, browser speech as fallback.
// The ElevenLabs key lives only in the edge function; when it's missing the
// endpoint returns 503 voice_not_configured and we fall back to the browser voice.

let currentAudio: HTMLAudioElement | null = null;

function stripStageDirections(text: string) {
  return text.replace(/\*\(.*?\)\*/g, '').trim();
}

export async function speakMayaVoice(text: string): Promise<void> {
  const clean = stripStageDirections(text);
  if (!clean) return;

  stopMayaVoice();

  try {
    const { data: session } = await (async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        return await supabase.auth.getSession();
      } catch {
        return { data: { session: null } };
      }
    })();

    const token = session?.session?.access_token;
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/the-room-voice`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY }),
        },
        body: JSON.stringify({ text: clean }),
      }
    );

    if (!response.ok) throw new Error(`voice endpoint ${response.status}`);

    const blob = await response.blob();
    const audio = new Audio(URL.createObjectURL(blob));
    currentAudio = audio;
    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
      URL.revokeObjectURL(audio.src);
    };
    await audio.play();
  } catch {
    // No key configured yet, provider failure, or playback blocked — browser voice.
    speakFreeVoice(clean);
  }
}

export function stopMayaVoice() {
  if (currentAudio) {
    currentAudio.pause();
    if (currentAudio.src.startsWith('blob:')) URL.revokeObjectURL(currentAudio.src);
    currentAudio = null;
  }
  stopFreeVoice();
}

// Free tier host voice: the browser's built-in speech, no server cost.
export function speakFreeVoice(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const clean = stripStageDirections(text);
  if (!clean) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(clean);
  u.rate = 1.0;
  u.pitch = 1.05;
  u.lang = 'en-US';
  const voice = window.speechSynthesis
    .getVoices()
    .find((v) => v.name.includes('Google US English') || v.name.includes('Samantha'));
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}

export function stopFreeVoice() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
}
