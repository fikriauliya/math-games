import { describe, it, expect } from 'bun:test';
import { calcMean, calcMedian, calcMode, generateQuestion, checkAnswer, getResultText, TOTAL } from './logic';

describe('mean-median logic', () => {
  it('calcMean computes correct average', () => {
    expect(calcMean([2, 4, 6])).toBe(4);
    expect(calcMean([1, 2, 3, 4, 5])).toBe(3);
    expect(calcMean([10, 20])).toBe(15);
  });

  it('calcMedian finds middle value', () => {
    expect(calcMedian([1, 3, 5])).toBe(3);
    expect(calcMedian([1, 2, 3, 4])).toBe(2.5);
    expect(calcMedian([5, 1, 3])).toBe(3);
  });

  it('calcMode finds most frequent', () => {
    expect(calcMode([1, 2, 2, 3])).toBe(2);
    expect(calcMode([5, 5, 5, 1, 2])).toBe(5);
  });

  it('generateQuestion returns 4 choices including answer', () => {
    const q = generateQuestion(0);
    expect(q.choices.length).toBe(4);
    expect(q.choices).toContain(q.answer);
    expect(q.numbers.length).toBeGreaterThanOrEqual(5);
  });

  it('checkAnswer validates correctly', () => {
    expect(checkAnswer(5, 5)).toBe(true);
    expect(checkAnswer(3, 5)).toBe(false);
  });

  it('getResultText returns correct grades', () => {
    expect(getResultText(10, 10).title).toBe('Perfect!');
    expect(getResultText(7, 10).title).toBe('Great Job!');
    expect(getResultText(2, 10).title).toBe('Keep Practicing!');
  });
});
