// Upbeat intro score for The Room's cinematic teaser.
// Generated live with WebAudio — a driving 124 BPM broadcast groove
// (kick, hi-hats, pulsing bass, bright arpeggio, chord stabs). No audio files.

export interface RoomAmbienceHandle {
  start: () => void;
  stop: (fadeOutSeconds?: number) => void;
}

const BPM = 124;
const STEP = 60 / BPM / 4; // 16th note
// Am – F – C – G progression (one bar each)
const CHORDS: number[][] = [
  [220, 261.63, 329.63],
  [174.61, 220, 261.63],
  [261.63, 329.63, 392],
  [196, 246.94, 293.66],
];
const BASS = [55, 43.65, 65.41, 49];

export const createRoomAmbience = (): RoomAmbienceHandle => {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let noise: AudioBuffer | null = null;
  let timer: number | null = null;
  let stopTimer: number | null = null;
  let nextTime = 0;
  let step = 0;
  let stopped = false;

  const env = (g: GainNode, t: number, peak: number, dur: number) => {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  };

  const tone = (type: OscillatorType, f: number, t: number, peak: number, dur: number, cutoff = 4000) => {
    const o = ctx!.createOscillator();
    o.type = type;
    o.frequency.value = f;
    const flt = ctx!.createBiquadFilter();
    flt.type = 'lowpass';
    flt.frequency.value = cutoff;
    const g = ctx!.createGain();
    env(g, t, peak, dur);
    o.connect(flt).connect(g).connect(master!);
    o.start(t);
    o.stop(t + dur + 0.05);
  };

  const kick = (t: number) => {
    const o = ctx!.createOscillator();
    const g = ctx!.createGain();
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    env(g, t, 0.9, 0.3);
    o.connect(g).connect(master!);
    o.start(t);
    o.stop(t + 0.35);
  };

  const hat = (t: number, peak: number, dur = 0.04) => {
    const s = ctx!.createBufferSource();
    s.buffer = noise;
    const f = ctx!.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 7000;
    const g = ctx!.createGain();
    env(g, t, peak, dur);
    s.connect(f).connect(g).connect(master!);
    s.start(t);
    s.stop(t + dur + 0.02);
  };

  const clap = (t: number) => {
    const s = ctx!.createBufferSource();
    s.buffer = noise;
    const f = ctx!.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1500;
    const g = ctx!.createGain();
    env(g, t, 0.35, 0.15);
    s.connect(f).connect(g).connect(master!);
    s.start(t);
    s.stop(t + 0.2);
  };

  const scheduleStep = (s: number, t: number) => {
    const bar = Math.floor(s / 16) % 4;
    const i = s % 16;
    const chord = CHORDS[bar];
    if (i % 4 === 0) kick(t);
    if (i === 4 || i === 12) clap(t);
    if (i % 2 === 1) hat(t, 0.12);
    else hat(t, 0.05);
    // Offbeat pumping bass
    if (i % 4 === 2) tone('sawtooth', BASS[bar], t, 0.28, STEP * 1.8, 600);
    // Bright arpeggio on every 16th
    const arp = chord[i % 3] * (i % 6 < 3 ? 2 : 4);
    tone('square', arp, t, 0.035, STEP * 0.9, 3500);
    // Chord stab on the first beat of each bar
    if (i === 0) chord.forEach((f) => tone('sawtooth', f * 2, t, 0.05, STEP * 6, 2500));
  };

  const tick = () => {
    if (!ctx) return;
    while (nextTime < ctx.currentTime + 0.15) {
      scheduleStep(step, nextTime);
      step++;
      nextTime += STEP;
    }
  };

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
      master.connect(ctx.destination);
      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      nextTime = ctx.currentTime + 0.1;
      step = 0;
      timer = window.setInterval(tick, 25);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0.5, t + 1.5);
  };

  const stop = (fadeOutSeconds = 1.2) => {
    stopped = true;
    if (!ctx || !master) return;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0.0001, t + fadeOutSeconds);
    stopTimer = window.setTimeout(() => {
      if (timer !== null) window.clearInterval(timer);
      timer = null;
      void ctx?.close().catch(() => undefined);
      ctx = null;
      master = null;
    }, fadeOutSeconds * 1000 + 250);
  };

  return { start, stop };
};
