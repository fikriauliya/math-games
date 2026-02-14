import { describe, it, expect } from 'bun:test';
import { QUESTIONS, TOTAL, shuffle, checkAnswer, getOptions, getResultText } from './logic';

describe('toddler-clock logic', () => {
  it('QUESTIONS has enough entries', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(TOTAL);
  });

  it('each question has correct and wrong different', () => {
    for (const q of QUESTIONS) {
      expect(q.correct).not.toBe(q.wrong);
    }
  });

  it('checkAnswer works', () => {
    expect(checkAnswer('Pagi', 'Pagi')).toBe(true);
    expect(checkAnswer('Siang', 'Pagi')).toBe(false);
  });

  it('getOptions returns exactly 2 options', () => {
    const opts = getOptions(QUESTIONS[0]);
    expect(opts.length).toBe(2);
    expect(opts).toContain(QUESTIONS[0].correct);
    expect(opts).toContain(QUESTIONS[0].wrong);
  });

  it('shuffle preserves elements', () => {
    const arr = [1, 2, 3];
    const result = shuffle(arr);
    expect(result.sort()).toEqual([1, 2, 3]);
  });

  it('getResultText returns correct text', () => {
    expect(getResultText(6, 6).title).toBe('Hebat Sekali!');
    expect(getResultText(4, 6).title).toBe('Bagus!');
    expect(getResultText(1, 6).title).toBe('Ayo Coba Lagi!');
  });
});
