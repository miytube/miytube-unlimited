// Free tier host voice: the browser's built-in speech, no server cost.
export function speakFreeVoice(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const clean = text.replace(/\*\(.*?\)\*/g, '').trim();
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
