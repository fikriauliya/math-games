import { Effect } from 'effect';

export const COLS = 7;
export const ROWS = 6;
export type Player = 'red' | 'yellow';
export type Cell = Player | null;

export interface GameState {
  board: Cell[][];
  currentPlayer: Player;
  winner: Player | null;
  draw: boolean;
}

export function createBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

export function createGameState(): GameState {
  return { board: createBoard(), currentPlayer: 'red', winner: null, draw: false };
}

export function dropDisc(state: GameState, col: number): GameState | null {
  if (col < 0 || col >= COLS || state.winner || state.draw) return null;
  const board = state.board.map(row => [...row]);
  
  // Find lowest empty row in column
  let row = -1;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!board[r][col]) { row = r; break; }
  }
  if (row === -1) return null; // Column full

  board[row][col] = state.currentPlayer;
  const winner = checkWin(board, row, col, state.currentPlayer);
  const draw = !winner && board[0].every((_, c) => board[0][c] !== null);
  const nextPlayer: Player = state.currentPlayer === 'red' ? 'yellow' : 'red';

  return { board, currentPlayer: winner || draw ? state.currentPlayer : nextPlayer, winner: winner ? state.currentPlayer : null, draw };
}

export function checkWin(board: Cell[][], row: number, col: number, player: Player): boolean {
  const dirs: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (const [dr, dc] of dirs) {
    let count = 1;
    for (let d = 1; d <= 3; d++) {
      const r = row + dr * d, c = col + dc * d;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) count++;
      else break;
    }
    for (let d = 1; d <= 3; d++) {
      const r = row - dr * d, c = col - dc * d;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) count++;
      else break;
    }
    if (count >= 4) return true;
  }
  return false;
}

export function isColumnFull(board: Cell[][], col: number): boolean {
  return board[0][col] !== null;
}
