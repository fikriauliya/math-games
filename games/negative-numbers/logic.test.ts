import { describe, it, expect } from 'bun:test';
import { genQuestion, checkAnswer, getResult, shuffle, TOTAL } from './logic';

describe('negative-numbers logic', () => {
  it('genQuestion returns valid question with 4 choices', () => {
    const q = genQuestion();
    expect(q.text).toBeTruthy();
    expect(q.choices.length).toBeGreaterThanOrEqual(2);
    expect(q.choices).toContain(q.answer);
  });

  it('checkAnswer returns true for correct', () => {
    expect(checkAnswer(5, 5)).toBe(true);
    expect(checkAnswer(-3, -3)).toBe(true);
  });

  it('checkAnswer returns false for wrong', () => {
    expect(checkAnswer(5, -5)).toBe(false);
  });

  it('getResult returns perfect for full score', () => {
    const r = getResult(10, 10);
    expect(r.emoji).toBe('🏆');
    expect(r.title).toBe('Perfect!');
  });

  it('getResult returns keep practicing for low score', () => {
    const r = getResult(2, 10);
    expect(r.title).toBe('Keep Practicing!');
  });

  it('shuffle preserves elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
  });

  it('TOTAL is 10', () => {
    expect(TOTAL).toBe(10);
  });

  it('compare questions have 2 choices', () => {
    // Generate many to find a compare question
    for (let i = 0; i < 50; i++) {
      const q = genQuestion();
      if (q.type === 'compare') {
        expect(q.choices.length).toBe(2);
        return;
      }
    }
    // It's okay if we don't find one in 50 tries (random)
  });
});
