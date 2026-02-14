import { describe, it, expect } from 'bun:test';
import { getFactors, isFactor, generateQuestion, checkFactorSelection, getResultText, TOTAL } from './logic';

describe('factor-finder logic', () => {
  it('getFactors returns correct factors', () => {
    expect(getFactors(12)).toEqual([1, 2, 3, 4, 6, 12]);
    expect(getFactors(7)).toEqual([1, 7]);
    expect(getFactors(24)).toEqual([1, 2, 3, 4, 6, 8, 12, 24]);
  });

  it('isFactor checks correctly', () => {
    expect(isFactor(3, 12)).toBe(true);
    expect(isFactor(5, 12)).toBe(false);
    expect(isFactor(7, 42)).toBe(true);
  });

  it('generateQuestion returns valid question', () => {
    const q = generateQuestion(0);
    expect(q.number).toBeGreaterThan(0);
    expect(q.factors.length).toBeGreaterThanOrEqual(2);
  });

  it('true-false questions have tfTarget and tfAnswer', () => {
    const q = generateQuestion(2); // round % 3 === 2
    expect(q.type).toBe('true-false');
    expect(q.tfTarget).toBeDefined();
    expect(typeof q.tfAnswer).toBe('boolean');
  });

  it('checkFactorSelection scores correctly', () => {
    const result = checkFactorSelection([1, 2, 3, 5], [1, 2, 3, 4, 6, 12]);
    expect(result.correct).toBe(3);
    expect(result.wrong).toBe(1);
    expect(result.missed).toBe(3);
  });

  it('getResultText returns correct grades', () => {
    expect(getResultText(10, 10).title).toBe('Diamond Miner!');
    expect(getResultText(3, 10).title).toBe('Keep Mining!');
  });
});
