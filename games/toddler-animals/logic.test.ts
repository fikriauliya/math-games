import { describe, it, expect } from 'bun:test';
import { ANIMALS, TOTAL, shuffle, checkAnswer, getOptions, getResultText } from './logic';

describe('toddler-animals logic', () => {
  it('ANIMALS has 10 entries', () => {
    expect(ANIMALS.length).toBe(10);
  });

  it('each animal has unique sound', () => {
    const sounds = ANIMALS.map(a => a.sound);
    expect(new Set(sounds).size).toBe(10);
  });

  it('each animal wrong sounds do not include correct sound', () => {
    for (const a of ANIMALS) {
      expect(a.wrong).not.toContain(a.sound);
    }
  });

  it('shuffle preserves all elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
    expect(arr).toEqual([1, 2, 3, 4, 5]); // doesn't mutate
  });

  it('checkAnswer works correctly', () => {
    expect(checkAnswer('Mooo!', 'Mooo!')).toBe(true);
    expect(checkAnswer('Guk guk!', 'Mooo!')).toBe(false);
  });

  it('getOptions returns 4 options including correct sound', () => {
    const opts = getOptions(ANIMALS[0]);
    expect(opts.length).toBe(4);
    expect(opts).toContain(ANIMALS[0].sound);
  });

  it('getResultText returns correct results', () => {
    expect(getResultText(6, 6).title).toBe('Hebat Sekali!');
    expect(getResultText(4, 6).title).toBe('Bagus!');
    expect(getResultText(1, 6).title).toBe('Ayo Coba Lagi!');
  });

  it('TOTAL is 6', () => {
    expect(TOTAL).toBe(6);
  });
});
