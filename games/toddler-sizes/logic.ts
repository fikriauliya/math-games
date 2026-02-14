import { Effect } from 'effect';

export interface SizeRound {
  emoji: string;
  question: 'besar' | 'kecil';
  bigIndex: number; // 0 or 1
}

export const EMOJIS = ['🐻', '🌟', '🎈', '🏀', '🚗', '🐘', '🍎', '🌸'];
export const TOTAL = 8;

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const generateRoundEffect = (idx: number): Effect.Effect<SizeRound> =>
  Effect.gen(function* () {
    const emoji = EMOJIS[idx % EMOJIS.length];
    const question: 'besar' | 'kecil' = idx % 2 === 0 ? 'besar' : 'kecil';
    const bigIndex = yield* randomInt(2);
    return { emoji, question, bigIndex };
  });

export const checkAnswer = (tappedIndex: number, round: SizeRound): boolean => {
  if (round.question === 'besar') return tappedIndex === round.bigIndex;
  return tappedIndex !== round.bigIndex; // kecil = the other one
};

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
export function generateRound(idx: number): SizeRound {
  return Effect.runSync(generateRoundEffect(idx));
}
