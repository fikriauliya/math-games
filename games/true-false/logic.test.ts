import { describe, it, expect } from 'bun:test';
import { generateStatement, checkAnswer, getResultText, GAME_DURATION } from './logic';

describe('true-false logic', () => {
  it('generates statement with text and answer', () => {
    const s = generateStatement();
    expect(typeof s.text).toBe('string');
    expect(typeof s.answer).toBe('boolean');
  });

  it('statement text contains an operator', () => {
    const s = generateStatement();
    expect(s.text).toMatch(/[+−×]/);
  });

  it('statement text contains =', () => {
    const s = generateStatement();
    expect(s.text).toContain('=');
  });

  it('true statements are actually correct', () => {
    let foundTrue = false;
    for (let i = 0; i < 50; i++) {
      const s = generateStatement();
      if (s.answer) {
        foundTrue = true;
        const parts = s.text.split('=');
        const shown = parseInt(parts[1].trim());
        const expr = parts[0].trim();
        // Verify the math
        let result: number;
        if (expr.includes('×')) {
          const [a, b] = expr.split('×').map(x => parseInt(x.trim()));
          result = a * b;
        } else if (expr.includes('−')) {
          const [a, b] = expr.split('−').map(x => parseInt(x.trim()));
          result = a - b;
        } else {
          const [a, b] = expr.split('+').map(x => parseInt(x.trim()));
          result = a + b;
        }
        expect(shown).toBe(result);
      }
    }
    expect(foundTrue).toBe(true);
  });

  it('checkAnswer works', () => {
    expect(checkAnswer(true, true)).toBe(true);
    expect(checkAnswer(false, true)).toBe(false);
  });

  it('getResultText tiers', () => {
    expect(getResultText(25).emoji).toBe('🏆');
    expect(getResultText(15).emoji).toBe('🌟');
    expect(getResultText(8).emoji).toBe('⭐');
    expect(getResultText(3).emoji).toBe('💪');
  });

  it('GAME_DURATION is 30', () => {
    expect(GAME_DURATION).toBe(30);
  });
});
