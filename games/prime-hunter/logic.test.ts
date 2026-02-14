import { describe, it, expect } from 'bun:test';
import { isPrime, generateRound, calcRoundScore, getResultText, ROUNDS } from './logic';

describe('prime-hunter logic', () => {
  it('isPrime correctly identifies primes', () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(3)).toBe(true);
    expect(isPrime(5)).toBe(true);
    expect(isPrime(7)).toBe(true);
    expect(isPrime(11)).toBe(true);
    expect(isPrime(97)).toBe(true);
  });

  it('isPrime correctly identifies non-primes', () => {
    expect(isPrime(0)).toBe(false);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(4)).toBe(false);
    expect(isPrime(9)).toBe(false);
    expect(isPrime(100)).toBe(false);
  });

  it('generateRound returns numbers and primes', () => {
    const round = generateRound(0);
    expect(round.numbers.length).toBeGreaterThan(0);
    expect(round.primes.length).toBeGreaterThan(0);
    // All primes should be in numbers
    for (const p of round.primes) {
      expect(round.numbers).toContain(p);
      expect(isPrime(p)).toBe(true);
    }
  });

  it('generateRound respects round ranges', () => {
    const r0 = generateRound(0);
    r0.numbers.forEach(n => {
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(20);
    });
  });

  it('calcRoundScore rewards found and penalizes wrong', () => {
    expect(calcRoundScore([2, 3, 5], [], 0)).toBe(30);
    expect(calcRoundScore([2, 3], [5], 1)).toBe(15);
    expect(calcRoundScore([], [2, 3, 5], 3)).toBe(0);
  });

  it('getResultText returns correct tiers', () => {
    expect(getResultText(100).title).toBe('Prime Master!');
    expect(getResultText(50).title).toBe('Great Hunter!');
    expect(getResultText(10).title).toBe('Keep Hunting!');
  });

  it('ROUNDS has 3 rounds', () => {
    expect(ROUNDS.length).toBe(3);
  });
});
