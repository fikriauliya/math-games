import { describe, it, expect } from 'bun:test';
import { toRoman, fromRoman, genQuestion, validateAnswer, getResultText, TOTAL } from './logic';
import { Either } from 'effect';

describe('roman-numerals logic', () => {
  it('toRoman converts correctly', () => {
    expect(toRoman(1)).toBe('I');
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(9)).toBe('IX');
    expect(toRoman(14)).toBe('XIV');
    expect(toRoman(27)).toBe('XXVII');
    expect(toRoman(99)).toBe('XCIX');
    expect(toRoman(2024)).toBe('MMXXIV');
  });

  it('fromRoman converts correctly', () => {
    expect(fromRoman('XIV')).toBe(14);
    expect(fromRoman('XXVII')).toBe(27);
    expect(fromRoman('XCIX')).toBe(99);
    expect(fromRoman('MMXXIV')).toBe(2024);
  });

  it('toRoman and fromRoman are inverses', () => {
    for (let i = 1; i <= 100; i++) {
      expect(fromRoman(toRoman(i))).toBe(i);
    }
  });

  it('genQuestion returns 4 choices including answer', () => {
    const q = genQuestion(0);
    expect(q.choices.length).toBe(4);
    expect(q.choices).toContain(q.answer);
  });

  it('direction is toArabic or toRoman', () => {
    const dirs = new Set<string>();
    for (let i = 0; i < 30; i++) {
      dirs.add(genQuestion(i % 12).direction);
    }
    expect(dirs.has('toArabic')).toBe(true);
    expect(dirs.has('toRoman')).toBe(true);
  });

  it('validateAnswer works', () => {
    expect(Either.isRight(validateAnswer('XIV', 'XIV'))).toBe(true);
    expect(Either.isLeft(validateAnswer('XV', 'XIV'))).toBe(true);
  });

  it('getResultText returns correct tiers', () => {
    expect(getResultText(12, 12).title).toBe('Roman Emperor!');
    expect(getResultText(8, 12).title).toBe('Great Centurion!');
    expect(getResultText(3, 12).title).toBe('Keep Training!');
  });

  it('TOTAL is 12', () => {
    expect(TOTAL).toBe(12);
  });
});
