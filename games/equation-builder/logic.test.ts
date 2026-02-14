import { describe, it, expect } from 'bun:test';
import { generatePuzzle, checkEquation, calcScore, getGrade, shuffle, TOTAL_ROUNDS } from './logic';

describe('equation-builder logic', () => {
  it('generatePuzzle returns valid puzzle with solution', () => {
    const p = generatePuzzle(0);
    expect(p.numbers.length).toBeGreaterThanOrEqual(2);
    expect(p.target).toBeDefined();
    const { a, op, b } = p.solution;
    expect(checkEquation(a, op, b, p.target)).toBe(true);
  });

  it('generatePuzzle target is non-negative', () => {
    for (let i = 0; i < 20; i++) {
      const p = generatePuzzle(i);
      expect(p.target).toBeGreaterThanOrEqual(0);
    }
  });

  it('checkEquation works for all operations', () => {
    expect(checkEquation(3, '+', 5, 8)).toBe(true);
    expect(checkEquation(10, '−', 3, 7)).toBe(true);
    expect(checkEquation(4, '×', 5, 20)).toBe(true);
    expect(checkEquation(3, '+', 5, 9)).toBe(false);
  });

  it('calcScore returns 10 per correct', () => {
    expect(calcScore(5, 10)).toBe(50);
    expect(calcScore(10, 10)).toBe(100);
  });

  it('getGrade returns correct grades', () => {
    expect(getGrade(10, 10).grade).toBe('S');
    expect(getGrade(7, 10).grade).toBe('B');
    expect(getGrade(5, 10).grade).toBe('D');
  });

  it('shuffle preserves elements', () => {
    const arr = [1, 2, 3, 4];
    const result = shuffle(arr);
    expect(result.sort()).toEqual([1, 2, 3, 4]);
  });

  it('TOTAL_ROUNDS is 10', () => {
    expect(TOTAL_ROUNDS).toBe(10);
  });

  it('puzzle numbers contain the solution numbers', () => {
    const p = generatePuzzle(0);
    expect(p.numbers).toContain(p.solution.a);
    expect(p.numbers).toContain(p.solution.b);
  });
});
