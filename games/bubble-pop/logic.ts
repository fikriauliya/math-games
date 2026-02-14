import { Effect, pipe, Either, Option } from 'effect';

// ── Constants ──────────────────────────────────────────────────
export const COLORS = ['#f093fb','#f5576c','#00d2ff','#3a7bd5','#ffd700','#4caf50','#ff6b6b','#a29bfe','#fd79a8','#00cec9'];

// ── Random helpers ─────────────────────────────────────────────
const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));
const randomFloat = () => Effect.sync(() => Math.random());

// ── Effect-based functions ─────────────────────────────────────
export const generateTargetEffect = (mode: string): Effect.Effect<number> =>
  Effect.gen(function* () {
    return mode === 'single'
      ? (yield* randomInt(20)) + 1
      : (yield* randomInt(15)) + 5;
  });

export const generateBubbleNumberEffect = (mode: string, target: number): Effect.Effect<number> =>
  Effect.gen(function* () {
    if ((yield* randomFloat()) < 0.3) {
      if (mode === 'single') return target;
      return (yield* randomInt(target - 1)) + 1;
    }
    return (yield* randomInt(20)) + 1;
  });

export const checkSingleMatchEffect = (num: number, target: number): Either.Either<string, string> =>
  num === target ? Either.right('Match!') : Either.left('No match');

export const checkPairMatchEffect = (num1: number, num2: number, target: number): Either.Either<string, string> =>
  num1 + num2 === target ? Either.right('Pair match!') : Either.left('No pair match');

export const calcPopScoreEffect = (combo: number, mode: string): Effect.Effect<number> =>
  Effect.succeed((() => {
    const base = mode === 'single' ? 10 : 20;
    return base * Math.min(combo, 5);
  })());

export const getResultTitleEffect = (score: number): Effect.Effect<string> =>
  Effect.succeed(
    score >= 500 ? '🏆 AMAZING!' :
    score >= 200 ? '⭐ Great Job!' :
    '💪 Keep Going!'
  );

// ── Plain wrappers ─────────────────────────────────────────────
export function generateTarget(mode: string): number {
  return Effect.runSync(generateTargetEffect(mode));
}

export function generateBubbleNumber(mode: string, target: number): number {
  return Effect.runSync(generateBubbleNumberEffect(mode, target));
}

export function checkSingleMatch(num: number, target: number): boolean {
  return num === target;
}

export function checkPairMatch(num1: number, num2: number, target: number): boolean {
  return num1 + num2 === target;
}

export function calcPopScore(combo: number, mode: string): number {
  return Effect.runSync(calcPopScoreEffect(combo, mode));
}

export function getResultTitle(score: number): string {
  return Effect.runSync(getResultTitleEffect(score));
}
