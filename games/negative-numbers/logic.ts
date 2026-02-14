import { Effect, Either } from 'effect';

export type QType = 'add' | 'subtract' | 'compare';

export interface Question {
  text: string;
  answer: number | string;
  choices: (number | string)[];
  type: QType;
}

export const TOTAL = 10;

const randomInt = (min: number, max: number) => Effect.sync(() => Math.floor(Math.random() * (max - min + 1)) + min);

export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* Effect.sync(() => Math.floor(Math.random() * (i + 1)));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export const genQuestionEffect = (): Effect.Effect<Question> =>
  Effect.gen(function* () {
    const typeRoll = yield* randomInt(0, 2);
    const qType: QType = typeRoll === 0 ? 'add' : typeRoll === 1 ? 'subtract' : 'compare';

    if (qType === 'compare') {
      const a = yield* randomInt(-20, 20);
      let b = yield* randomInt(-20, 20);
      while (b === a) b = yield* randomInt(-20, 20);
      const answer = a < b ? a : b;
      const choices = yield* shuffleEffect([a, b]);
      return { text: `Mana yang lebih kecil: ${a} atau ${b}?`, answer, choices, type: qType };
    }

    const a = yield* randomInt(-15, 15);
    const b = yield* randomInt(-15, 15);
    const ans = qType === 'add' ? a + b : a - b;
    const op = qType === 'add' ? '+' : '−';
    const text = `${a} ${op} ${b >= 0 ? b : `(${b})`} = ?`;

    const choiceSet = new Set([ans]);
    while (choiceSet.size < 4) {
      const off = yield* randomInt(-5, 5);
      if (off !== 0) choiceSet.add(ans + off);
    }
    const choices = yield* shuffleEffect([...choiceSet]);
    return { text, answer: ans, choices, type: qType };
  });

export const checkAnswerEffect = (answer: number | string, correct: number | string): Either.Either<string, string> =>
  answer === correct ? Either.right('Correct!') : Either.left('Wrong!');

export const getResultEffect = (score: number, total: number): Effect.Effect<{ emoji: string; title: string; sub: string }> =>
  Effect.succeed((() => {
    const pct = score / total;
    return {
      emoji: pct === 1 ? '🏆' : pct >= 0.7 ? '🎉' : '💪',
      title: pct === 1 ? 'Perfect!' : pct >= 0.7 ? 'Great Job!' : 'Keep Practicing!',
      sub: `${score} out of ${total} correct!`,
    };
  })());

// Plain wrappers
export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
export function genQuestion(): Question { return Effect.runSync(genQuestionEffect()); }
export function checkAnswer(answer: number | string, correct: number | string): boolean { return answer === correct; }
export function getResult(score: number, total: number) { return Effect.runSync(getResultEffect(score, total)); }
