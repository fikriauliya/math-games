import { Effect } from 'effect';

export interface TFStatement { text: string; answer: boolean; }

export const GAME_DURATION = 30;
const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const generateStatementEffect = (): Effect.Effect<TFStatement> =>
  Effect.gen(function* () {
    const ops = ['+', '−', '×'];
    const op = ops[yield* randomInt(3)];
    let a: number, b: number, correctAnswer: number;

    if (op === '×') {
      a = (yield* randomInt(12)) + 1;
      b = (yield* randomInt(12)) + 1;
      correctAnswer = a * b;
    } else if (op === '−') {
      a = (yield* randomInt(50)) + 10;
      b = (yield* randomInt(a)) + 1;
      correctAnswer = a - b;
    } else {
      a = (yield* randomInt(50)) + 1;
      b = (yield* randomInt(50)) + 1;
      correctAnswer = a + b;
    }

    const isTrue = (yield* randomInt(2)) === 0;
    let shown: number;
    if (isTrue) {
      shown = correctAnswer;
    } else {
      // Make a plausible wrong answer
      const offsets = [1, -1, 2, -2, 10, -10, 5];
      shown = correctAnswer + offsets[yield* randomInt(offsets.length)];
      if (shown === correctAnswer) shown = correctAnswer + 1;
    }

    return { text: `${a} ${op} ${b} = ${shown}`, answer: shown === correctAnswer };
  });

// ── Plain wrappers ─────────────────────────────────────────────
export function generateStatement(): TFStatement { return Effect.runSync(generateStatementEffect()); }
export function checkAnswer(userAnswer: boolean, correct: boolean): boolean { return userAnswer === correct; }
export function getResultText(score: number): { emoji: string; title: string; sub: string } {
  return {
    emoji: score >= 25 ? '🏆' : score >= 15 ? '🌟' : score >= 8 ? '⭐' : '💪',
    title: score >= 25 ? 'Game Show Champion!' : score >= 15 ? 'Star Contestant!' : score >= 8 ? 'Good Try!' : 'Keep Playing!',
    sub: `${score} correct in 30 seconds!`,
  };
}
