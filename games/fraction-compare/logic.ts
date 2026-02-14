import { Effect } from 'effect';

export interface Question {
  frac1: [number, number];
  frac2: [number, number];
  answer: 'left' | 'right' | 'equal';
  text: string;
}

const randomInt = (min: number, max: number) => Effect.sync(() => Math.floor(Math.random() * (max - min + 1)) + min);

export const genQuestionEffect = (): Effect.Effect<Question> =>
  Effect.gen(function* () {
    const d1 = yield* randomInt(2, 10);
    const n1 = yield* randomInt(1, d1 - 1);
    const d2 = yield* randomInt(2, 10);
    const n2 = yield* randomInt(1, d2 - 1);
    const v1 = n1 / d1, v2 = n2 / d2;
    const answer: 'left' | 'right' | 'equal' = Math.abs(v1 - v2) < 0.0001 ? 'equal' : v1 > v2 ? 'left' : 'right';
    return { frac1: [n1, d1], frac2: [n2, d2], answer, text: `Which is bigger?` };
  });

export const getGradeEffect = (correct: number, total: number): Effect.Effect<{ grade: string; message: string }> =>
  Effect.succeed((() => {
    const pct = (correct / total) * 100;
    const grade = pct >= 95 ? 'S' : pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
    const message = pct >= 90 ? '🏆 AMAZING!' : pct >= 70 ? '⭐ Great Job!' : '💪 Keep Practicing!';
    return { grade, message };
  })());

export function genQuestion(): Question { return Effect.runSync(genQuestionEffect()); }
export function getGrade(c: number, t: number) { return Effect.runSync(getGradeEffect(c, t)); }
export function compareFractions(n1: number, d1: number, n2: number, d2: number): 'left' | 'right' | 'equal' {
  const v1 = n1 / d1, v2 = n2 / d2;
  if (Math.abs(v1 - v2) < 0.0001) return 'equal';
  return v1 > v2 ? 'left' : 'right';
}
export function fractionValue(n: number, d: number): number { return n / d; }
