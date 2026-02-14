import { Effect, Either } from 'effect';

export interface TimeQuestion {
  emoji: string;
  scene: string;
  correct: string;
  wrong: string;
}

export const QUESTIONS: TimeQuestion[] = [
  { emoji: '🌅', scene: 'Matahari terbit, ayam berkokok', correct: 'Pagi', wrong: 'Malam' },
  { emoji: '☀️', scene: 'Matahari tinggi, panas sekali', correct: 'Siang', wrong: 'Pagi' },
  { emoji: '🌇', scene: 'Matahari turun, langit oranye', correct: 'Sore', wrong: 'Siang' },
  { emoji: '🌙', scene: 'Bintang-bintang, bulan bersinar', correct: 'Malam', wrong: 'Pagi' },
  { emoji: '🥣', scene: 'Sarapan, makan roti dan susu', correct: 'Pagi', wrong: 'Sore' },
  { emoji: '🍱', scene: 'Makan siang di sekolah', correct: 'Siang', wrong: 'Malam' },
  { emoji: '🛁', scene: 'Mandi sebelum tidur', correct: 'Malam', wrong: 'Siang' },
  { emoji: '⚽', scene: 'Bermain di taman, mulai gelap', correct: 'Sore', wrong: 'Pagi' },
  { emoji: '😴', scene: 'Tidur di kasur, lampu mati', correct: 'Malam', wrong: 'Sore' },
  { emoji: '🏫', scene: 'Berangkat sekolah, masih sejuk', correct: 'Pagi', wrong: 'Malam' },
];

export const TOTAL = 6;

export function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.sync(() => shuffle(a));

export function checkAnswer(answer: string, correct: string): boolean {
  return answer === correct;
}

export const checkAnswerEffect = (answer: string, correct: string): Either.Either<string, string> =>
  checkAnswer(answer, correct) ? Either.right('Benar!') : Either.left('Salah');

export function getOptions(q: TimeQuestion): string[] {
  return shuffle([q.correct, q.wrong]);
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
