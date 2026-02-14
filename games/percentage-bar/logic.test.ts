import { describe, it, expect } from 'bun:test';
import { genQuestion, validateAnswer, getResultText, TOTAL } from './logic';
import { Either } from 'effect';

describe('percentage-bar logic', () => {
  it('generates questions with 4 choices', () => {
    const q = genQuestion(0);
    expect(q.choices.length).toBe(4);
    expect(q.choices).toContain(q.answer);
  });

  it('choices are sorted ascending', () => {
    for (let i = 0; i < 10; i++) {
      const q = genQuestion(i);
      for (let j = 1; j < q.choices.length; j++) {
        expect(q.choices[j]).toBeGreaterThanOrEqual(q.choices[j - 1]);
      }
    }
  });

  it('barPercent is between 0 and 100', () => {
    for (let i = 0; i < 20; i++) {
      const q = genQuestion(i % 10);
      expect(q.barPercent).toBeGreaterThanOrEqual(10);
      expect(q.barPercent).toBeLessThanOrEqual(90);
    }
  });

  it('validateAnswer works', () => {
    expect(Either.isRight(validateAnswer(25, 25))).toBe(true);
    expect(Either.isLeft(validateAnswer(30, 25))).toBe(true);
  });

  it('getResultText returns correct tiers', () => {
    expect(getResultText(10, 10).title).toBe('Percentage Pro!');
    expect(getResultText(7, 10).title).toBe('Great Job!');
    expect(getResultText(3, 10).title).toBe('Keep Practicing!');
  });

  it('TOTAL is 10', () => {
    expect(TOTAL).toBe(10);
  });

  it('question type is calc or visual', () => {
    for (let i = 0; i < 20; i++) {
      const q = genQuestion(i % 10);
      expect(['calc', 'visual']).toContain(q.type);
    }
  });

  it('calc questions have positive answers', () => {
    for (let i = 0; i < 20; i++) {
      const q = genQuestion(i % 10);
      expect(q.answer).toBeGreaterThan(0);
    }
  });
});
