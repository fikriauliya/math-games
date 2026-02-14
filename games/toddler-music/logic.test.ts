import { describe, it, expect } from 'bun:test';
import { INSTRUMENTS, TOTAL, shuffle, generateRound, checkAnswer, getResultText } from './logic';

describe('toddler-music logic', () => {
  it('INSTRUMENTS has 8 entries', () => {
    expect(INSTRUMENTS.length).toBe(8);
  });

  it('each instrument has unique name', () => {
    const names = INSTRUMENTS.map(i => i.name);
    expect(new Set(names).size).toBe(8);
  });

  it('generateRound returns 2 choices including target', () => {
    const round = generateRound(INSTRUMENTS);
    expect(round.choices.length).toBe(2);
    expect(round.choices.map(c => c.name)).toContain(round.target.name);
  });

  it('generateRound choices are different', () => {
    const round = generateRound(INSTRUMENTS);
    expect(round.choices[0].name).not.toBe(round.choices[1].name);
  });

  it('checkAnswer works correctly', () => {
    expect(checkAnswer('Gitar', 'Gitar')).toBe(true);
    expect(checkAnswer('Drum', 'Gitar')).toBe(false);
  });

  it('shuffle preserves elements', () => {
    const arr = [1, 2, 3];
    expect(shuffle(arr).sort()).toEqual([1, 2, 3]);
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
