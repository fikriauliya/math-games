import { Effect } from 'effect';

export interface Instrument {
  emoji: string;
  name: string;
}

export const INSTRUMENTS: Instrument[] = [
  { emoji: '🎸', name: 'Gitar' },
  { emoji: '🥁', name: 'Drum' },
  { emoji: '🎹', name: 'Piano' },
  { emoji: '🎻', name: 'Biola' },
  { emoji: '🎺', name: 'Terompet' },
  { emoji: '🪈', name: 'Seruling' },
  { emoji: '🪘', name: 'Tambur' },
  { emoji: '🪗', name: 'Harmonika' },
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

export interface RoundData {
  target: Instrument;
  choices: Instrument[];
}

export const generateRoundEffect = (available: Instrument[]): Effect.Effect<RoundData> =>
  Effect.gen(function* () {
    const shuffled = yield* shuffleEffect(available);
    const target = shuffled[0];
    const wrong = shuffled.find(f => f.name !== target.name)!;
    const choices = yield* shuffleEffect([target, wrong]);
    return { target, choices };
  });

export const checkAnswer = (selected: string, correct: string): boolean => selected === correct;

export const getResultText = (score: number, total: number): { emoji: string; title: string; sub: string } => {
  const perfect = score === total;
  const good = score >= total * 0.6;
  return {
    emoji: perfect ? '🏆' : good ? '🎉' : '💪',
    title: perfect ? 'Hebat Sekali!' : good ? 'Bagus!' : 'Ayo Coba Lagi!',
    sub: `${score} dari ${total} benar!`,
  };
};

export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
export function generateRound(available: Instrument[]): RoundData { return Effect.runSync(generateRoundEffect(available)); }
