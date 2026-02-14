import { describe, it, expect } from 'bun:test';
import { getPuzzle, checkCell, checkPuzzle, getResultText } from './logic';

describe('math-crossword logic', () => {
  it('getPuzzle returns 5x5 grid', () => {
    const p = getPuzzle(0);
    expect(p.size).toBe(5);
    expect(p.grid.length).toBe(5);
    p.grid.forEach(row => expect(row.length).toBe(5));
  });

  it('puzzle has clues', () => {
    const p = getPuzzle(0);
    expect(p.clues.length).toBeGreaterThan(0);
  });

  it('clues have valid directions', () => {
    const p = getPuzzle(0);
    p.clues.forEach(c => {
      expect(['across', 'down']).toContain(c.direction);
    });
  });

  it('checkCell works correctly', () => {
    expect(checkCell('5', '5')).toBe(true);
    expect(checkCell('3', '5')).toBe(false);
  });

  it('checkPuzzle counts correct cells', () => {
    const p = getPuzzle(0);
    // All correct
    const result = checkPuzzle(p.grid.map(r => [...r]), p);
    expect(result.correct).toBe(result.total);
  });

  it('checkPuzzle detects wrong cells', () => {
    const p = getPuzzle(0);
    const userGrid = p.grid.map(r => r.map(c => c === null ? '' : '0'));
    const result = checkPuzzle(userGrid, p);
    expect(result.correct).toBeLessThan(result.total);
  });

  it('getResultText returns correct tiers', () => {
    expect(getResultText(15, 15).title).toBe('Perfect Puzzle!');
    expect(getResultText(12, 15).title).toBe('Great Job!');
    expect(getResultText(5, 15).title).toBe('Keep Trying!');
  });

  it('clues have numbered labels', () => {
    const p = getPuzzle(0);
    p.clues.forEach(c => {
      expect(c.number).toBeGreaterThan(0);
    });
  });
});
