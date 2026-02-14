import { Effect } from 'effect';

export interface RainbowColor {
  name: string;
  color: string;
  order: number;
}

export const RAINBOW_COLORS: RainbowColor[] = [
  { name: 'Merah', color: '#FF0000', order: 0 },
  { name: 'Jingga', color: '#FF7F00', order: 1 },
  { name: 'Kuning', color: '#FFFF00', order: 2 },
  { name: 'Hijau', color: '#00FF00', order: 3 },
  { name: 'Biru', color: '#0000FF', order: 4 },
  { name: 'Nila', color: '#4B0082', order: 5 },
  { name: 'Ungu', color: '#8B00FF', order: 6 },
];

export const shuffleColorsEffect = (): Effect.Effect<RainbowColor[]> =>
  Effect.sync(() => [...RAINBOW_COLORS].sort(() => Math.random() - 0.5));

export function shuffleColors(): RainbowColor[] {
  return Effect.runSync(shuffleColorsEffect());
}

export function isCorrectOrder(colors: RainbowColor[]): boolean {
  return colors.every((c, i) => c.order === i);
}

export function swapColors(colors: RainbowColor[], a: number, b: number): RainbowColor[] {
  const result = [...colors];
  [result[a], result[b]] = [result[b], result[a]];
  return result;
}

export function getEndResult(moves: number): { title: string; stars: string } {
  if (moves <= 10) return { title: '🎉 Hebat Sekali!', stars: '⭐⭐⭐' };
  if (moves <= 20) return { title: '⭐ Bagus!', stars: '⭐⭐' };
  return { title: '💪 Selesai!', stars: '⭐' };
}
