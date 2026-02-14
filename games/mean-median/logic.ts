import { Effect, Either } from 'effect';

export const TOTAL = 10;
export type StatType = 'mean' | 'median' | 'mode';

export interface StatQuestion {
  numbers: number[];
  type: StatType;
  answer: number;
  choices: number[];
  label: string;
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

export function calcMean(nums: number[]): number {
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

export function calcMedian(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function calcMode(nums: number[]): number {
  const freq: Record<number, number> = {};
  nums.forEach(n => freq[n] = (freq[n] || 0) + 1);
  const maxFreq = Math.max(...Object.values(freq));
  return Number(Object.keys(freq).find(k => freq[Number(k)] === maxFreq)!);
}

export const generateQuestionEffect = (round: number): Effect.Effect<StatQuestion> =>
  Effect.gen(function* () {
    const types: StatType[] = ['mean', 'median', 'mode'];
    const type = types[round % 3];
    const len = yield* randomInt(5, 7);
    let numbers: number[];
    
    if (type === 'mode') {
      // Ensure there's a clear mode
      const base: number[] = [];
      for (let i = 0; i < len - 2; i++) base.push(yield* randomInt(1, 20));
      const modeVal = yield* randomInt(1, 20);
      numbers = [...base, modeVal, modeVal];
    } else {
      numbers = [];
      for (let i = 0; i < len; i++) numbers.push(yield* randomInt(1, 20));
    }

    const answer = type === 'mean' ? calcMean(numbers) : type === 'median' ? calcMedian(numbers) : calcMode(numbers);
    const label = type === 'mean' ? 'Mean' : type === 'median' ? 'Median' : 'Mode';

    const wrongs = new Set<number>();
    while (wrongs.size < 3) {
      const w = yield* randomInt(Math.max(1, Math.floor(answer) - 5), Math.floor(answer) + 8);
      if (w !== answer) wrongs.add(w);
    }
    const choices = yield* shuffleEffect([answer, ...wrongs]);
    return { numbers: numbers.sort((a, b) => a - b), type, answer, choices, label };
  });

export const checkAnswerEffect = (answer: number, correct: number): Either.Either<string, string> =>
  answer === correct ? Either.right('Correct!') : Either.left('Wrong!');

export const getResultText = (score: number, total: number) => {
  const perfect = score === total;
  const good = score >= total * 0.7;
  return {
    emoji: perfect ? '🏆' : good ? '🎉' : '💪',
    title: perfect ? 'Perfect!' : good ? 'Great Job!' : 'Keep Practicing!',
    sub: `${score} / ${total} correct`,
  };
};

// Plain wrappers
export function generateQuestion(round: number): StatQuestion { return Effect.runSync(generateQuestionEffect(round)); }
export function checkAnswer(answer: number, correct: number): boolean { return answer === correct; }
export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
