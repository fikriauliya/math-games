import { Effect } from 'effect';

export const GRID_SIZE = 5;

// Pipe types: straight (vertical/horizontal), elbow, T, cross
// Connections: top, right, bottom, left
export type PipeType = 'straight' | 'elbow' | 'tee' | 'cross' | 'source' | 'drain' | 'empty';

export interface Pipe {
  type: PipeType;
  rotation: number; // 0, 1, 2, 3 (× 90°)
  connections: boolean[]; // [top, right, bottom, left]
}

export function getConnections(type: PipeType, rotation: number): boolean[] {
  let base: boolean[];
  switch (type) {
    case 'straight': base = [true, false, true, false]; break;
    case 'elbow': base = [true, true, false, false]; break;
    case 'tee': base = [true, true, false, true]; break;
    case 'cross': base = [true, true, true, true]; break;
    case 'source': base = [false, true, false, false]; break;
    case 'drain': base = [false, false, false, true]; break;
    case 'empty': base = [false, false, false, false]; break;
    default: base = [false, false, false, false];
  }
  // Rotate
  const result = [...base];
  for (let i = 0; i < (rotation % 4); i++) {
    const last = result.pop()!;
    result.unshift(last);
  }
  return result;
}

export interface GameState {
  grid: Pipe[][];
  solved: boolean;
}

export function createPuzzle(): GameState {
  const grid: Pipe[][] = [];
  const types: PipeType[] = ['straight', 'elbow', 'tee', 'straight', 'elbow'];

  for (let r = 0; r < GRID_SIZE; r++) {
    const row: Pipe[] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      if (r === Math.floor(GRID_SIZE / 2) && c === 0) {
        row.push({ type: 'source', rotation: 0, connections: getConnections('source', 0) });
      } else if (r === Math.floor(GRID_SIZE / 2) && c === GRID_SIZE - 1) {
        row.push({ type: 'drain', rotation: 0, connections: getConnections('drain', 0) });
      } else {
        const type = types[Math.floor(Math.random() * types.length)];
        const rotation = Math.floor(Math.random() * 4);
        row.push({ type, rotation, connections: getConnections(type, rotation) });
      }
    }
    grid.push(row);
  }
  return { grid, solved: false };
}

export function rotatePipe(state: GameState, r: number, c: number): GameState {
  if (state.solved) return state;
  const grid = state.grid.map(row => row.map(p => ({ ...p })));
  const pipe = grid[r][c];
  if (pipe.type === 'source' || pipe.type === 'drain' || pipe.type === 'empty') return state;
  pipe.rotation = (pipe.rotation + 1) % 4;
  pipe.connections = getConnections(pipe.type, pipe.rotation);
  const solved = checkFlow(grid);
  return { grid, solved };
}

export function checkFlow(grid: Pipe[][]): boolean {
  const size = grid.length;
  const mid = Math.floor(size / 2);
  // BFS from source
  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  const queue: [number, number][] = [[mid, 0]];
  visited[mid][0] = true;
  const dirs: [number, number][] = [[-1, 0], [0, 1], [1, 0], [0, -1]]; // top, right, bottom, left
  const opposite = [2, 3, 0, 1];

  while (queue.length) {
    const [r, c] = queue.shift()!;
    const pipe = grid[r][c];
    for (let d = 0; d < 4; d++) {
      if (!pipe.connections[d]) continue;
      const nr = r + dirs[d][0], nc = c + dirs[d][1];
      if (nr < 0 || nr >= size || nc < 0 || nc >= size || visited[nr][nc]) continue;
      const neighbor = grid[nr][nc];
      if (neighbor.connections[opposite[d]]) {
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }
  return visited[mid][size - 1];
}

// Effect wrappers
export const createPuzzleEffect = () => Effect.sync(() => createPuzzle());
export const rotatePipeEffect = (s: GameState, r: number, c: number) => Effect.sync(() => rotatePipe(s, r, c));
