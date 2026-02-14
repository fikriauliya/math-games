import { describe, it, expect } from 'bun:test';
import { MOVES, MAX_LEVEL, generateSequence, checkMove, getResultText } from './logic';

describe('toddler-dance logic', () => {
  it('MOVES has 4 dance moves', () => {
    expect(MOVES.length).toBe(4);
  });

  it('generateSequence returns correct length for level', () => {
    expect(generateSequence(0).length).toBe(1);
    expect(generateSequence(1).length).toBe(2);
    expect(generateSequence(2).length).toBe(3);
    expect(generateSequence(3).length).toBe(4);
    expect(generateSequence(5).length).toBe(4); // capped at 4
  });

  it('generateSequence uses valid move indices', () => {
    const seq = generateSequence(3);
    for (const i of seq) {
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(MOVES.length);
    }
  });

  it('checkMove works correctly', () => {
    expect(checkMove(0, 0)).toBe(true);
    expect(checkMove(1, 0)).toBe(false);
  });

  it('getResultText returns correct text', () => {
    expect(getResultText(MAX_LEVEL, MAX_LEVEL).title).toBe('Penari Hebat!');
    expect(getResultText(3, MAX_LEVEL).title).toBe('Bagus Sekali!');
    expect(getResultText(1, MAX_LEVEL).title).toBe('Ayo Coba Lagi!');
  });

  it('MAX_LEVEL is reasonable', () => {
    expect(MAX_LEVEL).toBeGreaterThanOrEqual(4);
  });
});
