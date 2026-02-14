import { Effect } from 'effect';

export interface Question { text: string; answer: number; choices: number[]; unit: string; }

const CONVERSIONS = [
  { from: 'cm', to: 'm', factor: 0.01, q: (v: number) => `${v} cm = ? m` },
  { from: 'm', to: 'cm', factor: 100, q: (v: number) => `${v} m = ? cm` },
  { from: 'kg', to: 'g', factor: 1000, q: (v: number) => `${v} kg = ? g` },
  { from: 'g', to: 'kg', factor: 0.001, q: (v: number) => `${v} g = ? kg` },
  { from: 'L', to: 'mL', factor: 1000, q: (v: number) => `${v} L = ? mL` },
  { from: 'mL', to: 'L', factor: 0.001, q: (v: number) => `${v} mL = ? L` },
  { from: 'km', to: 'm', factor: 1000, q: (v: number) => `${v} km = ? m` },
  { from: 'm', to: 'km', factor: 0.001, q: (v: number) => `${v} m = ? km` },
];

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = randInt(0, i); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export const genQuestionEffect = (): Effect.Effect<Question> =>
  Effect.sync(() => {
    const conv = CONVERSIONS[randInt(0, CONVERSIONS.length - 1)];
    const value = conv.factor >= 100 ? randInt(1, 10) : conv.factor >= 1 ? randInt(1, 50) : randInt(100, 9000);
    const answer = parseFloat((value * conv.factor).toPrecision(6));
    const wrong1 = parseFloat((answer * 10).toPrecision(6));
    const wrong2 = parseFloat((answer / 10).toPrecision(6));
    const wrong3 = parseFloat((answer + (conv.factor >= 1 ? randInt(1, 5) : randInt(1, 5) * conv.factor)).toPrecision(6));
    const choices = shuffleArray([answer, wrong1, wrong2, wrong3]);
    return { text: conv.q(value), answer, choices, unit: conv.to };
  });

export function genQuestion(): Question { return Effect.runSync(genQuestionEffect()); }

export function isCorrect(selected: number, answer: number): boolean { return selected === answer; }

export function getGrade(correct: number, total: number): { grade: string; message: string } {
  const pct = total === 0 ? 0 : (correct / total) * 100;
  if (pct >= 90) return { grade: 'A+', message: '🏆 Excellent!' };
  if (pct >= 70) return { grade: 'B', message: '⭐ Great Job!' };
  if (pct >= 50) return { grade: 'C', message: '👍 Not Bad!' };
  return { grade: 'D', message: '💪 Keep Practicing!' };
}
