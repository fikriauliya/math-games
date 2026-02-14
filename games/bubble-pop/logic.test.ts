import { describe, it, expect } from 'bun:test';
import { COLORS, generateTarget, checkSingleMatch, checkPairMatch, calcPopScore, getResultTitle } from './logic';

describe('bubble-pop logic', () => {
  it('COLORS has 10 entries', () => {
    expect(COLORS.length).toBe(10);
  });

  it('generateTarget single mode returns 1-20', () => {
    for (let i = 0; i < 20; i++) {
      const t = generateTarget('single');
      expect(t).toBeGreaterThanOrEqual(1);
      expect(t).toBeLessThanOrEqual(20);
    }
  });

  it('generateTarget pair mode returns 5-19', () => {
    for (let i = 0; i < 20; i++) {
      const t = generateTarget('pair');
      expect(t).toBeGreaterThanOrEqual(5);
      expect(t).toBeLessThanOrEqual(19);
    }
  });

  it('checkSingleMatch works', () => {
    expect(checkSingleMatch(5, 5)).toBe(true);
    expect(checkSingleMatch(5, 6)).toBe(false);
  });

  it('checkPairMatch works', () => {
    expect(checkPairMatch(3, 7, 10)).toBe(true);
    expect(checkPairMatch(3, 6, 10)).toBe(false);
  });

  it('calcPopScore caps combo at 5', () => {
    expect(calcPopScore(1, 'single')).toBe(10);
    expect(calcPopScore(5, 'single')).toBe(50);
    expect(calcPopScore(10, 'single')).toBe(50);
    expect(calcPopScore(1, 'pair')).toBe(20);
    expect(calcPopScore(5, 'pair')).toBe(100);
  });

  it('getResultTitle returns correct titles', () => {
    expect(getResultTitle(500)).toBe('🏆 AMAZING!');
    expect(getResultTitle(200)).toBe('⭐ Great Job!');
    expect(getResultTitle(100)).toBe('💪 Keep Going!');
  });
});
