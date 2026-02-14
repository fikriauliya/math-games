export interface ColorItem { name: string; color: string; emoji: string; }
export interface ShapeItem { name: string; emoji: string; svg: string; }

export const COLORS: ColorItem[] = [
  { name: 'MERAH', color: '#f44336', emoji: '🔴' },
  { name: 'BIRU', color: '#2196F3', emoji: '🔵' },
  { name: 'KUNING', color: '#FFEB3B', emoji: '🟡' },
  { name: 'HIJAU', color: '#4CAF50', emoji: '🟢' },
  { name: 'ORANGE', color: '#FF9800', emoji: '🟠' },
  { name: 'UNGU', color: '#9C27B0', emoji: '🟣' },
  { name: 'PINK', color: '#E91E63', emoji: '💗' },
  { name: 'COKLAT', color: '#795548', emoji: '🟤' },
];

export const SHAPES: ShapeItem[] = [
  { name: 'LINGKARAN', emoji: '⚫', svg: 'circle' },
  { name: 'BINTANG', emoji: '⭐', svg: 'star' },
  { name: 'HATI', emoji: '❤️', svg: 'heart' },
  { name: 'SEGITIGA', emoji: '🔺', svg: 'triangle' },
  { name: 'KOTAK', emoji: '⬛', svg: 'square' },
  { name: 'BULAN', emoji: '🌙', svg: 'moon' },
];

export const ANIMALS = ['🐶','🐱','🐰','🐸','🐣','🐷','🐮','🦊','🐻','🐼','🐨','🦁','🐯','🐵','🐔'];

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

export function generateCountingAnswers(targetCount: number): number[] {
  const answers = new Set([targetCount]);
  const candidates = [1, 2, 3, 4, 5, 6, 7].filter(n => n !== targetCount);
  // shuffle candidates
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  for (const c of candidates) {
    if (answers.size >= 4) break;
    answers.add(c);
  }
  return [...answers].sort((a, b) => a - b);
}

export function getEndResult(correct: number, total: number): { title: string; stars: string } {
  const pct = correct / total;
  return {
    title: pct >= 0.8 ? '🎉 Hebat Sekali!' : pct >= 0.5 ? '⭐ Bagus!' : '💪 Coba Lagi!',
    stars: pct >= 0.9 ? '⭐⭐⭐' : pct >= 0.7 ? '⭐⭐' : '⭐',
  };
}
