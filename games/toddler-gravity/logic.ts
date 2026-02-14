import { Effect } from 'effect';

export interface GravityQuestion {
  obj1: { name: string; emoji: string; heavy: boolean };
  obj2: { name: string; emoji: string; heavy: boolean };
  answer: 'left' | 'right'; // which lands first
  explanation: string;
}

const PAIRS: Omit<GravityQuestion, 'answer'>[] = [
  { obj1: { name: 'Batu', emoji: '🪨', heavy: true }, obj2: { name: 'Bulu', emoji: '🪶', heavy: false }, explanation: 'Batu lebih berat, jatuh lebih cepat karena angin tidak menahannya!' },
  { obj1: { name: 'Bola', emoji: '⚽', heavy: true }, obj2: { name: 'Balon', emoji: '🎈', heavy: false }, explanation: 'Bola lebih berat dari balon yang ringan!' },
  { obj1: { name: 'Kertas', emoji: '📄', heavy: false }, obj2: { name: 'Buku', emoji: '📕', heavy: true }, explanation: 'Buku lebih berat dari selembar kertas!' },
  { obj1: { name: 'Apel', emoji: '🍎', heavy: true }, obj2: { name: 'Daun', emoji: '🍃', heavy: false }, explanation: 'Apel lebih berat dari daun yang ringan!' },
  { obj1: { name: 'Sepatu', emoji: '👟', heavy: true }, obj2: { name: 'Bulu', emoji: '🪶', heavy: false }, explanation: 'Sepatu lebih berat dari bulu!' },
  { obj1: { name: 'Kelereng', emoji: '🔮', heavy: true }, obj2: { name: 'Kapas', emoji: '☁️', heavy: false }, explanation: 'Kelereng lebih berat dari kapas yang lembut!' },
  { obj1: { name: 'Semangka', emoji: '🍉', heavy: true }, obj2: { name: 'Tisu', emoji: '🧻', heavy: false }, explanation: 'Semangka sangat berat dibanding tisu!' },
  { obj1: { name: 'Sendok', emoji: '🥄', heavy: true }, obj2: { name: 'Pita', emoji: '🎀', heavy: false }, explanation: 'Sendok dari logam lebih berat dari pita!' },
];

export const genQuestionEffect = (): Effect.Effect<GravityQuestion> =>
  Effect.sync(() => {
    const pair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
    const swap = Math.random() > 0.5;
    const obj1 = swap ? pair.obj2 : pair.obj1;
    const obj2 = swap ? pair.obj1 : pair.obj2;
    const answer: 'left' | 'right' = obj1.heavy ? 'left' : 'right';
    return { obj1, obj2, answer, explanation: pair.explanation };
  });

export function genQuestion(): GravityQuestion { return Effect.runSync(genQuestionEffect()); }

export function isCorrect(selected: 'left' | 'right', answer: 'left' | 'right'): boolean {
  return selected === answer;
}

export function getEndResult(correct: number, total: number): { title: string; stars: string } {
  const pct = total === 0 ? 0 : correct / total;
  if (pct >= 0.8) return { title: '🎉 Hebat Sekali!', stars: '⭐⭐⭐' };
  if (pct >= 0.5) return { title: '⭐ Bagus!', stars: '⭐⭐' };
  return { title: '💪 Coba Lagi!', stars: '⭐' };
}
