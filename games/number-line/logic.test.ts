import { describe, it, expect } from 'bun:test';
import { generateQuestion, getStars, calcScore, getGrade, TOTAL_ROUNDS, DIFFICULTY_CONFIG } from './logic';

describe('number-line logic', () => {
  it('generateQuestion easy target is 0-20', () => {
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion('easy');
      expect(q.target).toBeGreaterThanOrEqual(0);
      expect(q.target).toBeLessThanOrEqual(20);
    }
  });

  it('generateQuestion hard target is 0-100', () => {
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion('hard');
      expect(q.target).toBeGreaterThanOrEqual(0);
      expect(q.target).toBeLessThanOrEqual(100);
    }
  });

  it('getStars returns 3 for exact match', () => {
    expect(getStars(10, 10, 20)).toBe(3);
  });

  it('getStars returns 2 for close match', () => {
    expect(getStars(11, 10, 20)).toBe(2);
  });

  it('getStars returns 0 for far off', () => {
    expect(getStars(0, 20, 20)).toBe(0);
  });

  it('calcScore returns 10 per star', () => {
    expect(calcScore(15)).toBe(150);
  });

  it('getGrade returns S for perfect', () => {
    expect(getGrade(30, 30).grade).toBe('S');
  });

  it('TOTAL_ROUNDS is 10', () => {
    expect(TOTAL_ROUNDS).toBe(10);
  });

  it('DIFFICULTY_CONFIG has correct ranges', () => {
    expect(DIFFICULTY_CONFIG.easy.max).toBe(20);
    expect(DIFFICULTY_CONFIG.hard.max).toBe(100);
  });
});
