import { Effect } from 'effect';

export const GRID_SIZE = 8;
export type CellType = 'empty' | 'wall' | 'start' | 'end' | 'path' | 'visited';

export interface Grid {
  cells: CellType[][];
  start: [number, number];
  end: [number, number];
}

export interface GameState {
  grid: Grid;
  userPath: [number, number][];
  shortestLength: number;
  won: boolean;
}

export function generateGrid(size: number = GRID_SIZE): Grid {
  const cells: CellType[][] = Array.from({ length: size }, () => Array(size).fill('empty'));
  const start: [number, number] = [0, 0];
  const end: [number, number] = [size - 1, size - 1];
  cells[0][0] = 'start';
  cells[size - 1][size - 1] = 'end';

  // Add random walls (~25%)
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if ((r === 0 && c === 0) || (r === size - 1 && c === size - 1)) continue;
      if (Math.random() < 0.25) cells[r][c] = 'wall';
    }
  }

  // Ensure path exists
  const shortest = bfs(cells, start, end);
  if (shortest === -1) {
    // Clear a path
    for (let i = 0; i < size; i++) {
      cells[i][i] = i === 0 ? 'start' : i === size - 1 ? 'end' : 'empty';
    }
  }

  return { cells, start, end };
}

export function bfs(cells: CellType[][], start: [number, number], end: [number, number]): number {
  const size = cells.length;
  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  const queue: [number, number, number][] = [[start[0], start[1], 0]];
  visited[start[0]][start[1]] = true;
  const dirs: [number, number][] = [[-1,0],[1,0],[0,-1],[0,1]];

  while (queue.length) {
    const [r, c, d] = queue.shift()!;
    if (r === end[0] && c === end[1]) return d;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited[nr][nc] && cells[nr][nc] !== 'wall') {
        visited[nr][nc] = true;
        queue.push([nr, nc, d + 1]);
      }
    }
  }
  return -1;
}

export function createGame(size: number = GRID_SIZE): GameState {
  const grid = generateGrid(size);
  const shortestLength = bfs(grid.cells, grid.start, grid.end);
  return { grid, userPath: [grid.start], shortestLength, won: false };
}

export function addToPath(state: GameState, r: number, c: number): GameState | null {
  if (state.won) return null;
  const last = state.userPath[state.userPath.length - 1];
  const dr = Math.abs(last[0] - r), dc = Math.abs(last[1] - c);
  if ((dr + dc) !== 1) return null; // must be adjacent
  if (state.grid.cells[r][c] === 'wall') return null;
  if (state.userPath.some(([pr, pc]) => pr === r && pc === c)) return null; // no revisits

  const userPath: [number, number][] = [...state.userPath, [r, c]];
  const won = r === state.grid.end[0] && c === state.grid.end[1];
  return { ...state, userPath, won };
}

export function isOptimal(state: GameState): boolean {
  return state.userPath.length - 1 === state.shortestLength;
}

// Effect wrappers
export const createGameEffect = (s?: number) => Effect.sync(() => createGame(s));
export const addToPathEffect = (st: GameState, r: number, c: number) => Effect.sync(() => addToPath(st, r, c));
