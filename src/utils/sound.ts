let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) {
    audioCtx = new Ctor();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  durationMs: number,
  type: OscillatorType,
  gainPeak: number,
  delaySeconds = 0
) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime + delaySeconds;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + durationMs / 1000 + 0.01);
}

export function playKeyTap(enabled: boolean) {
  if (!enabled) return;
  playTone(520, 38, 'triangle', 0.035);
}

export function playBackspaceTap(enabled: boolean) {
  if (!enabled) return;
  playTone(300, 42, 'sine', 0.03);
}

export function playWordSolved(enabled: boolean) {
  if (!enabled) return;
  playTone(587.33, 95, 'sine', 0.045, 0);
  playTone(783.99, 130, 'sine', 0.05, 0.07);
}

export function playErrorTick(enabled: boolean) {
  if (!enabled) return;
  playTone(210, 90, 'sawtooth', 0.025, 0);
}

export function playPuzzleVictory(enabled: boolean) {
  if (!enabled) return;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    playTone(freq, 170, 'triangle', 0.055, idx * 0.09);
  });
}
