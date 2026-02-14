import { describe, it, expect } from 'bun:test';
import { generateQuestion, checkAnswer, getGrade } from './logic';

describe('rounding logic', () => {
  it('easy rounds to 10', () => {
    const q = generateQuestion('easy');
    expect(q.roundTo).toBe(10);
    expect(q.answer % 10).toBe(0);
  });

  it('answer is correct rounding', () => {
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion('medium');
      expect(q.answer).toBe(Math.round(q.number / q.roundTo) * q.roundTo);
    }
  });

  it('has 4 choices including answer', () => {
    const q = generateQuestion('hard');
    expect(q.choices.length).toBe(4);
    expect(q.choices).toContain(q.answer);
  });

  it('choices are sorted', () => {
    const q = generateQuestion('medium');
    for (let i = 1; i < q.choices.length; i++) expect(q.choices[i]).toBeGreaterThanOrEqual(q.choices[i-1]);
  });

  it('checkAnswer works', () => {
    expect(checkAnswer(10, 10)).toBe(true);
    expect(checkAnswer(10, 20)).toBe(false);
  });

  it('getGrade S for perfect', () => {
    expect(getGrade(15, 15).grade).toBe('S');
  });
});
