import { describe, it, expect } from 'bun:test';
import { generatePattern, checkAnswer, calcScore, getGrade, TOTAL_ROUNDS } from './logic';

describe('pattern-detective logic', () => {
  it('generatePattern returns sequence of 5 numbers', () => {
    const q = generatePattern(0);
    expect(q.sequence.length).toBe(5);
  });

  it('generatePattern returns 4 choices including answer', () => {
    const q = generatePattern(0);
    expect(q.choices.length).toBe(4);
    expect(q.choices).toContain(q.answer);
  });

  it('early rounds use addN pattern', () => {
    const patterns = new Set<string>();
    for (let i = 0; i < 20; i++) {
      patterns.add(generatePattern(0).patternType);
    }
    expect(patterns.has('addN')).toBe(true);
  });

  it('addN pattern has constant difference', () => {
    // Generate many and check at least some addN patterns work
    for (let i = 0; i < 10; i++) {
      const q = generatePattern(0);
      if (q.patternType === 'addN') {
        const diff = q.sequence[1] - q.sequence[0];
        for (let j = 2; j < q.sequence.length; j++) {
          expect(q.sequence[j] - q.sequence[j-1]).toBe(diff);
        }
        expect(q.answer).toBe(q.sequence[4] + diff);
      }
    }
  });

  it('checkAnswer works correctly', () => {
    expect(checkAnswer(10, 10)).toBe(true);
    expect(checkAnswer(10, 11)).toBe(false);
  });

  it('calcScore returns 10 per correct', () => {
    expect(calcScore(6)).toBe(60);
  });

  it('getGrade returns correct grades', () => {
    expect(getGrade(12, 12).grade).toBe('S');
    expect(getGrade(8, 12).grade).toBe('C');
  });

  it('TOTAL_ROUNDS is 12', () => {
    expect(TOTAL_ROUNDS).toBe(12);
  });

  it('later rounds can produce different pattern types', () => {
    const types = new Set<string>();
    for (let i = 0; i < 50; i++) {
      types.add(generatePattern(9).patternType);
    }
    expect(types.size).toBeGreaterThan(1);
  });
});
