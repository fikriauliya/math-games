import { Effect } from 'effect';

export interface Bond {
  target: number;
  numbers: number[];
  pairs: [number, number][];
}

export const generateBondEffect = (difficulty: string): Effect.Effect<Bond> =>
  Effect.sync(() => {
    const target = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 100;
    const pairCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
    const pairs: [number, number][] = [];
    const used = new Set<number>();

    while (pairs.length < pairCount) {
      const a = Math.floor(Math.random() * (target - 1)) + 1;
      const b = target - a;
      if (a !== b && !used.has(a) && !used.has(b)) {
        pairs.push([a, b]);
        used.add(a);
        used.add(b);
      }
    }

    // Add distractors
    const numbers = pairs.flat();
    while (numbers.length < pairCount * 2 + 2) {
      const d = Math.floor(Math.random() * target) + 1;
      if (!numbers.includes(d)) numbers.push(d);
    }

    // Shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return { target, numbers, pairs };
  });

export const checkPairEffect = (a: number, b: number, target: number): Effect.Effect<boolean> =>
  Effect.succeed(a + b === target);

export const calcScoreEffect = (found: number, total: number, timeLeft: number): Effect.Effect<number> =>
  Effect.succeed(found * 100 + timeLeft * 5);

export const isPerfectEffect = (found: number, total: number): Effect.Effect<boolean> =>
  Effect.succeed(found === total);

export const getGradeEffect = (found: number, total: number): Effect.Effect<{ grade: string; message: string }> =>
  Effect.succeed((() => {
    const pct = found / total * 100;
    const grade = pct >= 100 ? 'S' : pct >= 80 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'D';
    const message = pct >= 100 ? '🏆 PERFECT!' : pct >= 80 ? '⭐ Great Job!' : '💪 Keep Practicing!';
    return { grade, message };
  })());

// Plain wrappers
export function generateBond(difficulty: string): Bond { return Effect.runSync(generateBondEffect(difficulty)); }
export function checkPair(a: number, b: number, target: number): boolean { return Effect.runSync(checkPairEffect(a, b, target)); }
export function calcScore(found: number, total: number, timeLeft: number): number { return Effect.runSync(calcScoreEffect(found, total, timeLeft)); }
export function isPerfect(found: number, total: number): boolean { return Effect.runSync(isPerfectEffect(found, total)); }
export function getGrade(found: number, total: number): { grade: string; message: string } { return Effect.runSync(getGradeEffect(found, total)); }
