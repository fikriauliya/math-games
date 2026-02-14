import { Effect, Either } from 'effect';

export interface PatternQuestion {
  sequence: number[];
  answer: number;
  choices: number[];
  patternType: string;
}

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const TOTAL_ROUNDS = 12;

const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* randomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export const generatePatternEffect = (round: number): Effect.Effect<PatternQuestion> =>
  Effect.gen(function* () {
    const difficulty = Math.min(Math.floor(round / 3), 3);
    const patternTypes = difficulty < 1
      ? ['addN']
      : difficulty < 2
        ? ['addN', 'mulN']
        : ['addN', 'mulN', 'squares', 'alternating'];

    const type = patternTypes[yield* randomInt(patternTypes.length)];
    let seq: number[] = [];
    let answer: number;

    if (type === 'addN') {
      const start = (yield* randomInt(5)) + 1;
      const step = (yield* randomInt(5 + difficulty * 3)) + 1;
      for (let i = 0; i < 5; i++) seq.push(start + step * i);
      answer = start + step * 5;
    } else if (type === 'mulN') {
      const start = (yield* randomInt(3)) + 1;
      const factor = (yield* randomInt(2)) + 2;
      let val = start;
      for (let i = 0; i < 5; i++) { seq.push(val); val *= factor; }
      answer = val;
    } else if (type === 'squares') {
      const offset = yield* randomInt(3);
      for (let i = 1 + offset; i <= 5 + offset; i++) seq.push(i * i);
      answer = (6 + offset) * (6 + offset);
    } else { // alternating
      const a = (yield* randomInt(5)) + 1;
      const b = (yield* randomInt(5)) + 6;
      for (let i = 0; i < 5; i++) seq.push(i % 2 === 0 ? a + i : b + i);
      answer = 5 % 2 === 0 ? a + 5 : b + 5;
    }

    const choices = new Set([answer]);
    while (choices.size < 4) {
      const off = (yield* randomInt(10)) - 5;
      const wrong = answer + off;
      if (wrong !== answer && wrong >= 0) choices.add(wrong);
    }

    return {
      sequence: seq,
      answer,
      choices: yield* shuffleEffect([...choices]),
      patternType: type,
    };
  });

export const checkAnswer = (selected: number, correct: number): boolean => selected === correct;

export const validateAnswer = (selected: number, correct: number): Either.Either<string, string> =>
  selected === correct ? Either.right('Correct!') : Either.left('Wrong!');

export const calcScore = (correct: number): number => correct * 10;

export const getGrade = (correct: number, total: number): { grade: string; message: string } => {
  const pct = correct / total * 100;
  const grade = pct >= 95 ? 'S' : pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
  const message = pct >= 90 ? '🏆 AMAZING!' : pct >= 70 ? '⭐ Great Job!' : '💪 Keep Practicing!';
  return { grade, message };
};

// ── Plain wrappers ─────────────────────────────────────────────
export function generatePattern(round: number): PatternQuestion {
  return Effect.runSync(generatePatternEffect(round));
}
