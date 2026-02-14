import { describe, it, expect } from 'bun:test';
import { genQuestion, getGrade, compareFractions, fractionValue } from './logic';

describe('fraction-compare logic', () => {
  it('compareFractions 1/2 vs 1/3 = left', () => { expect(compareFractions(1, 2, 1, 3)).toBe('left'); });
  it('compareFractions 1/4 vs 3/4 = right', () => { expect(compareFractions(1, 4, 3, 4)).toBe('right'); });
  it('compareFractions 2/4 vs 1/2 = equal', () => { expect(compareFractions(2, 4, 1, 2)).toBe('equal'); });
  it('fractionValue 3/4 = 0.75', () => { expect(fractionValue(3, 4)).toBe(0.75); });
  it('genQuestion returns valid question', () => {
    const q = genQuestion();
    expect(['left', 'right', 'equal']).toContain(q.answer);
    expect(q.frac1[0]).toBeLessThan(q.frac1[1]);
  });
  it('getGrade works', () => { expect(getGrade(10, 10).grade).toBe('S'); });
});
