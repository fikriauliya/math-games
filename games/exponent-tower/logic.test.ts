import { describe, it, expect } from 'bun:test';
import { genQuestion, getGrade, power } from './logic';

describe('exponent-tower logic', () => {
  it('power 2^3 = 8', () => { expect(power(2, 3)).toBe(8); });
  it('power 5^2 = 25', () => { expect(power(5, 2)).toBe(25); });
  it('power 10^3 = 1000', () => { expect(power(10, 3)).toBe(1000); });
  it('genQuestion answer matches', () => {
    for (let i = 0; i < 20; i++) {
      const q = genQuestion('medium');
      expect(q.answer).toBe(Math.pow(q.base, q.exp));
    }
  });
  it('genQuestion has 4 choices', () => {
    expect(genQuestion('easy').choices.length).toBe(4);
  });
  it('easy mode uses exp=2', () => {
    for (let i = 0; i < 10; i++) { expect(genQuestion('easy').exp).toBe(2); }
  });
  it('getGrade works', () => { expect(getGrade(10, 10).grade).toBe('S'); });
});
