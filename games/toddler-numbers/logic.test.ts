import { describe, it, expect } from 'bun:test';
import { EMOJIS, TOTAL, shuffle, generateAnswer, pickEmoji, generateChoices, getResultText } from './logic';

describe('toddler-numbers logic', () => {
  it('EMOJIS has 15 entries', () => {
    expect(EMOJIS.length).toBe(15);
  });

  it('TOTAL is 8', () => {
    expect(TOTAL).toBe(8);
  });

  it('generateAnswer returns 1-5', () => {
    for (let i = 0; i < 20; i++) {
      const a = generateAnswer();
      expect(a).toBeGreaterThanOrEqual(1);
      expect(a).toBeLessThanOrEqual(5);
    }
  });

  it('pickEmoji returns one from EMOJIS', () => {
    for (let i = 0; i < 10; i++) {
      expect(EMOJIS).toContain(pickEmoji());
    }
  });

  it('generateChoices returns 4 options including answer', () => {
    for (let ans = 1; ans <= 5; ans++) {
      const choices = generateChoices(ans);
      expect(choices.length).toBe(4);
      expect(choices).toContain(ans);
      // all unique
      expect(new Set(choices).size).toBe(4);
    }
  });

  it('shuffle preserves elements', () => {
    const arr = [10, 20, 30];
    const result = shuffle(arr);
    expect(result.sort((a, b) => a - b)).toEqual([10, 20, 30]);
    expect(arr).toEqual([10, 20, 30]);
  });

  it('getResultText returns correct results', () => {
    expect(getResultText(8, 8).title).toBe('Pintar Sekali!');
    expect(getResultText(5, 8).title).toBe('Bagus!');
    expect(getResultText(2, 8).title).toBe('Ayo Lagi!');
    expect(getResultText(8, 8).emoji).toBe('🏆');
  });
});
