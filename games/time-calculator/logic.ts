import { Effect, Either } from 'effect';

export interface Question {
  text: string;
  answer: string;
  choices: string[];
}

export const TOTAL = 10;

const randomInt = (min: number, max: number) => Effect.sync(() => Math.floor(Math.random() * (max - min + 1)) + min);

function formatTime(h: number, m: number): string {
  return `${h}:${m.toString().padStart(2, '0')}`;
}

function normalizeTime(h: number, m: number): [number, number] {
  let totalMin = h * 60 + m;
  totalMin = ((totalMin % (12 * 60)) + 12 * 60) % (12 * 60);
  if (totalMin === 0) totalMin = 12 * 60;
  return [Math.floor(totalMin / 60), totalMin % 60];
}

export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* Effect.sync(() => Math.floor(Math.random() * (i + 1)));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export const genQuestionEffect = (): Effect.Effect<Question> =>
  Effect.gen(function* () {
    const typeRoll = yield* randomInt(0, 2);
    const hour = yield* randomInt(1, 12);
    const min = [0, 15, 30, 45][yield* randomInt(0, 3)];
    const delta = [15, 20, 30, 45, 60, 90][yield* randomInt(0, 5)];

    let text: string, answer: string;

    if (typeRoll === 0) {
      // Add time
      const [rh, rm] = normalizeTime(hour, min + delta);
      answer = formatTime(rh, rm);
      text = `Sekarang jam ${formatTime(hour, min)}. ${delta} menit lagi jam berapa?`;
    } else if (typeRoll === 1) {
      // Subtract time
      const [rh, rm] = normalizeTime(hour, min - delta);
      answer = formatTime(rh, rm);
      text = `Sekarang jam ${formatTime(hour, min)}. ${delta} menit yang lalu jam berapa?`;
    } else {
      // Convert
      const totalMin = hour * 60 + min;
      answer = `${totalMin} menit`;
      text = `${hour} jam ${min} menit = berapa menit?`;
    }

    const choices = new Set([answer]);
    while (choices.size < 4) {
      if (typeRoll === 2) {
        const off = yield* randomInt(-60, 60);
        const val = parseInt(answer) + off;
        if (val > 0 && `${val} menit` !== answer) choices.add(`${val} menit`);
      } else {
        const offH = yield* randomInt(0, 2);
        const offM = [0, 15, 30, 45][yield* randomInt(0, 3)];
        const [fh, fm] = normalizeTime(hour + offH, min + offM);
        const fake = formatTime(fh, fm);
        if (fake !== answer) choices.add(fake);
      }
    }
    return { text, answer, choices: yield* shuffleEffect([...choices]) };
  });

export const checkAnswerEffect = (a: string, b: string): Either.Either<string, string> =>
  a === b ? Either.right('Benar!') : Either.left('Salah!');

export const getResultEffect = (score: number, total: number): Effect.Effect<{ emoji: string; title: string; sub: string }> =>
  Effect.succeed((() => {
    const pct = score / total;
    return {
      emoji: pct === 1 ? '🏆' : pct >= 0.7 ? '🎉' : '💪',
      title: pct === 1 ? 'Sempurna!' : pct >= 0.7 ? 'Hebat!' : 'Ayo Coba Lagi!',
      sub: `${score} dari ${total} benar!`,
    };
  })());

export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
export function genQuestion(): Question { return Effect.runSync(genQuestionEffect()); }
export function checkAnswer(a: string, b: string): boolean { return a === b; }
export function getResult(score: number, total: number) { return Effect.runSync(getResultEffect(score, total)); }
