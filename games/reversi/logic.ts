import { Effect } from 'effect';

export const SIZE = 8;
export type Player = 'black' | 'white';
export type Cell = Player | null;

export interface GameState {
  board: Cell[][];
  currentPlayer: Player;
  gameOver: boolean;
  blackCount: number;
  whiteCount: number;
}

export function createGame(): GameState {
  const board: Cell[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  const m = SIZE / 2;
  board[m - 1][m - 1] = 'white'; board[m - 1][m] = 'black';
  board[m][m - 1] = 'black'; board[m][m] = 'white';
  return { board, currentPlayer: 'black', gameOver: false, ...countPieces(board) };
}

function countPieces(board: Cell[][]): { blackCount: number; whiteCount: number } {
  let blackCount = 0, whiteCount = 0;
  for (const row of board) for (const c of row) { if (c === 'black') blackCount++; if (c === 'white') whiteCount++; }
  return { blackCount, whiteCount };
}

const DIRS: [number, number][] = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

export function getFlips(board: Cell[][], r: number, c: number, player: Player): [number, number][] {
  if (board[r][c] !== null) return [];
  const opp: Player = player === 'black' ? 'white' : 'black';
  const allFlips: [number, number][] = [];
  for (const [dr, dc] of DIRS) {
    const flips: [number, number][] = [];
    let nr = r + dr, nc = c + dc;
    while (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === opp) {
      flips.push([nr, nc]);
      nr += dr; nc += dc;
    }
    if (flips.length > 0 && nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === player) {
      allFlips.push(...flips);
    }
  }
  return allFlips;
}

export function getValidMoves(board: Cell[][], player: Player): [number, number][] {
  const moves: [number, number][] = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (getFlips(board, r, c, player).length > 0) moves.push([r, c]);
  return moves;
}

export function makeMove(state: GameState, r: number, c: number): GameState | null {
  if (state.gameOver) return null;
  const flips = getFlips(state.board, r, c, state.currentPlayer);
  if (flips.length === 0) return null;

  const board = state.board.map(row => [...row]);
  board[r][c] = state.currentPlayer;
  for (const [fr, fc] of flips) board[fr][fc] = state.currentPlayer;

  const opp: Player = state.currentPlayer === 'black' ? 'white' : 'black';
  let nextPlayer = opp;
  let gameOver = false;

  if (getValidMoves(board, opp).length === 0) {
    if (getValidMoves(board, state.currentPlayer).length === 0) {
      gameOver = true;
    } else {
      nextPlayer = state.currentPlayer; // opponent passes
    }
  }

  return { board, currentPlayer: nextPlayer, gameOver, ...countPieces(board) };
}

export function getAIMove(state: GameState): [number, number] | null {
  const moves = getValidMoves(state.board, state.currentPlayer);
  if (moves.length === 0) return null;
  // Simple: prefer corners, then edges, then max flips
  const corners = moves.filter(([r, c]) => (r === 0 || r === SIZE - 1) && (c === 0 || c === SIZE - 1));
  if (corners.length) return corners[0];
  const edges = moves.filter(([r, c]) => r === 0 || r === SIZE - 1 || c === 0 || c === SIZE - 1);
  if (edges.length) return edges[0];
  // Max flips
  let best = moves[0], bestCount = 0;
  for (const [r, c] of moves) {
    const count = getFlips(state.board, r, c, state.currentPlayer).length;
    if (count > bestCount) { bestCount = count; best = [r, c]; }
  }
  return best;
}

export function getWinner(state: GameState): Player | 'draw' | null {
  if (!state.gameOver) return null;
  if (state.blackCount > state.whiteCount) return 'black';
  if (state.whiteCount > state.blackCount) return 'white';
  return 'draw';
}

// Effect wrappers
export const createGameEffect = () => Effect.sync(() => createGame());
export const makeMoveEffect = (s: GameState, r: number, c: number) => Effect.sync(() => makeMove(s, r, c));
