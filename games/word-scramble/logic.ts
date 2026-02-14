import { Effect, Either } from 'effect';

export const WORDS = [
  'CAT','DOG','SUN','HAT','BIG','RUN','FUN','CUP','BUS','MAP',
  'STAR','FISH','BOOK','TREE','RAIN','LAMP','FROG','JUMP','MILK','CAKE',
  'APPLE','HOUSE','WATER','HAPPY','SMILE','LIGHT','CLOUD','MOUSE','TRAIN','BEACH',
];

export const TOTAL = 8;

export function scramble(word: string): string {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join('');
  return result === word ? scramble(word) : result;
}

export const scrambleEffect = (word: string): Effect.Effect<string> =>
  Effect.sync(() => scramble(word));

export function checkAnswer(guess: string, word: string): boolean {
  return guess.toUpperCase().trim() === word;
}

export const checkAnswerEffect = (guess: string, word: string): Either.Either<string, string> =>
  checkAnswer(guess, word) ? Either.right('Correct!') : Either.left('Wrong!');

export function pickWords(count: number): string[] {
  const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const pickWordsEffect = (count: number): Effect.Effect<string[]> =>
  Effect.sync(() => pickWords(count));

export function getHint(word: string): string {
  return word[0] + '_'.repeat(word.length - 1);
}

export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  const perfect = score === total;
  const good = score >= total * 0.6;
  return {
    emoji: perfect ? '🏆' : good ? '🎉' : '💪',
    title: perfect ? 'Word Master!' : good ? 'Great Spelling!' : 'Keep Trying!',
    sub: `${score} of ${total} correct`,
  };
}
