import { Effect } from 'effect';

export interface Puzzle {
  name: string;
  emoji: string;
  image: string; // CSS gradient or emoji composition
}

export const PUZZLES: Puzzle[] = [
  { name: 'Kucing', emoji: '🐱', image: '🐱' },
  { name: 'Rumah', emoji: '🏠', image: '🏠' },
  { name: 'Bunga', emoji: '🌸', image: '🌸' },
  { name: 'Mobil', emoji: '🚗', image: '🚗' },
  { name: 'Ikan', emoji: '🐟', image: '🐟' },
  { name: 'Bintang', emoji: '⭐', image: '⭐' },
];

export interface PuzzlePiece {
  id: number;
  correctPos: number;
  currentPos: number;
}

export const createPuzzleEffect = (): Effect.Effect<{ puzzle: Puzzle; pieces: PuzzlePiece[] }> =>
  Effect.sync(() => {
    const puzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
    const pieces: PuzzlePiece[] = [0, 1, 2, 3].map(i => ({ id: i, correctPos: i, currentPos: i }));
    // Shuffle positions
    const positions = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    pieces.forEach((p, i) => { p.currentPos = positions[i]; });
    return { puzzle, pieces };
  });

export function createPuzzle() {
  return Effect.runSync(createPuzzleEffect());
}

export function swapPieces(pieces: PuzzlePiece[], posA: number, posB: number): PuzzlePiece[] {
  const result = pieces.map(p => ({ ...p }));
  const pieceA = result.find(p => p.currentPos === posA);
  const pieceB = result.find(p => p.currentPos === posB);
  if (pieceA && pieceB) {
    pieceA.currentPos = posB;
    pieceB.currentPos = posA;
  }
  return result;
}

export function isSolved(pieces: PuzzlePiece[]): boolean {
  return pieces.every(p => p.currentPos === p.correctPos);
}

export function getEndResult(moves: number): { title: string; stars: string } {
  if (moves <= 6) return { title: '🎉 Hebat Sekali!', stars: '⭐⭐⭐' };
  if (moves <= 12) return { title: '⭐ Bagus!', stars: '⭐⭐' };
  return { title: '💪 Selesai!', stars: '⭐' };
}
