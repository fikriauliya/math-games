import { Effect } from 'effect';

export interface MirrorRound {
  size: number;
  pattern: boolean[][];
  mode: 'same' | 'mirror' | 'rotate';
}

export const TOTAL_ROUNDS = 10;
const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const generateRoundEffect = (roundNum: number): Effect.Effect<MirrorRound> =>
  Effect.sync(() => {
    const rand = (max: number) => Math.floor(Math.random() * max);
    const size = roundNum < 3 ? 3 : roundNum < 6 ? 4 : roundNum < 8 ? 5 : 6;
    const modes: MirrorRound['mode'][] = roundNum < 4 ? ['same'] : ['same', 'mirror', 'rotate'];
    const mode = modes[rand(modes.length)];
    const fillCount = Math.floor(size * size * 0.3) + 2;

    const pattern: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
    let filled = 0;
    while (filled < fillCount) {
      const r = rand(size);
      const c = rand(size);
      if (!pattern[r][c]) { pattern[r][c] = true; filled++; }
    }
    return { size, pattern, mode };
  });

export function getExpectedPattern(round: MirrorRound): boolean[][] {
  const { size, pattern, mode } = round;
  if (mode === 'same') return pattern.map(row => [...row]);
  if (mode === 'mirror') return pattern.map(row => [...row].reverse());
  // rotate 90 degrees clockwise
  const rotated: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      rotated[c][size - 1 - r] = pattern[r][c];
  return rotated;
}

export function checkPattern(userGrid: boolean[][], expected: boolean[][]): { correct: number; total: number; perfect: boolean } {
  let correct = 0, total = 0;
  for (let r = 0; r < expected.length; r++) {
    for (let c = 0; c < expected[r].length; c++) {
      total++;
      if (userGrid[r][c] === expected[r][c]) correct++;
    }
  }
  return { correct, total, perfect: correct === total };
}

export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  const pct = score / total;
  return {
    emoji: pct >= 1 ? '🏆' : pct >= 0.7 ? '🔬' : '💪',
    title: pct >= 1 ? 'Perfect Replication!' : pct >= 0.7 ? 'Good Analysis!' : 'Keep Experimenting!',
    sub: `${score} / ${total} rounds correct!`,
  };
}

// Plain wrappers
export function generateRound(roundNum: number): MirrorRound { return Effect.runSync(generateRoundEffect(roundNum)); }
