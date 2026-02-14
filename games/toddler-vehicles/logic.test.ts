import { describe, it, expect } from 'bun:test';
import { VEHICLES, TOTAL, shuffle, getOptions, checkAnswer, getResultText } from './logic';

describe('toddler-vehicles logic', () => {
  it('VEHICLES has 8 entries', () => {
    expect(VEHICLES.length).toBe(8);
  });

  it('each vehicle has unique name', () => {
    const names = VEHICLES.map(v => v.name);
    expect(new Set(names).size).toBe(8);
  });

  it('shuffle preserves elements', () => {
    const arr = [1, 2, 3];
    expect(shuffle(arr).sort()).toEqual([1, 2, 3]);
  });

  it('getOptions returns 2 options including correct', () => {
    const opts = getOptions(VEHICLES[0], VEHICLES);
    expect(opts.length).toBe(2);
    expect(opts.map(o => o.name)).toContain(VEHICLES[0].name);
  });

  it('getOptions wrong option is different from correct', () => {
    const opts = getOptions(VEHICLES[0], VEHICLES);
    const names = opts.map(o => o.name);
    expect(new Set(names).size).toBe(2);
  });

  it('checkAnswer works', () => {
    expect(checkAnswer('Mobil', 'Mobil')).toBe(true);
    expect(checkAnswer('Bus', 'Mobil')).toBe(false);
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
