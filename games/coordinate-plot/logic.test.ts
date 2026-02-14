import { describe, it, expect } from 'bun:test';
import { genQuestion, checkAnswer, getGrade, manhattan } from './logic';

describe('coordinate-plot logic', () => {
  it('genQuestion generates coords 0-9', () => {
    for (let i = 0; i < 20; i++) {
      const q = genQuestion();
      expect(q.targetX).toBeGreaterThanOrEqual(0); expect(q.targetX).toBeLessThanOrEqual(9);
      expect(q.targetY).toBeGreaterThanOrEqual(0); expect(q.targetY).toBeLessThanOrEqual(9);
    }
  });
  it('checkAnswer correct', () => { expect(checkAnswer(3, 4, 3, 4)).toBe(true); });
  it('checkAnswer wrong', () => { expect(checkAnswer(3, 4, 5, 6)).toBe(false); });
  it('manhattan distance', () => { expect(manhattan(0, 0, 3, 4)).toBe(7); });
  it('getGrade S for perfect', () => { expect(getGrade(10, 10).grade).toBe('S'); });
  it('manhattan zero for same point', () => { expect(manhattan(5, 5, 5, 5)).toBe(0); });
});
