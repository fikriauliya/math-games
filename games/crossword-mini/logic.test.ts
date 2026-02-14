import { describe, it, expect } from 'bun:test';
import { getPuzzle, getPuzzleCount, createEmptyGrid, checkCell, checkComplete, countCorrect, totalLetters } from './logic';

describe('crossword-mini logic', () => {
  it('returns a puzzle', () => {
    const p = getPuzzle(0);
    expect(p.size).toBe(5);
    expect(p.clues.length).toBeGreaterThan(0);
  });

  it('creates empty grid with correct shape', () => {
    const p = getPuzzle(0);
    const g = createEmptyGrid(p);
    expect(g.length).toBe(5);
    expect(g[0][3]).toBeNull(); // black cell stays null
    expect(g[0][0]).toBe(''); // letter cell is empty string
  });

  it('checkCell validates correctly', () => {
    const p = getPuzzle(0);
    expect(checkCell(p, 0, 0, 'C')).toBe(true);
    expect(checkCell(p, 0, 0, 'X')).toBe(false);
  });

  it('checkComplete detects incomplete', () => {
    const p = getPuzzle(0);
    const g = createEmptyGrid(p);
    expect(checkComplete(p, g)).toBe(false);
  });

  it('checkComplete detects complete', () => {
    const p = getPuzzle(0);
    // Use the puzzle grid itself as user input
    expect(checkComplete(p, p.grid)).toBe(true);
  });

  it('countCorrect counts filled correct cells', () => {
    const p = getPuzzle(0);
    const g = createEmptyGrid(p);
    g[0][0] = 'C';
    expect(countCorrect(p, g)).toBe(1);
  });

  it('totalLetters counts non-null cells', () => {
    const p = getPuzzle(0);
    expect(totalLetters(p)).toBeGreaterThan(0);
  });
});
