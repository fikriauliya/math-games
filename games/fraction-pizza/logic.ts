import { Effect, Either } from 'effect';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface FractionQuestion {
  numerator: number;
  denominator: number;
  display: string;
}

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const TOTAL_ROUNDS = 8;

export const DIFFICULTY_DENOMS: Record<Difficulty, number[]> = {
  easy: [2, 4],
  medium: [3, 4, 6],
  hard: [3, 4, 6, 8],
};

export const generateQuestionEffect = (diff: Difficulty): Effect.Effect<FractionQuestion> =>
  Effect.gen(function* () {
    const denoms = DIFFICULTY_DENOMS[diff];
    const denom = denoms[yield* randomInt(denoms.length)];
    const numer = (yield* randomInt(denom)) + 1; // 1 to denom
    return {
      numerator: numer,
      denominator: denom,
      display: `${numer}/${denom}`,
    };
  });

export const checkSlices = (selected: number, numerator: number): boolean => selected === numerator;

export const validateSlices = (selected: number, numerator: number): Either.Either<string, string> =>
  selected === numerator ? Either.right('Correct!') : Either.left(`Wrong! Need ${numerator}`);

export const calcScore = (correct: number): number => correct * 10;

export const getGrade = (correct: number, total: number): { grade: string; message: string } => {
  const pct = correct / total * 100;
  const grade = pct >= 95 ? 'S' : pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
  const message = pct >= 90 ? '🏆 AMAZING!' : pct >= 70 ? '⭐ Great Job!' : '💪 Keep Practicing!';
  return { grade, message };
};

// ── Plain wrappers ─────────────────────────────────────────────
export function generateQuestion(diff: Difficulty): FractionQuestion {
  return Effect.runSync(generateQuestionEffect(diff));
}
