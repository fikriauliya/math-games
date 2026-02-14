import { describe, it, expect } from 'bun:test';
import { SOUNDS, generateRound, checkAnswer, getEndResult } from './logic';

describe('toddler-sounds logic', () => {
  it('SOUNDS has 8 entries', () => {
    expect(SOUNDS.length).toBe(8);
  });

  it('each sound has required fields', () => {
    for (const s of SOUNDS) {
      expect(s.emoji).toBeTruthy();
      expect(s.name).toBeTruthy();
      expect(s.freq).toBeGreaterThan(0);
      expect(s.duration).toBeGreaterThan(0);
    }
  });

  it('generateRound returns 2 choices', () => {
    const r = generateRound();
    expect(r.choices.length).toBe(2);
  });

  it('target is always in choices', () => {
    for (let i = 0; i < 20; i++) {
      const r = generateRound();
      expect(r.choices.map(c => c.emoji)).toContain(r.target.emoji);
    }
  });

  it('checkAnswer works', () => {
    const r = generateRound();
    expect(checkAnswer(r.target, r.target)).toBe(true);
    const wrong = r.choices.find(c => c.emoji !== r.target.emoji)!;
    expect(checkAnswer(wrong, r.target)).toBe(false);
  });

  it('getEndResult tiers', () => {
    expect(getEndResult(10, 10).stars).toBe('⭐⭐⭐');
    expect(getEndResult(7, 10).stars).toBe('⭐⭐');
    expect(getEndResult(3, 10).stars).toBe('⭐');
  });
});
