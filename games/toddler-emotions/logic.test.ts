import { describe, it, expect } from 'bun:test';
import { EMOTIONS, TOTAL, shuffle, generateRound, checkAnswer, getResultText } from './logic';

describe('toddler-emotions logic', () => {
  it('EMOTIONS has 6 entries', () => {
    expect(EMOTIONS.length).toBe(6);
  });

  it('each emotion has unique name', () => {
    const names = EMOTIONS.map(e => e.name);
    expect(new Set(names).size).toBe(6);
  });

  it('shuffle preserves elements', () => {
    const arr = [1, 2, 3];
    expect(shuffle(arr).sort()).toEqual([1, 2, 3]);
  });

  it('generateRound returns 2 choices including target', () => {
    const round = generateRound(EMOTIONS[0], EMOTIONS);
    expect(round.choices.length).toBe(2);
    expect(round.choices.map(c => c.name)).toContain(EMOTIONS[0].name);
  });

  it('wrong choice differs from target', () => {
    const round = generateRound(EMOTIONS[0], EMOTIONS);
    const other = round.choices.find(c => c.name !== EMOTIONS[0].name)!;
    expect(other.name).not.toBe(EMOTIONS[0].name);
  });

  it('checkAnswer works', () => {
    expect(checkAnswer('SENANG', 'SENANG')).toBe(true);
    expect(checkAnswer('SEDIH', 'SENANG')).toBe(false);
  });

  it('getResultText tiers', () => {
    expect(getResultText(8, 8).title).toBe('Hebat Sekali!');
    expect(getResultText(5, 8).title).toBe('Bagus!');
    expect(getResultText(2, 8).title).toBe('Ayo Coba Lagi!');
  });
});
