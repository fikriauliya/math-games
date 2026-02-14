import { describe, it, expect } from 'bun:test';
import { generateNumbers, calculateAnswer, formatNumber, checkAnswer, getDifficultyConfig, getGrade, getSpeedMs } from './logic';

describe('sempoa logic', () => {
  it('generateNumbers returns correct count', () => {
    const nums = generateNumbers('easy', 5, false);
    expect(nums.length).toBe(5);
  });

  it('easy mode generates only positive integers', () => {
    for (let i = 0; i < 20; i++) {
      const nums = generateNumbers('easy', 3, false);
      for (const n of nums) {
        expect(n).toBeGreaterThan(0);
        expect(Number.isInteger(n)).toBe(true);
      }
    }
  });

  it('calculateAnswer handles integers correctly', () => {
    expect(calculateAnswer([5, 3, 2])).toBe(10);
    expect(calculateAnswer([10, -3, -2])).toBe(5);
  });

  it('calculateAnswer handles floating point correctly', () => {
    // 0.1 + 0.2 should not be 0.30000000000000004
    expect(calculateAnswer([0.1, 0.2])).toBe(0.3);
    expect(calculateAnswer([8.83, -0.82, -1.35])).toBe(6.66);
  });

  it('formatNumber adds sign prefix', () => {
    expect(formatNumber(5)).toBe('+5');
    expect(formatNumber(-3)).toBe('-3');
    expect(formatNumber(0)).toBe('0');
  });

  it('checkAnswer with tolerance', () => {
    expect(checkAnswer(5, 5)).toBe(true);
    expect(checkAnswer(5.001, 5, 0.01)).toBe(true);
    expect(checkAnswer(5.02, 5, 0.01)).toBe(false);
  });

  it('getDifficultyConfig returns valid configs', () => {
    const easy = getDifficultyConfig('easy');
    expect(easy.count).toBe(3);
    expect(easy.decimals).toBe(false);
    expect(easy.speed).toBe(2);

    const expert = getDifficultyConfig('expert');
    expect(expert.count).toBe(8);
    expect(expert.decimals).toBe(true);
    expect(expert.speed).toBe(0.7);
  });

  it('getGrade returns correct grades', () => {
    expect(getGrade(10, 10).grade).toBe('S');
    expect(getGrade(9, 10).grade).toBe('A+');
    expect(getGrade(5, 10).grade).toBe('D');
  });

  it('getSpeedMs maps labels correctly', () => {
    expect(getSpeedMs('slow')).toBe(2000);
    expect(getSpeedMs('turbo')).toBe(500);
    expect(getSpeedMs('unknown')).toBe(1500);
  });

  it('medium+ can generate negative numbers', () => {
    let hasNegative = false;
    for (let i = 0; i < 50; i++) {
      const nums = generateNumbers('medium', 5, false);
      if (nums.some(n => n < 0)) { hasNegative = true; break; }
    }
    expect(hasNegative).toBe(true);
  });
});
