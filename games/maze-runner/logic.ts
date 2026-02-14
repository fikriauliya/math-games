import { Effect } from 'effect';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Maze {
  width: number;
  height: number;
  walls: boolean[][][]; // walls[r][c] = [top, right, bottom, left]
  start: [number, number];
  end: [number, number];
}

export interface MazeState {
  maze: Maze;
  pos: [number, number];
  completed: boolean;
  startTime: number;
  moves: number;
}

function mazeSize(diff: Difficulty): { w: number; h: number } {
  if (diff === 'easy') return { w: 8, h: 8 };
  if (diff === 'medium') return { w: 12, h: 12 };
  return { w: 16, h: 16 };
}

export const generateMaze = (diff: Difficulty): Effect.Effect<Maze> =>
  Effect.sync(() => {
    const { w, h } = mazeSize(diff);
    // Initialize all walls
    const walls: boolean[][][] = Array.from({ length: h }, () =>
      Array.from({ length: w }, () => [true, true, true, true])
    );
    const visited = Array.from({ length: h }, () => Array(w).fill(false));

    // DFS maze generation
    const stack: [number, number][] = [[0, 0]];
    visited[0][0] = true;
    const dirs: [number, number, number, number][] = [
      [-1, 0, 0, 2], // up: remove top of current, bottom of neighbor
      [0, 1, 1, 3],  // right
      [1, 0, 2, 0],  // down
      [0, -1, 3, 1], // left
    ];

    while (stack.length > 0) {
      const [r, c] = stack[stack.length - 1];
      const neighbors = dirs
        .map(([dr, dc, w1, w2]) => ({ nr: r + dr, nc: c + dc, w1, w2 }))
        .filter(({ nr, nc }) => nr >= 0 && nr < h && nc >= 0 && nc < w && !visited[nr][nc]);

      if (neighbors.length === 0) {
        stack.pop();
        continue;
      }
      const { nr, nc, w1, w2 } = neighbors[Math.floor(Math.random() * neighbors.length)];
      walls[r][c][w1] = false;
      walls[nr][nc][w2] = false;
      visited[nr][nc] = true;
      stack.push([nr, nc]);
    }

    return { width: w, height: h, walls, start: [0, 0] as [number, number], end: [h - 1, w - 1] as [number, number] };
  });

export function canMove(maze: Maze, from: [number, number], dir: 'up' | 'down' | 'left' | 'right'): boolean {
  const [r, c] = from;
  const wallIdx = dir === 'up' ? 0 : dir === 'right' ? 1 : dir === 'down' ? 2 : 3;
  return !maze.walls[r][c][wallIdx];
}

export function move(state: MazeState, dir: 'up' | 'down' | 'left' | 'right'): MazeState {
  if (state.completed) return state;
  if (!canMove(state.maze, state.pos, dir)) return state;
  const dr = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;
  const dc = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
  const newPos: [number, number] = [state.pos[0] + dr, state.pos[1] + dc];
  const completed = newPos[0] === state.maze.end[0] && newPos[1] === state.maze.end[1];
  return { ...state, pos: newPos, completed, moves: state.moves + 1 };
}

export function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export function createMaze(diff: Difficulty): Maze {
  return Effect.runSync(generateMaze(diff));
}

export function createMazeState(maze: Maze): MazeState {
  return { maze, pos: [...maze.start] as [number, number], completed: false, startTime: Date.now(), moves: 0 };
}
