import { describe, it, expect } from 'bun:test';
import { genQuestion, getGrade, checkBalance } from './logic';

describe('math-balance logic', () => {
  it('checkBalance correct', () => { expect(checkBalance([5, 3], 4, 4)).toBe(true); });
  it('checkBalance wrong', () => { expect(checkBalance([5, 3], 3, 4)).toBe(false); });
  it('genQuestion answer balances', () => {
    for (let i = 0; i < 20; i++) {
      const q = genQuestion('easy');
      const leftSum = q.leftSide.reduce((s, n) => s + n, 0);
      expect(q.answer + q.rightTarget).toBe(leftSum);
    }
  });
  it('genQuestion has 4 choices', () => { expect(genQuestion('medium').choices.length).toBe(4); });
  it('genQuestion answer in choices', () => {
    const q = genQuestion('easy');
    expect(q.choices).toContain(q.answer);
  });
  it('getGrade works', () => { expect(getGrade(10, 10).grade).toBe('S'); });
});
