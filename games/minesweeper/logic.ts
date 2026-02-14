import { Effect } from 'effect';

export interface Cell {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
}

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

export const DIFFICULTIES: Record<string, GameConfig> = {
  easy: { rows: 6, cols: 6, mines: 6 },
  medium: { rows: 8, cols: 8, mines: 10 },
  hard: { rows: 10, cols: 10, mines: 15 },
};

export type Board = Cell[][];

export function createEmptyBoard(rows: number, cols: number): Board {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 }))
  );
}

function getAdjacent(r: number, c: number, rows: number, cols: number): [number, number][] {
  const adj: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) adj.push([nr, nc]);
    }
  return adj;
}

export const placeMinesEffect = (rows: number, cols: number, mines: number, safeR: number, safeC: number): Effect.Effect<Board> =>
  Effect.gen(function* () {
    const board = createEmptyBoard(rows, cols);
    let placed = 0;
    while (placed < mines) {
      const r = yield* Effect.sync(() => Math.floor(Math.random() * rows));
      const c = yield* Effect.sync(() => Math.floor(Math.random() * cols));
      if (board[r][c].mine || (r === safeR && c === safeC)) continue;
      board[r][c].mine = true;
      placed++;
    }
    // Calculate adjacency
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (!board[r][c].mine)
          board[r][c].adjacent = getAdjacent(r, c, rows, cols).filter(([ar, ac]) => board[ar][ac].mine).length;
    return board;
  });

export function placeMines(rows: number, cols: number, mines: number, safeR: number, safeC: number): Board {
  return Effect.runSync(placeMinesEffect(rows, cols, mines, safeR, safeC));
}

export function reveal(board: Board, r: number, c: number): Board {
  const b = board.map(row => row.map(cell => ({ ...cell })));
  const flood = (r: number, c: number) => {
    if (r < 0 || r >= b.length || c < 0 || c >= b[0].length) return;
    if (b[r][c].revealed || b[r][c].flagged) return;
    b[r][c].revealed = true;
    if (b[r][c].adjacent === 0 && !b[r][c].mine) {
      getAdjacent(r, c, b.length, b[0].length).forEach(([nr, nc]) => flood(nr, nc));
    }
  };
  flood(r, c);
  return b;
}

export function toggleFlag(board: Board, r: number, c: number): Board {
  const b = board.map(row => row.map(cell => ({ ...cell })));
  if (!b[r][c].revealed) b[r][c].flagged = !b[r][c].flagged;
  return b;
}

export function checkWin(board: Board): boolean {
  return board.every(row => row.every(cell => cell.mine ? !cell.revealed : cell.revealed));
}

export function checkLoss(board: Board): boolean {
  return board.some(row => row.some(cell => cell.mine && cell.revealed));
}

export function countFlags(board: Board): number {
  return board.reduce((sum, row) => sum + row.filter(c => c.flagged).length, 0);
}

export function revealAll(board: Board): Board {
  return board.map(row => row.map(cell => ({ ...cell, revealed: true })));
}
