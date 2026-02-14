import { Effect } from 'effect';

export interface PatternItem { emoji: string; name: string; }

export const PATTERN_SETS: PatternItem[][] = [
  [{ emoji: '🔴', name: 'merah' }, { emoji: '🔵', name: 'biru' }],
  [{ emoji: '🟡', name: 'kuning' }, { emoji: '🟢', name: 'hijau' }],
  [{ emoji: '⭐', name: 'bintang' }, { emoji: '🌙', name: 'bulan' }],
  [{ emoji: '🐶', name: 'anjing' }, { emoji: '🐱', name: 'kucing' }],
  [{ emoji: '🍎', name: 'apel' }, { emoji: '🍌', name: 'pisang' }],
  [{ emoji: '🌸', name: 'bunga' }, { emoji: '🍃', name: 'daun' }],
  [{ emoji: '☀️', name: 'matahari' }, { emoji: '🌧️', name: 'hujan' }],
  [{ emoji: '🐸', name: 'katak' }, { emoji: '🐣', name: 'ayam' }],
];

export interface PatternRound {
  sequence: PatternItem[];
  answer: PatternItem;
  choices: PatternItem[];
}

export const generatePatternEffect = (): Effect.Effect<PatternRound> =>
  Effect.sync(() => {
    const set = PATTERN_SETS[Math.floor(Math.random() * PATTERN_SETS.length)];
    const [a, b] = set;
    // Pattern: ABAB or AABB
    const patterns = [
      [a, b, a, b, a],
      [a, a, b, b, a],
      [b, a, b, a, b],
      [a, b, b, a, b],
    ];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const answer = pattern[pattern.length - 1];
    const sequence = pattern.slice(0, -1);
    const wrong = set.find(s => s.emoji !== answer.emoji)!;
    const choices = Math.random() > 0.5 ? [answer, wrong] : [wrong, answer];
    return { sequence, answer, choices };
  });

export function generatePattern(): PatternRound {
  return Effect.runSync(generatePatternEffect());
}

export function checkAnswer(selected: PatternItem, answer: PatternItem): boolean {
  return selected.emoji === answer.emoji;
}

export function getEndResult(correct: number, total: number): { title: string; stars: string } {
  const pct = correct / total;
  return {
    title: pct >= 0.8 ? '🎉 Hebat Sekali!' : pct >= 0.5 ? '⭐ Bagus!' : '💪 Coba Lagi!',
    stars: pct >= 0.9 ? '⭐⭐⭐' : pct >= 0.7 ? '⭐⭐' : '⭐',
  };
}
