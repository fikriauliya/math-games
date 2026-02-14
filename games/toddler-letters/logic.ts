import { Effect } from 'effect';

export interface LetterRound {
  letter: string;
  word: string;
  emoji: string;
  choices: string[];
}

export const LETTERS: { letter: string; word: string; emoji: string }[] = [
  { letter: 'A', word: 'Ayam', emoji: '🐔' },
  { letter: 'B', word: 'Bola', emoji: '⚽' },
  { letter: 'C', word: 'Cumi', emoji: '🦑' },
  { letter: 'D', word: 'Domba', emoji: '🐑' },
  { letter: 'E', word: 'Elang', emoji: '🦅' },
  { letter: 'F', word: 'Flamingo', emoji: '🦩' },
  { letter: 'G', word: 'Gajah', emoji: '🐘' },
  { letter: 'H', word: 'Harimau', emoji: '🐯' },
  { letter: 'I', word: 'Ikan', emoji: '🐟' },
  { letter: 'J', word: 'Jerapah', emoji: '🦒' },
];

export const TOTAL = 10;

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* randomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export const generateRoundEffect = (idx: number): Effect.Effect<LetterRound> =>
  Effect.gen(function* () {
    const target = LETTERS[idx];
    // Pick a wrong letter
    const others = LETTERS.filter(l => l.letter !== target.letter);
    const wrong = others[yield* randomInt(others.length)];
    const choices = yield* shuffleEffect([target.letter, wrong.letter]);
    return { ...target, choices };
  });

export const checkAnswer = (selected: string, correct: string): boolean => selected === correct;

export const getResultText = (score: number, total: number): { emoji: string; title: string; sub: string } => {
  const perfect = score === total;
  const good = score >= total * 0.6;
  return {
    emoji: perfect ? '🏆' : good ? '🎉' : '💪',
    title: perfect ? 'Hebat Sekali!' : good ? 'Bagus!' : 'Ayo Coba Lagi!',
    sub: `${score} dari ${total} benar!`,
  };
};

// ── Plain wrappers ─────────────────────────────────────────────
export function generateRound(idx: number): LetterRound {
  return Effect.runSync(generateRoundEffect(idx));
}
