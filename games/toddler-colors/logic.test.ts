import { describe, it, expect } from 'bun:test';
import { COLORS, SHAPES, ANIMALS, shuffle, generateCountingAnswers, getEndResult } from './logic';

describe('toddler-colors logic', () => {
  it('COLORS has 8 entries', () => {
    expect(COLORS.length).toBe(8);
  });

  it('SHAPES has 6 entries', () => {
    expect(SHAPES.length).toBe(6);
  });

  it('ANIMALS has 15 entries', () => {
    expect(ANIMALS.length).toBe(15);
  });

  it('shuffle preserves elements and does not mutate', () => {
    const arr = ['a', 'b', 'c', 'd'];
    const result = shuffle(arr);
    expect(result.sort()).toEqual(['a', 'b', 'c', 'd']);
    expect(arr).toEqual(['a', 'b', 'c', 'd']);
  });

  it('generateCountingAnswers includes target and has 4 options', () => {
    for (let t = 1; t <= 5; t++) {
      const answers = generateCountingAnswers(t);
      expect(answers).toContain(t);
      expect(answers.length).toBe(4);
      // sorted
      for (let i = 1; i < answers.length; i++) {
        expect(answers[i]).toBeGreaterThanOrEqual(answers[i-1]);
      }
    }
  });

  it('generateCountingAnswers all values >= 1', () => {
    for (let i = 0; i < 20; i++) {
      const answers = generateCountingAnswers(1);
      for (const a of answers) {
        expect(a).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('getEndResult returns correct results', () => {
    expect(getEndResult(9, 10).title).toBe('🎉 Hebat Sekali!');
    expect(getEndResult(9, 10).stars).toBe('⭐⭐⭐');
    expect(getEndResult(6, 10).title).toBe('⭐ Bagus!');
    expect(getEndResult(3, 10).title).toBe('💪 Coba Lagi!');
    expect(getEndResult(3, 10).stars).toBe('⭐');
  });

  it('each color has unique name', () => {
    const names = COLORS.map(c => c.name);
    expect(new Set(names).size).toBe(8);
  });
});
