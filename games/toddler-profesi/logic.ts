import { Effect, Either } from 'effect';

export interface Profesi {
  emoji: string;
  name: string;
}

export const PROFESI_LIST: Profesi[] = [
  { emoji: '👨‍⚕️', name: 'Dokter' },
  { emoji: '👩‍🏫', name: 'Guru' },
  { emoji: '👮', name: 'Polisi' },
  { emoji: '👨‍🌾', name: 'Petani' },
  { emoji: '👨‍🍳', name: 'Koki' },
  { emoji: '🎨', name: 'Pelukis' },
  { emoji: '👨‍🚀', name: 'Astronaut' },
  { emoji: '🧑‍🚒', name: 'Pemadam' },
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

export const genRoundEffect = (target: Profesi, all: Profesi[]): Effect.Effect<Profesi[]> =>
  Effect.gen(function* () {
    const others = all.filter(p => p.name !== target.name);
    const shuffled = yield* shuffleEffect(others);
    const wrong = shuffled[0];
    return yield* shuffleEffect([target, wrong]);
  });

export const checkAnswerEffect = (answer: string, correct: string): Either.Either<string, string> =>
  answer === correct ? Either.right('Benar!') : Either.left('Salah!');

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
export function genRound(target: Profesi, all: Profesi[]): Profesi[] { return Effect.runSync(genRoundEffect(target, all)); }
export function checkAnswer(answer: string, correct: string): boolean { return answer === correct; }
export function getResult(score: number, total: number) { return Effect.runSync(getResultEffect(score, total)); }
