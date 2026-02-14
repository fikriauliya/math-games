import { describe, it, expect } from 'bun:test';
import { generateRound, checkAnswer, getResult, TOTAL_ROUNDS } from './logic';

describe('multiplication-war logic', () => {
  it('generateRound returns valid cards 1-12', () => {
    for (let i = 0; i < 20; i++) {
      const r = generateRound();
      expect(r.card1).toBeGreaterThanOrEqual(1);
      expect(r.card1).toBeLessThanOrEqual(12);
      expect(r.card2).toBeGreaterThanOrEqual(1);
      expect(r.card2).toBeLessThanOrEqual(12);
    }
  });

  it('product is card1 * card2', () => {
    for (let i = 0; i < 20; i++) {
      const r = generateRound();
      expect(r.product).toBe(r.card1 * r.card2);
    }
  });

  it('choices contains the correct product', () => {
    const r = generateRound();
    expect(r.choices).toContain(r.product);
    expect(r.choices.length).toBe(4);
  });

  it('checkAnswer returns true for correct', () => {
    expect(checkAnswer(24, 24)).toBe(true);
    expect(checkAnswer(25, 24)).toBe(false);
  });

  it('getResult determines winner correctly', () => {
    expect(getResult(10, 5).winner).toBe('Player 1');
    expect(getResult(5, 10).winner).toBe('Player 2');
    expect(getResult(5, 5).winner).toBe('Tie');
  });

  it('TOTAL_ROUNDS is 15', () => {
    expect(TOTAL_ROUNDS).toBe(15);
  });
});
