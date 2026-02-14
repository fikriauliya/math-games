import { Effect, Either } from 'effect';

export interface Vehicle { emoji: string; name: string; }

export const VEHICLES: Vehicle[] = [
  { emoji: '🚗', name: 'Mobil' },
  { emoji: '🚌', name: 'Bus' },
  { emoji: '🚛', name: 'Truk' },
  { emoji: '🚲', name: 'Sepeda' },
  { emoji: '✈️', name: 'Pesawat' },
  { emoji: '🚢', name: 'Kapal' },
  { emoji: '🚂', name: 'Kereta' },
  { emoji: '🚁', name: 'Helikopter' },
];

export const TOTAL = 8;
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

export const getOptionsEffect = (correct: Vehicle, all: Vehicle[]): Effect.Effect<Vehicle[]> =>
  Effect.gen(function* () {
    const others = all.filter(v => v.name !== correct.name);
    const wrong = (yield* shuffleEffect(others))[0];
    return yield* shuffleEffect([correct, wrong]);
  });

export const checkAnswerEffect = (answer: string, correct: string): Either.Either<string, string> =>
  answer === correct ? Either.right('Benar!') : Either.left('Salah!');

export const getResultTextEffect = (score: number, total: number): Effect.Effect<{ emoji: string; title: string; sub: string }> =>
  Effect.succeed(getResultText(score, total));

// ── Plain wrappers ─────────────────────────────────────────────
export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
export function getOptions(correct: Vehicle, all: Vehicle[]): Vehicle[] { return Effect.runSync(getOptionsEffect(correct, all)); }
export function checkAnswer(answer: string, correct: string): boolean { return answer === correct; }
export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  const pct = score / total;
  return {
    emoji: pct >= 1 ? '🏆' : pct >= 0.6 ? '🎉' : '💪',
    title: pct >= 1 ? 'Hebat Sekali!' : pct >= 0.6 ? 'Bagus!' : 'Ayo Coba Lagi!',
    sub: `${score} dari ${total} benar!`,
  };
}
