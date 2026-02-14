import { describe, it, expect } from 'bun:test';
import { ANIMALS, TOTAL, shuffle, generateRound, checkAnswer, getResultText } from './logic';

describe('toddler-sea logic', () => {
  it('ANIMALS has 8 entries', () => {
    expect(ANIMALS.length).toBe(8);
  });

  it('each animal has unique name', () => {
    const names = ANIMALS.map(a => a.name);
    expect(new Set(names).size).toBe(8);
  });

  it('generateRound returns 2 choices including target', () => {
    const round = generateRound(ANIMALS);
    expect(round.choices.length).toBe(2);
    expect(round.choices.map(c => c.name)).toContain(round.target.name);
  });

  it('generateRound choices are different', () => {
    const round = generateRound(ANIMALS);
    expect(round.choices[0].name).not.toBe(round.choices[1].name);
  });

  it('checkAnswer works correctly', () => {
    expect(checkAnswer('Ikan', 'Ikan')).toBe(true);
    expect(checkAnswer('Gurita', 'Ikan')).toBe(false);
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
