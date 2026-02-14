import { describe, it, expect } from 'bun:test';
import { genQuestion, clampRopeOffset, calcRopeOffset, determineWinner, formatTime } from './logic';

describe('tug-of-war logic', () => {
  it('genQuestion returns valid addition question', () => {
    const q = genQuestion('easy', 'add');
    expect(q.text).toContain('+');
    expect(q.answer).toBeGreaterThanOrEqual(2);
  });

  it('genQuestion returns valid subtraction with non-negative answer', () => {
    for (let i = 0; i < 20; i++) {
      const q = genQuestion('medium', 'sub');
      expect(q.answer).toBeGreaterThanOrEqual(0);
    }
  });

  it('genQuestion returns valid multiplication', () => {
    const q = genQuestion('hard', 'mul');
    expect(q.text).toContain('×');
    expect(q.answer).toBeGreaterThanOrEqual(1);
  });

  it('clampRopeOffset clamps values', () => {
    expect(clampRopeOffset(150)).toBe(100);
    expect(clampRopeOffset(-150)).toBe(-100);
    expect(clampRopeOffset(50)).toBe(50);
  });

  it('calcRopeOffset moves correctly per team', () => {
    expect(calcRopeOffset(0, 1)).toBe(-8);
    expect(calcRopeOffset(0, 2)).toBe(8);
  });

  it('determineWinner returns correct result', () => {
    expect(determineWinner(5, 3)).toBe('🏆 Team 1 Wins!');
    expect(determineWinner(3, 5)).toBe('🏆 Team 2 Wins!');
    expect(determineWinner(4, 4)).toBe("🤝 It's a Tie!");
  });

  it('formatTime formats correctly', () => {
    expect(formatTime(90)).toBe('01:30');
    expect(formatTime(5)).toBe('00:05');
    expect(formatTime(0)).toBe('00:00');
  });

  it('genQuestion mix produces + or −', () => {
    const results = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const q = genQuestion('medium', 'mix');
      if (q.text.includes('+')) results.add('+');
      if (q.text.includes('−')) results.add('−');
    }
    expect(results.size).toBe(2);
  });
});
