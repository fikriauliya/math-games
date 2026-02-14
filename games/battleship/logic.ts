import { Effect } from 'effect';

export type Cell = 'empty' | 'ship' | 'hit' | 'miss';
export type Board = Cell[][];

const SHIPS = [5, 4, 3, 3, 2];

export const createBoardEffect = (): Effect.Effect<Board> =>
  Effect.sync(() => {
    const board: Board = Array.from({ length: 10 }, () => Array(10).fill('empty'));
    for (const len of SHIPS) {
      let placed = false;
      while (!placed) {
        const horiz = Math.random() < 0.5;
        const r = Math.floor(Math.random() * (horiz ? 10 : 10 - len));
        const c = Math.floor(Math.random() * (horiz ? 10 - len : 10));
        let ok = true;
        for (let i = 0; i < len; i++) {
          const rr = horiz ? r : r + i, cc = horiz ? c + i : c;
          if (board[rr][cc] !== 'empty') { ok = false; break; }
        }
        if (ok) {
          for (let i = 0; i < len; i++) {
            const rr = horiz ? r : r + i, cc = horiz ? c + i : c;
            board[rr][cc] = 'ship';
          }
          placed = true;
        }
      }
    }
    return board;
  });

export const fireEffect = (board: Board, r: number, c: number): Effect.Effect<{ result: 'hit' | 'miss' | 'already'; sunk: boolean }> =>
  Effect.sync(() => {
    if (board[r][c] === 'hit' || board[r][c] === 'miss') return { result: 'already' as const, sunk: false };
    if (board[r][c] === 'ship') {
      board[r][c] = 'hit';
      return { result: 'hit' as const, sunk: false };
    }
    board[r][c] = 'miss';
    return { result: 'miss' as const, sunk: false };
  });

export const aiFireEffect = (board: Board): Effect.Effect<{ r: number; c: number }> =>
  Effect.sync(() => {
    const targets: { r: number; c: number }[] = [];
    // Look for adjacent to hits first
    for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
      if (board[r][c] === 'hit') {
        for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10 && (board[nr][nc] === 'empty' || board[nr][nc] === 'ship'))
            targets.push({ r: nr, c: nc });
        }
      }
    }
    if (targets.length > 0) return targets[Math.floor(Math.random() * targets.length)];
    // Random
    const avail: { r: number; c: number }[] = [];
    for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
      if (board[r][c] === 'empty' || board[r][c] === 'ship') avail.push({ r, c });
    }
    return avail[Math.floor(Math.random() * avail.length)];
  });

export const isGameOverEffect = (board: Board): Effect.Effect<boolean> =>
  Effect.succeed(!board.some(row => row.some(c => c === 'ship')));

export const countHitsEffect = (board: Board): Effect.Effect<number> =>
  Effect.succeed(board.flat().filter(c => c === 'hit').length);

export function createBoard(): Board { return Effect.runSync(createBoardEffect()); }
export function fire(b: Board, r: number, c: number) { return Effect.runSync(fireEffect(b, r, c)); }
export function aiFire(b: Board) { return Effect.runSync(aiFireEffect(b)); }
export function isGameOver(b: Board): boolean { return Effect.runSync(isGameOverEffect(b)); }
export function countHits(b: Board): number { return Effect.runSync(countHitsEffect(b)); }
