import { Effect, pipe, Schema } from 'effect';

// ── Schema-validated config ────────────────────────────────────
export interface DiffConfig {
  maxNum: number;
  ops: string[];
  speed: number;
  spawnMs: number;
  lives: number;
}

const DiffConfigSchema = Schema.Struct({
  maxNum: Schema.Number,
  ops: Schema.Array(Schema.String),
  speed: Schema.Number,
  spawnMs: Schema.Number,
  lives: Schema.Number,
});

export const CONFIG: Record<string, DiffConfig> = {
  easy:   { maxNum: 10, ops: ['+','-'], speed: 0.4, spawnMs: 3000, lives: 5 },
  medium: { maxNum: 12, ops: ['+','-','×'], speed: 0.6, spawnMs: 2200, lives: 4 },
  hard:   { maxNum: 15, ops: ['+','-','×','÷'], speed: 0.8, spawnMs: 1800, lives: 3 },
};

// ── Random helpers ─────────────────────────────────────────────
const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

// ── Effect-based functions ─────────────────────────────────────
export const genQuestionEffect = (diff: string): Effect.Effect<{ text: string; answer: number }> =>
  Effect.gen(function* () {
    const c = CONFIG[diff];
    const op = c.ops[yield* randomInt(c.ops.length)];
    let a: number, b: number, answer: number, text: string;
    switch (op) {
      case '+':
        a = (yield* randomInt(c.maxNum)) + 1;
        b = (yield* randomInt(c.maxNum)) + 1;
        answer = a + b; text = `${a} + ${b}`;
        break;
      case '-':
        a = (yield* randomInt(c.maxNum)) + 2;
        b = (yield* randomInt(a)) + 1;
        answer = a - b; text = `${a} − ${b}`;
        break;
      case '×':
        a = (yield* randomInt(c.maxNum)) + 1;
        b = (yield* randomInt(10)) + 2;
        answer = a * b; text = `${a} × ${b}`;
        break;
      case '÷':
      default:
        b = (yield* randomInt(9)) + 2;
        answer = (yield* randomInt(c.maxNum)) + 1;
        a = answer * b;
        text = `${a} ÷ ${b}`;
        break;
    }
    return { text, answer };
  });

export const calcPointsEffect = (combo: number): Effect.Effect<number> =>
  Effect.succeed(10 * (1 + Math.floor(combo / 3)));

export const calcAccuracyEffect = (slashed: number, missed: number): Effect.Effect<number> =>
  Effect.succeed(slashed + missed > 0 ? Math.round(slashed / (slashed + missed) * 100) : 0);

// ── Plain wrappers ─────────────────────────────────────────────
export function genQuestion(diff: string): { text: string; answer: number } {
  return Effect.runSync(genQuestionEffect(diff));
}

export function calcPoints(combo: number): number {
  return Effect.runSync(calcPointsEffect(combo));
}

export function calcAccuracy(slashed: number, missed: number): number {
  return Effect.runSync(calcAccuracyEffect(slashed, missed));
}
