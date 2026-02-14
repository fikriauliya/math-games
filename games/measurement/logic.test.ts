import { describe, it, expect } from 'bun:test';
import { genQuestion, isCorrect, getGrade } from './logic';

describe('measurement logic', () => {
  it('genQuestion returns valid question', () => {
    const q = genQuestion();
    expect(q.text).toBeTruthy();
    expect(q.choices.length).toBe(4);
    expect(q.choices).toContain(q.answer);
  });

  it('genQuestion answer is in choices', () => {
    for (let i = 0; i < 20; i++) {
      const q = genQuestion();
      expect(q.choices).toContain(q.answer);
    }
  });

  it('isCorrect works', () => {
    expect(isCorrect(5, 5)).toBe(true);
    expect(isCorrect(5, 10)).toBe(false);
  });

  it('getGrade tiers', () => {
    expect(getGrade(10, 10).grade).toBe('A+');
    expect(getGrade(7, 10).grade).toBe('B');
    expect(getGrade(5, 10).grade).toBe('C');
    expect(getGrade(2, 10).grade).toBe('D');
  });

  it('choices are all different (usually)', () => {
    const q = genQuestion();
    const unique = new Set(q.choices);
    // At least 3 should be unique (edge case: answer*10 could equal another)
    expect(unique.size).toBeGreaterThanOrEqual(3);
  });
});
