import { describe, it, expect } from 'bun:test';
import { LETTERS, TOTAL, generateRound, checkAnswer, getResultText } from './logic';

describe('toddler-letters logic', () => {
  it('LETTERS has 10 entries', () => {
    expect(LETTERS.length).toBe(10);
  });

  it('LETTERS covers A through J', () => {
    const letters = LETTERS.map(l => l.letter);
    expect(letters).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);
  });

  it('generateRound returns 2 choices including correct', () => {
    const r = generateRound(0);
    expect(r.choices.length).toBe(2);
    expect(r.choices).toContain('A');
  });

  it('generateRound choices are different', () => {
    const r = generateRound(0);
    expect(r.choices[0]).not.toBe(r.choices[1]);
  });

  it('checkAnswer works correctly', () => {
    expect(checkAnswer('A', 'A')).toBe(true);
    expect(checkAnswer('B', 'A')).toBe(false);
  });

  it('getResultText returns correct results', () => {
    expect(getResultText(10, 10).title).toBe('Hebat Sekali!');
    expect(getResultText(6, 10).title).toBe('Bagus!');
    expect(getResultText(3, 10).title).toBe('Ayo Coba Lagi!');
  });

  it('each letter has emoji and word', () => {
    for (const l of LETTERS) {
      expect(l.emoji.length).toBeGreaterThan(0);
      expect(l.word.length).toBeGreaterThan(0);
    }
  });

  it('TOTAL is 10', () => {
    expect(TOTAL).toBe(10);
  });
});
