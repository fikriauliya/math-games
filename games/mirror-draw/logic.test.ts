import { describe, it, expect } from 'bun:test';
import { generateRound, getExpectedPattern, checkPattern, getResultText, TOTAL_ROUNDS } from './logic';

describe('mirror-draw logic', () => {
  it('generates round with correct size', () => {
    const r = generateRound(0);
    expect(r.size).toBe(3);
    expect(r.pattern.length).toBe(3);
    expect(r.pattern[0].length).toBe(3);
  });

  it('later rounds have larger grids', () => {
    expect(generateRound(5).size).toBeGreaterThanOrEqual(4);
  });

  it('pattern has filled cells', () => {
    const r = generateRound(0);
    const filled = r.pattern.flat().filter(Boolean).length;
    expect(filled).toBeGreaterThanOrEqual(2);
  });

  it('getExpectedPattern same mode returns same', () => {
    const r = { size: 3, pattern: [[true, false, false], [false, true, false], [false, false, true]], mode: 'same' as const };
    const expected = getExpectedPattern(r);
    expect(expected).toEqual(r.pattern);
  });

  it('getExpectedPattern mirror mode reverses rows', () => {
    const r = { size: 3, pattern: [[true, false, false], [false, false, false], [false, false, false]], mode: 'mirror' as const };
    const expected = getExpectedPattern(r);
    expect(expected[0]).toEqual([false, false, true]);
  });

  it('checkPattern detects perfect match', () => {
    const grid = [[true, false], [false, true]];
    const result = checkPattern(grid, grid);
    expect(result.perfect).toBe(true);
    expect(result.correct).toBe(4);
  });

  it('checkPattern detects mismatches', () => {
    const user = [[true, true], [true, true]];
    const expected = [[false, false], [false, false]];
    const result = checkPattern(user, expected);
    expect(result.correct).toBe(0);
    expect(result.perfect).toBe(false);
  });

  it('getResultText tiers', () => {
    expect(getResultText(10, 10).emoji).toBe('🏆');
    expect(getResultText(7, 10).emoji).toBe('🔬');
    expect(getResultText(3, 10).emoji).toBe('💪');
  });

  it('TOTAL_ROUNDS is 10', () => {
    expect(TOTAL_ROUNDS).toBe(10);
  });
});
