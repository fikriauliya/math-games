import { describe, it, expect } from 'bun:test';
import { genQuestion, getGrade, solveForX } from './logic';

describe('algebra-intro logic', () => {
  it('solveForX addition', () => { expect(solveForX('+', 3, 7)).toBe(4); });
  it('solveForX subtraction', () => { expect(solveForX('−', 10, 3)).toBe(7); });
  it('solveForX multiplication', () => { expect(solveForX('×', 3, 12)).toBe(4); });
  it('solveForX division', () => { expect(solveForX('÷', 12, 4)).toBe(3); });
  it('genQuestion returns 4 choices with answer', () => {
    const q = genQuestion('easy');
    expect(q.choices.length).toBe(4);
    expect(q.choices).toContain(q.answer);
  });
  it('genQuestion answer is positive', () => {
    for (let i = 0; i < 20; i++) {
      expect(genQuestion('medium').answer).toBeGreaterThan(0);
    }
  });
  it('getGrade S for perfect', () => { expect(getGrade(10, 10).grade).toBe('S'); });
});
