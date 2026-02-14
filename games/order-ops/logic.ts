import { Effect } from 'effect';

export interface Question {
  expression: string;
  answer: number;
  choices: number[];
}

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateQuestionEffect = (difficulty: string): Effect.Effect<Question> =>
  Effect.sync(() => {
    let expression: string;
    let answer: number;

    if (difficulty === 'easy') {
      const a = randomInt(1, 10), b = randomInt(1, 10), c = randomInt(1, 5);
      const type = randomInt(0, 1);
      if (type === 0) { expression = `${a} + ${b} × ${c}`; answer = a + b * c; }
      else { expression = `${a} × ${b} + ${c}`; answer = a * b + c; }
    } else if (difficulty === 'medium') {
      const a = randomInt(1, 10), b = randomInt(1, 10), c = randomInt(1, 10);
      const type = randomInt(0, 2);
      if (type === 0) { expression = `${a} + ${b} × ${c} - ${randomInt(1, 5)}`; const d = randomInt(1, 5); expression = `${a} + ${b} × ${c} - ${d}`; answer = a + b * c - d; }
      else if (type === 1) { expression = `(${a} + ${b}) × ${c}`; answer = (a + b) * c; }
      else { expression = `${a} × ${b} - ${c}`; answer = a * b - c; }
    } else {
      const a = randomInt(2, 12), b = randomInt(2, 8), c = randomInt(1, 10), d = randomInt(1, 5);
      const type = randomInt(0, 2);
      if (type === 0) { expression = `(${a} + ${b}) × ${c} - ${d}`; answer = (a + b) * c - d; }
      else if (type === 1) { expression = `${a} × (${b} - ${d}) + ${c}`; answer = a * (b > d ? b - d : d - b) + c; expression = `${a} × (${Math.max(b,d)} - ${Math.min(b,d)}) + ${c}`; answer = a * (Math.max(b,d) - Math.min(b,d)) + c; }
      else { expression = `${a}² + ${b} × ${c}`; answer = a * a + b * c; }
    }

    const choices = new Set([answer]);
    while (choices.size < 4) {
      const offset = randomInt(-10, 10);
      const wrong = answer + offset;
      if (wrong !== answer) choices.add(wrong);
    }

    return { expression, answer, choices: [...choices].sort((a, b) => a - b) };
  });

export const checkAnswerEffect = (selected: number, correct: number): Effect.Effect<boolean> =>
  Effect.succeed(selected === correct);

export const calcScoreEffect = (streak: number): Effect.Effect<number> =>
  Effect.succeed(10 * Math.min(streak, 5));

export const getGradeEffect = (correct: number, total: number): Effect.Effect<{ grade: string; message: string }> =>
  Effect.succeed((() => {
    const pct = correct / total * 100;
    const grade = pct >= 95 ? 'S' : pct >= 80 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'D';
    const message = pct >= 95 ? '🏆 PEMDAS Master!' : pct >= 80 ? '⭐ Great Job!' : '💪 Keep Practicing!';
    return { grade, message };
  })());

export function generateQuestion(d: string): Question { return Effect.runSync(generateQuestionEffect(d)); }
export function checkAnswer(s: number, c: number): boolean { return Effect.runSync(checkAnswerEffect(s, c)); }
export function calcScore(s: number): number { return Effect.runSync(calcScoreEffect(s)); }
export function getGrade(c: number, t: number) { return Effect.runSync(getGradeEffect(c, t)); }
