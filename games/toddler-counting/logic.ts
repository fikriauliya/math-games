import { Effect, Either } from 'effect';

export interface CountQuestion {
  emoji: string;
  name: string;
  count: number;
  wrong: number;
}

const OBJECTS = [
  { emoji: '🍎', name: 'Apel' },
  { emoji: '⭐', name: 'Bintang' },
  { emoji: '🌺', name: 'Bunga' },
  { emoji: '🐟', name: 'Ikan' },
  { emoji: '🦋', name: 'Kupu-kupu' },
  { emoji: '🍌', name: 'Pisang' },
  { emoji: '🎈', name: 'Balon' },
  { emoji: '🐤', name: 'Ayam' },
];

export const TOTAL = 6;

export function generateQuestion(): CountQuestion {
  const obj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
  const count = 1 + Math.floor(Math.random() * 10);
  let wrong: number;
  do { wrong = 1 + Math.floor(Math.random() * 10); } while (wrong === count);
  return { ...obj, count, wrong };
}

export const generateQuestionEffect = (): Effect.Effect<CountQuestion> =>
  Effect.sync(() => generateQuestion());

export function checkAnswer(answer: number, correct: number): boolean {
  return answer === correct;
}

export const checkAnswerEffect = (answer: number, correct: number): Either.Either<string, string> =>
  checkAnswer(answer, correct) ? Either.right('Benar!') : Either.left('Salah');

export function getOptions(q: CountQuestion): number[] {
  return shuffle([q.count, q.wrong]);
}

export function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  const perfect = score === total;
  const good = score >= total * 0.6;
  return {
    emoji: perfect ? '🏆' : good ? '🎉' : '💪',
    title: perfect ? 'Hebat Sekali!' : good ? 'Bagus!' : 'Ayo Coba Lagi!',
    sub: `${score} dari ${total} benar!`,
  };
}
