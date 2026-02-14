import { Effect, Either } from 'effect';

export const TOTAL = 12;

export type QuestionType = 'area' | 'perimeter' | 'sides' | 'angles';

export interface GeoQuestion {
  text: string;
  shape: string;
  answer: number;
  choices: number[];
  type: QuestionType;
  dimensions?: { width?: number; height?: number; side?: number; radius?: number };
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

const SHAPES_SIDES: Record<string, number> = {
  triangle: 3, square: 4, pentagon: 5, hexagon: 6, heptagon: 7, octagon: 8,
};

export const generateQuestionEffect = (round: number): Effect.Effect<GeoQuestion> =>
  Effect.gen(function* () {
    const typeIdx = round % 4;
    const types: QuestionType[] = ['area', 'perimeter', 'sides', 'angles'];
    const type = types[typeIdx];

    let text: string, answer: number, shape: string;
    let dimensions: GeoQuestion['dimensions'] = {};

    if (type === 'sides') {
      const shapes = Object.keys(SHAPES_SIDES);
      const idx = yield* randomInt(0, shapes.length - 1);
      shape = shapes[idx];
      answer = SHAPES_SIDES[shape];
      text = `How many sides does a ${shape} have?`;
    } else if (type === 'angles') {
      const shapes = Object.keys(SHAPES_SIDES);
      const idx = yield* randomInt(0, shapes.length - 1);
      shape = shapes[idx];
      answer = (SHAPES_SIDES[shape] - 2) * 180;
      text = `Sum of interior angles of a ${shape}?`;
    } else if (type === 'area') {
      const shapeType = yield* randomInt(0, 1);
      if (shapeType === 0) {
        const w = yield* randomInt(2, 12);
        const h = yield* randomInt(2, 12);
        shape = 'rectangle';
        dimensions = { width: w, height: h };
        answer = w * h;
        text = `Area of a rectangle ${w} × ${h}?`;
      } else {
        const s = yield* randomInt(2, 10);
        shape = 'square';
        dimensions = { side: s };
        answer = s * s;
        text = `Area of a square with side ${s}?`;
      }
    } else {
      const shapeType = yield* randomInt(0, 1);
      if (shapeType === 0) {
        const w = yield* randomInt(2, 12);
        const h = yield* randomInt(2, 12);
        shape = 'rectangle';
        dimensions = { width: w, height: h };
        answer = 2 * (w + h);
        text = `Perimeter of a rectangle ${w} × ${h}?`;
      } else {
        const s = yield* randomInt(2, 10);
        shape = 'square';
        dimensions = { side: s };
        answer = 4 * s;
        text = `Perimeter of a square with side ${s}?`;
      }
    }

    const wrongs = new Set<number>();
    while (wrongs.size < 3) {
      const offset = yield* randomInt(-5, 10);
      const w = answer + offset;
      if (w !== answer && w > 0) wrongs.add(w);
    }
    const choices = yield* shuffleEffect([answer, ...wrongs]);
    return { text, shape, answer, choices, type, dimensions };
  });

export const checkAnswerEffect = (answer: number, correct: number): Either.Either<string, string> =>
  answer === correct ? Either.right('Correct!') : Either.left('Wrong!');

export const getResultText = (score: number, total: number) => {
  const perfect = score === total;
  const good = score >= total * 0.7;
  return {
    emoji: perfect ? '🏆' : good ? '📐' : '💪',
    title: perfect ? 'Perfect!' : good ? 'Great Job!' : 'Keep Practicing!',
    sub: `${score} / ${total} correct`,
  };
};

// Plain wrappers
export function generateQuestion(round: number): GeoQuestion { return Effect.runSync(generateQuestionEffect(round)); }
export function checkAnswer(answer: number, correct: number): boolean { return answer === correct; }
export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
