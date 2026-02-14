import { describe, it, expect } from 'bun:test';
import { generateQuestion, checkAnswer, getOptions, getResultText, TOTAL, shuffle } from './logic';

describe('toddler-counting logic', () => {
  it('generateQuestion returns valid question', () => {
    const q = generateQuestion();
    expect(q.count).toBeGreaterThanOrEqual(1);
    expect(q.count).toBeLessThanOrEqual(10);
    expect(q.wrong).not.toBe(q.count);
    expect(q.emoji.length).toBeGreaterThan(0);
  });

  it('checkAnswer works correctly', () => {
    expect(checkAnswer(5, 5)).toBe(true);
    expect(checkAnswer(3, 5)).toBe(false);
  });

  it('getOptions returns exactly 2 options', () => {
    const q = generateQuestion();
    const opts = getOptions(q);
    expect(opts.length).toBe(2);
    expect(opts).toContain(q.count);
    expect(opts).toContain(q.wrong);
  });

  it('shuffle preserves elements', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr).sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('getResultText returns correct text', () => {
    expect(getResultText(6, 6).title).toBe('Hebat Sekali!');
    expect(getResultText(4, 6).title).toBe('Bagus!');
    expect(getResultText(1, 6).title).toBe('Ayo Coba Lagi!');
  });
});
