import { Effect, Either } from 'effect';

export type Difficulty = 'easy' | 'medium' | 'hard';
export interface GLRound { a: number; b: number; answer: '>' | '<' | '='; }

export const GAME_DURATION = 60;
const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const generateRoundEffect = (diff: Difficulty): Effect.Effect<GLRound> =>
  Effect.gen(function* () {
    if (diff === 'hard') {
      const useDecimal = (yield* randomInt(2)) === 0;
      if (useDecimal) {
        const a = parseFloat(((yield* randomInt(100)) / 10).toFixed(1));
        const b = parseFloat(((yield* randomInt(100)) / 10).toFixed(1));
        return { a, b, answer: a > b ? '>' as const : a < b ? '<' as const : '=' as const };
      }
      const a = (yield* randomInt(100)) + 1;
      const b = (yield* randomInt(100)) + 1;
      return { a, b, answer: a > b ? '>' as const : a < b ? '<' as const : '=' as const };
    }
    const max = diff === 'easy' ? 20 : 100;
    const a = (yield* randomInt(max)) + 1;
    const makeEqual = (yield* randomInt(8)) === 0;
    const b = makeEqual ? a : (yield* randomInt(max)) + 1;
    return { a, b, answer: a > b ? '>' as const : a < b ? '<' as const : '=' as const };
  });

export const checkAnswerEffect = (userAnswer: string, correct: string): Either.Either<string, string> =>
  userAnswer === correct ? Either.right('Correct!') : Either.left('Wrong!');

// ── Plain wrappers ─────────────────────────────────────────────
export function generateRound(diff: Difficulty): GLRound { return Effect.runSync(generateRoundEffect(diff)); }
export function checkAnswer(userAnswer: string, correct: string): boolean { return userAnswer === correct; }
export function getResultText(score: number): { emoji: string; title: string; sub: string } {
  return {
    emoji: score >= 30 ? '🏆' : score >= 20 ? '🥊' : score >= 10 ? '⭐' : '💪',
    title: score >= 30 ? 'Champion!' : score >= 20 ? 'Great Fighter!' : score >= 10 ? 'Good Job!' : 'Keep Punching!',
    sub: `${score} correct in 60 seconds!`,
  };
}
