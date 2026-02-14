import { Effect, Either } from 'effect';

export interface ChessPuzzle {
  id: number;
  board: (string | null)[][]; // 8x8, piece strings like 'wK','bK','wQ','wR' etc
  correctMove: [number, number]; // [row, col] where to move the attacking piece
  attackerPos: [number, number]; // position of the piece that delivers mate
  description: string;
}

// Piece display mapping
export const PIECE_DISPLAY: Record<string, string> = {
  'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
  'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟',
};

function emptyBoard(): (string | null)[][] {
  return Array.from({ length: 8 }, () => Array(8).fill(null));
}

export const PUZZLES: ChessPuzzle[] = [
  {
    id: 1,
    board: (() => { const b = emptyBoard(); b[0][7] = 'bK'; b[2][5] = 'wK'; b[7][0] = 'wR'; return b; })(),
    correctMove: [0, 0],
    attackerPos: [7, 0],
    description: 'Move the Rook to deliver checkmate!',
  },
  {
    id: 2,
    board: (() => { const b = emptyBoard(); b[0][4] = 'bK'; b[2][4] = 'wK'; b[5][4] = 'wQ'; return b; })(),
    correctMove: [1, 4],
    attackerPos: [5, 4],
    description: 'Move the Queen to deliver checkmate!',
  },
  {
    id: 3,
    board: (() => { const b = emptyBoard(); b[0][0] = 'bK'; b[0][1] = 'bP'; b[1][0] = 'bP'; b[2][2] = 'wK'; b[7][7] = 'wR'; return b; })(),
    correctMove: [0, 7],
    attackerPos: [7, 7],
    description: 'Back rank mate! Move the Rook.',
  },
  {
    id: 4,
    board: (() => { const b = emptyBoard(); b[0][6] = 'bK'; b[0][7] = 'bR'; b[1][6] = 'bP'; b[1][7] = 'bP'; b[2][5] = 'wQ'; b[4][4] = 'wK'; return b; })(),
    correctMove: [1, 5],
    attackerPos: [2, 5],
    description: 'Queen smothered mate!',
  },
  {
    id: 5,
    board: (() => { const b = emptyBoard(); b[0][7] = 'bK'; b[1][6] = 'bP'; b[1][7] = 'bP'; b[3][7] = 'wQ'; b[5][5] = 'wK'; return b; })(),
    correctMove: [0, 6],
    attackerPos: [3, 7],
    description: 'Queen delivers mate on the edge!',
  },
  {
    id: 6,
    board: (() => { const b = emptyBoard(); b[0][4] = 'bK'; b[0][5] = 'bR'; b[1][3] = 'bP'; b[1][4] = 'bP'; b[6][0] = 'wR'; b[7][0] = 'wR'; b[4][4] = 'wK'; return b; })(),
    correctMove: [0, 0],
    attackerPos: [6, 0],
    description: 'Rook delivers back rank mate!',
  },
];

export const TOTAL = PUZZLES.length;

export function checkMove(row: number, col: number, puzzle: ChessPuzzle): boolean {
  return row === puzzle.correctMove[0] && col === puzzle.correctMove[1];
}

export const checkMoveEffect = (row: number, col: number, puzzle: ChessPuzzle): Either.Either<string, string> =>
  checkMove(row, col, puzzle) ? Either.right('Checkmate!') : Either.left('Not the right square');

export function shufflePuzzles(): ChessPuzzle[] {
  const arr = [...PUZZLES];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const shufflePuzzlesEffect = (): Effect.Effect<ChessPuzzle[]> =>
  Effect.sync(() => shufflePuzzles());

export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  const perfect = score === total;
  const good = score >= total * 0.5;
  return {
    emoji: perfect ? '🏆' : good ? '♟️' : '💪',
    title: perfect ? 'Grandmaster!' : good ? 'Great Tactics!' : 'Keep Practicing!',
    sub: `${score} of ${total} puzzles solved`,
  };
}
