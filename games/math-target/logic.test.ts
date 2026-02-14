import { describe, it, expect } from 'bun:test';
import { generateQuestion, checkAnswer, hasValidCombination, getResultText, TOTAL } from './logic';

describe('math-target logic', () => {
  it('generates question with numbers and target', () => {
    const q = generateQuestion(0);
    expect(q.numbers.length).toBeGreaterThanOrEqual(5);
    expect(q.target).toBeGreaterThan(0);
  });

  it('generated question always has a valid combination', () => {
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion(i % TOTAL);
      expect(hasValidCombination(q.numbers, q.target)).toBe(true);
    }
  });

  it('checkAnswer sums selected numbers', () => {
    expect(checkAnswer([5, 15], 20)).toBe(true);
    expect(checkAnswer([5, 10], 20)).toBe(false);
    expect(checkAnswer([], 20)).toBe(false);
  });

  it('hasValidCombination finds subsets', () => {
    expect(hasValidCombination([3, 7, 5, 8], 12)).toBe(true); // 7+5
    expect(hasValidCombination([1, 2, 3], 100)).toBe(false);
  });

  it('getResultText returns correct tiers', () => {
    expect(getResultText(10, 10).title).toBe('Bullseye Master!');
    expect(getResultText(7, 10).title).toBe('Great Aim!');
    expect(getResultText(2, 10).title).toBe('Keep Practicing!');
  });

  it('later rounds have more numbers', () => {
    const early = generateQuestion(0);
    const late = generateQuestion(9);
    expect(late.numbers.length).toBeGreaterThanOrEqual(early.numbers.length);
  });
});
