import { describe, it, expect } from 'bun:test';
import { FRUITS, TOTAL, shuffle, generateRound, checkAnswer, getResultText } from './logic';

describe('toddler-fruits logic', () => {
  it('FRUITS has 8 entries', () => {
    expect(FRUITS.length).toBe(8);
  });

  it('each fruit has unique name', () => {
    const names = FRUITS.map(f => f.name);
    expect(new Set(names).size).toBe(8);
  });

  it('generateRound returns 2 choices including target', () => {
    const round = generateRound(FRUITS);
    expect(round.choices.length).toBe(2);
    expect(round.choices.map(c => c.name)).toContain(round.target.name);
  });

  it('generateRound choices are different fruits', () => {
    const round = generateRound(FRUITS);
    expect(round.choices[0].name).not.toBe(round.choices[1].name);
  });

  it('checkAnswer works correctly', () => {
    expect(checkAnswer('Apel', 'Apel')).toBe(true);
    expect(checkAnswer('Pisang', 'Apel')).toBe(false);
  });

  it('shuffle preserves elements', () => {
    const arr = [1, 2, 3];
    const result = shuffle(arr);
    expect(result.sort()).toEqual([1, 2, 3]);
  });

  it('getResultText returns correct results', () => {
    expect(getResultText(8, 8).title).toBe('Hebat Sekali!');
    expect(getResultText(5, 8).title).toBe('Bagus!');
    expect(getResultText(2, 8).title).toBe('Ayo Coba Lagi!');
  });

  it('TOTAL is 8', () => {
    expect(TOTAL).toBe(8);
  });
});
