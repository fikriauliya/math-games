import { describe, it, expect } from 'bun:test';
import { PUZZLES, createPuzzle, swapPieces, isSolved, getEndResult } from './logic';

describe('toddler-puzzle logic', () => {
  it('PUZZLES has 6 entries', () => {
    expect(PUZZLES.length).toBe(6);
  });

  it('createPuzzle returns 4 pieces', () => {
    const { pieces } = createPuzzle();
    expect(pieces.length).toBe(4);
  });

  it('pieces have unique positions', () => {
    const { pieces } = createPuzzle();
    const positions = pieces.map(p => p.currentPos);
    expect(new Set(positions).size).toBe(4);
  });

  it('swapPieces swaps correctly', () => {
    const pieces = [
      { id: 0, correctPos: 0, currentPos: 1 },
      { id: 1, correctPos: 1, currentPos: 0 },
      { id: 2, correctPos: 2, currentPos: 2 },
      { id: 3, correctPos: 3, currentPos: 3 },
    ];
    const result = swapPieces(pieces, 0, 1);
    expect(result.find(p => p.id === 0)!.currentPos).toBe(0);
    expect(result.find(p => p.id === 1)!.currentPos).toBe(1);
  });

  it('isSolved detects solved state', () => {
    const solved = [0,1,2,3].map(i => ({ id: i, correctPos: i, currentPos: i }));
    expect(isSolved(solved)).toBe(true);
    solved[0].currentPos = 1;
    solved[1].currentPos = 0;
    expect(isSolved(solved)).toBe(false);
  });

  it('getEndResult returns correct tiers', () => {
    expect(getEndResult(4).stars).toBe('⭐⭐⭐');
    expect(getEndResult(10).stars).toBe('⭐⭐');
    expect(getEndResult(20).stars).toBe('⭐');
  });
});
