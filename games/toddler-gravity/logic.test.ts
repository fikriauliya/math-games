import { describe, it, expect } from 'bun:test';
import { genQuestion, isCorrect, getEndResult } from './logic';

describe('toddler-gravity logic', () => {
  it('genQuestion returns valid question', () => {
    const q = genQuestion();
    expect(q.obj1.name).toBeTruthy();
    expect(q.obj2.name).toBeTruthy();
    expect(['left', 'right']).toContain(q.answer);
    expect(q.explanation).toBeTruthy();
  });

  it('answer points to heavy object', () => {
    for (let i = 0; i < 20; i++) {
      const q = genQuestion();
      if (q.answer === 'left') expect(q.obj1.heavy).toBe(true);
      else expect(q.obj2.heavy).toBe(true);
    }
  });

  it('isCorrect works', () => {
    expect(isCorrect('left', 'left')).toBe(true);
    expect(isCorrect('right', 'left')).toBe(false);
  });

  it('getEndResult tiers', () => {
    expect(getEndResult(5, 5).stars).toBe('⭐⭐⭐');
    expect(getEndResult(3, 5).stars).toBe('⭐⭐');
    expect(getEndResult(1, 5).stars).toBe('⭐');
  });

  it('both objects have emoji', () => {
    const q = genQuestion();
    expect(q.obj1.emoji).toBeTruthy();
    expect(q.obj2.emoji).toBeTruthy();
  });
});
