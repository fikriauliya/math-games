import { describe, it, expect } from 'bun:test';
import { genQuestion, checkAnswer, getResult, shuffle, TOTAL } from './logic';

describe('time-calculator logic', () => {
  it('genQuestion returns question with 4 choices', () => {
    const q = genQuestion();
    expect(q.text).toBeTruthy();
    expect(q.choices.length).toBe(4);
    expect(q.choices).toContain(q.answer);
  });

  it('checkAnswer works correctly', () => {
    expect(checkAnswer('3:30', '3:30')).toBe(true);
    expect(checkAnswer('3:30', '4:00')).toBe(false);
  });

  it('getResult returns perfect for full score', () => {
    expect(getResult(10, 10).title).toBe('Sempurna!');
  });

  it('getResult returns try again for low score', () => {
    expect(getResult(2, 10).title).toBe('Ayo Coba Lagi!');
  });

  it('shuffle preserves elements', () => {
    const r = shuffle([1, 2, 3]);
    expect(r.sort()).toEqual([1, 2, 3]);
  });

  it('TOTAL is 10', () => {
    expect(TOTAL).toBe(10);
  });
});
