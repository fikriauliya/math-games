import { Effect } from 'effect';

export type Mark = 'X' | 'O' | null;
export type Board = Mark[];

export interface GameState {
  board: Board;
  currentPlayer: Mark;
  winner: Mark;
  draw: boolean;
  mode: '1p' | '2p';
}

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6],         // diags
];

export function createGameState(mode: '1p' | '2p'): GameState {
  return { board: Array(9).fill(null), currentPlayer: 'X', winner: null, draw: false, mode };
}

export function checkWinner(board: Board): Mark {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
  }
  return null;
}

export function isDraw(board: Board): boolean {
  return !checkWinner(board) && board.every(c => c !== null);
}

export function makeMove(state: GameState, index: number): GameState | null {
  if (state.board[index] || state.winner || state.draw) return null;
  const board = [...state.board];
  board[index] = state.currentPlayer;
  const winner = checkWinner(board);
  const draw = isDraw(board);
  return {
    ...state,
    board,
    currentPlayer: winner || draw ? state.currentPlayer : (state.currentPlayer === 'X' ? 'O' : 'X'),
    winner,
    draw,
  };
}

export function getAIMove(board: Board): number {
  // 1. Win if possible
  for (const [a, b, c] of WIN_LINES) {
    const line = [board[a], board[b], board[c]];
    if (line.filter(m => m === 'O').length === 2 && line.includes(null)) {
      const idx = [a, b, c][line.indexOf(null)];
      return idx;
    }
  }
  // 2. Block opponent win
  for (const [a, b, c] of WIN_LINES) {
    const line = [board[a], board[b], board[c]];
    if (line.filter(m => m === 'X').length === 2 && line.includes(null)) {
      const idx = [a, b, c][line.indexOf(null)];
      return idx;
    }
  }
  // 3. Center
  if (!board[4]) return 4;
  // 4. Random empty
  const empty = board.map((c, i) => c === null ? i : -1).filter(i => i >= 0);
  return empty[Math.floor(Math.random() * empty.length)];
}

export function getWinLine(board: Board): number[] | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) return line;
  }
  return null;
}
