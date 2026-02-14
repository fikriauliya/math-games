import { Effect, Either } from 'effect';

export const TOTAL = 8;

export interface FingerQuestion {
  count: number;
  emoji: string;
  options: number[];
}

const HAND_EMOJIS: Record<number, string> = {
  1: '☝️',
  2: '✌️',
  3: '🤟',
  4: '🖖',
  5: '✋',
};

const randomInt = (min: number, max: number) => Effect.sync(() => Math.floor(Math.random() * (max - min + 1)) + min);

export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* randomInt(0, i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export const generateQuestionEffect = (): Effect.Effect<FingerQuestion> =>
  Effect.gen(function* () {
    const count = yield* randomInt(1, 5);
    const emoji = HAND_EMOJIS[count];
    // Generate one wrong answer
    let wrong: number;
    do { wrong = yield* randomInt(1, 5); } while (wrong === count);
    const options = yield* shuffleEffect([count, wrong]);
    return { count, emoji, options };
  });

export const checkAnswerEffect = (answer: number, correct: number): Either.Either<string, string> =>
  answer === correct ? Either.right('Benar!') : Either.left('Salah!');

export const getResultText = (score: number, total: number) => {
  const perfect = score === total;
  const good = score >= total * 0.6;
  return {
    emoji: perfect ? '🏆' : good ? '🎉' : '💪',
    title: perfect ? 'Hebat Sekali!' : good ? 'Bagus!' : 'Ayo Coba Lagi!',
    sub: `${score} dari ${total} benar!`,
  };
};

export function getHandEmoji(count: number): string {
  return HAND_EMOJIS[count] || '✋';
}

// Plain wrappers
export function generateQuestion(): FingerQuestion { return Effect.runSync(generateQuestionEffect()); }
export function checkAnswer(answer: number, correct: number): boolean { return answer === correct; }
export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
