import { describe, it, expect } from 'bun:test';
import { generateQuestion, checkAnswer, calcScore, getGrade } from './logic';

describe('order-ops logic', () => {
  it('generates question with 4 choices', () => {
    const q = generateQuestion('easy');
    expect(q.choices.length).toBe(4);
    expect(q.choices).toContain(q.answer);
  });

  it('choices are sorted', () => {
    const q = generateQuestion('medium');
    for (let i = 1; i < q.choices.length; i++) expect(q.choices[i]).toBeGreaterThanOrEqual(q.choices[i-1]);
  });

  it('checkAnswer works', () => {
    expect(checkAnswer(5, 5)).toBe(true);
    expect(checkAnswer(5, 6)).toBe(false);
  });

  it('calcScore caps at 5x', () => {
    expect(calcScore(1)).toBe(10);
    expect(calcScore(10)).toBe(50);
  });

  it('getGrade returns correct grades', () => {
    expect(getGrade(10, 10).grade).toBe('S');
    expect(getGrade(5, 10).grade).toBe('C');
  });

  it('hard generates parentheses or squares', () => {
    let hasComplex = false;
    for (let i = 0; i < 30; i++) {
      const q = generateQuestion('hard');
      if (q.expression.includes('(') || q.expression.includes('²')) hasComplex = true;
    }
    expect(hasComplex).toBe(true);
  });
});
