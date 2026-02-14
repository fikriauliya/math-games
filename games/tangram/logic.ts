import { Effect } from 'effect';

export interface Piece {
  id: number;
  type: 'triangle-lg' | 'triangle-md' | 'triangle-sm' | 'square' | 'parallelogram';
  color: string;
  x: number;
  y: number;
  rotation: number;
}

export interface Puzzle {
  name: string;
  silhouette: string; // SVG path or CSS clip-path
  targetPositions: { x: number; y: number; rotation: number }[];
}

export const COLORS = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#f06292'];

export const PUZZLES: Puzzle[] = [
  { name: 'Square', silhouette: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', targetPositions: [] },
  { name: 'House', silhouette: 'polygon(50% 0%, 100% 35%, 100% 100%, 0% 100%, 0% 35%)', targetPositions: [] },
  { name: 'Cat', silhouette: 'polygon(20% 0%, 40% 0%, 40% 20%, 60% 20%, 60% 0%, 80% 0%, 80% 30%, 100% 50%, 80% 100%, 20% 100%, 0% 50%, 20% 30%)', targetPositions: [] },
  { name: 'Arrow', silhouette: 'polygon(50% 0%, 100% 40%, 70% 40%, 70% 100%, 30% 100%, 30% 40%, 0% 40%)', targetPositions: [] },
  { name: 'Bird', silhouette: 'polygon(0% 50%, 30% 20%, 50% 0%, 70% 20%, 100% 10%, 80% 40%, 100% 70%, 60% 100%, 40% 100%, 20% 80%)', targetPositions: [] },
  { name: 'Diamond', silhouette: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', targetPositions: [] },
  { name: 'Fish', silhouette: 'polygon(0% 50%, 20% 20%, 60% 10%, 80% 0%, 100% 30%, 80% 50%, 100% 70%, 80% 100%, 60% 90%, 20% 80%)', targetPositions: [] },
  { name: 'Heart', silhouette: 'polygon(50% 100%, 0% 40%, 0% 20%, 25% 0%, 50% 20%, 75% 0%, 100% 20%, 100% 40%)', targetPositions: [] },
  { name: 'Boat', silhouette: 'polygon(50% 0%, 55% 40%, 100% 60%, 90% 100%, 10% 100%, 0% 60%, 45% 40%)', targetPositions: [] },
  { name: 'Tree', silhouette: 'polygon(50% 0%, 80% 35%, 65% 35%, 85% 65%, 65% 65%, 60% 100%, 40% 100%, 35% 65%, 15% 65%, 35% 35%, 20% 35%)', targetPositions: [] },
];

export const createPiecesEffect = (): Effect.Effect<Piece[]> =>
  Effect.gen(function* () {
    const pieces: Piece[] = [
      { id: 0, type: 'triangle-lg', color: COLORS[0], x: 0, y: 0, rotation: 0 },
      { id: 1, type: 'triangle-lg', color: COLORS[1], x: 0, y: 0, rotation: 0 },
      { id: 2, type: 'triangle-md', color: COLORS[2], x: 0, y: 0, rotation: 0 },
      { id: 3, type: 'triangle-sm', color: COLORS[3], x: 0, y: 0, rotation: 0 },
      { id: 4, type: 'triangle-sm', color: COLORS[4], x: 0, y: 0, rotation: 0 },
      { id: 5, type: 'square', color: COLORS[5], x: 0, y: 0, rotation: 0 },
      { id: 6, type: 'parallelogram', color: COLORS[6], x: 0, y: 0, rotation: 0 },
    ];
    // Scatter pieces randomly
    for (const p of pieces) {
      p.x = yield* Effect.sync(() => Math.floor(Math.random() * 200));
      p.y = yield* Effect.sync(() => Math.floor(Math.random() * 200) + 250);
      p.rotation = yield* Effect.sync(() => Math.floor(Math.random() * 4) * 90);
    }
    return pieces;
  });

export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* Effect.sync(() => Math.floor(Math.random() * (i + 1)));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export function createPieces(): Piece[] { return Effect.runSync(createPiecesEffect()); }
export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }

export function getPuzzlesForDifficulty(diff: string): Puzzle[] {
  const start = diff === 'easy' ? 0 : diff === 'medium' ? 3 : 6;
  return PUZZLES.slice(start, start + 5).length >= 5 ? PUZZLES.slice(start, start + 5) : PUZZLES.slice(0, 5);
}

export function rotatePiece(piece: Piece): Piece {
  return { ...piece, rotation: (piece.rotation + 90) % 360 };
}

export function movePiece(piece: Piece, x: number, y: number): Piece {
  return { ...piece, x, y };
}
