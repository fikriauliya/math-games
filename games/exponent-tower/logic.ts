import { Effect } from 'effect';

export interface Question { base: number; exp: number; answer: number; choices: number[]; text: string; }

const randomInt = (min: number, max: number) => Effect.sync(() => Math.floor(Math.random() * (max - min + 1)) + min);

export const genQuestionEffect = (diff: string): Effect.Effect<Question> =>
  Effect.gen(function* () {
    let base: number, exp: number;
    if (diff === 'easy') { base = yield* randomInt(2, 5); exp = 2; }
    else if (diff === 'medium') { base = yield* randomInt(2, 10); exp = yield* randomInt(2, 3); }
    else { base = yield* randomInt(2, 12); exp = yield* randomInt(2, 4); }
    const answer = Math.pow(base, exp);
    const text = `${base}${superscript(exp)} = ?`;
    const choices = new Set([answer]);
    while (choices.size < 4) {
      const off = (yield* randomInt(1, Math.max(5, Math.floor(answer * 0.3)))) * ((yield* randomInt(0, 1)) === 0 ? 1 : -1);
      const w = answer + off;
      if (w > 0 && w !== answer) choices.add(w);
    }
    return { base, exp, answer, choices: [...choices].sort((a, b) => a - b), text };
  });

function superscript(n: number): string {
  const map: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return String(n).split('').map(c => map[c] || c).join('');
}

export const getGradeEffect = (correct: number, total: number): Effect.Effect<{ grade: string; message: string }> =>
  Effect.succeed((() => {
    const pct = (correct / total) * 100;
    const grade = pct >= 95 ? 'S' : pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
    const message = pct >= 90 ? '🏆 AMAZING!' : pct >= 70 ? '⭐ Great Job!' : '💪 Keep Practicing!';
    return { grade, message };
  })());

export function genQuestion(diff: string): Question { return Effect.runSync(genQuestionEffect(diff)); }
export function getGrade(c: number, t: number) { return Effect.runSync(getGradeEffect(c, t)); }
export function power(base: number, exp: number): number { return Math.pow(base, exp); }
