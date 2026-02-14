import { Effect, Either } from 'effect';

export const TOTAL_ROUNDS = 15;

export interface WarRound {
  card1: number;
  card2: number;
  product: number;
  choices: number[];
}

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

export const generateRoundEffect = (): Effect.Effect<WarRound> =>
  Effect.gen(function* () {
    const card1 = yield* randomInt(1, 12);
    const card2 = yield* randomInt(1, 12);
    const product = card1 * card2;
    const wrongs = new Set<number>();
    while (wrongs.size < 3) {
      const w = yield* randomInt(Math.max(1, product - 20), product + 20);
      if (w !== product && w > 0) wrongs.add(w);
    }
    const choices = yield* shuffleEffect([product, ...wrongs]);
    return { card1, card2, product, choices };
  });

export const checkAnswerEffect = (answer: number, correct: number): Either.Either<string, string> =>
  answer === correct ? Either.right('Correct!') : Either.left('Wrong!');

export const getResultEffect = (p1: number, p2: number): Effect.Effect<{ winner: string; emoji: string; sub: string }> =>
  Effect.succeed((() => {
    if (p1 > p2) return { winner: 'Player 1', emoji: '🏆', sub: `${p1} - ${p2}` };
    if (p2 > p1) return { winner: 'Player 2', emoji: '🏆', sub: `${p2} - ${p1}` };
    return { winner: 'Tie', emoji: '🤝', sub: `${p1} - ${p2}` };
  })());

// Plain wrappers
export function generateRound(): WarRound { return Effect.runSync(generateRoundEffect()); }
export function checkAnswer(answer: number, correct: number): boolean { return answer === correct; }
export function getResult(p1: number, p2: number) { return Effect.runSync(getResultEffect(p1, p2)); }
export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
