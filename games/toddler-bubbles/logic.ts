import { Effect } from 'effect';

export interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  wobble: number;
}

export const COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6eb4', '#a855f7', '#f97316', '#00bcd4'];

let nextId = 0;

export function createBubble(screenWidth: number, screenHeight: number): Bubble {
  return {
    id: nextId++,
    x: Math.random() * (screenWidth - 60) + 30,
    y: screenHeight + 30,
    size: 40 + Math.random() * 50,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speed: 1 + Math.random() * 2,
    wobble: Math.random() * Math.PI * 2,
  };
}

export const createBubbleEffect = (sw: number, sh: number): Effect.Effect<Bubble> =>
  Effect.sync(() => createBubble(sw, sh));

export function updateBubble(b: Bubble, dt: number): Bubble {
  return {
    ...b,
    y: b.y - b.speed * dt * 60,
    x: b.x + Math.sin(b.wobble + b.y * 0.02) * 0.5,
  };
}

export const updateBubbleEffect = (b: Bubble, dt: number): Effect.Effect<Bubble> =>
  Effect.sync(() => updateBubble(b, dt));

export function isBubbleOffScreen(b: Bubble): boolean {
  return b.y + b.size < -10;
}

export function isTapOnBubble(tapX: number, tapY: number, b: Bubble): boolean {
  const dx = tapX - b.x;
  const dy = tapY - b.y;
  const r = b.size / 2 + 10; // generous hit area
  return dx * dx + dy * dy < r * r;
}

export const isTapOnBubbleEffect = (tx: number, ty: number, b: Bubble): Effect.Effect<boolean> =>
  Effect.sync(() => isTapOnBubble(tx, ty, b));

export function resetId() { nextId = 0; }
