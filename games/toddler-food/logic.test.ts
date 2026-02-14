import { describe, it, expect } from 'bun:test';
import { FOODS, TOTAL, shuffle, generateRound, checkAnswer, getResultText } from './logic';

describe('toddler-food logic', () => {
  it('FOODS has 8 entries', () => {
    expect(FOODS.length).toBe(8);
  });

  it('each food has unique name', () => {
    const names = FOODS.map(f => f.name);
    expect(new Set(names).size).toBe(8);
  });

  it('shuffle preserves elements', () => {
    const arr = [1, 2, 3, 4];
    const result = shuffle(arr);
    expect(result.sort()).toEqual([1, 2, 3, 4]);
  });

  it('generateRound returns 2 choices including target', () => {
    const round = generateRound(FOODS[0], FOODS);
    expect(round.choices.length).toBe(2);
    expect(round.choices.map(c => c.name)).toContain(FOODS[0].name);
  });

  it('generateRound wrong choice is different from target', () => {
    const round = generateRound(FOODS[0], FOODS);
    const other = round.choices.find(c => c.name !== FOODS[0].name)!;
    expect(other.name).not.toBe(FOODS[0].name);
  });

  it('checkAnswer works', () => {
    expect(checkAnswer('NASI', 'NASI')).toBe(true);
    expect(checkAnswer('ROTI', 'NASI')).toBe(false);
  });

  it('getResultText returns correct tiers', () => {
    expect(getResultText(8, 8).title).toBe('Hebat Sekali!');
    expect(getResultText(5, 8).title).toBe('Bagus!');
    expect(getResultText(2, 8).title).toBe('Ayo Coba Lagi!');
  });

  it('TOTAL is 8', () => {
    expect(TOTAL).toBe(8);
  });
});
