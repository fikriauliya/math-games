import { describe, it, expect } from 'bun:test';
import { genQuestion, validateAnswer, calcScore, getGrade } from './logic';
import { Either } from 'effect';

describe('division-dash logic', () => {
  it('easy generates divisions with divisors 1-5', () => {
    for (let i = 0; i < 30; i++) {
      const q = genQuestion('easy');
      const parts = q.text.match(/(\d+) ÷ (\d+)/);
      expect(parts).not.toBeNull();
      const divisor = parseInt(parts![2]);
      expect(divisor).toBeGreaterThanOrEqual(1);
      expect(divisor).toBeLessThanOrEqual(5);
    }
  });

  it('returns 4 choices including correct answer', () => {
    const q = genQuestion('medium');
    expect(q.choices.length).toBe(4);
    expect(q.choices).toContain(q.answer);
  });

  it('choices are sorted ascending', () => {
    const q = genQuestion('hard');
    for (let i = 1; i < q.choices.length; i++) {
      expect(q.choices[i]).toBeGreaterThanOrEqual(q.choices[i - 1]);
    }
  });

  it('validateAnswer returns Right for correct', () => {
    const result = validateAnswer(5, 5);
    expect(Either.isRight(result)).toBe(true);
  });

  it('validateAnswer returns Left for wrong', () => {
    const result = validateAnswer(3, 5);
    expect(Either.isLeft(result)).toBe(true);
  });

  it('calcScore rewards streak and time', () => {
    expect(calcScore(0, 0)).toBe(10);
    expect(calcScore(3, 30)).toBeGreaterThan(calcScore(0, 0));
  });

  it('getGrade returns correct grades', () => {
    expect(getGrade(150, 10).grade).toBe('S');
    expect(getGrade(50, 10).grade).toBe('B');
    expect(getGrade(10, 10).grade).toBe('C');
  });

  it('answer is always positive', () => {
    for (let i = 0; i < 30; i++) {
      const q = genQuestion('hard');
      expect(q.answer).toBeGreaterThan(0);
    }
  });
});
