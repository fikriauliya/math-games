import { Effect, Either } from 'effect';

export type QuestionType = 'calc' | 'visual';

export interface Question {
  type: QuestionType;
  text: string;
  answer: number;
  choices: number[];
  barPercent: number; // for visual display
}

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

const PERCENTAGES = [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90];
const BASES_EASY = [10, 20, 40, 50, 100];
const BASES_HARD = [60, 80, 120, 150, 200, 250, 300];

export const genQuestionEffect = (round: number): Effect.Effect<Question> =>
  Effect.gen(function* () {
    const isVisual = (yield* randomInt(2)) === 0;
    const pctIdx = yield* randomInt(Math.min(round + 3, PERCENTAGES.length));
    const pct = PERCENTAGES[pctIdx];

    if (isVisual) {
      // "What percentage is shaded?"
      const choices = new Set([pct]);
      while (choices.size < 4) {
        const wrong = PERCENTAGES[yield* randomInt(PERCENTAGES.length)];
        if (wrong !== pct) choices.add(wrong);
      }
      return {
        type: 'visual' as QuestionType,
        text: 'What percentage is shaded?',
        answer: pct,
        choices: [...choices].sort((a, b) => a - b),
        barPercent: pct,
      };
    } else {
      const bases = round < 5 ? BASES_EASY : [...BASES_EASY, ...BASES_HARD];
      const base = bases[yield* randomInt(bases.length)];
      const answer = (pct / 100) * base;
      const choices = new Set([answer]);
      while (choices.size < 4) {
        const wrong = answer + (yield* randomInt(20)) - 10;
        if (wrong !== answer && wrong > 0) choices.add(wrong);
      }
      return {
        type: 'calc' as QuestionType,
        text: `What is ${pct}% of ${base}?`,
        answer,
        choices: [...choices].sort((a, b) => a - b),
        barPercent: pct,
      };
    }
  });

export const validateAnswer = (user: number, correct: number): Either.Either<string, string> =>
  user === correct ? Either.right('Correct!') : Either.left(`Wrong! Answer: ${correct}`);

export const getResultText = (score: number, total: number): { emoji: string; title: string; sub: string } => {
  const pct = (score / total) * 100;
  if (pct >= 90) return { emoji: '🏆', title: 'Percentage Pro!', sub: `${score}/${total} correct!` };
  if (pct >= 60) return { emoji: '⭐', title: 'Great Job!', sub: `${score}/${total} correct!` };
  return { emoji: '💪', title: 'Keep Practicing!', sub: `${score}/${total} correct!` };
};

export const TOTAL = 10;

export function genQuestion(round: number): Question {
  return Effect.runSync(genQuestionEffect(round));
}
