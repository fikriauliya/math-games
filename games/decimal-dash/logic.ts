import { Effect, Either } from 'effect';

export type RoundType = 'place' | 'compare';
export interface PlaceRound { type: 'place'; target: number; min: number; max: number; }
export interface CompareRound { type: 'compare'; a: number; b: number; answer: 'a' | 'b' | 'equal'; }
export type Round = PlaceRound | CompareRound;

export const TOTAL_ROUNDS = 10;

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const generateRoundEffect = (roundNum: number): Effect.Effect<Round> =>
  Effect.gen(function* () {
    const isCompare = (yield* randomInt(2)) === 0;
    if (isCompare) {
      const decimals = roundNum < 5 ? 1 : 2;
      const factor = Math.pow(10, decimals);
      const a = ((yield* randomInt(factor - 1)) + 1) / factor;
      let b: number;
      if ((yield* randomInt(5)) === 0) { b = a; } // occasional equal
      else { b = ((yield* randomInt(factor - 1)) + 1) / factor; }
      const answer = a > b ? 'a' as const : a < b ? 'b' as const : 'equal' as const;
      return { type: 'compare' as const, a: parseFloat(a.toFixed(decimals)), b: parseFloat(b.toFixed(decimals)), answer };
    } else {
      const decimals = roundNum < 5 ? 1 : 2;
      const factor = Math.pow(10, decimals);
      const target = ((yield* randomInt(factor - 2)) + 1) / factor;
      return { type: 'place' as const, target: parseFloat(target.toFixed(decimals)), min: 0, max: 1 };
    }
  });

export const checkPlacementEffect = (placed: number, target: number): Effect.Effect<{ correct: boolean; accuracy: number }> =>
  Effect.succeed(checkPlacement(placed, target));

export const checkCompareEffect = (userAnswer: 'a' | 'b' | 'equal', correct: 'a' | 'b' | 'equal'): Either.Either<string, string> =>
  userAnswer === correct ? Either.right('Correct!') : Either.left('Wrong!');

export const getResultTextEffect = (score: number, total: number): Effect.Effect<{ emoji: string; title: string; sub: string }> =>
  Effect.succeed(getResultText(score, total));

// ── Plain wrappers ─────────────────────────────────────────────
export function generateRound(roundNum: number): Round {
  return Effect.runSync(generateRoundEffect(roundNum));
}

export function checkPlacement(placed: number, target: number): { correct: boolean; accuracy: number } {
  const accuracy = Math.round((1 - Math.abs(placed - target)) * 100);
  return { correct: accuracy >= 85, accuracy: Math.max(0, accuracy) };
}

export function checkCompare(userAnswer: 'a' | 'b' | 'equal', correct: 'a' | 'b' | 'equal'): boolean {
  return userAnswer === correct;
}

export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  const pct = score / total;
  return {
    emoji: pct >= 1 ? '🏆' : pct >= 0.7 ? '🚀' : '💫',
    title: pct >= 1 ? 'Perfect Mission!' : pct >= 0.7 ? 'Great Navigation!' : 'Keep Exploring!',
    sub: `${score} / ${total} correct!`,
  };
}
