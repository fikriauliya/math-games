import { Effect, Either } from 'effect';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MazeCell {
  x: number;
  y: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  isPath: boolean;
  question?: string;
  answer?: number;
  choices?: number[];
  solved: boolean;
}

export interface Maze {
  grid: MazeCell[][];
  width: number;
  height: number;
  playerX: number;
  playerY: number;
  exitX: number;
  exitY: number;
}

const randomInt = (min: number, max: number) => Effect.sync(() => Math.floor(Math.random() * (max - min + 1)) + min);

export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* randomInt(0, i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

function genMathQ(diff: Difficulty): { question: string; answer: number } {
  const a = diff === 'easy' ? Math.floor(Math.random() * 10) + 1 : diff === 'medium' ? Math.floor(Math.random() * 12) + 2 : Math.floor(Math.random() * 15) + 3;
  const b = diff === 'easy' ? Math.floor(Math.random() * 10) + 1 : diff === 'medium' ? Math.floor(Math.random() * 12) + 2 : Math.floor(Math.random() * 15) + 3;
  const ops = diff === 'easy' ? ['+'] : diff === 'medium' ? ['+', '-', '×'] : ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let answer: number;
  let qa = a, qb = b;
  if (op === '-') { qa = Math.max(a, b); qb = Math.min(a, b); }
  switch (op) {
    case '+': answer = qa + qb; break;
    case '-': answer = qa - qb; break;
    case '×': answer = qa * qb; break;
    default: answer = qa + qb;
  }
  return { question: `${qa} ${op} ${qb}`, answer };
}

export const generateMazeEffect = (diff: Difficulty): Effect.Effect<Maze> =>
  Effect.gen(function* () {
    const size = diff === 'easy' ? 4 : diff === 'medium' ? 5 : 6;
    const grid: MazeCell[][] = [];
    for (let y = 0; y < size; y++) {
      grid[y] = [];
      for (let x = 0; x < size; x++) {
        grid[y][x] = { x, y, walls: { top: true, right: true, bottom: true, left: true }, isPath: false, solved: false };
      }
    }

    // Simple maze generation using recursive backtracking
    const visited = new Set<string>();
    const stack: [number, number][] = [[0, 0]];
    visited.add('0,0');

    while (stack.length > 0) {
      const [cx, cy] = stack[stack.length - 1];
      const neighbors: [number, number, string, string][] = [];
      if (cy > 0 && !visited.has(`${cx},${cy - 1}`)) neighbors.push([cx, cy - 1, 'top', 'bottom']);
      if (cx < size - 1 && !visited.has(`${cx + 1},${cy}`)) neighbors.push([cx + 1, cy, 'right', 'left']);
      if (cy < size - 1 && !visited.has(`${cx},${cy + 1}`)) neighbors.push([cx, cy + 1, 'bottom', 'top']);
      if (cx > 0 && !visited.has(`${cx - 1},${cy}`)) neighbors.push([cx - 1, cy, 'left', 'right']);

      if (neighbors.length === 0) { stack.pop(); continue; }
      const idx = Math.floor(Math.random() * neighbors.length);
      const [nx, ny, wall1, wall2] = neighbors[idx];
      (grid[cy][cx].walls as any)[wall1] = false;
      (grid[ny][nx].walls as any)[wall2] = false;
      visited.add(`${nx},${ny}`);
      stack.push([nx, ny]);
    }

    // Mark path cells and add questions using BFS
    const path = findPath(grid, 0, 0, size - 1, size - 1, size);
    let qCount = 0;
    for (const [px, py] of path) {
      grid[py][px].isPath = true;
      if ((px !== 0 || py !== 0) && (px !== size - 1 || py !== size - 1) && qCount < 5) {
        const q = genMathQ(diff);
        const wrongs = new Set<number>();
        while (wrongs.size < 2) {
          const w = q.answer + Math.floor(Math.random() * 10) - 5;
          if (w !== q.answer && w >= 0) wrongs.add(w);
        }
        grid[py][px].question = q.question;
        grid[py][px].answer = q.answer;
        const shuffled = [q.answer, ...wrongs].sort(() => Math.random() - 0.5);
        grid[py][px].choices = shuffled;
        qCount++;
      }
    }

    return { grid, width: size, height: size, playerX: 0, playerY: 0, exitX: size - 1, exitY: size - 1 };
  });

function findPath(grid: MazeCell[][], sx: number, sy: number, ex: number, ey: number, size: number): [number, number][] {
  const queue: [number, number, [number, number][]][] = [[sx, sy, [[sx, sy]]]];
  const visited = new Set<string>();
  visited.add(`${sx},${sy}`);
  while (queue.length > 0) {
    const [x, y, path] = queue.shift()!;
    if (x === ex && y === ey) return path;
    const cell = grid[y][x];
    const dirs: [number, number, keyof MazeCell['walls']][] = [[0, -1, 'top'], [1, 0, 'right'], [0, 1, 'bottom'], [-1, 0, 'left']];
    for (const [dx, dy, wall] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < size && ny >= 0 && ny < size && !cell.walls[wall] && !visited.has(`${nx},${ny}`)) {
        visited.add(`${nx},${ny}`);
        queue.push([nx, ny, [...path, [nx, ny]]]);
      }
    }
  }
  return [[sx, sy]];
}

export function checkAnswer(answer: number, correct: number): boolean { return answer === correct; }

export function canMove(maze: Maze, dx: number, dy: number): boolean {
  const { playerX: x, playerY: y, grid } = maze;
  const cell = grid[y][x];
  if (dx === 0 && dy === -1) return !cell.walls.top;
  if (dx === 1 && dy === 0) return !cell.walls.right;
  if (dx === 0 && dy === 1) return !cell.walls.bottom;
  if (dx === -1 && dy === 0) return !cell.walls.left;
  return false;
}

export const getResultText = (solved: number, total: number) => ({
  emoji: solved === total ? '🏆' : solved >= total * 0.7 ? '🗝️' : '⚔️',
  title: solved === total ? 'Dungeon Master!' : solved >= total * 0.7 ? 'Great Explorer!' : 'Keep Adventuring!',
  sub: `${solved} / ${total} mazes cleared`,
});

// Plain wrappers
export function generateMaze(diff: Difficulty): Maze { return Effect.runSync(generateMazeEffect(diff)); }
export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
