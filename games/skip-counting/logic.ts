import { Effect, Either } from 'effect';

export interface SkipRound {
  step: number;
  sequence: (number | null)[];
  answers: number[];
  choices: number[];
}

export const TOTAL_ROUNDS = 10;
const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* randomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export const generateRoundEffect = (roundNum: number): Effect.Effect<SkipRound> =>
  Effect.sync(() => {
    const rand = (max: number) => Math.floor(Math.random() * max);
    const steps = roundNum < 3 ? [2, 5, 10] : roundNum < 6 ? [2, 3, 5, 10] : [2, 3, 4, 5, 6, 7, 10];
    const step = steps[rand(steps.length)];
    const start = step * (rand(5) + 1);
    const full: number[] = [];
    for (let i = 0; i < 6; i++) full.push(start + step * i);

    const blankCount = roundNum < 4 ? 1 : 2;
    const indices = [1, 2, 3, 4];
    // shuffle indices
    for (let i = indices.length - 1; i > 0; i--) {
      const j = rand(i + 1);
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const blankIndices = indices.slice(0, blankCount);
    const answers: number[] = blankIndices.map(i => full[i]);
    const sequence: (number | null)[] = full.map((n, i) => blankIndices.includes(i) ? null : n);

    const choiceSet = new Set(answers);
    while (choiceSet.size < answers.length + 3) {
      const wrong = answers[0] + (rand(10) - 5) * step;
      if (wrong > 0 && !answers.includes(wrong)) choiceSet.add(wrong);
    }
    const arr = [...choiceSet];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = rand(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return { step, sequence, answers, choices: arr };
  });

export const checkAnswerEffect = (answer: number, expected: number): Either.Either<string, string> =>
  answer === expected ? Either.right('Correct!') : Either.left('Wrong!');

export const getResultTextEffect = (score: number, total: number): Effect.Effect<{ emoji: string; title: string; sub: string }> =>
  Effect.succeed(getResultText(score, total));

// ── Plain wrappers ─────────────────────────────────────────────
export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
export function generateRound(roundNum: number): SkipRound { return Effect.runSync(generateRoundEffect(roundNum)); }
export function checkAnswer(answer: number, expected: number): boolean { return answer === expected; }
export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  const pct = score / total;
  return {
    emoji: pct >= 1 ? '🏆' : pct >= 0.7 ? '⭐' : '💪',
    title: pct >= 1 ? 'Perfect!' : pct >= 0.7 ? 'Great Job!' : 'Keep Trying!',
    sub: `${score} / ${total} correct!`,
  };
}
