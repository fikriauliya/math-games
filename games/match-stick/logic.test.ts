import { describe, it, expect } from 'bun:test';
import { getPuzzle, getPuzzleCount, checkSolution, getSegments } from './logic';

describe('match-stick logic', () => {
  it('returns a puzzle', () => {
    const p = getPuzzle(0);
    expect(p.broken).toBeTruthy();
    expect(p.answer).toBeTruthy();
    expect(p.hint).toBeTruthy();
  });

  it('getPuzzleCount > 0', () => {
    expect(getPuzzleCount()).toBeGreaterThan(0);
  });

  it('checkSolution correct answer', () => {
    const p = getPuzzle(0);
    expect(checkSolution(p, p.answer)).toBe(true);
  });

  it('checkSolution wrong answer', () => {
    const p = getPuzzle(0);
    expect(checkSolution(p, 'wrong')).toBe(false);
  });

  it('getSegments returns 7 booleans for digit', () => {
    const s = getSegments('0');
    expect(s.length).toBe(7);
    expect(s[0]).toBe(true); // top segment
  });

  it('getSegments for unknown char', () => {
    const s = getSegments('?');
    expect(s.every(v => v === false)).toBe(true);
  });
});
