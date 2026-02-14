import { describe, it, expect } from 'bun:test';
import { generateRound, checkPlacement, checkCompare, getResultText, TOTAL_ROUNDS } from './logic';

describe('decimal-dash logic', () => {
  it('generates a round with valid type', () => {
    const r = generateRound(0);
    expect(['place', 'compare']).toContain(r.type);
  });

  it('place round has target between min and max', () => {
    for (let i = 0; i < 20; i++) {
      const r = generateRound(i % 10);
      if (r.type === 'place') {
        expect(r.target).toBeGreaterThan(0);
        expect(r.target).toBeLessThan(1);
      }
    }
  });

  it('compare round has valid answer', () => {
    for (let i = 0; i < 20; i++) {
      const r = generateRound(i % 10);
      if (r.type === 'compare') {
        expect(['a', 'b', 'equal']).toContain(r.answer);
        if (r.answer === 'a') expect(r.a).toBeGreaterThan(r.b);
        if (r.answer === 'b') expect(r.b).toBeGreaterThan(r.a);
        if (r.answer === 'equal') expect(r.a).toBe(r.b);
      }
    }
  });

  it('checkPlacement near target is correct', () => {
    const result = checkPlacement(0.7, 0.7);
    expect(result.correct).toBe(true);
    expect(result.accuracy).toBe(100);
  });

  it('checkPlacement far from target is incorrect', () => {
    const result = checkPlacement(0.1, 0.9);
    expect(result.correct).toBe(false);
  });

  it('checkCompare works', () => {
    expect(checkCompare('a', 'a')).toBe(true);
    expect(checkCompare('b', 'a')).toBe(false);
  });

  it('getResultText returns correct tiers', () => {
    expect(getResultText(10, 10).emoji).toBe('🏆');
    expect(getResultText(8, 10).emoji).toBe('🚀');
    expect(getResultText(3, 10).emoji).toBe('💫');
  });

  it('TOTAL_ROUNDS is 10', () => {
    expect(TOTAL_ROUNDS).toBe(10);
  });
});
