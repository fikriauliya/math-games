import { describe, it, expect } from 'bun:test';
import { ROOMS, TOTAL, genRound, checkAnswer, getResult, shuffle } from './logic';

describe('toddler-rooms logic', () => {
  it('ROOMS has 8 entries', () => {
    expect(ROOMS.length).toBe(8);
  });

  it('each room has unique name', () => {
    const names = ROOMS.map(r => r.name);
    expect(new Set(names).size).toBe(8);
  });

  it('genRound returns 2 choices including target', () => {
    const target = ROOMS[0];
    const choices = genRound(target, ROOMS);
    expect(choices.length).toBe(2);
    expect(choices.map(c => c.name)).toContain(target.name);
  });

  it('checkAnswer works correctly', () => {
    expect(checkAnswer('Dapur', 'Dapur')).toBe(true);
    expect(checkAnswer('Kamar', 'Dapur')).toBe(false);
  });

  it('getResult returns perfect for full score', () => {
    expect(getResult(8, 8).title).toBe('Hebat Sekali!');
  });

  it('TOTAL is 8', () => {
    expect(TOTAL).toBe(8);
  });
});
