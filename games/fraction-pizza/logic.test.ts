import { describe, it, expect } from 'bun:test';
import { generateQuestion, checkSlices, calcScore, getGrade, TOTAL_ROUNDS, DIFFICULTY_DENOMS } from './logic';

describe('fraction-pizza logic', () => {
  it('generateQuestion easy uses denominator 2 or 4', () => {
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion('easy');
      expect([2, 4]).toContain(q.denominator);
    }
  });

  it('generateQuestion numerator <= denominator and > 0', () => {
    for (let i = 0; i < 30; i++) {
      const q = generateQuestion('medium');
      expect(q.numerator).toBeGreaterThan(0);
      expect(q.numerator).toBeLessThanOrEqual(q.denominator);
    }
  });

  it('generateQuestion display format is correct', () => {
    const q = generateQuestion('easy');
    expect(q.display).toBe(`${q.numerator}/${q.denominator}`);
  });

  it('checkSlices works correctly', () => {
    expect(checkSlices(3, 3)).toBe(true);
    expect(checkSlices(2, 3)).toBe(false);
  });

  it('calcScore returns 10 per correct', () => {
    expect(calcScore(5)).toBe(50);
  });

  it('getGrade returns S for perfect', () => {
    expect(getGrade(8, 8).grade).toBe('S');
    expect(getGrade(6, 8).grade).toBe('B');
  });

  it('TOTAL_ROUNDS is 8', () => {
    expect(TOTAL_ROUNDS).toBe(8);
  });

  it('hard difficulty includes denominator 8', () => {
    expect(DIFFICULTY_DENOMS.hard).toContain(8);
  });
});
