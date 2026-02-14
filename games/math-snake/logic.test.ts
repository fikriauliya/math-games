import { describe, it, expect } from 'bun:test';
import { genProblem, genFoodItems, getGrade, isCorrectFood } from './logic';

describe('math-snake logic', () => {
  it('genProblem answer is correct', () => {
    for (let i = 0; i < 20; i++) {
      const p = genProblem();
      const parts = p.text.split(' ');
      const a = parseInt(parts[0]), b = parseInt(parts[2]);
      if (parts[1] === '+') expect(p.answer).toBe(a + b);
      else expect(p.answer).toBe(a - b);
    }
  });
  it('genFoodItems returns correct count', () => {
    const items = genFoodItems(10, 15, 4);
    expect(items.length).toBe(4);
  });
  it('genFoodItems includes correct answer', () => {
    const items = genFoodItems(7, 15, 4);
    expect(items.some(i => i.value === 7)).toBe(true);
  });
  it('isCorrectFood true', () => { expect(isCorrectFood(5, 5)).toBe(true); });
  it('isCorrectFood false', () => { expect(isCorrectFood(5, 6)).toBe(false); });
  it('genProblem answer non-negative', () => {
    for (let i = 0; i < 30; i++) expect(genProblem().answer).toBeGreaterThanOrEqual(0);
  });
  it('getGrade works', () => { expect(getGrade(10, 10).grade).toBe('S'); });
});
