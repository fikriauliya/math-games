import { Effect } from 'effect';

export interface Question {
  text: string;
  answer: number;
  choices: number[];
}

const randomInt = (min: number, max: number) => Effect.sync(() => Math.floor(Math.random() * (max - min + 1)) + min);

export const genQuestionEffect = (diff: string): Effect.Effect<Question> =>
  Effect.gen(function* () {
    const max = diff === 'easy' ? 10 : diff === 'medium' ? 20 : 50;
    const opIdx = yield* randomInt(0, diff === 'easy' ? 1 : 3);
    const ops = ['+', '−', '×', '÷'];
    const op = ops[opIdx];

    let a: number, b: number, x: number, text: string;

    if (op === '×') {
      x = yield* randomInt(1, 12);
      a = yield* randomInt(1, 12);
      b = a * x;
      text = `${a} × X = ${b}`;
    } else if (op === '÷') {
      x = yield* randomInt(1, 10);
      a = x * (yield* randomInt(1, 10));
      b = a / x;
      text = `${a} ÷ X = ${b}`;
    } else if (op === '−') {
      x = yield* randomInt(1, max);
      a = yield* randomInt(x, max + x);
      b = a - x;
      text = `${a} − X = ${b}`;
    } else {
      x = yield* randomInt(1, max);
      a = yield* randomInt(1, max);
      b = a + x;
      text = `${a} + X = ${b}`;
    }

    const choices = new Set([x]);
    while (choices.size < 4) {
      const wrong = x + (yield* randomInt(1, 5)) * ((yield* randomInt(0, 1)) === 0 ? 1 : -1);
      if (wrong > 0 && wrong !== x) choices.add(wrong);
    }

    return { text, answer: x, choices: [...choices].sort((a, b) => a - b) };
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
export function solveForX(op: string, a: number, b: number): number {
  if (op === '+') return b - a;
  if (op === '−') return a - b;
  if (op === '×') return b / a;
  return a / b; // ÷
}
