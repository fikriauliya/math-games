import { describe, it, expect } from 'bun:test';
import { BODY_PARTS, TOTAL, shuffle, getOptions, checkAnswer, getResultText } from './logic';

describe('toddler-body logic', () => {
  it('BODY_PARTS has 6 entries', () => {
    expect(BODY_PARTS.length).toBe(6);
  });

  it('each body part has unique name', () => {
    const names = BODY_PARTS.map(b => b.name);
    expect(new Set(names).size).toBe(6);
  });

  it('shuffle preserves elements', () => {
    const arr = [1, 2, 3];
    expect(shuffle(arr).sort()).toEqual([1, 2, 3]);
  });

  it('getOptions returns 2 options including correct', () => {
    const opts = getOptions(BODY_PARTS[0], BODY_PARTS);
    expect(opts.length).toBe(2);
    expect(opts.map(o => o.name)).toContain(BODY_PARTS[0].name);
  });

  it('getOptions has different options', () => {
    const opts = getOptions(BODY_PARTS[0], BODY_PARTS);
    expect(new Set(opts.map(o => o.name)).size).toBe(2);
  });

  it('checkAnswer works', () => {
    expect(checkAnswer('Mata', 'Mata')).toBe(true);
    expect(checkAnswer('Kaki', 'Mata')).toBe(false);
  });

  it('getResultText tiers', () => {
    expect(getResultText(8, 8).title).toBe('Hebat Sekali!');
    expect(getResultText(5, 8).title).toBe('Bagus!');
    expect(getResultText(2, 8).title).toBe('Ayo Coba Lagi!');
  });

  it('TOTAL is 8', () => {
    expect(TOTAL).toBe(8);
  });
});
