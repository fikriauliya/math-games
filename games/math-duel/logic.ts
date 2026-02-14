import { Effect, Either } from 'effect';

export interface Question {
  text: string;
  answer: number;
  choices: number[];
}

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const TOTAL_QUESTIONS = 15;

const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* randomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export const genQuestionEffect = (): Effect.Effect<Question> =>
  Effect.gen(function* () {
    const ops = ['+', '−', '×'];
    const op = ops[yield* randomInt(ops.length)];
    let a: number, b: number, ans: number;

    if (op === '×') {
      a = (yield* randomInt(10)) + 1;
      b = (yield* randomInt(10)) + 1;
      ans = a * b;
    } else if (op === '−') {
      a = (yield* randomInt(20)) + 1;
      b = (yield* randomInt(a)) + 1;
      ans = a - b;
    } else {
      a = (yield* randomInt(20)) + 1;
      b = (yield* randomInt(20)) + 1;
      ans = a + b;
    }

    const choices = new Set([ans]);
    while (choices.size < 4) {
      const wrong = ans + (yield* randomInt(10)) - 5;
      if (wrong !== ans && wrong >= 0) choices.add(wrong);
    }

    return { text: `${a} ${op} ${b}`, answer: ans, choices: yield* shuffleEffect([...choices]) };
  });

export const checkAnswer = (selected: number, correct: number): boolean => selected === correct;

export const getWinner = (p1Score: number, p2Score: number): string =>
  p1Score > p2Score ? 'Player 1' : p2Score > p1Score ? 'Player 2' : 'Tie';

export const getResultEmoji = (p1Score: number, p2Score: number): string =>
  p1Score === p2Score ? '🤝' : '🏆';

// ── Plain wrappers ─────────────────────────────────────────────
export function genQuestion(): Question {
  return Effect.runSync(genQuestionEffect());
}
