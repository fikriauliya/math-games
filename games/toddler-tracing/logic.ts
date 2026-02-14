import { Effect } from 'effect';

export interface TracingChar {
  char: string;
  name: string;
  points: { x: number; y: number }[];  // normalized 0-1
}

export const TRACING_CHARS: TracingChar[] = [
  { char: 'A', name: 'Huruf A', points: [
    {x:0.5,y:0.1},{x:0.3,y:0.5},{x:0.1,y:0.9},{x:0.3,y:0.5},{x:0.7,y:0.5},{x:0.9,y:0.9},{x:0.7,y:0.5},{x:0.3,y:0.5}
  ]},
  { char: 'B', name: 'Huruf B', points: [
    {x:0.2,y:0.1},{x:0.2,y:0.9},{x:0.2,y:0.1},{x:0.6,y:0.1},{x:0.7,y:0.25},{x:0.6,y:0.5},{x:0.2,y:0.5},{x:0.6,y:0.5},{x:0.7,y:0.7},{x:0.6,y:0.9},{x:0.2,y:0.9}
  ]},
  { char: '1', name: 'Angka 1', points: [
    {x:0.4,y:0.2},{x:0.5,y:0.1},{x:0.5,y:0.9},{x:0.3,y:0.9},{x:0.7,y:0.9}
  ]},
  { char: '2', name: 'Angka 2', points: [
    {x:0.2,y:0.3},{x:0.3,y:0.1},{x:0.6,y:0.1},{x:0.7,y:0.3},{x:0.5,y:0.5},{x:0.2,y:0.9},{x:0.8,y:0.9}
  ]},
  { char: '3', name: 'Angka 3', points: [
    {x:0.2,y:0.1},{x:0.7,y:0.1},{x:0.5,y:0.5},{x:0.7,y:0.5},{x:0.7,y:0.7},{x:0.5,y:0.9},{x:0.2,y:0.9}
  ]},
  { char: 'O', name: 'Huruf O', points: [
    {x:0.5,y:0.1},{x:0.7,y:0.2},{x:0.8,y:0.5},{x:0.7,y:0.8},{x:0.5,y:0.9},{x:0.3,y:0.8},{x:0.2,y:0.5},{x:0.3,y:0.2},{x:0.5,y:0.1}
  ]},
];

export const pickCharEffect = (): Effect.Effect<TracingChar> =>
  Effect.sync(() => TRACING_CHARS[Math.floor(Math.random() * TRACING_CHARS.length)]);

export function pickChar(): TracingChar {
  return Effect.runSync(pickCharEffect());
}

export function getDistToPoint(px: number, py: number, tx: number, ty: number): number {
  return Math.sqrt((px - tx) ** 2 + (py - ty) ** 2);
}

export function checkTrace(traced: { x: number; y: number }[], target: TracingChar, threshold: number): number {
  let hit = 0;
  for (const tp of target.points) {
    const close = traced.some(p => getDistToPoint(p.x, p.y, tp.x, tp.y) < threshold);
    if (close) hit++;
  }
  return hit / target.points.length;
}

export function getEndResult(accuracy: number): { title: string; stars: string } {
  if (accuracy >= 0.7) return { title: '🎉 Hebat Sekali!', stars: '⭐⭐⭐' };
  if (accuracy >= 0.4) return { title: '⭐ Bagus!', stars: '⭐⭐' };
  return { title: '💪 Coba Lagi!', stars: '⭐' };
}
