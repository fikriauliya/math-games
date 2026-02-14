import { Effect, Either } from 'effect';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ClockQuestion {
  hour: number;
  minute: number;
  display: string;
  options: string[];
}

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const shuffleEffect = <T>(arr: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = yield* randomInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  });

export function formatTime(h: number, m: number): string {
  const hh = h.toString().padStart(2, '0');
  const mm = m.toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

export const generateQuestionEffect = (difficulty: Difficulty): Effect.Effect<ClockQuestion> =>
  Effect.gen(function* () {
    const hour = (yield* randomInt(12)) + 1;
    let minute: number;
    if (difficulty === 'easy') {
      minute = 0;
    } else if (difficulty === 'medium') {
      const choices = [0, 15, 30, 45];
      minute = choices[yield* randomInt(choices.length)];
    } else {
      minute = (yield* randomInt(12)) * 5;
    }
    const correct = formatTime(hour, minute);
    const wrongs = new Set<string>();
    while (wrongs.size < 3) {
      const wh = (yield* randomInt(12)) + 1;
      let wm: number;
      if (difficulty === 'easy') {
        wm = 0;
      } else if (difficulty === 'medium') {
        wm = [0, 15, 30, 45][yield* randomInt(4)];
      } else {
        wm = (yield* randomInt(12)) * 5;
      }
      const t = formatTime(wh, wm);
      if (t !== correct) wrongs.add(t);
    }
    const options = yield* shuffleEffect([correct, ...wrongs]);
    return { hour, minute, display: correct, options };
  });

export const checkAnswerEffect = (answer: string, correct: string): Either.Either<string, string> =>
  answer === correct ? Either.right('Benar!') : Either.left('Salah!');

export const TOTAL = 10;
export const DIFFICULTY_SCHEDULE: Difficulty[] = ['easy','easy','easy','medium','medium','medium','hard','hard','hard','hard'];

export function generateQuestion(difficulty: Difficulty): ClockQuestion {
  return Effect.runSync(generateQuestionEffect(difficulty));
}

export function shuffle<T>(a: T[]): T[] {
  return Effect.runSync(shuffleEffect(a));
}

export function checkAnswer(answer: string, correct: string): boolean {
  return answer === correct;
}

export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  const perfect = score === total;
  const good = score >= total * 0.6;
  return {
    emoji: perfect ? '🏆' : good ? '🎉' : '💪',
    title: perfect ? 'Sempurna!' : good ? 'Bagus!' : 'Ayo Coba Lagi!',
    sub: `${score} dari ${total} benar!`,
  };
}
