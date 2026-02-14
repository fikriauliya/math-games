import { Effect } from 'effect';

export interface Question { a: number; b: number; type: 'GCD' | 'LCM'; answer: number; choices: number[]; text: string; }

const randomInt = (min: number, max: number) => Effect.sync(() => Math.floor(Math.random() * (max - min + 1)) + min);

export function gcd(a: number, b: number): number { while (b) { [a, b] = [b, a % b]; } return a; }
export function lcm(a: number, b: number): number { return (a * b) / gcd(a, b); }

export const genQuestionEffect = (diff: string): Effect.Effect<Question> =>
  Effect.gen(function* () {
    const max = diff === 'easy' ? 12 : diff === 'medium' ? 24 : 50;
    const a = yield* randomInt(2, max);
    const b = yield* randomInt(2, max);
    const type: 'GCD' | 'LCM' = (yield* randomInt(0, 1)) === 0 ? 'GCD' : 'LCM';
    const answer = type === 'GCD' ? gcd(a, b) : lcm(a, b);
    const text = `${type}(${a}, ${b}) = ?`;
    const choices = new Set([answer]);
    while (choices.size < 4) {
      const off = (yield* randomInt(1, Math.max(3, Math.floor(answer * 0.4)))) * ((yield* randomInt(0, 1)) === 0 ? 1 : -1);
      const w = answer + off;
      if (w > 0 && w !== answer) choices.add(w);
    }
    return { a, b, type, answer, choices: [...choices].sort((a, b) => a - b), text };
  });

export const getGradeEffect = (correct: number, total: number): Effect.Effect<{ grade: string; message: string }> =>
  Effect.succeed((() => {
    const pct = (correct / total) * 100;
    const grade = pct >= 95 ? 'S' : pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
    const message = pct >= 90 ? '🏆 AMAZING!' : pct >= 70 ? '⭐ Great Job!' : '💪 Keep Practicing!';
    return { grade, message };
  })());

export function genQuestion(diff: string): Question { return Effect.runSync(genQuestionEffect(diff)); }
export function getGrade(c: number, t: number) { return Effect.runSync(getGradeEffect(c, t)); }
