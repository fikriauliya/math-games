import { describe, it, expect } from 'bun:test';
import { WORDS, TOTAL, scramble, checkAnswer, pickWords, getHint, getResultText } from './logic';

describe('word-scramble logic', () => {
  it('WORDS has at least TOTAL entries', () => {
    expect(WORDS.length).toBeGreaterThanOrEqual(TOTAL);
  });

  it('scramble returns different order', () => {
    const word = 'APPLE';
    const s = scramble(word);
    expect(s.length).toBe(word.length);
    expect(s).not.toBe(word);
    expect(s.split('').sort().join('')).toBe(word.split('').sort().join(''));
  });

  it('checkAnswer is case insensitive', () => {
    expect(checkAnswer('cat', 'CAT')).toBe(true);
    expect(checkAnswer('CAT', 'CAT')).toBe(true);
    expect(checkAnswer('dog', 'CAT')).toBe(false);
  });

  it('pickWords returns correct count', () => {
    const w = pickWords(5);
    expect(w.length).toBe(5);
    expect(new Set(w).size).toBe(5);
  });

  it('getHint shows first letter', () => {
    expect(getHint('CAT')).toBe('C__');
    expect(getHint('APPLE')).toBe('A____');
  });

  it('getResultText returns correct text', () => {
    expect(getResultText(8, 8).title).toBe('Word Master!');
    expect(getResultText(5, 8).title).toBe('Great Spelling!');
    expect(getResultText(1, 8).title).toBe('Keep Trying!');
  });
});
