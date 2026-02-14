import { describe, it, expect } from 'bun:test';
import { genQuestion, checkAnswer, getResult, shuffle, TOTAL } from './logic';

describe('binary-code logic', () => {
  it('genQuestion returns question with 4 choices', () => {
    const q = genQuestion(0);
    expect(q.text).toBeTruthy();
    expect(q.choices.length).toBe(4);
    expect(q.choices).toContain(q.answer);
  });

  it('early rounds use 4-bit numbers', () => {
    const q = genQuestion(0);
    if (q.type === 'dec2bin') {
      expect(q.answer.length).toBe(4);
    } else {
      expect(parseInt(q.answer)).toBeLessThanOrEqual(15);
    }
  });

  it('later rounds use more bits', () => {
    const q = genQuestion(9);
    if (q.type === 'dec2bin') {
      expect(q.answer.length).toBe(8);
    }
  });

  it('checkAnswer works correctly', () => {
    expect(checkAnswer('10', '10')).toBe(true);
    expect(checkAnswer('10', '11')).toBe(false);
  });

  it('getResult returns perfect for full score', () => {
    expect(getResult(10, 10).title).toBe('SYSTEM CRACKED!');
  });

  it('TOTAL is 10', () => {
    expect(TOTAL).toBe(10);
  });

  it('shuffle preserves elements', () => {
    const r = shuffle([1, 2, 3]);
    expect(r.sort()).toEqual([1, 2, 3]);
  });
});
