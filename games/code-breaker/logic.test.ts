import { describe, it, expect } from 'bun:test';
import { generateCode, evaluateGuess, isWin, getGrade, COLORS, CODE_LENGTH } from './logic';

describe('code-breaker logic', () => {
  it('generateCode returns correct length', () => {
    expect(generateCode().length).toBe(CODE_LENGTH);
  });

  it('generateCode uses valid colors', () => {
    const code = generateCode();
    for (const c of code) expect(COLORS).toContain(c);
  });

  it('evaluateGuess all correct', () => {
    const secret = ['🔴', '🔵', '🟢', '🟡'];
    const pegs = evaluateGuess(secret, secret);
    expect(pegs.filter(p => p.type === 'black').length).toBe(4);
    expect(pegs.filter(p => p.type === 'white').length).toBe(0);
  });

  it('evaluateGuess none correct', () => {
    const pegs = evaluateGuess(['🔴', '🔴', '🔴', '🔴'], ['🔵', '🔵', '🔵', '🔵']);
    expect(pegs.length).toBe(0);
  });

  it('evaluateGuess white pegs', () => {
    const pegs = evaluateGuess(['🔴', '🔵', '🟢', '🟡'], ['🔵', '🔴', '🟡', '🟢']);
    expect(pegs.filter(p => p.type === 'black').length).toBe(0);
    expect(pegs.filter(p => p.type === 'white').length).toBe(4);
  });

  it('isWin detects win', () => {
    expect(isWin([{ type: 'black' }, { type: 'black' }, { type: 'black' }, { type: 'black' }])).toBe(true);
    expect(isWin([{ type: 'black' }, { type: 'white' }, { type: 'black' }, { type: 'black' }])).toBe(false);
  });

  it('getGrade tiers', () => {
    expect(getGrade(2).grade).toBe('S');
    expect(getGrade(5).grade).toBe('A');
    expect(getGrade(7).grade).toBe('B');
    expect(getGrade(9).grade).toBe('C');
  });
});
