import { createBubble, updateBubble, isBubbleOffScreen, isTapOnBubble, type Bubble } from './logic';
import { playPop, initMuteButton } from '../../lib/sounds';
import { trackGameStart } from '../../lib/analytics';

const GAME_ID = 'toddler-bubbles';
const canvas = document.getElementById('bubble-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
let bubbles: Bubble[] = [];
let popped = 0;
let lastSpawn = 0;
let running = false;
let lastTime = 0;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function startGame() {
  trackGameStart(GAME_ID);
  document.getElementById('start-screen')!.style.display = 'none';
  canvas.style.display = 'block';
  document.getElementById('pop-count')!.style.display = 'block';
  bubbles = [];
  popped = 0;
  running = true;
  lastTime = performance.now();
  updateCount();
  requestAnimationFrame(loop);
}

function loop(now: number) {
  if (!running) return;
  const dt = (now - lastTime) / 16.67;
  lastTime = now;

  // Spawn
  if (now - lastSpawn > 600) {
    bubbles.push(createBubble(canvas.width, canvas.height));
    lastSpawn = now;
  }

  // Update
  bubbles = bubbles.map(b => updateBubble(b, dt)).filter(b => !isBubbleOffScreen(b));

  // Draw
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const b of bubbles) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = b.color + '80';
    ctx.fill();
    ctx.strokeStyle = b.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    // Shine
    ctx.beginPath();
    ctx.arc(b.x - b.size * 0.15, b.y - b.size * 0.15, b.size * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fill();
  }

  requestAnimationFrame(loop);
}

function handleTap(x: number, y: number) {
  for (let i = bubbles.length - 1; i >= 0; i--) {
    if (isTapOnBubble(x, y, bubbles[i])) {
      // Pop animation
      const b = bubbles[i];
      showPopEffect(b.x, b.y, b.color);
      bubbles.splice(i, 1);
      popped++;
      updateCount();
      playPop();
      try {
        const msgs = ['Pop!', 'Yay!', 'Wuush!', 'Hore!'];
        const u = new SpeechSynthesisUtterance(msgs[Math.floor(Math.random() * msgs.length)]);
        u.lang = 'id-ID'; u.rate = 1.2; u.pitch = 1.5;
        speechSynthesis.speak(u);
      } catch {}
      break;
    }
  }
}

function showPopEffect(x: number, y: number, color: string) {
  const el = document.createElement('div');
  el.textContent = '💥';
  el.style.cssText = `position:fixed;left:${x-15}px;top:${y-15}px;font-size:2rem;pointer-events:none;z-index:10;animation:popAnim 0.4s ease forwards;`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 500);
}

function updateCount() {
  document.getElementById('pop-count')!.textContent = `💥 ${popped}`;
}

canvas.addEventListener('pointerdown', (e) => handleTap(e.clientX, e.clientY));
window.addEventListener('resize', resize);
resize();

initMuteButton();
(window as any).startGame = startGame;
