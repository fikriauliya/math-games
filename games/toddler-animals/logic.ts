import { Effect, Either } from 'effect';

// ── Types ──────────────────────────────────────────────────────
export interface Animal {
  emoji: string;
  name: string;
  sound: string;
  wrong: string[];
}

// ── Constants ──────────────────────────────────────────────────
export const ANIMALS: Animal[] = [
  { emoji: '🐄', name: 'Sapi', sound: 'Mooo!', wrong: ['Guk guk!', 'Meong!', 'Kukuruyuk!'] },
  { emoji: '🐔', name: 'Ayam', sound: 'Kukuruyuk!', wrong: ['Mooo!', 'Mbee!', 'Kwek kwek!'] },
  { emoji: '🐱', name: 'Kucing', sound: 'Meong!', wrong: ['Guk guk!', 'Cit cit!', 'Mooo!'] },
  { emoji: '🐶', name: 'Anjing', sound: 'Guk guk!', wrong: ['Meong!', 'Mooo!', 'Mbee!'] },
  { emoji: '🐸', name: 'Katak', sound: 'Koak koak!', wrong: ['Cit cit!', 'Guk guk!', 'Kukuruyuk!'] },
  { emoji: '🐑', name: 'Domba', sound: 'Mbee!', wrong: ['Mooo!', 'Guk guk!', 'Koak koak!'] },
  { emoji: '🦆', name: 'Bebek', sound: 'Kwek kwek!', wrong: ['Kukuruyuk!', 'Cit cit!', 'Meong!'] },
  { emoji: '🐦', name: 'Burung', sound: 'Cit cit!', wrong: ['Kwek kwek!', 'Koak koak!', 'Mbee!'] },
  { emoji: '🐷', name: 'Babi', sound: 'Oink oink!', wrong: ['Mooo!', 'Guk guk!', 'Mbee!'] },
  { emoji: '🦁', name: 'Singa', sound: 'Aum!', wrong: ['Guk guk!', 'Meong!', 'Mooo!'] },
];

export const TOTAL = 6;

// ── Random helpers ─────────────────────────────────────────────
const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

// ── Effect-based functions ─────────────────────────────────────
export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* randomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export const checkAnswerEffect = (answer: string, correctSound: string): Either.Either<string, string> =>
  answer === correctSound ? Either.right('Correct!') : Either.left('Wrong!');

export const getOptionsEffect = (animal: Animal): Effect.Effect<string[]> =>
  Effect.gen(function* () {
    const wrongPick = (yield* shuffleEffect([...animal.wrong])).slice(0, 3);
    return yield* shuffleEffect([animal.sound, ...wrongPick]);
  });

export const getResultTextEffect = (score: number, total: number): Effect.Effect<{ emoji: string; title: string; sub: string }> =>
  Effect.succeed((() => {
    const perfect = score === total;
    const good = score >= total * 0.6;
    return {
      emoji: perfect ? '🏆' : good ? '🎉' : '💪',
      title: perfect ? 'Hebat Sekali!' : good ? 'Bagus!' : 'Ayo Coba Lagi!',
      sub: `${score} dari ${total} benar!`,
    };
  })());

// ── Plain wrappers ─────────────────────────────────────────────
export function shuffle<T>(a: T[]): T[] {
  return Effect.runSync(shuffleEffect(a));
}

export function checkAnswer(answer: string, correctSound: string): boolean {
  return answer === correctSound;
}

export function getOptions(animal: Animal): string[] {
  return Effect.runSync(getOptionsEffect(animal));
}

export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  return Effect.runSync(getResultTextEffect(score, total));
}
