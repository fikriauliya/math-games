import { describe, it, expect } from 'bun:test';
import { PROFESI_LIST, TOTAL, genRound, checkAnswer, getResult, shuffle } from './logic';

describe('toddler-profesi logic', () => {
  it('PROFESI_LIST has 8 entries', () => {
    expect(PROFESI_LIST.length).toBe(8);
  });

  it('each profesi has unique name', () => {
    const names = PROFESI_LIST.map(p => p.name);
    expect(new Set(names).size).toBe(8);
  });

  it('genRound returns 2 choices including target', () => {
    const target = PROFESI_LIST[0];
    const choices = genRound(target, PROFESI_LIST);
    expect(choices.length).toBe(2);
    expect(choices.map(c => c.name)).toContain(target.name);
  });

  it('checkAnswer works correctly', () => {
    expect(checkAnswer('Dokter', 'Dokter')).toBe(true);
    expect(checkAnswer('Guru', 'Dokter')).toBe(false);
  });

  it('getResult returns perfect for full score', () => {
    expect(getResult(8, 8).title).toBe('Hebat Sekali!');
  });

  it('TOTAL is 8', () => {
    expect(TOTAL).toBe(8);
  });

  it('shuffle preserves elements', () => {
    const r = shuffle([1, 2, 3]);
    expect(r.sort()).toEqual([1, 2, 3]);
  });
});
