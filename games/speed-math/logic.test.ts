import { describe, it, expect } from 'bun:test';
import { genQ, calcScore, getGrade } from './logic';

describe('speed-math logic', () => {
  it('genQ easy only uses addition', () => {
    for (let i = 0; i < 20; i++) {
      const q = genQ('easy');
      expect(q.text).toContain('+');
    }
  });

  it('genQ returns 4 choices including the answer', () => {
    const q = genQ('medium');
    expect(q.choices.length).toBe(4);
    expect(q.choices).toContain(q.answer);
  });

  it('genQ choices are sorted ascending', () => {
    const q = genQ('hard');
    for (let i = 1; i < q.choices.length; i++) {
      expect(q.choices[i]).toBeGreaterThanOrEqual(q.choices[i-1]);
    }
  });

  it('genQ subtraction produces non-negative answers', () => {
    for (let i = 0; i < 30; i++) {
      const q = genQ('medium');
      expect(q.answer).toBeGreaterThanOrEqual(0);
    }
  });

  it('calcScore caps bonus at 5', () => {
    expect(calcScore(1)).toBe(10);
    expect(calcScore(5)).toBe(50);
    expect(calcScore(10)).toBe(50);
  });

  it('getGrade returns correct grades', () => {
    expect(getGrade(20, 20).grade).toBe('S');
    expect(getGrade(18, 20).grade).toBe('A+');
    expect(getGrade(16, 20).grade).toBe('A');
    expect(getGrade(14, 20).grade).toBe('B');
    expect(getGrade(12, 20).grade).toBe('C');
    expect(getGrade(10, 20).grade).toBe('D');
  });

  it('genQ hard can produce multiplication', () => {
    const ops = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const q = genQ('hard');
      if (q.text.includes('×')) ops.add('×');
    }
    expect(ops.has('×')).toBe(true);
  });
});
