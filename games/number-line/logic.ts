import { Effect, Either } from 'effect';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface LineQuestion {
  target: number;
  min: number;
  max: number;
  step: number;
}

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const TOTAL_ROUNDS = 10;

export const DIFFICULTY_CONFIG: Record<Difficulty, { min: number; max: number; step: number }> = {
  easy: { min: 0, max: 20, step: 1 },
  medium: { min: 0, max: 50, step: 5 },
  hard: { min: 0, max: 100, step: 10 },
};

export const generateQuestionEffect = (diff: Difficulty): Effect.Effect<LineQuestion> =>
  Effect.gen(function* () {
    const config = DIFFICULTY_CONFIG[diff];
    const range = config.max - config.min;
    const target = config.min + (yield* randomInt(range + 1));
    return { target, ...config };
  });

export const getStars = (guess: number, target: number, max: number): number => {
  const range = max;
  const error = Math.abs(guess - target);
  const pct = error / range;
  return pct === 0 ? 3 : pct <= 0.05 ? 2 : pct <= 0.15 ? 1 : 0;
};

export const calcScore = (totalStars: number): number => totalStars * 10;

export const getGrade = (totalStars: number, maxStars: number): { grade: string; message: string } => {
  const pct = totalStars / maxStars * 100;
  const grade = pct >= 95 ? 'S' : pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
  const message = pct >= 90 ? '🏆 AMAZING!' : pct >= 70 ? '⭐ Great Job!' : '💪 Keep Practicing!';
  return { grade, message };
};

// ── Plain wrappers ─────────────────────────────────────────────
export function generateQuestion(diff: Difficulty): LineQuestion {
  return Effect.runSync(generateQuestionEffect(diff));
}
