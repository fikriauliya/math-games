import { Effect, pipe, Either, Brand } from 'effect';

// ── Branded types ──────────────────────────────────────────────
export type Score = number & Brand.Brand<'Score'>;
export type RopeOffset = number & Brand.Brand<'RopeOffset'>;

export const Score = Brand.refined<Score>(
  (n) => n >= 0,
  (n) => Brand.error(`Score must be non-negative, got ${n}`)
);

export const RopeOffset = Brand.refined<RopeOffset>(
  (n) => n >= -100 && n <= 100,
  (n) => Brand.error(`RopeOffset must be between -100 and 100, got ${n}`)
);

// ── Types ──────────────────────────────────────────────────────
export interface Question {
  text: string;
  answer: number;
}

// ── Random service ─────────────────────────────────────────────
const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));
const randomFloat = () => Effect.sync(() => Math.random());

// ── Effect-based functions ─────────────────────────────────────
export const genQuestionEffect = (difficulty: string, operations: string): Effect.Effect<Question> =>
  Effect.gen(function* () {
    const ranges: Record<string, number> = { easy: 10, medium: 20, hard: 50 };
    const max = ranges[difficulty] || 20;

    let op: string;
    if (operations === 'add') op = '+';
    else if (operations === 'sub') op = '−';
    else if (operations === 'mul') op = '×';
    else if (operations === 'mix') op = (yield* randomFloat()) < 0.5 ? '+' : '−';
    else {
      const ops = ['+', '−', '×'];
      op = ops[yield* randomInt(3)];
    }

    let a: number, b: number, answer: number;
    if (op === '×') {
      a = (yield* randomInt(12)) + 1;
      b = (yield* randomInt(12)) + 1;
      answer = a * b;
    } else if (op === '−') {
      a = (yield* randomInt(max)) + 1;
      b = (yield* randomInt(a)) + 1;
      answer = a - b;
    } else {
      a = (yield* randomInt(max)) + 1;
      b = (yield* randomInt(max)) + 1;
      answer = a + b;
    }

    return { text: `${a} ${op} ${b} = ?`, answer };
  });

export const clampRopeOffsetEffect = (offset: number): Effect.Effect<number> =>
  Effect.succeed(Math.max(-100, Math.min(100, offset)));

export const calcRopeOffsetEffect = (current: number, team: number, delta: number = 8): Effect.Effect<number> =>
  pipe(
    Effect.succeed(current + (team === 1 ? -delta : delta)),
    Effect.flatMap(clampRopeOffsetEffect)
  );

export const determineWinnerEffect = (score1: number, score2: number): Effect.Effect<string> =>
  Effect.succeed(
    score1 > score2 ? '🏆 Team 1 Wins!' :
    score2 > score1 ? '🏆 Team 2 Wins!' :
    "🤝 It's a Tie!"
  );

export const checkAnswerEffect = (userAnswer: number, correctAnswer: number): Either.Either<string, string> =>
  userAnswer === correctAnswer
    ? Either.right('Correct!')
    : Either.left(`Wrong! Expected ${correctAnswer}`);

export const formatTimeEffect = (seconds: number): Effect.Effect<string> =>
  Effect.succeed(
    `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
  );

// ── Plain wrappers (backward-compatible exports) ───────────────
export function genQuestion(difficulty: string, operations: string): Question {
  return Effect.runSync(genQuestionEffect(difficulty, operations));
}

export function clampRopeOffset(offset: number): number {
  return Effect.runSync(clampRopeOffsetEffect(offset));
}

export function calcRopeOffset(current: number, team: number, delta: number = 8): number {
  return Effect.runSync(calcRopeOffsetEffect(current, team, delta));
}

export function determineWinner(score1: number, score2: number): string {
  return Effect.runSync(determineWinnerEffect(score1, score2));
}

export function formatTime(seconds: number): string {
  return Effect.runSync(formatTimeEffect(seconds));
}
