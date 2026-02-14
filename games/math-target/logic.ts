import { Effect, Either } from 'effect';

export interface TargetQuestion {
  target: number;
  numbers: number[];
}

const randomInt = (min: number, max: number) => Effect.sync(() => min + Math.floor(Math.random() * (max - min + 1)));

export const shuffleEffect = <T>(arr: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = yield* Effect.sync(() => Math.floor(Math.random() * (i + 1)));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  });

export const generateQuestionEffect = (round: number): Effect.Effect<TargetQuestion> =>
  Effect.gen(function* () {
    const count = round < 4 ? 5 : round < 8 ? 6 : 7;
    const maxNum = round < 4 ? 12 : round < 8 ? 15 : 20;
    // Generate numbers that have at least one valid subset summing to target
    const nums: number[] = [];
    for (let i = 0; i < count; i++) {
      nums.push(yield* randomInt(1, maxNum));
    }
    // Pick 2-3 numbers to form target
    const pickCount = round < 4 ? 2 : (yield* randomInt(2, 3));
    const shuffled = yield* shuffleEffect(nums);
    const subset = shuffled.slice(0, pickCount);
    const target = subset.reduce((a, b) => a + b, 0);
    return { target, numbers: yield* shuffleEffect(nums) };
  });

export function checkAnswer(selected: number[], target: number): boolean {
  return selected.length > 0 && selected.reduce((a, b) => a + b, 0) === target;
}

export function hasValidCombination(numbers: number[], target: number): boolean {
  const n = numbers.length;
  for (let mask = 1; mask < (1 << n); mask++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) sum += numbers[i];
    }
    if (sum === target) return true;
  }
  return false;
}

export const TOTAL = 10;

export function generateQuestion(round: number): TargetQuestion {
  return Effect.runSync(generateQuestionEffect(round));
}

export function shuffle<T>(a: T[]): T[] {
  return Effect.runSync(shuffleEffect(a));
}

export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  const perfect = score === total;
  const good = score >= total * 0.6;
  return {
    emoji: perfect ? '🏆' : good ? '🎯' : '💪',
    title: perfect ? 'Bullseye Master!' : good ? 'Great Aim!' : 'Keep Practicing!',
    sub: `${score} of ${total} targets hit!`,
  };
}
