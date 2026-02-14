import { describe, it, expect } from 'bun:test';
import { generateRound, checkMatch, getResultText, shuffle, TOTAL_ROUNDS, PAIRS_PER_ROUND } from './logic';

describe('toddler-match logic', () => {
  it('generateRound returns 3 pairs', () => {
    const r = generateRound(0);
    expect(r.pairs.length).toBe(3);
  });

  it('generateRound shuffledRight has same values as pairs right', () => {
    const r = generateRound(0);
    const rightValues = r.pairs.map(p => p.right).sort();
    const shuffled = [...r.shuffledRight].sort();
    expect(shuffled).toEqual(rightValues);
  });

  it('checkMatch returns true for correct match', () => {
    const r = generateRound(0);
    expect(checkMatch(0, r.pairs[0].right, r.pairs)).toBe(true);
  });

  it('checkMatch returns false for wrong match', () => {
    const r = generateRound(0);
    // Find a wrong match
    const wrongRight = r.pairs[1].right;
    if (r.pairs[0].right !== wrongRight) {
      expect(checkMatch(0, wrongRight, r.pairs)).toBe(false);
    }
  });

  it('getResultText returns correct results', () => {
    expect(getResultText(9, 9).title).toBe('Hebat Sekali!');
    expect(getResultText(6, 9).title).toBe('Bagus!');
    expect(getResultText(2, 9).title).toBe('Ayo Coba Lagi!');
  });

  it('shuffle preserves elements', () => {
    const arr = [1, 2, 3];
    expect(shuffle(arr).sort()).toEqual([1, 2, 3]);
  });

  it('TOTAL_ROUNDS is 3', () => {
    expect(TOTAL_ROUNDS).toBe(3);
  });

  it('PAIRS_PER_ROUND is 3', () => {
    expect(PAIRS_PER_ROUND).toBe(3);
  });

  it('different rounds use different themes', () => {
    const r0 = generateRound(0);
    const r1 = generateRound(1);
    expect(r0.theme).not.toBe(r1.theme);
  });
});
