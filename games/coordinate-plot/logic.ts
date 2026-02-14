import { Effect } from 'effect';

export interface Question {
  targetX: number;
  targetY: number;
  text: string;
}

const randomInt = (min: number, max: number) => Effect.sync(() => Math.floor(Math.random() * (max - min + 1)) + min);

export const genQuestionEffect = (): Effect.Effect<Question> =>
  Effect.gen(function* () {
    const x = yield* randomInt(0, 9);
    const y = yield* randomInt(0, 9);
    return { targetX: x, targetY: y, text: `Find the treasure at (${x}, ${y})!` };
  });

export const checkAnswerEffect = (clickX: number, clickY: number, targetX: number, targetY: number): Effect.Effect<boolean> =>
  Effect.succeed(clickX === targetX && clickY === targetY);

export const getGradeEffect = (correct: number, total: number): Effect.Effect<{ grade: string; message: string }> =>
  Effect.succeed((() => {
    const pct = (correct / total) * 100;
    const grade = pct >= 95 ? 'S' : pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
    const message = pct >= 90 ? '🏆 AMAZING!' : pct >= 70 ? '⭐ Great Job!' : '💪 Keep Practicing!';
    return { grade, message };
  })());

export function genQuestion(): Question { return Effect.runSync(genQuestionEffect()); }
export function checkAnswer(cx: number, cy: number, tx: number, ty: number): boolean { return Effect.runSync(checkAnswerEffect(cx, cy, tx, ty)); }
export function getGrade(c: number, t: number) { return Effect.runSync(getGradeEffect(c, t)); }
export function manhattan(x1: number, y1: number, x2: number, y2: number): number { return Math.abs(x1 - x2) + Math.abs(y1 - y2); }
