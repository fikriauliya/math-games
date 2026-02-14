import { describe, it, expect } from 'bun:test';
import { generateQuestion, checkAnswer, getResultText, getHandEmoji, TOTAL } from './logic';

describe('toddler-fingers logic', () => {
  it('TOTAL is 8', () => {
    expect(TOTAL).toBe(8);
  });

  it('generateQuestion returns count 1-5', () => {
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion();
      expect(q.count).toBeGreaterThanOrEqual(1);
      expect(q.count).toBeLessThanOrEqual(5);
    }
  });

  it('generateQuestion returns 2 options', () => {
    const q = generateQuestion();
    expect(q.options.length).toBe(2);
    expect(q.options).toContain(q.count);
  });

  it('options contain different numbers', () => {
    const q = generateQuestion();
    expect(q.options[0]).not.toBe(q.options[1]);
  });

  it('checkAnswer validates correctly', () => {
    expect(checkAnswer(3, 3)).toBe(true);
    expect(checkAnswer(2, 3)).toBe(false);
  });

  it('getHandEmoji returns emoji for 1-5', () => {
    expect(getHandEmoji(1)).toBe('☝️');
    expect(getHandEmoji(5)).toBe('✋');
  });

  it('getResultText returns Bahasa messages', () => {
    expect(getResultText(8, 8).title).toBe('Hebat Sekali!');
    expect(getResultText(5, 8).title).toBe('Bagus!');
    expect(getResultText(2, 8).title).toBe('Ayo Coba Lagi!');
  });
});
