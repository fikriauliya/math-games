import { Effect, Either } from 'effect';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  text: string;
  answer: number;
  choices: number[];
  hasRemainder: boolean;
}

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const genQuestionEffect = (diff: Difficulty): Effect.Effect<Question> =>
  Effect.gen(function* () {
    const maxDiv: Record<Difficulty, number> = { easy: 5, medium: 10, hard: 12 };
    const divisor = (yield* randomInt(maxDiv[diff])) + 1;
    let dividend: number, answer: number, hasRemainder = false;

    if (diff === 'hard' && (yield* randomInt(3)) === 0) {
      // With remainder
      const quotient = (yield* randomInt(10)) + 1;
      const remainder = (yield* randomInt(divisor - 1)) + 1;
      dividend = quotient * divisor + remainder;
      answer = quotient;
      hasRemainder = true;
    } else {
      const quotient = (yield* randomInt(12)) + 1;
      dividend = quotient * divisor;
      answer = quotient;
    }

    const text = hasRemainder ? `${dividend} ÷ ${divisor} = ? (no remainder)` : `${dividend} ÷ ${divisor} = ?`;
    const choices = new Set([answer]);
    while (choices.size < 4) {
      const wrong = answer + (yield* randomInt(10)) - 5;
      if (wrong !== answer && wrong > 0) choices.add(wrong);
    }
    return { text, answer, choices: [...choices].sort((a, b) => a - b), hasRemainder };
  });

export const validateAnswer = (user: number, correct: number): Either.Either<string, string> =>
  user === correct ? Either.right('Correct!') : Either.left(`Wrong! Answer: ${correct}`);

export const calcScore = (streak: number, timeLeft: number): number =>
  10 + Math.min(streak, 5) * 5 + Math.floor(timeLeft / 10);

export const getGrade = (score: number, total: number): { grade: string; message: string } => {
  const pct = (score / (total * 15)) * 100;
  if (pct >= 90) return { grade: 'S', message: '🏆 SPEED DEMON!' };
  if (pct >= 75) return { grade: 'A', message: '⭐ Great Speed!' };
  if (pct >= 50) return { grade: 'B', message: '👍 Nice Run!' };
  return { grade: 'C', message: '💪 Keep Practicing!' };
};

export function genQuestion(diff: Difficulty): Question {
  return Effect.runSync(genQuestionEffect(diff));
}
