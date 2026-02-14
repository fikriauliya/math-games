import { Effect } from 'effect';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface SudokuState {
  size: number;
  boxW: number;
  boxH: number;
  solution: number[][];
  board: number[][]; // 0 = empty
  fixed: boolean[][]; // true = pre-filled
  selected: [number, number] | null;
  startTime: number;
  completed: boolean;
}

function gridSize(diff: Difficulty): { size: number; boxW: number; boxH: number } {
  if (diff === 'easy') return { size: 4, boxW: 2, boxH: 2 };
  if (diff === 'medium') return { size: 6, boxW: 3, boxH: 2 };
  return { size: 9, boxW: 3, boxH: 3 };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function solve(grid: number[][], size: number, boxW: number, boxH: number): boolean {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 0) {
        const nums = shuffle(Array.from({ length: size }, (_, i) => i + 1));
        for (const n of nums) {
          if (isValidPlacement(grid, r, c, n, size, boxW, boxH)) {
            grid[r][c] = n;
            if (solve(grid, size, boxW, boxH)) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValidPlacement(grid: number[][], row: number, col: number, num: number, size: number, boxW: number, boxH: number): boolean {
  for (let c = 0; c < size; c++) if (grid[row][c] === num) return false;
  for (let r = 0; r < size; r++) if (grid[r][col] === num) return false;
  const br = Math.floor(row / boxH) * boxH;
  const bc = Math.floor(col / boxW) * boxW;
  for (let r = br; r < br + boxH; r++)
    for (let c = bc; c < bc + boxW; c++)
      if (grid[r][c] === num) return false;
  return true;
}

export const generatePuzzle = (diff: Difficulty): Effect.Effect<SudokuState> =>
  Effect.sync(() => {
    const { size, boxW, boxH } = gridSize(diff);
    const solution = Array.from({ length: size }, () => Array(size).fill(0));
    solve(solution, size, boxW, boxH);

    const board = solution.map(r => [...r]);
    const fixed = Array.from({ length: size }, () => Array(size).fill(false));

    // Remove cells - more removals for harder difficulties
    const removals = diff === 'easy' ? 8 : diff === 'medium' ? 18 : 45;
    let removed = 0;
    while (removed < removals) {
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      if (board[r][c] !== 0) { board[r][c] = 0; removed++; }
    }

    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++)
        fixed[r][c] = board[r][c] !== 0;

    return { size, boxW, boxH, solution, board, fixed, selected: null, startTime: Date.now(), completed: false };
  });

export function placeNumber(state: SudokuState, row: number, col: number, num: number): SudokuState {
  if (state.fixed[row][col] || state.completed) return state;
  const board = state.board.map(r => [...r]);
  board[row][col] = num;
  const completed = checkComplete(board, state.solution);
  return { ...state, board, completed };
}

export function clearCell(state: SudokuState, row: number, col: number): SudokuState {
  if (state.fixed[row][col] || state.completed) return state;
  const board = state.board.map(r => [...r]);
  board[row][col] = 0;
  return { ...state, board };
}

export function getConflicts(board: number[][], size: number, boxW: number, boxH: number): Set<string> {
  const conflicts = new Set<string>();
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const v = board[r][c];
      if (v === 0) continue;
      // Check row
      for (let c2 = 0; c2 < size; c2++) if (c2 !== c && board[r][c2] === v) { conflicts.add(`${r},${c}`); conflicts.add(`${r},${c2}`); }
      // Check col
      for (let r2 = 0; r2 < size; r2++) if (r2 !== r && board[r2][c] === v) { conflicts.add(`${r},${c}`); conflicts.add(`${r2},${c}`); }
      // Check box
      const br = Math.floor(r / boxH) * boxH;
      const bc = Math.floor(c / boxW) * boxW;
      for (let r2 = br; r2 < br + boxH; r2++)
        for (let c2 = bc; c2 < bc + boxW; c2++)
          if ((r2 !== r || c2 !== c) && board[r2][c2] === v) { conflicts.add(`${r},${c}`); conflicts.add(`${r2},${c2}`); }
    }
  }
  return conflicts;
}

export function checkComplete(board: number[][], solution: number[][]): boolean {
  for (let r = 0; r < board.length; r++)
    for (let c = 0; c < board[r].length; c++)
      if (board[r][c] !== solution[r][c]) return false;
  return true;
}

export function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

// Plain wrappers
export function createPuzzle(diff: Difficulty): SudokuState {
  return Effect.runSync(generatePuzzle(diff));
}
