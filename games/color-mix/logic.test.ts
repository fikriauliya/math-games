import { describe, it, expect } from 'bun:test';
import { generateQuestion, checkAnswer, getResultText, TOTAL, ALL_COLORS, COLOR_HEX } from './logic';

describe('color-mix logic', () => {
  it('generates question with 4 options', () => {
    const q = generateQuestion(0);
    expect(q.options.length).toBe(4);
    expect(q.options).toContain(q.answer);
  });

  it('has two input colors', () => {
    const q = generateQuestion(0);
    expect(q.color1).toBeTruthy();
    expect(q.color2).toBeTruthy();
  });

  it('checkAnswer works', () => {
    expect(checkAnswer('Purple', 'Purple')).toBe(true);
    expect(checkAnswer('Green', 'Purple')).toBe(false);
  });

  it('ALL_COLORS has entries', () => {
    expect(ALL_COLORS.length).toBeGreaterThan(10);
  });

  it('every color has a hex', () => {
    for (const c of ALL_COLORS) {
      expect(COLOR_HEX[c]).toBeDefined();
    }
  });

  it('getResultText returns tiers', () => {
    expect(getResultText(10, 10).title).toBe('Master Artist!');
    expect(getResultText(7, 10).title).toBe('Great Mixing!');
    expect(getResultText(2, 10).title).toBe('Keep Painting!');
  });

  it('TOTAL is 10', () => {
    expect(TOTAL).toBe(10);
  });
});
