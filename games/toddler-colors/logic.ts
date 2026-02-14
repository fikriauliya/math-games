import { Effect, pipe } from 'effect';

// ── Types ──────────────────────────────────────────────────────
export interface ColorItem { name: string; color: string; emoji: string; }
export interface ShapeItem { name: string; emoji: string; svg: string; }

// ── Constants ──────────────────────────────────────────────────
export const COLORS: ColorItem[] = [
  { name: 'MERAH', color: '#f44336', emoji: '🔴' },
  { name: 'BIRU', color: '#2196F3', emoji: '🔵' },
  { name: 'KUNING', color: '#FFEB3B', emoji: '🟡' },
  { name: 'HIJAU', color: '#4CAF50', emoji: '🟢' },
  { name: 'ORANGE', color: '#FF9800', emoji: '🟠' },
  { name: 'UNGU', color: '#9C27B0', emoji: '🟣' },
  { name: 'PINK', color: '#E91E63', emoji: '💗' },
  { name: 'COKLAT', color: '#795548', emoji: '🟤' },
];

export const SHAPES: ShapeItem[] = [
  { name: 'LINGKARAN', emoji: '⚫', svg: 'circle' },
  { name: 'BINTANG', emoji: '⭐', svg: 'star' },
  { name: 'HATI', emoji: '❤️', svg: 'heart' },
  { name: 'SEGITIGA', emoji: '🔺', svg: 'triangle' },
  { name: 'KOTAK', emoji: '⬛', svg: 'square' },
  { name: 'BULAN', emoji: '🌙', svg: 'moon' },
];

export const ANIMALS = ['🐶','🐱','🐰','🐸','🐣','🐷','🐮','🦊','🐻','🐼','🐨','🦁','🐯','🐵','🐔'];

// ── Random helpers ─────────────────────────────────────────────
const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

// ── Effect-based functions ─────────────────────────────────────
export const shuffleEffect = <T>(arr: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = yield* randomInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  });

export const generateCountingAnswersEffect = (targetCount: number): Effect.Effect<number[]> =>
  Effect.gen(function* () {
    const answers = new Set([targetCount]);
    const candidates = [1, 2, 3, 4, 5, 6, 7].filter(n => n !== targetCount);
    // shuffle candidates
    const shuffled = yield* shuffleEffect(candidates);
    for (const c of shuffled) {
      if (answers.size >= 4) break;
      answers.add(c);
    }
    return [...answers].sort((a, b) => a - b);
  });

export const getEndResultEffect = (correct: number, total: number): Effect.Effect<{ title: string; stars: string }> =>
  Effect.succeed((() => {
    const pct = correct / total;
    return {
      title: pct >= 0.8 ? '🎉 Hebat Sekali!' : pct >= 0.5 ? '⭐ Bagus!' : '💪 Coba Lagi!',
      stars: pct >= 0.9 ? '⭐⭐⭐' : pct >= 0.7 ? '⭐⭐' : '⭐',
    };
  })());

// ── Plain wrappers ─────────────────────────────────────────────
export function shuffle<T>(arr: T[]): T[] {
  return Effect.runSync(shuffleEffect(arr));
}

export function generateCountingAnswers(targetCount: number): number[] {
  return Effect.runSync(generateCountingAnswersEffect(targetCount));
}

export function getEndResult(correct: number, total: number): { title: string; stars: string } {
  return Effect.runSync(getEndResultEffect(correct, total));
}
