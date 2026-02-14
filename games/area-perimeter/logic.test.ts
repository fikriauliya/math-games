import { describe, it, expect } from 'bun:test';
import { genQuestion, calcArea, calcPerimeter, getGrade } from './logic';

describe('area-perimeter logic', () => {
  it('calcArea rectangle', () => {
    expect(calcArea('rectangle', 5, 3)).toBe(15);
  });
  it('calcArea triangle', () => {
    expect(calcArea('triangle', 6, 4)).toBe(12);
  });
  it('calcPerimeter rectangle', () => {
    expect(calcPerimeter('rectangle', 5, 3)).toBe(16);
  });
  it('calcPerimeter triangle (right triangle)', () => {
    const p = calcPerimeter('triangle', 3, 4);
    expect(p).toBe(12); // 3+4+5
  });
  it('genQuestion returns 4 choices with answer', () => {
    const q = genQuestion();
    expect(q.choices.length).toBe(4);
    expect(q.choices).toContain(q.answer);
  });
  it('getGrade returns correct grades', () => {
    expect(getGrade(10, 10).grade).toBe('S');
    expect(getGrade(5, 10).grade).toBe('D');
  });
  it('genQuestion answer matches calculation', () => {
    for (let i = 0; i < 20; i++) {
      const q = genQuestion();
      if (q.shape === 'rectangle' && q.type === 'area') {
        expect(q.answer).toBe(q.width * q.height);
      }
    }
  });
});
