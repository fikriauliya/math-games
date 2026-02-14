import { Effect } from 'effect';

export const GRID_SIZE = 4;
export const TILE_COUNT = GRID_SIZE * GRID_SIZE - 1;

export type Board = number[]; // 0 = empty, 1-15 = tiles

export function solvedBoard(): Board {
  const b: Board = [];
  for (let i = 1; i <= TILE_COUNT; i++) b.push(i);
  b.push(0);
  return b;
}

export function isSolved(board: Board): boolean {
  const solved = solvedBoard();
  return board.every((v, i) => v === solved[i]);
}

export function findEmpty(board: Board): number {
  return board.indexOf(0);
}

export function getNeighbors(index: number): number[] {
  const row = Math.floor(index / GRID_SIZE);
  const col = index % GRID_SIZE;
  const neighbors: number[] = [];
  if (row > 0) neighbors.push(index - GRID_SIZE);
  if (row < GRID_SIZE - 1) neighbors.push(index + GRID_SIZE);
  if (col > 0) neighbors.push(index - 1);
  if (col < GRID_SIZE - 1) neighbors.push(index + 1);
  return neighbors;
}

export function canMove(board: Board, tileIndex: number): boolean {
  const emptyIndex = findEmpty(board);
  return getNeighbors(tileIndex).includes(emptyIndex);
}

export function moveTile(board: Board, tileIndex: number): Board {
  if (!canMove(board, tileIndex)) return board;
  const newBoard = [...board];
  const emptyIndex = findEmpty(board);
  [newBoard[tileIndex], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[tileIndex]];
  return newBoard;
}

export const shuffleBoardEffect = (moves: number): Effect.Effect<Board> =>
  Effect.gen(function* () {
    let board = solvedBoard();
    let lastEmpty = findEmpty(board);
    for (let i = 0; i < moves; i++) {
      const neighbors = getNeighbors(findEmpty(board)).filter(n => n !== lastEmpty);
      const pick = yield* Effect.sync(() => neighbors[Math.floor(Math.random() * neighbors.length)]);
      lastEmpty = findEmpty(board);
      board = moveTile(board, pick);
    }
    return board;
  });

export function shuffleBoard(moves: number): Board {
  return Effect.runSync(shuffleBoardEffect(moves));
}

export function getDifficultyMoves(diff: string): number {
  return diff === 'easy' ? 30 : diff === 'medium' ? 80 : 150;
}

export function getResultText(moves: number, seconds: number): { emoji: string; title: string; sub: string } {
  return {
    emoji: moves < 50 ? '🏆' : moves < 100 ? '🎉' : '💪',
    title: moves < 50 ? 'Amazing!' : moves < 100 ? 'Great Job!' : 'You Did It!',
    sub: `Solved in ${moves} moves, ${seconds}s`,
  };
}
