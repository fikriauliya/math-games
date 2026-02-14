import { describe, it, expect } from 'bun:test';
import { ANIMALS, shuffle, getAnimalById } from './logic';

describe('toddler-farm logic', () => {
  it('ANIMALS has at least 10 entries', () => {
    expect(ANIMALS.length).toBeGreaterThanOrEqual(10);
  });

  it('each animal has required fields', () => {
    for (const a of ANIMALS) {
      expect(a.emoji.length).toBeGreaterThan(0);
      expect(a.name.length).toBeGreaterThan(0);
      expect(a.sound.length).toBeGreaterThan(0);
      expect(a.fact.length).toBeGreaterThan(0);
    }
  });

  it('shuffle preserves all elements', () => {
    const result = shuffle([...ANIMALS]);
    expect(result.length).toBe(ANIMALS.length);
    const names = result.map(a => a.name).sort();
    const origNames = [...ANIMALS].map(a => a.name).sort();
    expect(names).toEqual(origNames);
  });

  it('getAnimalById returns correct animal', () => {
    expect(getAnimalById(0).name).toBe(ANIMALS[0].name);
    expect(getAnimalById(2).name).toBe(ANIMALS[2].name);
  });

  it('getAnimalById wraps around', () => {
    const wrapped = getAnimalById(ANIMALS.length);
    expect(wrapped.name).toBe(ANIMALS[0].name);
  });
});
