import { describe, it, expect } from 'bun:test';
import { getDigitAt, getValueAt, generateQuestion, checkAnswer, getResultText, TOTAL, placeLabel } from './logic';

describe('place-value logic', () => {
  it('getDigitAt extracts correct digit', () => {
    expect(getDigitAt(4527, 'ones')).toBe(7);
    expect(getDigitAt(4527, 'tens')).toBe(2);
    expect(getDigitAt(4527, 'hundreds')).toBe(5);
    expect(getDigitAt(4527, 'thousands')).toBe(4);
  });

  it('getValueAt extracts correct value', () => {
    expect(getValueAt(3518, 'hundreds')).toBe(500);
    expect(getValueAt(3518, 'thousands')).toBe(3000);
    expect(getValueAt(3518, 'ones')).toBe(8);
  });

  it('generates question with 4 options including answer', () => {
    const q = generateQuestion(5);
    expect(q.options.length).toBe(4);
    expect(q.options).toContain(q.answer);
  });

  it('checkAnswer works', () => {
    expect(checkAnswer(5, 5)).toBe(true);
    expect(checkAnswer(3, 5)).toBe(false);
  });

  it('getResultText returns correct tiers', () => {
    expect(getResultText(12, 12).title).toBe('Super Hero!');
    expect(getResultText(8, 12).title).toBe('Great Power!');
    expect(getResultText(2, 12).title).toBe('Train Harder!');
  });

  it('placeLabel returns labels', () => {
    expect(placeLabel('hundreds')).toBe('hundreds');
  });

  it('early rounds use simpler places', () => {
    for (let i = 0; i < 5; i++) {
      const q = generateQuestion(0);
      expect(q.place).toBe('ones');
    }
  });
});
