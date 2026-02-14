import { Effect } from 'effect';

export interface ShadowItem {
  emoji: string;
  name: string;
}

export const ITEMS: ShadowItem[] = [
  { emoji: '🐱', name: 'Kucing' },
  { emoji: '🐶', name: 'Anjing' },
  { emoji: '🌳', name: 'Pohon' },
  { emoji: '🏠', name: 'Rumah' },
  { emoji: '⭐', name: 'Bintang' },
  { emoji: '🚗', name: 'Mobil' },
  { emoji: '🐟', name: 'Ikan' },
  { emoji: '🦋', name: 'Kupu-kupu' },
  { emoji: '🍎', name: 'Apel' },
  { emoji: '🌸', name: 'Bunga' },
  { emoji: '🐰', name: 'Kelinci' },
  { emoji: '🐸', name: 'Katak' },
];

export interface ShadowRound {
  target: ShadowItem;
  choices: ShadowItem[];
}

export const generateRoundEffect = (): Effect.Effect<ShadowRound> =>
  Effect.sync(() => {
    const shuffled = [...ITEMS].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    const wrong = shuffled[1];
    const choices = Math.random() > 0.5 ? [target, wrong] : [wrong, target];
    return { target, choices };
  });

export function generateRound(): ShadowRound {
  return Effect.runSync(generateRoundEffect());
}

export function checkAnswer(selected: ShadowItem, target: ShadowItem): boolean {
  return selected.emoji === target.emoji;
}

export function getEndResult(correct: number, total: number): { title: string; stars: string } {
  const pct = correct / total;
  return {
    title: pct >= 0.8 ? '🎉 Hebat Sekali!' : pct >= 0.5 ? '⭐ Bagus!' : '💪 Coba Lagi!',
    stars: pct >= 0.9 ? '⭐⭐⭐' : pct >= 0.7 ? '⭐⭐' : '⭐',
  };
}
