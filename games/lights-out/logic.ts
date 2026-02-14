import { Effect } from 'effect';

export type LightsGrid = boolean[][]; // true = on

export const createEmptyGrid = (): LightsGrid =>
  Array.from({ length: 5 }, () => Array(5).fill(false));

export function toggle(grid: LightsGrid, row: number, col: number): LightsGrid {
  const g = grid.map(r => [...r]);
  const coords = [[row, col], [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]];
  for (const [r, c] of coords) {
    if (r >= 0 && r < 5 && c >= 0 && c < 5) g[r][c] = !g[r][c];
  }
  return g;
}

export function isSolved(grid: LightsGrid): boolean {
  return grid.every(r => r.every(v => !v));
}

export const PUZZLES: LightsGrid[] = [
  // Puzzle 1 - simple cross
  (() => { const g = createEmptyGrid(); return toggle(g, 2, 2); })(),
  // Puzzle 2
  (() => { let g = createEmptyGrid(); g = toggle(g, 0, 0); return toggle(g, 4, 4); })(),
  // Puzzle 3
  (() => { let g = createEmptyGrid(); g = toggle(g, 1, 1); g = toggle(g, 3, 3); return g; })(),
  // Puzzle 4
  (() => { let g = createEmptyGrid(); g = toggle(g, 0, 2); g = toggle(g, 2, 0); g = toggle(g, 2, 4); return toggle(g, 4, 2); })(),
  // Puzzle 5
  (() => { let g = createEmptyGrid(); g = toggle(g, 1, 0); g = toggle(g, 1, 4); g = toggle(g, 3, 0); return toggle(g, 3, 4); })(),
];

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const generateRandomPuzzleEffect = (): Effect.Effect<LightsGrid> =>
  Effect.gen(function* () {
    let g = createEmptyGrid();
    const moves = (yield* randomInt(5)) + 3;
    for (let i = 0; i < moves; i++) {
      const r = yield* randomInt(5);
      const c = yield* randomInt(5);
      g = toggle(g, r, c);
    }
    if (isSolved(g)) g = toggle(g, 2, 2);
    return g;
  });

export function generateRandomPuzzle(): LightsGrid {
  return Effect.runSync(generateRandomPuzzleEffect());
}

export function countLightsOn(grid: LightsGrid): number {
  return grid.flat().filter(v => v).length;
}
