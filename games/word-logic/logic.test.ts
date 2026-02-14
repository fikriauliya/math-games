import { describe, it, expect } from 'bun:test';
import { letterValue, wordValue, generateQuestion, checkAnswer, getResultText, TOTAL } from './logic';

describe('word-logic', () => {
  it('letterValue A=1, Z=26', () => {
    expect(letterValue('A')).toBe(1);
    expect(letterValue('Z')).toBe(26);
    expect(letterValue('c')).toBe(3);
  });

  it('wordValue CAT = 3+1+20 = 24', () => {
    expect(wordValue('CAT')).toBe(24);
  });

  it('wordValue DOG = 4+15+7 = 26', () => {
    expect(wordValue('DOG')).toBe(26);
  });

  it('forward question has word and numeric options', () => {
    const q = generateQuestion(0);
    expect(q.type).toBe('forward');
    expect(q.word).toBeDefined();
    expect(q.options.length).toBe(4);
    expect(q.options).toContain(q.answer);
  });

  it('reverse question has targetValue and word options', () => {
    const q = generateQuestion(1);
    expect(q.type).toBe('reverse');
    expect(q.targetValue).toBeGreaterThan(0);
    expect(q.options.length).toBe(4);
  });

  it('checkAnswer works', () => {
    expect(checkAnswer('24', '24')).toBe(true);
    expect(checkAnswer('25', '24')).toBe(false);
  });

  it('getResultText returns tiers', () => {
    expect(getResultText(10, 10).title).toBe('Word Genius!');
    expect(getResultText(7, 10).title).toBe('Well Read!');
    expect(getResultText(2, 10).title).toBe('Keep Learning!');
  });

  it('TOTAL is 10', () => {
    expect(TOTAL).toBe(10);
  });
});
