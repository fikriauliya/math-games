import { describe, it, expect } from 'bun:test';
import { genPairs, shuffle, makeCards, isMatch, getStars, formatTime } from './logic';

describe('memory-math logic', () => {
  it('genPairs generates correct count', () => {
    const pairs = genPairs(8);
    expect(pairs.length).toBe(8);
  });

  it('genPairs produces unique equations', () => {
    const pairs = genPairs(8);
    const eqs = pairs.map(p => p.equation);
    expect(new Set(eqs).size).toBe(8);
  });

  it('genPairs answers are correct', () => {
    const pairs = genPairs(10);
    for (const p of pairs) {
      const parts = p.equation.split(' ');
      const a = parseInt(parts[0]), op = parts[1], b = parseInt(parts[2]);
      let expected: number;
      if (op === '+') expected = a + b;
      else if (op === '−') expected = a - b;
      else expected = a * b;
      expect(p.answer).toBe(String(expected));
    }
  });

  it('shuffle preserves elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffle(arr);
    expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('shuffle does not mutate original', () => {
    const arr = [1, 2, 3];
    shuffle(arr);
    expect(arr).toEqual([1, 2, 3]);
  });

  it('makeCards creates 2 cards per pair', () => {
    const pairs = genPairs(5);
    const cards = makeCards(pairs);
    expect(cards.length).toBe(10);
  });

  it('isMatch correctly identifies matches', () => {
    const cardA = { text: '3 + 4', pairId: 0, type: 'eq' };
    const cardB = { text: '7', pairId: 0, type: 'ans' };
    const cardC = { text: '10', pairId: 1, type: 'ans' };
    expect(isMatch(cardA, cardB)).toBe(true);
    expect(isMatch(cardA, cardC)).toBe(false);
  });

  it('getStars returns correct star ratings', () => {
    expect(getStars(8, 8)).toBe('⭐⭐⭐');
    expect(getStars(8, 12)).toBe('⭐⭐');
    expect(getStars(8, 20)).toBe('⭐');
  });

  it('formatTime formats correctly', () => {
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(0)).toBe('0:00');
  });
});
