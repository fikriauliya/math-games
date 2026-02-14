import { describe, it, expect } from 'bun:test';
import { gcd, lcm, genQuestion, getGrade } from './logic';

describe('lcm-gcd logic', () => {
  it('gcd(12, 8) = 4', () => { expect(gcd(12, 8)).toBe(4); });
  it('gcd(7, 3) = 1', () => { expect(gcd(7, 3)).toBe(1); });
  it('lcm(4, 6) = 12', () => { expect(lcm(4, 6)).toBe(12); });
  it('lcm(3, 5) = 15', () => { expect(lcm(3, 5)).toBe(15); });
  it('genQuestion has 4 choices with answer', () => {
    const q = genQuestion('easy');
    expect(q.choices.length).toBe(4);
    expect(q.choices).toContain(q.answer);
  });
  it('genQuestion answer is correct', () => {
    for (let i = 0; i < 20; i++) {
      const q = genQuestion('medium');
      const expected = q.type === 'GCD' ? gcd(q.a, q.b) : lcm(q.a, q.b);
      expect(q.answer).toBe(expected);
    }
  });
  it('getGrade works', () => { expect(getGrade(10, 10).grade).toBe('S'); });
});
