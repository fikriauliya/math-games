import { describe, it, expect } from 'bun:test';
import { PATTERN_SETS, generatePattern, checkAnswer, getEndResult } from './logic';

describe('toddler-patterns logic', () => {
  it('PATTERN_SETS has 8 sets', () => {
    expect(PATTERN_SETS.length).toBe(8);
  });

  it('each set has 2 items', () => {
    for (const s of PATTERN_SETS) expect(s.length).toBe(2);
  });

  it('generatePattern returns sequence of 4 and 2 choices', () => {
    const r = generatePattern();
    expect(r.sequence.length).toBe(4);
    expect(r.choices.length).toBe(2);
  });

  it('answer is in choices', () => {
    for (let i = 0; i < 20; i++) {
      const r = generatePattern();
      expect(r.choices.map(c => c.emoji)).toContain(r.answer.emoji);
    }
  });

  it('checkAnswer works correctly', () => {
    const r = generatePattern();
    expect(checkAnswer(r.answer, r.answer)).toBe(true);
    const wrong = r.choices.find(c => c.emoji !== r.answer.emoji)!;
    expect(checkAnswer(wrong, r.answer)).toBe(false);
  });

  it('getEndResult returns correct tiers', () => {
    expect(getEndResult(9, 10).title).toBe('🎉 Hebat Sekali!');
    expect(getEndResult(6, 10).title).toBe('⭐ Bagus!');
    expect(getEndResult(3, 10).title).toBe('💪 Coba Lagi!');
  });
});
