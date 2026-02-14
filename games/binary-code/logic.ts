import { Effect, Either } from 'effect';

export type QType = 'bin2dec' | 'dec2bin';

export interface Question {
  text: string;
  answer: string;
  choices: string[];
  type: QType;
}

export const TOTAL = 10;

const randomInt = (min: number, max: number) => Effect.sync(() => Math.floor(Math.random() * (max - min + 1)) + min);

export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* Effect.sync(() => Math.floor(Math.random() * (i + 1)));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export const genQuestionEffect = (round: number): Effect.Effect<Question> =>
  Effect.gen(function* () {
    const bits = round < 5 ? 4 : round < 8 ? 6 : 8;
    const max = Math.pow(2, bits) - 1;
    const num = yield* randomInt(1, max);
    const binary = num.toString(2).padStart(bits, '0');
    const typeRoll = yield* randomInt(0, 1);
    const type: QType = typeRoll === 0 ? 'bin2dec' : 'dec2bin';

    let text: string, answer: string;
    if (type === 'bin2dec') {
      text = `What is ${binary} in decimal?`;
      answer = String(num);
      const choices = new Set([answer]);
      while (choices.size < 4) {
        const off = yield* randomInt(-5, 5);
        const v = num + off;
        if (v > 0 && v <= max && String(v) !== answer) choices.add(String(v));
      }
      return { text, answer, choices: yield* shuffleEffect([...choices]), type };
    } else {
      text = `Convert ${num} to binary`;
      answer = binary;
      const choices = new Set([answer]);
      while (choices.size < 4) {
        const fakeNum = yield* randomInt(1, max);
        const fake = fakeNum.toString(2).padStart(bits, '0');
        if (fake !== answer) choices.add(fake);
      }
      return { text, answer, choices: yield* shuffleEffect([...choices]), type };
    }
  });

export const checkAnswerEffect = (a: string, b: string): Either.Either<string, string> =>
  a === b ? Either.right('Correct!') : Either.left('Wrong!');

export const getResultEffect = (score: number, total: number): Effect.Effect<{ emoji: string; title: string; sub: string }> =>
  Effect.succeed((() => {
    const pct = score / total;
    return {
      emoji: pct === 1 ? '🏆' : pct >= 0.7 ? '🎉' : '💪',
      title: pct === 1 ? 'SYSTEM CRACKED!' : pct >= 0.7 ? 'ACCESS GRANTED!' : 'TRY AGAIN...',
      sub: `${score}/${total} decoded`,
    };
  })());

export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
export function genQuestion(round: number): Question { return Effect.runSync(genQuestionEffect(round)); }
export function checkAnswer(a: string, b: string): boolean { return a === b; }
export function getResult(score: number, total: number) { return Effect.runSync(getResultEffect(score, total)); }
