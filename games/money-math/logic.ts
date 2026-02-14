import { Effect, Either } from 'effect';

export const DENOMINATIONS = [100, 200, 500, 1000, 2000, 5000, 10000];
export const DENOM_EMOJI: Record<number, string> = {
  100: '🪙', 200: '🪙', 500: '🪙', 1000: '💵', 2000: '💵', 5000: '💵', 10000: '💵',
};

export type QuestionType = 'total' | 'change';
export interface MoneyQuestion {
  type: QuestionType;
  items: number[];
  answer: number;
  display: string;
  choices: number[];
}

export const TOTAL_ROUNDS = 10;
const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* randomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export const generateQuestionEffect = (roundNum: number): Effect.Effect<MoneyQuestion> =>
  Effect.gen(function* () {
    const maxDenom = roundNum < 4 ? 4 : DENOMINATIONS.length;
    const isChange = roundNum >= 3 && (yield* randomInt(3)) === 0;

    if (isChange) {
      const paid = DENOMINATIONS[(yield* randomInt(maxDenom - 2)) + 2]; // at least 500
      const price = DENOMINATIONS[yield* randomInt(Math.min(maxDenom - 1, DENOMINATIONS.indexOf(paid)))];
      const answer = paid - price;
      const choices = yield* generateChoices(answer, maxDenom);
      return {
        type: 'change' as const,
        items: [paid],
        answer,
        display: `Bayar Rp${paid.toLocaleString('id-ID')}, harga Rp${price.toLocaleString('id-ID')}.\nKembaliannya berapa?`,
        choices,
      };
    } else {
      const count = roundNum < 3 ? 2 : roundNum < 6 ? 3 : 4;
      const items: number[] = [];
      for (let i = 0; i < count; i++) {
        items.push(DENOMINATIONS[yield* randomInt(maxDenom)]);
      }
      const answer = items.reduce((a, b) => a + b, 0);
      const choices = yield* generateChoices(answer, maxDenom);
      return {
        type: 'total' as const,
        items,
        answer,
        display: 'Berapa total uangnya?',
        choices,
      };
    }
  });

const generateChoices = (answer: number, maxDenom: number): Effect.Effect<number[]> =>
  Effect.gen(function* () {
    const choices = new Set([answer]);
    while (choices.size < 4) {
      const offset = ((yield* randomInt(5)) + 1) * DENOMINATIONS[yield* randomInt(maxDenom)];
      const wrong = (yield* randomInt(2)) === 0 ? answer + offset : Math.max(100, answer - offset);
      if (wrong !== answer && wrong > 0) choices.add(wrong);
    }
    return yield* shuffleEffect([...choices]);
  });

export const checkAnswerEffect = (userAnswer: number, correct: number): Either.Either<string, string> =>
  userAnswer === correct ? Either.right('Benar!') : Either.left('Salah!');

export const getResultTextEffect = (score: number, total: number): Effect.Effect<{ emoji: string; title: string; sub: string }> =>
  Effect.succeed(getResultText(score, total));

// ── Plain wrappers ─────────────────────────────────────────────
export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
export function generateQuestion(roundNum: number): MoneyQuestion { return Effect.runSync(generateQuestionEffect(roundNum)); }
export function checkAnswer(userAnswer: number, correct: number): boolean { return userAnswer === correct; }
export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  const pct = score / total;
  return {
    emoji: pct >= 1 ? '🏆' : pct >= 0.7 ? '🎉' : '💪',
    title: pct >= 1 ? 'Hebat Sekali!' : pct >= 0.7 ? 'Pintar!' : 'Ayo Coba Lagi!',
    sub: `${score} dari ${total} benar!`,
  };
}
