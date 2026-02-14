import { Effect } from 'effect';

export interface Question { number: number; roundTo: number; answer: number; choices: number[]; }

export const generateQuestionEffect = (difficulty: string): Effect.Effect<Question> =>
  Effect.sync(() => {
    const roundTo = difficulty === 'easy' ? 10 : difficulty === 'medium' ? [10, 100][Math.floor(Math.random() * 2)] : [10, 100, 1000][Math.floor(Math.random() * 3)];
    const max = difficulty === 'easy' ? 100 : difficulty === 'medium' ? 1000 : 10000;
    const number = Math.floor(Math.random() * max) + 1;
    const answer = Math.round(number / roundTo) * roundTo;
    const choices = new Set([answer]);
    while (choices.size < 4) {
      const offset = (Math.floor(Math.random() * 3) + 1) * roundTo * (Math.random() < 0.5 ? 1 : -1);
      const wrong = answer + offset;
      if (wrong >= 0 && wrong !== answer) choices.add(wrong);
    }
    return { number, roundTo, answer, choices: [...choices].sort((a, b) => a - b) };
  });

export const checkAnswerEffect = (selected: number, correct: number): Effect.Effect<boolean> =>
  Effect.succeed(selected === correct);

export const getGradeEffect = (correct: number, total: number): Effect.Effect<{ grade: string; message: string }> =>
  Effect.succeed((() => {
    const pct = correct / total * 100;
    const grade = pct >= 95 ? 'S' : pct >= 80 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'D';
    const message = pct >= 95 ? '🏆 Rounding Pro!' : pct >= 80 ? '⭐ Great Job!' : '💪 Keep Practicing!';
    return { grade, message };
  })());

export function generateQuestion(d: string): Question { return Effect.runSync(generateQuestionEffect(d)); }
export function checkAnswer(s: number, c: number): boolean { return Effect.runSync(checkAnswerEffect(s, c)); }
export function getGrade(c: number, t: number) { return Effect.runSync(getGradeEffect(c, t)); }
