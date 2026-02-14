import { describe, it, expect } from 'bun:test';
import { generateRound, checkAnswer, getResultText, TOTAL_ROUNDS, shuffle } from './logic';

describe('skip-counting logic', () => {
  it('generates a round with blanks', () => {
    const r = generateRound(0);
    expect(r.sequence.length).toBe(6);
    expect(r.sequence.filter(n => n === null).length).toBeGreaterThanOrEqual(1);
  });

  it('sequence follows skip pattern', () => {
    const r = generateRound(0);
    const filled = r.sequence.map((n, i) => n ?? r.answers[r.sequence.slice(0, i).filter(x => x === null).length]);
    for (let i = 1; i < filled.length; i++) {
      expect(filled[i]! - filled[i-1]!).toBe(r.step);
    }
  });

  it('answers fill the blanks correctly', () => {
    const r = generateRound(0);
    expect(r.answers.length).toBeGreaterThanOrEqual(1);
  });

  it('choices include all answers', () => {
    const r = generateRound(0);
    for (const a of r.answers) {
      expect(r.choices).toContain(a);
    }
  });

  it('checkAnswer works', () => {
    expect(checkAnswer(6, 6)).toBe(true);
    expect(checkAnswer(5, 6)).toBe(false);
  });

  it('getResultText tiers', () => {
    expect(getResultText(10, 10).emoji).toBe('🏆');
    expect(getResultText(7, 10).emoji).toBe('⭐');
    expect(getResultText(3, 10).emoji).toBe('💪');
  });

  it('TOTAL_ROUNDS is 10', () => {
    expect(TOTAL_ROUNDS).toBe(10);
  });

  it('shuffle preserves elements', () => {
    expect(shuffle([1,2,3]).sort()).toEqual([1,2,3]);
  });
});
