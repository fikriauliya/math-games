import { describe, it, expect } from 'bun:test';
import { ITEMS, generateRound, checkAnswer, getEndResult } from './logic';

describe('toddler-shadows logic', () => {
  it('ITEMS has 12 entries', () => {
    expect(ITEMS.length).toBe(12);
  });

  it('generateRound returns 2 choices', () => {
    const r = generateRound();
    expect(r.choices.length).toBe(2);
  });

  it('target is in choices', () => {
    for (let i = 0; i < 20; i++) {
      const r = generateRound();
      expect(r.choices.map(c => c.emoji)).toContain(r.target.emoji);
    }
  });

  it('checkAnswer works correctly', () => {
    const r = generateRound();
    expect(checkAnswer(r.target, r.target)).toBe(true);
    const wrong = r.choices.find(c => c.emoji !== r.target.emoji)!;
    expect(checkAnswer(wrong, r.target)).toBe(false);
  });

  it('getEndResult returns correct tiers', () => {
    expect(getEndResult(9, 10).title).toBe('🎉 Hebat Sekali!');
    expect(getEndResult(6, 10).title).toBe('⭐ Bagus!');
    expect(getEndResult(3, 10).title).toBe('💪 Coba Lagi!');
  });

  it('each item has emoji and name', () => {
    for (const item of ITEMS) {
      expect(item.emoji).toBeTruthy();
      expect(item.name.length).toBeGreaterThan(0);
    }
  });
});
