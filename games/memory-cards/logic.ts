import { Effect } from 'effect';

export interface Card {
  id: number;
  emoji: string;
  matched: boolean;
  flipped: boolean;
}

export const THEMES: Record<string, string[]> = {
  animals: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'],
  food: ['🍕','🍔','🌮','🍣','🍩','🍪','🧁','🍫'],
  sports: ['⚽','🏀','🏈','⚾','🎾','🏐','🏓','⛳'],
};

export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* Effect.sync(() => Math.floor(Math.random() * (i + 1)));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export const createBoardEffect = (theme: string): Effect.Effect<Card[]> =>
  Effect.gen(function* () {
    const emojis = THEMES[theme] || THEMES.animals;
    const pairs = [...emojis, ...emojis];
    const shuffled = yield* shuffleEffect(pairs);
    return shuffled.map((emoji, i) => ({ id: i, emoji, matched: false, flipped: false }));
  });

export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
export function createBoard(theme: string): Card[] { return Effect.runSync(createBoardEffect(theme)); }

export function checkMatch(a: Card, b: Card): boolean {
  return a.emoji === b.emoji && a.id !== b.id;
}

export function isComplete(cards: Card[]): boolean {
  return cards.every(c => c.matched);
}

export function getResultText(flips: number, seconds: number): { emoji: string; title: string; sub: string } {
  return {
    emoji: flips <= 20 ? '🏆' : flips <= 30 ? '🎉' : '💪',
    title: flips <= 20 ? 'Amazing Memory!' : flips <= 30 ? 'Great Job!' : 'Well Done!',
    sub: `${flips} flips in ${seconds}s`,
  };
}
