// Ambient score for The Room's cinematic intro.
// Generated live with WebAudio (a slow, warm minor-ish pad) — no audio files,
// loops forever, and fades in/out so the teaser never sits in total silence.

export interface RoomAmbienceHandle {
  start: () => void;
  stop: (fadeOutSeconds?: number) => void;
}

export const createRoomAmbience = (): RoomAmbienceHandle => {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let voices: { osc: OscillatorNode; lfo: OscillatorNode }[] = [];
  let stopTimer: number | null = null;
  let stopped = false;

  const start = () => {
    if (stopped) return;
    const AC: typeof AudioContext | undefined =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;

    if (stopTimer !== null) {
      window.clearTimeout(stopTimer);
      stopTimer = null;
    }

    if (!ctx || !master) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 900;
      filter.Q.value = 0.4;
      master.connect(filter);
      filter.connect(ctx.destination);

      // Warm suspended pad: A2, E3, A3, B3, E4 (A-sus2) — calm, cinematic.
      const freqs = [110, 164.81, 220, 246.94, 329.63];
      voices = freqs.map((f, i) => {
        const osc = ctx!.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.value = f * (i % 2 === 0 ? 1.0015 : 0.999);
        const voiceGain = ctx!.createGain();
        const level = 0.085 / (i + 1);
        voiceGain.gain.value = level;

        // Slow independent swell per voice so the pad breathes.
        const lfo = ctx!.createOscillator();
        lfo.frequency.value = 0.045 + i * 0.019;
        const lfoGain = ctx!.createGain();
        lfoGain.gain.value = level * 0.75;
        lfo.connect(lfoGain);
        lfoGain.connect(voiceGain.gain);

        osc.connect(voiceGain);
        voiceGain.connect(master!);
        osc.start();
        lfo.start();
        return { osc, lfo };
      });
    }

    if (ctx.state === 'suspended') {
      void ctx.resume();
    }
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0.55, t + 3);
  };

  const stop = (fadeOutSeconds = 1.2) => {
    stopped = true;
    if (!ctx || !master) return;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0.0001, t + fadeOutSeconds);
    stopTimer = window.setTimeout(() => {
      voices.forEach(({ osc, lfo }) => {
        try { osc.stop(); } catch { /* already stopped */ }
        try { lfo.stop(); } catch { /* already stopped */ }
      });
      voices = [];
      void ctx?.close().catch(() => undefined);
      ctx = null;
      master = null;
    }, fadeOutSeconds * 1000 + 250);
  };

  return { start, stop };
};
