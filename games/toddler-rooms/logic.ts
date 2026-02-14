import { Effect, Either } from 'effect';

export interface Room {
  emoji: string;
  name: string;
}

export const ROOMS: Room[] = [
  { emoji: '🍳', name: 'Dapur' },
  { emoji: '🛏️', name: 'Kamar' },
  { emoji: '🚿', name: 'Kamar Mandi' },
  { emoji: '🛋️', name: 'Ruang Tamu' },
  { emoji: '🌳', name: 'Taman' },
  { emoji: '🚗', name: 'Garasi' },
  { emoji: '🪑', name: 'Meja' },
  { emoji: '🚪', name: 'Pintu' },
];

export const TOTAL = 8;

export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* Effect.sync(() => Math.floor(Math.random() * (i + 1)));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export const genRoundEffect = (target: Room, all: Room[]): Effect.Effect<Room[]> =>
  Effect.gen(function* () {
    const others = all.filter(r => r.name !== target.name);
    const shuffled = yield* shuffleEffect(others);
    return yield* shuffleEffect([target, shuffled[0]]);
  });

export const checkAnswerEffect = (a: string, b: string): Either.Either<string, string> =>
  a === b ? Either.right('Benar!') : Either.left('Salah!');

export const getResultEffect = (score: number, total: number): Effect.Effect<{ emoji: string; title: string; sub: string }> =>
  Effect.succeed((() => {
    const pct = score / total;
    return {
      emoji: pct === 1 ? '🏆' : pct >= 0.6 ? '🎉' : '💪',
      title: pct === 1 ? 'Hebat Sekali!' : pct >= 0.6 ? 'Bagus!' : 'Ayo Coba Lagi!',
      sub: `${score} dari ${total} benar!`,
    };
  })());

export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
export function genRound(target: Room, all: Room[]): Room[] { return Effect.runSync(genRoundEffect(target, all)); }
export function checkAnswer(a: string, b: string): boolean { return a === b; }
export function getResult(score: number, total: number) { return Effect.runSync(getResultEffect(score, total)); }
