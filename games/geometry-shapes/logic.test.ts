import { describe, it, expect } from 'bun:test';
import { generateQuestion, checkAnswer, getResultText, TOTAL } from './logic';

describe('geometry-shapes logic', () => {
  it('generates questions with 4 choices', () => {
    for (let i = 0; i < 12; i++) {
      const q = generateQuestion(i);
      expect(q.choices.length).toBe(4);
      expect(q.choices).toContain(q.answer);
    }
  });

  it('sides questions have correct answers', () => {
    // round % 4 === 2 is sides
    const q = generateQuestion(2);
    expect(q.type).toBe('sides');
    expect(q.answer).toBeGreaterThanOrEqual(3);
    expect(q.answer).toBeLessThanOrEqual(8);
  });

  it('area questions give positive answers', () => {
    const q = generateQuestion(0); // area
    expect(q.type).toBe('area');
    expect(q.answer).toBeGreaterThan(0);
  });

  it('perimeter questions give positive answers', () => {
    const q = generateQuestion(1); // perimeter
    expect(q.type).toBe('perimeter');
    expect(q.answer).toBeGreaterThan(0);
  });

  it('checkAnswer validates correctly', () => {
    expect(checkAnswer(15, 15)).toBe(true);
    expect(checkAnswer(14, 15)).toBe(false);
  });

  it('getResultText returns correct grades', () => {
    expect(getResultText(12, 12).title).toBe('Perfect!');
    expect(getResultText(9, 12).title).toBe('Great Job!');
    expect(getResultText(3, 12).title).toBe('Keep Practicing!');
  });
});
