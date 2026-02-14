import { Effect } from 'effect';

export interface ColorMixQuestion {
  color1: string;
  color2: string;
  answer: string;
  options: string[];
}

interface MixRule { a: string; b: string; result: string; }

const MIXES: MixRule[] = [
  { a: 'Red', b: 'Blue', result: 'Purple' },
  { a: 'Red', b: 'Yellow', result: 'Orange' },
  { a: 'Blue', b: 'Yellow', result: 'Green' },
  { a: 'Red', b: 'White', result: 'Pink' },
  { a: 'Blue', b: 'White', result: 'Light Blue' },
  { a: 'Red', b: 'Green', result: 'Brown' },
  { a: 'Blue', b: 'Orange', result: 'Brown' },
  { a: 'Yellow', b: 'Purple', result: 'Brown' },
  { a: 'Black', b: 'White', result: 'Gray' },
  { a: 'Red', b: 'Black', result: 'Maroon' },
];

export const ALL_COLORS = ['Red','Blue','Yellow','Green','Orange','Purple','Pink','Brown','Light Blue','Gray','Maroon','White','Black'];

export const COLOR_HEX: Record<string, string> = {
  Red: '#f44336', Blue: '#2196F3', Yellow: '#FFEB3B', Green: '#4CAF50',
  Orange: '#FF9800', Purple: '#9C27B0', Pink: '#E91E63', Brown: '#795548',
  'Light Blue': '#03A9F4', Gray: '#9E9E9E', Maroon: '#800000', White: '#FFFFFF', Black: '#212121',
};

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const shuffleEffect = <T>(arr: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = yield* randomInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  });

export const generateQuestionEffect = (round: number): Effect.Effect<ColorMixQuestion> =>
  Effect.gen(function* () {
    const pool = round < 5 ? MIXES.slice(0, 5) : MIXES;
    const mix = pool[yield* randomInt(pool.length)];
    const swap = (yield* randomInt(2)) === 0;
    const color1 = swap ? mix.b : mix.a;
    const color2 = swap ? mix.a : mix.b;
    const wrongs = new Set<string>();
    while (wrongs.size < 3) {
      const c = ALL_COLORS[yield* randomInt(ALL_COLORS.length)];
      if (c !== mix.result) wrongs.add(c);
    }
    const options = yield* shuffleEffect([mix.result, ...wrongs]);
    return { color1, color2, answer: mix.result, options };
  });

export const TOTAL = 10;

export function generateQuestion(round: number): ColorMixQuestion {
  return Effect.runSync(generateQuestionEffect(round));
}

export function checkAnswer(selected: string, correct: string): boolean {
  return selected === correct;
}

export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  const perfect = score === total;
  const good = score >= total * 0.6;
  return {
    emoji: perfect ? '🎨' : good ? '🖌️' : '💪',
    title: perfect ? 'Master Artist!' : good ? 'Great Mixing!' : 'Keep Painting!',
    sub: `${score} of ${total} correct!`,
  };
}
