import { Effect } from 'effect';

export type Grid = number[][]; // 0 = empty
export type Direction = 'up' | 'down' | 'left' | 'right';

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const createGrid = (): Grid => Array.from({ length: 4 }, () => Array(4).fill(0));

export const addRandomTileEffect = (grid: Grid): Effect.Effect<Grid> =>
  Effect.gen(function* () {
    const g = grid.map(r => [...r]);
    const empty: [number, number][] = [];
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++)
        if (g[r][c] === 0) empty.push([r, c]);
    if (empty.length === 0) return g;
    const idx = yield* randomInt(empty.length);
    const val = (yield* randomInt(10)) < 9 ? 2 : 4;
    g[empty[idx][0]][empty[idx][1]] = val;
    return g;
  });

function slideLine(line: number[]): { result: number[]; score: number; moved: boolean } {
  const filtered = line.filter(v => v !== 0);
  let score = 0;
  const merged: number[] = [];
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const val = filtered[i] * 2;
      merged.push(val);
      score += val;
      i += 2;
    } else {
      merged.push(filtered[i]);
      i++;
    }
  }
  while (merged.length < 4) merged.push(0);
  const moved = line.some((v, j) => v !== merged[j]);
  return { result: merged, score, moved };
}

export function move(grid: Grid, dir: Direction): { grid: Grid; score: number; moved: boolean } {
  let g = grid.map(r => [...r]);
  let totalScore = 0;
  let anyMoved = false;

  if (dir === 'left') {
    for (let r = 0; r < 4; r++) {
      const { result, score, moved } = slideLine(g[r]);
      g[r] = result; totalScore += score; if (moved) anyMoved = true;
    }
  } else if (dir === 'right') {
    for (let r = 0; r < 4; r++) {
      const { result, score, moved } = slideLine([...g[r]].reverse());
      g[r] = result.reverse(); totalScore += score; if (moved) anyMoved = true;
    }
  } else if (dir === 'up') {
    for (let c = 0; c < 4; c++) {
      const col = [g[0][c], g[1][c], g[2][c], g[3][c]];
      const { result, score, moved } = slideLine(col);
      for (let r = 0; r < 4; r++) g[r][c] = result[r];
      totalScore += score; if (moved) anyMoved = true;
    }
  } else {
    for (let c = 0; c < 4; c++) {
      const col = [g[3][c], g[2][c], g[1][c], g[0][c]];
      const { result, score, moved } = slideLine(col);
      for (let r = 0; r < 4; r++) g[r][c] = result[3 - r];
      totalScore += score; if (moved) anyMoved = true;
    }
  }
  return { grid: g, score: totalScore, moved: anyMoved };
}

export function canMove(grid: Grid): boolean {
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return true;
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return true;
    }
  return false;
}

export function hasWon(grid: Grid): boolean {
  return grid.some(r => r.some(v => v >= 2048));
}

export function addRandomTile(grid: Grid): Grid {
  return Effect.runSync(addRandomTileEffect(grid));
}

export const TILE_COLORS: Record<number, string> = {
  2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563',
  32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61',
  512: '#edc850', 1024: '#edc53f', 2048: '#edc22e',
};
