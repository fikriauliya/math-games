import { describe, it, expect } from 'bun:test';
import { genQuestion, checkAnswer, getWinner, getResultEmoji, TOTAL_QUESTIONS } from './logic';

describe('math-duel logic', () => {
  it('genQuestion returns 4 choices including answer', () => {
    const q = genQuestion();
    expect(q.choices.length).toBe(4);
    expect(q.choices).toContain(q.answer);
  });

  it('genQuestion answer is non-negative', () => {
    for (let i = 0; i < 30; i++) {
      expect(genQuestion().answer).toBeGreaterThanOrEqual(0);
    }
  });

  it('genQuestion text contains an operator', () => {
    const q = genQuestion();
    expect(q.text).toMatch(/[+−×]/);
  });

  it('checkAnswer works correctly', () => {
    expect(checkAnswer(5, 5)).toBe(true);
    expect(checkAnswer(5, 6)).toBe(false);
  });

  it('getWinner returns correct winner', () => {
    expect(getWinner(10, 5)).toBe('Player 1');
    expect(getWinner(5, 10)).toBe('Player 2');
    expect(getWinner(5, 5)).toBe('Tie');
  });

  it('getResultEmoji returns handshake for tie', () => {
    expect(getResultEmoji(5, 5)).toBe('🤝');
    expect(getResultEmoji(10, 5)).toBe('🏆');
  });

  it('TOTAL_QUESTIONS is 15', () => {
    expect(TOTAL_QUESTIONS).toBe(15);
  });
});
