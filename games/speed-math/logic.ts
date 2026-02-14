import { Effect, pipe, Either } from 'effect';

// ── Types ──────────────────────────────────────────────────────
export interface Question {
  text: string;
  answer: number;
  choices: number[];
}

// ── Random helpers ─────────────────────────────────────────────
const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

// ── Effect-based functions ─────────────────────────────────────
export const genQEffect = (diff: string): Effect.Effect<Question> =>
  Effect.gen(function* () {
    const max: Record<string, number> = { easy: 10, medium: 20, hard: 50 };
    const ops = diff === 'easy' ? ['+'] : diff === 'medium' ? ['+', '−'] : ['+', '−', '×'];
    const op = ops[yield* randomInt(ops.length)];

    let a: number, b: number, ans: number;
    if (op === '×') {
      a = (yield* randomInt(12)) + 1;
      b = (yield* randomInt(12)) + 1;
      ans = a * b;
    } else if (op === '−') {
      a = (yield* randomInt(max[diff])) + 1;
      b = (yield* randomInt(a)) + 1;
      ans = a - b;
    } else {
      a = (yield* randomInt(max[diff])) + 1;
      b = (yield* randomInt(max[diff])) + 1;
      ans = a + b;
    }

    const choices = new Set([ans]);
    while (choices.size < 4) {
      const wrong = ans + (yield* randomInt(10)) - 5;
      if (wrong !== ans && wrong >= 0) choices.add(wrong);
    }

    return { text: `${a} ${op} ${b} = ?`, answer: ans, choices: [...choices].sort((a, b) => a - b) };
  });

export const calcScoreEffect = (streak: number): Effect.Effect<number> =>
  Effect.succeed(10 * Math.min(streak, 5));

export const validateAnswerEffect = (userAnswer: number, correct: number): Either.Either<string, string> =>
  userAnswer === correct ? Either.right('Correct!') : Either.left(`Wrong! Expected ${correct}`);

export const getGradeEffect = (correct: number, total: number): Effect.Effect<{ grade: string; message: string }> =>
  Effect.succeed((() => {
    const pct = correct / total * 100;
    const grade = pct >= 95 ? 'S' : pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
    const message = pct >= 90 ? '🏆 AMAZING!' : pct >= 70 ? '⭐ Great Job!' : '💪 Keep Practicing!';
    return { grade, message };
  })());

// ── Plain wrappers ─────────────────────────────────────────────
export function genQ(diff: string): Question {
  return Effect.runSync(genQEffect(diff));
}

export function calcScore(streak: number): number {
  return Effect.runSync(calcScoreEffect(streak));
}

export function getGrade(correct: number, total: number): { grade: string; message: string } {
  return Effect.runSync(getGradeEffect(correct, total));
}
