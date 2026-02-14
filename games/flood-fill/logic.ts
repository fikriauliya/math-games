import { Effect } from 'effect';

export const COLORS = ['#e53935', '#43a047', '#1e88e5', '#fdd835', '#8e24aa', '#ff7043'];
export const BOARD_SIZE = 8;

export interface GameState {
  board: number[][];
  moves: number;
  maxMoves: number;
  won: boolean;
}

export function createBoard(size: number = BOARD_SIZE): number[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(Math.random() * COLORS.length))
  );
}

export function createGame(size: number = BOARD_SIZE): GameState {
  return { board: createBoard(size), moves: 0, maxMoves: 20, won: false };
}

export function flood(state: GameState, newColor: number): GameState {
  const board = state.board.map(r => [...r]);
  const oldColor = board[0][0];
  if (oldColor === newColor || state.won) return state;

  const size = board.length;
  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  const stack: [number, number][] = [[0, 0]];

  while (stack.length) {
    const [r, c] = stack.pop()!;
    if (r < 0 || r >= size || c < 0 || c >= size) continue;
    if (visited[r][c] || board[r][c] !== oldColor) continue;
    visited[r][c] = true;
    board[r][c] = newColor;
    stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
  }

  const moves = state.moves + 1;
  const won = board.every(row => row.every(cell => cell === newColor));
  return { board, moves, maxMoves: state.maxMoves, won };
}

export function isGameOver(state: GameState): boolean {
  return state.won || state.moves >= state.maxMoves;
}

export function currentColor(state: GameState): number {
  return state.board[0][0];
}

// Effect wrappers
export const createGameEffect = (s?: number) => Effect.sync(() => createGame(s));
export const floodEffect = (st: GameState, c: number) => Effect.sync(() => flood(st, c));
