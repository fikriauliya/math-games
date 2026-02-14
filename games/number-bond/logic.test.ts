import { describe, it, expect } from 'bun:test';
import { generateBond, checkPair, calcScore, isPerfect, getGrade } from './logic';

describe('number-bond logic', () => {
  it('generates bond with correct target for easy', () => {
    const bond = generateBond('easy');
    expect(bond.target).toBe(10);
    expect(bond.numbers.length).toBeGreaterThanOrEqual(6);
  });

  it('generates bond with correct target for hard', () => {
    const bond = generateBond('hard');
    expect(bond.target).toBe(100);
  });

  it('all pairs sum to target', () => {
    const bond = generateBond('medium');
    for (const [a, b] of bond.pairs) {
      expect(a + b).toBe(bond.target);
    }
  });

  it('checkPair returns true for valid pair', () => {
    expect(checkPair(3, 7, 10)).toBe(true);
    expect(checkPair(3, 8, 10)).toBe(false);
  });

  it('calcScore rewards time left', () => {
    expect(calcScore(3, 3, 10)).toBeGreaterThan(calcScore(3, 3, 0));
  });

  it('isPerfect checks all found', () => {
    expect(isPerfect(5, 5)).toBe(true);
    expect(isPerfect(4, 5)).toBe(false);
  });

  it('getGrade returns S for perfect', () => {
    expect(getGrade(5, 5).grade).toBe('S');
    expect(getGrade(2, 5).grade).toBe('C');
  });
});
