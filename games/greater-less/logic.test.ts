import { describe, it, expect } from 'bun:test';
import { generateRound, checkAnswer, getResultText, GAME_DURATION } from './logic';

describe('greater-less logic', () => {
  it('generates a round with valid answer', () => {
    const r = generateRound('easy');
    expect(['>', '<', '=']).toContain(r.answer);
  });

  it('answer matches comparison', () => {
    for (let i = 0; i < 20; i++) {
      const r = generateRound('medium');
      if (r.a > r.b) expect(r.answer).toBe('>');
      else if (r.a < r.b) expect(r.answer).toBe('<');
      else expect(r.answer).toBe('=');
    }
  });

  it('easy mode uses numbers 1-20', () => {
    for (let i = 0; i < 20; i++) {
      const r = generateRound('easy');
      expect(r.a).toBeGreaterThanOrEqual(1);
      expect(r.a).toBeLessThanOrEqual(20);
    }
  });

  it('hard mode can produce decimals', () => {
    let hasDecimal = false;
    for (let i = 0; i < 50; i++) {
      const r = generateRound('hard');
      if (r.a % 1 !== 0 || r.b % 1 !== 0) hasDecimal = true;
    }
    expect(hasDecimal).toBe(true);
  });

  it('checkAnswer works', () => {
    expect(checkAnswer('>', '>')).toBe(true);
    expect(checkAnswer('<', '>')).toBe(false);
  });

  it('getResultText tiers', () => {
    expect(getResultText(30).emoji).toBe('🏆');
    expect(getResultText(20).emoji).toBe('🥊');
    expect(getResultText(10).emoji).toBe('⭐');
    expect(getResultText(5).emoji).toBe('💪');
  });

  it('GAME_DURATION is 60', () => {
    expect(GAME_DURATION).toBe(60);
  });
});
