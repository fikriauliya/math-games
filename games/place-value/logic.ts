import { Effect } from 'effect';

export type QuestionType = 'digit' | 'value';
export type Place = 'ones' | 'tens' | 'hundreds' | 'thousands';

export interface PVQuestion {
  number: number;
  place: Place;
  type: QuestionType;
  answer: number;
  options: number[];
}

const randomInt = (min: number, max: number) => Effect.sync(() => min + Math.floor(Math.random() * (max - min + 1)));

const PLACE_LABELS: Record<Place, string> = { ones: 'ones', tens: 'tens', hundreds: 'hundreds', thousands: 'thousands' };
const PLACE_MULTIPLIER: Record<Place, number> = { ones: 1, tens: 10, hundreds: 100, thousands: 1000 };

export const PLACES_BY_DIFFICULTY: Place[][] = [
  ['ones'], ['ones'], ['tens'], ['tens'],
  ['hundreds'], ['hundreds'], ['hundreds'],
  ['thousands'], ['thousands'], ['thousands'], ['thousands'], ['thousands'],
];

export function getDigitAt(num: number, place: Place): number {
  return Math.floor(num / PLACE_MULTIPLIER[place]) % 10;
}

export function getValueAt(num: number, place: Place): number {
  return getDigitAt(num, place) * PLACE_MULTIPLIER[place];
}

export const shuffleEffect = <T>(arr: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = yield* Effect.sync(() => Math.floor(Math.random() * (i + 1)));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  });

export const generateQuestionEffect = (round: number): Effect.Effect<PVQuestion> =>
  Effect.gen(function* () {
    const places = PLACES_BY_DIFFICULTY[Math.min(round, PLACES_BY_DIFFICULTY.length - 1)];
    const place = places[yield* randomInt(0, places.length - 1)];
    const type: QuestionType = (yield* randomInt(0, 1)) === 0 ? 'digit' : 'value';
    
    let num: number;
    if (place === 'thousands') num = yield* randomInt(1000, 9999);
    else if (place === 'hundreds') num = yield* randomInt(100, 9999);
    else if (place === 'tens') num = yield* randomInt(10, 999);
    else num = yield* randomInt(10, 999);

    const answer = type === 'digit' ? getDigitAt(num, place) : getValueAt(num, place);
    const wrongs = new Set<number>();
    while (wrongs.size < 3) {
      let w: number;
      if (type === 'digit') {
        w = yield* randomInt(0, 9);
      } else {
        w = (yield* randomInt(0, 9)) * PLACE_MULTIPLIER[place];
      }
      if (w !== answer) wrongs.add(w);
    }
    const options = yield* shuffleEffect([answer, ...wrongs]);
    return { number: num, place, type, answer, options };
  });

export const TOTAL = 12;

export function placeLabel(p: Place): string { return PLACE_LABELS[p]; }

export function generateQuestion(round: number): PVQuestion {
  return Effect.runSync(generateQuestionEffect(round));
}

export function checkAnswer(selected: number, correct: number): boolean {
  return selected === correct;
}

export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  const perfect = score === total;
  const good = score >= total * 0.6;
  return {
    emoji: perfect ? '🦸' : good ? '💥' : '💪',
    title: perfect ? 'Super Hero!' : good ? 'Great Power!' : 'Train Harder!',
    sub: `${score} of ${total} correct!`,
  };
}
