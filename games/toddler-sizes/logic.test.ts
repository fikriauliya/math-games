import { describe, it, expect } from 'bun:test';
import { generateRound, checkAnswer, getResultText, EMOJIS, TOTAL } from './logic';

describe('toddler-sizes logic', () => {
  it('generateRound returns valid round', () => {
    const r = generateRound(0);
    expect(r.emoji).toBe(EMOJIS[0]);
    expect(r.question).toBe('besar');
    expect([0, 1]).toContain(r.bigIndex);
  });

  it('odd rounds ask kecil', () => {
    const r = generateRound(1);
    expect(r.question).toBe('kecil');
  });

  it('checkAnswer besar - tapping big is correct', () => {
    const r = { emoji: '🐻', question: 'besar' as const, bigIndex: 0 };
    expect(checkAnswer(0, r)).toBe(true);
    expect(checkAnswer(1, r)).toBe(false);
  });

  it('checkAnswer kecil - tapping small is correct', () => {
    const r = { emoji: '🐻', question: 'kecil' as const, bigIndex: 0 };
    expect(checkAnswer(1, r)).toBe(true);
    expect(checkAnswer(0, r)).toBe(false);
  });

  it('getResultText returns correct results', () => {
    expect(getResultText(8, 8).title).toBe('Hebat Sekali!');
    expect(getResultText(5, 8).title).toBe('Bagus!');
    expect(getResultText(2, 8).title).toBe('Ayo Coba Lagi!');
  });

  it('EMOJIS has 8 entries', () => {
    expect(EMOJIS.length).toBe(8);
  });

  it('TOTAL is 8', () => {
    expect(TOTAL).toBe(8);
  });
});
