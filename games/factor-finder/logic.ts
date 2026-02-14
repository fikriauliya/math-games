import { Effect, Either } from 'effect';

export const TOTAL = 10;

export interface FactorQuestion {
  number: number;
  factors: number[];
  grid: number[];
  type: 'find-all' | 'true-false';
  tfTarget?: number;
  tfAnswer?: boolean;
}

const randomInt = (min: number, max: number) => Effect.sync(() => Math.floor(Math.random() * (max - min + 1)) + min);

export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* randomInt(0, i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export function getFactors(n: number): number[] {
  const f: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) f.push(i);
  }
  return f;
}

export function isFactor(n: number, of: number): boolean {
  return of % n === 0;
}

export const generateQuestionEffect = (round: number): Effect.Effect<FactorQuestion> =>
  Effect.gen(function* () {
    const baseMin = 12 + round * 4;
    const baseMax = baseMin + 20;
    const number = yield* randomInt(baseMin, baseMax);
    const factors = getFactors(number);

    if (round % 3 === 2) {
      // True/False question
      const target = yield* randomInt(2, Math.floor(number / 2));
      const tfAnswer = isFactor(target, number);
      return { number, factors, grid: [], type: 'true-false' as const, tfTarget: target, tfAnswer };
    }

    // Find all factors - show grid of numbers including factors + non-factors
    const nonFactors = new Set<number>();
    while (nonFactors.size < Math.min(6, 12 - factors.length)) {
      const nf = yield* randomInt(2, number);
      if (!factors.includes(nf)) nonFactors.add(nf);
    }
    const grid = yield* shuffleEffect([...factors.slice(0, 8), ...nonFactors]);
    return { number, factors, grid: grid.slice(0, 12), type: 'find-all' as const };
  });

export function checkFactorSelection(selected: number[], factors: number[]): { correct: number; wrong: number; missed: number } {
  const factorSet = new Set(factors);
  let correct = 0, wrong = 0;
  selected.forEach(s => { if (factorSet.has(s)) correct++; else wrong++; });
  const missed = factors.length - correct;
  return { correct, wrong, missed };
}

export const getResultText = (score: number, total: number) => {
  const perfect = score === total;
  const good = score >= total * 0.7;
  return {
    emoji: perfect ? '💎' : good ? '🎉' : '⛏️',
    title: perfect ? 'Diamond Miner!' : good ? 'Great Digging!' : 'Keep Mining!',
    sub: `${score} / ${total} correct`,
  };
};

// Plain wrappers
export function generateQuestion(round: number): FactorQuestion { return Effect.runSync(generateQuestionEffect(round)); }
export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
