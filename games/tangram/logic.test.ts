import { describe, it, expect } from 'bun:test';
import { createPieces, rotatePiece, movePiece, getPuzzlesForDifficulty, PUZZLES, COLORS, shuffle } from './logic';

describe('tangram logic', () => {
  it('createPieces returns 7 pieces', () => {
    const pieces = createPieces();
    expect(pieces.length).toBe(7);
  });

  it('each piece has unique id', () => {
    const pieces = createPieces();
    const ids = pieces.map(p => p.id);
    expect(new Set(ids).size).toBe(7);
  });

  it('rotatePiece rotates by 90 degrees', () => {
    const piece = createPieces()[0];
    const rotated = rotatePiece({ ...piece, rotation: 0 });
    expect(rotated.rotation).toBe(90);
    const again = rotatePiece(rotatePiece(rotatePiece(rotated)));
    expect(again.rotation).toBe(0);
  });

  it('movePiece updates position', () => {
    const piece = createPieces()[0];
    const moved = movePiece(piece, 100, 200);
    expect(moved.x).toBe(100);
    expect(moved.y).toBe(200);
  });

  it('PUZZLES has 10 entries', () => {
    expect(PUZZLES.length).toBe(10);
  });

  it('getPuzzlesForDifficulty returns 5 puzzles', () => {
    expect(getPuzzlesForDifficulty('easy').length).toBe(5);
  });

  it('COLORS has 7 colors', () => {
    expect(COLORS.length).toBe(7);
  });

  it('shuffle preserves elements', () => {
    const r = shuffle([1, 2, 3]);
    expect(r.sort()).toEqual([1, 2, 3]);
  });
});
