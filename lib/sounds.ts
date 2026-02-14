// Web Audio API synthesized sounds — no external files needed
let audioCtx: AudioContext | null = null;
let muted = localStorage.getItem('game-muted') === '1';

function ctx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

export function isMuted(): boolean { return muted; }
export function setMuted(v: boolean) { muted = v; localStorage.setItem('game-muted', v ? '1' : '0'); }
export function toggleMute(): boolean { setMuted(!muted); return muted; }

function tone(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.3, delay = 0) {
  if (muted) return;
  try {
    const c = ctx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = type; o.frequency.value = freq; g.gain.value = vol;
    g.gain.setValueAtTime(vol, c.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + delay + duration);
    o.start(c.currentTime + delay);
    o.stop(c.currentTime + delay + duration);
  } catch {}
}

export function playCorrect() {
  tone(523, 0.1); // C5
  tone(659, 0.15, 'sine', 0.3, 0.1); // E5
}

export function playWrong() {
  tone(200, 0.2, 'triangle', 0.2);
  tone(180, 0.2, 'triangle', 0.15, 0.1);
}

export function playCombo(streak: number) {
  const base = 440 + streak * 40;
  tone(base, 0.08, 'sine', 0.25);
  tone(base * 1.25, 0.08, 'sine', 0.25, 0.08);
  tone(base * 1.5, 0.12, 'sine', 0.3, 0.16);
}

export function playPop() {
  if (muted) return;
  try {
    const c = ctx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = 'sine'; o.frequency.value = 600;
    o.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.1);
    g.gain.value = 0.3;
    g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.1);
    o.start(); o.stop(c.currentTime + 0.1);
  } catch {}
}

export function playTick() {
  tone(800, 0.05, 'square', 0.15);
}

export function playWin() {
  tone(523, 0.12); // C
  tone(659, 0.12, 'sine', 0.3, 0.12); // E
  tone(784, 0.12, 'sine', 0.3, 0.24); // G
  tone(1047, 0.25, 'sine', 0.35, 0.36); // C6
}

export function playClick() {
  tone(440, 0.05, 'sine', 0.2);
}

// Happy toddler sounds — pleasant regardless of right/wrong
export function playToddlerCorrect() {
  tone(523, 0.1, 'sine', 0.3);
  tone(659, 0.15, 'sine', 0.3, 0.1);
}

export function playToddlerWrong() {
  // Still pleasant, just lower pitch
  tone(392, 0.12, 'sine', 0.25);
  tone(349, 0.15, 'sine', 0.2, 0.1);
}

/** Inject mute button into page */
export function initMuteButton() {
  const btn = document.createElement('button');
  btn.id = 'mute-btn';
  btn.textContent = muted ? '🔇' : '🔊';
  btn.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9999;background:rgba(0,0,0,0.3);border:none;border-radius:50%;width:44px;height:44px;font-size:1.4rem;cursor:pointer;display:flex;align-items:center;justify-content:center;';
  btn.onclick = () => { const m = toggleMute(); btn.textContent = m ? '🔇' : '🔊'; };
  document.body.appendChild(btn);
}
