import { Effect } from 'effect';

export interface Question { value: number; fromUnit: string; toUnit: string; answer: number; choices: number[]; category: string; }

const CONVERSIONS: { from: string; to: string; factor: number; cat: string }[] = [
  { from: 'cm', to: 'mm', factor: 10, cat: 'Length' },
  { from: 'm', to: 'cm', factor: 100, cat: 'Length' },
  { from: 'km', to: 'm', factor: 1000, cat: 'Length' },
  { from: 'kg', to: 'g', factor: 1000, cat: 'Weight' },
  { from: 'g', to: 'mg', factor: 1000, cat: 'Weight' },
  { from: 'hour', to: 'min', factor: 60, cat: 'Time' },
  { from: 'min', to: 'sec', factor: 60, cat: 'Time' },
  { from: 'day', to: 'hour', factor: 24, cat: 'Time' },
  { from: 'L', to: 'mL', factor: 1000, cat: 'Volume' },
  { from: 'inch', to: 'cm', factor: 2.54, cat: 'Length' },
  { from: 'foot', to: 'inch', factor: 12, cat: 'Length' },
];

export const generateQuestionEffect = (difficulty: string): Effect.Effect<Question> =>
  Effect.sync(() => {
    const pool = difficulty === 'easy' ? CONVERSIONS.filter(c => [10, 100, 1000].includes(c.factor)) :
                 difficulty === 'medium' ? CONVERSIONS.filter(c => c.factor !== 2.54) : CONVERSIONS;
    const conv = pool[Math.floor(Math.random() * pool.length)];
    const reverse = Math.random() < 0.3 && difficulty !== 'easy';
    let value: number, answer: number, fromUnit: string, toUnit: string;
    if (reverse) {
      value = Math.floor(Math.random() * 20 + 1) * conv.factor;
      answer = parseFloat((value / conv.factor).toFixed(2));
      fromUnit = conv.to; toUnit = conv.from;
    } else {
      value = Math.floor(Math.random() * 20) + 1;
      answer = parseFloat((value * conv.factor).toFixed(2));
      fromUnit = conv.from; toUnit = conv.to;
    }
    const choices = new Set([answer]);
    while (choices.size < 4) {
      const mult = [0.1, 0.5, 2, 5, 10][Math.floor(Math.random() * 5)];
      const wrong = parseFloat((answer * mult).toFixed(2));
      if (wrong !== answer && wrong > 0) choices.add(wrong);
    }
    return { value, fromUnit, toUnit, answer, choices: [...choices].sort((a, b) => a - b), category: conv.cat };
  });

export const checkAnswerEffect = (s: number, c: number): Effect.Effect<boolean> => Effect.succeed(s === c);

export const getGradeEffect = (correct: number, total: number): Effect.Effect<{ grade: string; message: string }> =>
  Effect.succeed((() => {
    const pct = correct / total * 100;
    const grade = pct >= 95 ? 'S' : pct >= 80 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'D';
    const message = pct >= 95 ? '🏆 Conversion Master!' : pct >= 80 ? '⭐ Great Job!' : '💪 Keep Practicing!';
    return { grade, message };
  })());

export function generateQuestion(d: string): Question { return Effect.runSync(generateQuestionEffect(d)); }
export function checkAnswer(s: number, c: number): boolean { return Effect.runSync(checkAnswerEffect(s, c)); }
export function getGrade(c: number, t: number) { return Effect.runSync(getGradeEffect(c, t)); }
