import { Effect, Either } from 'effect';

export interface OppositePair {
  word1: string;
  emoji1: string;
  word2: string;
  emoji2: string;
}

export const OPPOSITES: OppositePair[] = [
  { word1: 'Besar', emoji1: '🐘', word2: 'Kecil', emoji2: '🐁' },
  { word1: 'Panas', emoji1: '🔥', word2: 'Dingin', emoji2: '❄️' },
  { word1: 'Cepat', emoji1: '🐇', word2: 'Lambat', emoji2: '🐢' },
  { word1: 'Terang', emoji1: '☀️', word2: 'Gelap', emoji2: '🌙' },
  { word1: 'Tinggi', emoji1: '🦒', word2: 'Pendek', emoji2: '🐕' },
  { word1: 'Banyak', emoji1: '🍎🍎🍎', word2: 'Sedikit', emoji2: '🍎' },
];

export interface Question {
  targetWord: string;
  choices: { emoji: string; word: string }[];
  correctWord: string;
}

export const TOTAL = 10;

export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* Effect.sync(() => Math.floor(Math.random() * (i + 1)));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export const genQuestionEffect = (pair: OppositePair): Effect.Effect<Question> =>
  Effect.gen(function* () {
    const askFirst = (yield* Effect.sync(() => Math.random())) > 0.5;
    const targetWord = askFirst ? pair.word1 : pair.word2;
    const correctWord = targetWord;
    const choices = yield* shuffleEffect([
      { emoji: pair.emoji1, word: pair.word1 },
      { emoji: pair.emoji2, word: pair.word2 },
    ]);
    return { targetWord, choices, correctWord };
  });

export const checkAnswerEffect = (a: string, b: string): Either.Either<string, string> =>
  a === b ? Either.right('Benar!') : Either.left('Salah!');

export const getResultEffect = (score: number, total: number): Effect.Effect<{ emoji: string; title: string; sub: string }> =>
  Effect.succeed((() => {
    const pct = score / total;
    return {
      emoji: pct === 1 ? '🏆' : pct >= 0.6 ? '🎉' : '💪',
      title: pct === 1 ? 'Hebat Sekali!' : pct >= 0.6 ? 'Bagus!' : 'Ayo Coba Lagi!',
      sub: `${score} dari ${total} benar!`,
    };
  })());

export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
export function genQuestion(pair: OppositePair): Question { return Effect.runSync(genQuestionEffect(pair)); }
export function checkAnswer(a: string, b: string): boolean { return a === b; }
export function getResult(score: number, total: number) { return Effect.runSync(getResultEffect(score, total)); }
