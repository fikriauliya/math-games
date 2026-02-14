import { Effect } from 'effect';

export const BOARD_SIZE = 5;
export const KNIGHT_MOVES: [number, number][] = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];

export interface GameState {
  board: number[][]; // 0=unvisited, >0=visit order
  currentPos: [number, number];
  moveCount: number;
  totalCells: number;
  won: boolean;
  stuck: boolean;
}

export function createGame(startR: number = 0, startC: number = 0): GameState {
  const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
  board[startR][startC] = 1;
  return { board, currentPos: [startR, startC], moveCount: 1, totalCells: BOARD_SIZE * BOARD_SIZE, won: false, stuck: false };
}

export function getValidMoves(state: GameState): [number, number][] {
  const [r, c] = state.currentPos;
  return KNIGHT_MOVES
    .map(([dr, dc]): [number, number] => [r + dr, c + dc])
    .filter(([nr, nc]) => nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && state.board[nr][nc] === 0);
}

export function makeMove(state: GameState, r: number, c: number): GameState | null {
  if (state.won || state.stuck) return null;
  const valid = getValidMoves(state);
  if (!valid.some(([vr, vc]) => vr === r && vc === c)) return null;

  const board = state.board.map(row => [...row]);
  const moveCount = state.moveCount + 1;
  board[r][c] = moveCount;
  const won = moveCount === state.totalCells;
  const newState: GameState = { board, currentPos: [r, c], moveCount, totalCells: state.totalCells, won, stuck: false };
  if (!won && getValidMoves(newState).length === 0) newState.stuck = true;
  return newState;
}

export function isKnightMove(fromR: number, fromC: number, toR: number, toC: number): boolean {
  const dr = Math.abs(fromR - toR);
  const dc = Math.abs(fromC - toC);
  return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
}

// Effect wrappers
export const createGameEffect = (r?: number, c?: number) => Effect.sync(() => createGame(r, c));
export const makeMoveEffect = (s: GameState, r: number, c: number) => Effect.sync(() => makeMove(s, r, c));
