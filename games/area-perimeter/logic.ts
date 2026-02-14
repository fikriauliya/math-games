import { Effect } from 'effect';

export type ShapeType = 'rectangle' | 'triangle';
export type QuestionType = 'area' | 'perimeter';

export interface Question {
  shape: ShapeType;
  type: QuestionType;
  width: number;
  height: number;
  answer: number;
  choices: number[];
  text: string;
}

const randomInt = (min: number, max: number) => Effect.sync(() => Math.floor(Math.random() * (max - min + 1)) + min);

export const genQuestionEffect = (): Effect.Effect<Question> =>
  Effect.gen(function* () {
    const shape: ShapeType = (yield* randomInt(0, 1)) === 0 ? 'rectangle' : 'triangle';
    const type: QuestionType = (yield* randomInt(0, 1)) === 0 ? 'area' : 'perimeter';
    const width = yield* randomInt(2, 12);
    const height = yield* randomInt(2, 12);

    let answer: number;
    let text: string;
    if (shape === 'rectangle') {
      if (type === 'area') {
        answer = width * height;
        text = `Rectangle ${width} × ${height}: Area?`;
      } else {
        answer = 2 * (width + height);
        text = `Rectangle ${width} × ${height}: Perimeter?`;
      }
    } else {
      if (type === 'area') {
        answer = (width * height) / 2;
        text = `Triangle base=${width}, height=${height}: Area?`;
      } else {
        // Right triangle: base + height + hypotenuse
        const hyp = Math.round(Math.sqrt(width * width + height * height) * 10) / 10;
        answer = Math.round((width + height + hyp) * 10) / 10;
        text = `Right triangle ${width}, ${height}: Perimeter?`;
      }
    }

    const choices = new Set([answer]);
    while (choices.size < 4) {
      const offset = (yield* randomInt(1, 10)) * ((yield* randomInt(0, 1)) === 0 ? 1 : -1);
      const wrong = Math.round((answer + offset) * 10) / 10;
      if (wrong > 0 && wrong !== answer) choices.add(wrong);
    }

    return { shape, type, width, height, answer, choices: [...choices].sort((a, b) => a - b), text };
  });

export const getGradeEffect = (correct: number, total: number): Effect.Effect<{ grade: string; message: string }> =>
  Effect.succeed((() => {
    const pct = (correct / total) * 100;
    const grade = pct >= 95 ? 'S' : pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
    const message = pct >= 90 ? '🏆 AMAZING!' : pct >= 70 ? '⭐ Great Job!' : '💪 Keep Practicing!';
    return { grade, message };
  })());

export function genQuestion(): Question { return Effect.runSync(genQuestionEffect()); }
export function getGrade(c: number, t: number) { return Effect.runSync(getGradeEffect(c, t)); }
export function calcArea(shape: ShapeType, w: number, h: number): number {
  return shape === 'rectangle' ? w * h : (w * h) / 2;
}
export function calcPerimeter(shape: ShapeType, w: number, h: number): number {
  if (shape === 'rectangle') return 2 * (w + h);
  const hyp = Math.round(Math.sqrt(w * w + h * h) * 10) / 10;
  return Math.round((w + h + hyp) * 10) / 10;
}
