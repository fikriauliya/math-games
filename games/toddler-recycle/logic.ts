import { Effect } from 'effect';

export type BinType = 'organik' | 'anorganik';

export interface TrashItem {
  emoji: string;
  name: string;
  bin: BinType;
}

export const TRASH_ITEMS: TrashItem[] = [
  { emoji: '🍌', name: 'Kulit pisang', bin: 'organik' },
  { emoji: '🍎', name: 'Sisa apel', bin: 'organik' },
  { emoji: '🥬', name: 'Sayur', bin: 'organik' },
  { emoji: '🌿', name: 'Daun', bin: 'organik' },
  { emoji: '🍞', name: 'Roti', bin: 'organik' },
  { emoji: '🥚', name: 'Kulit telur', bin: 'organik' },
  { emoji: '🧃', name: 'Kotak jus', bin: 'anorganik' },
  { emoji: '🥤', name: 'Gelas plastik', bin: 'anorganik' },
  { emoji: '📦', name: 'Kardus', bin: 'anorganik' },
  { emoji: '🔋', name: 'Baterai', bin: 'anorganik' },
  { emoji: '👜', name: 'Tas plastik', bin: 'anorganik' },
  { emoji: '🥫', name: 'Kaleng', bin: 'anorganik' },
];

export const generateRoundsEffect = (count: number): Effect.Effect<TrashItem[]> =>
  Effect.sync(() => {
    const shuffled = [...TRASH_ITEMS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  });

export function generateRounds(count: number): TrashItem[] {
  return Effect.runSync(generateRoundsEffect(count));
}

export function checkBin(item: TrashItem, bin: BinType): boolean {
  return item.bin === bin;
}

export function getEndResult(correct: number, total: number): { title: string; stars: string } {
  const pct = correct / total;
  return {
    title: pct >= 0.8 ? '🎉 Hebat Sekali!' : pct >= 0.5 ? '⭐ Bagus!' : '💪 Coba Lagi!',
    stars: pct >= 0.9 ? '⭐⭐⭐' : pct >= 0.7 ? '⭐⭐' : '⭐',
  };
}
