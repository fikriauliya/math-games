import { describe, it, expect } from 'bun:test';
import { OPPOSITES, TOTAL, genQuestion, checkAnswer, getResult, shuffle } from './logic';

describe('toddler-opposites logic', () => {
  it('OPPOSITES has 6 pairs', () => {
    expect(OPPOSITES.length).toBe(6);
  });

  it('each pair has two words and emojis', () => {
    for (const pair of OPPOSITES) {
      expect(pair.word1).toBeTruthy();
      expect(pair.word2).toBeTruthy();
      expect(pair.emoji1).toBeTruthy();
      expect(pair.emoji2).toBeTruthy();
    }
  });

  it('genQuestion returns 2 choices', () => {
    const q = genQuestion(OPPOSITES[0]);
    expect(q.choices.length).toBe(2);
    expect(q.targetWord).toBeTruthy();
  });

  it('checkAnswer works correctly', () => {
    expect(checkAnswer('Besar', 'Besar')).toBe(true);
    expect(checkAnswer('Kecil', 'Besar')).toBe(false);
  });

  it('getResult returns perfect for full score', () => {
    expect(getResult(10, 10).title).toBe('Hebat Sekali!');
  });

  it('TOTAL is 10', () => {
    expect(TOTAL).toBe(10);
  });

  it('shuffle preserves elements', () => {
    const r = shuffle([1, 2, 3]);
    expect(r.sort()).toEqual([1, 2, 3]);
  });
});
