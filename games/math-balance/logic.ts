import { Effect } from 'effect';

export interface Question {
  leftSide: number[];
  rightTarget: number;
  answer: number;
  choices: number[];
  text: string;
}

const randomInt = (min: number, max: number) => Effect.sync(() => Math.floor(Math.random() * (max - min + 1)) + min);

export const genQuestionEffect = (diff: string): Effect.Effect<Question> =>
  Effect.gen(function* () {
    const max = diff === 'easy' ? 10 : diff === 'medium' ? 20 : 50;
    const numWeights = diff === 'easy' ? 1 : yield* randomInt(1, 2);
    const leftSide: number[] = [];
    for (let i = 0; i < numWeights; i++) {
      leftSide.push(yield* randomInt(1, max));
    }
    const answer = yield* randomInt(1, max);
    const rightTarget = leftSide.reduce((s, n) => s + n, 0) - answer;
    // Ensure positive right side; if not, flip
    const leftSum = leftSide.reduce((s, n) => s + n, 0);
    const text = `${leftSide.join(' + ')} = ? + ${leftSum - answer}`;

    const choices = new Set([answer]);
    while (choices.size < 4) {
      const off = (yield* randomInt(1, 5)) * ((yield* randomInt(0, 1)) === 0 ? 1 : -1);
      const w = answer + off;
      if (w > 0 && w !== answer) choices.add(w);
    }

    return { leftSide, rightTarget: leftSum - answer, answer, choices: [...choices].sort((a, b) => a - b), text };
  });

export const getGradeEffect = (correct: number, total: number): Effect.Effect<{ grade: string; message: string }> =>
  Effect.succeed((() => {
    const pct = (correct / total) * 100;
    const grade = pct >= 95 ? 'S' : pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
    const message = pct >= 90 ? '🏆 AMAZING!' : pct >= 70 ? '⭐ Great Job!' : '💪 Keep Practicing!';
    return { grade, message };
  })());

export function genQuestion(diff: string): Question { return Effect.runSync(genQuestionEffect(diff)); }
export function getGrade(c: number, t: number) { return Effect.runSync(getGradeEffect(c, t)); }
export function checkBalance(leftSide: number[], rightAnswer: number, rightKnown: number): boolean {
  return leftSide.reduce((s, n) => s + n, 0) === rightAnswer + rightKnown;
}
