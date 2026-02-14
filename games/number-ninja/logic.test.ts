import { describe, it, expect } from 'bun:test';
import { CONFIG, genQuestion, calcPoints, calcAccuracy } from './logic';

describe('number-ninja logic', () => {
  it('CONFIG has correct difficulty levels', () => {
    expect(CONFIG.easy.lives).toBe(5);
    expect(CONFIG.medium.lives).toBe(4);
    expect(CONFIG.hard.lives).toBe(3);
  });

  it('genQuestion easy produces valid answers', () => {
    for (let i = 0; i < 20; i++) {
      const q = genQuestion('easy');
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.text.length).toBeGreaterThan(0);
    }
  });

  it('genQuestion hard can produce division', () => {
    const texts = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const q = genQuestion('hard');
      if (q.text.includes('÷')) texts.add('÷');
    }
    expect(texts.has('÷')).toBe(true);
  });

  it('genQuestion division produces whole numbers', () => {
    for (let i = 0; i < 30; i++) {
      const q = genQuestion('hard');
      expect(Number.isInteger(q.answer)).toBe(true);
    }
  });

  it('calcPoints increases with combo', () => {
    expect(calcPoints(0)).toBe(10);
    expect(calcPoints(3)).toBe(20);
    expect(calcPoints(6)).toBe(30);
  });

  it('calcAccuracy computes correctly', () => {
    expect(calcAccuracy(8, 2)).toBe(80);
    expect(calcAccuracy(0, 0)).toBe(0);
    expect(calcAccuracy(10, 0)).toBe(100);
  });
});
