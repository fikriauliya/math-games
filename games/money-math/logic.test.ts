import { describe, it, expect } from 'bun:test';
import { generateQuestion, checkAnswer, getResultText, DENOMINATIONS, TOTAL_ROUNDS, shuffle } from './logic';

describe('money-math logic', () => {
  it('generates a question with valid type', () => {
    const q = generateQuestion(0);
    expect(['total', 'change']).toContain(q.type);
  });

  it('total question answer equals sum of items', () => {
    for (let i = 0; i < 10; i++) {
      const q = generateQuestion(i);
      if (q.type === 'total') {
        expect(q.answer).toBe(q.items.reduce((a, b) => a + b, 0));
      }
    }
  });

  it('choices include the correct answer', () => {
    const q = generateQuestion(0);
    expect(q.choices).toContain(q.answer);
    expect(q.choices.length).toBe(4);
  });

  it('checkAnswer works correctly', () => {
    expect(checkAnswer(1000, 1000)).toBe(true);
    expect(checkAnswer(500, 1000)).toBe(false);
  });

  it('getResultText returns correct tiers', () => {
    expect(getResultText(10, 10).title).toBe('Hebat Sekali!');
    expect(getResultText(7, 10).title).toBe('Pintar!');
    expect(getResultText(2, 10).title).toBe('Ayo Coba Lagi!');
  });

  it('DENOMINATIONS has 7 values', () => {
    expect(DENOMINATIONS.length).toBe(7);
  });

  it('shuffle preserves elements', () => {
    const arr = [1, 2, 3];
    expect(shuffle(arr).sort()).toEqual([1, 2, 3]);
  });
});
