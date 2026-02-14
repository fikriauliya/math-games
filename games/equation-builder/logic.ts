import { Effect, Either } from 'effect';

export interface Puzzle {
  numbers: number[];
  operators: string[];
  target: number;
  solution: { a: number; op: string; b: number };
}

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const generatePuzzleEffect = (round: number): Effect.Effect<Puzzle> =>
  Effect.gen(function* () {
    const difficulty = Math.min(Math.floor(round / 3), 3);
    const maxNum = 5 + difficulty * 5;
    const ops = difficulty < 1 ? ['+'] : difficulty < 2 ? ['+', '−'] : ['+', '−', '×'];

    let a: number, b: number, op: string, target: number;
    // generate a valid equation
    do {
      a = (yield* randomInt(maxNum)) + 1;
      b = (yield* randomInt(maxNum)) + 1;
      op = ops[yield* randomInt(ops.length)];
      target = op === '+' ? a + b : op === '−' ? a - b : a * b;
    } while (target < 0 || target > 200);

    // Create distractor numbers
    const extra: number[] = [];
    while (extra.length < 1) {
      const n = (yield* randomInt(maxNum)) + 1;
      if (n !== a && n !== b) extra.push(n);
    }

    const numbers = yield* shuffleEffect([a, b, ...extra]);
    const allOps = difficulty < 2 ? ['+', '−'] : ['+', '−', '×'];

    return {
      numbers,
      operators: allOps,
      target,
      solution: { a, op, b },
    };
  });

export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* randomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export const checkEquation = (a: number, op: string, b: number, target: number): boolean => {
  const result = op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : NaN;
  return result === target;
};

export const validateAnswer = (a: number, op: string, b: number, target: number): Either.Either<string, string> =>
  checkEquation(a, op, b, target) ? Either.right('Correct!') : Either.left('Wrong!');

export const calcScore = (correct: number, total: number): number => correct * 10;

export const getGrade = (correct: number, total: number): { grade: string; message: string } => {
  const pct = correct / total * 100;
  const grade = pct >= 95 ? 'S' : pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
  const message = pct >= 90 ? '🏆 AMAZING!' : pct >= 70 ? '⭐ Great Job!' : '💪 Keep Practicing!';
  return { grade, message };
};

export const TOTAL_ROUNDS = 10;

// ── Plain wrappers ─────────────────────────────────────────────
export function generatePuzzle(round: number): Puzzle {
  return Effect.runSync(generatePuzzleEffect(round));
}

export function shuffle<T>(a: T[]): T[] {
  return Effect.runSync(shuffleEffect(a));
}
