import { Effect, Option } from 'effect';

// ── Constants ──────────────────────────────────────────────────
export const EMOJIS = ['🍎','🍌','🌟','🐟','🦋','🌸','🎈','🍪','🐣','🍓','🧁','🐞','🌈','🎀','🍩'];
export const TOTAL = 8;

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

export const generateAnswerEffect = (): Effect.Effect<number> =>
  Effect.map(randomInt(5), n => n + 1);

export const pickEmojiEffect = (): Effect.Effect<string> =>
  Effect.map(randomInt(EMOJIS.length), i => EMOJIS[i]);

export const generateChoicesEffect = (answer: number): Effect.Effect<number[]> =>
  Effect.gen(function* () {
    const wrong = new Set<number>();
    while (wrong.size < 3) {
      const n = (yield* randomInt(5)) + 1;
      if (n !== answer) wrong.add(n);
    }
    return yield* shuffleEffect([answer, ...wrong]);
  });

export const getResultTextEffect = (score: number, total: number): Effect.Effect<{ emoji: string; title: string; sub: string }> =>
  Effect.succeed((() => {
    const perfect = score === total;
    const good = score >= total * 0.6;
    return {
      emoji: perfect ? '🏆' : good ? '🎉' : '💪',
      title: perfect ? 'Pintar Sekali!' : good ? 'Bagus!' : 'Ayo Lagi!',
      sub: `${score} dari ${total} benar!`,
    };
  })());

// ── Plain wrappers ─────────────────────────────────────────────
export function shuffle<T>(a: T[]): T[] {
  return Effect.runSync(shuffleEffect(a));
}

export function generateAnswer(): number {
  return Effect.runSync(generateAnswerEffect());
}

export function pickEmoji(): string {
  return Effect.runSync(pickEmojiEffect());
}

export function generateChoices(answer: number): number[] {
  return Effect.runSync(generateChoicesEffect(answer));
}

export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  return Effect.runSync(getResultTextEffect(score, total));
}
