import { describe, it, expect } from 'bun:test';
import { TRACING_CHARS, pickChar, getDistToPoint, checkTrace, getEndResult } from './logic';

describe('toddler-tracing logic', () => {
  it('TRACING_CHARS has 6 entries', () => {
    expect(TRACING_CHARS.length).toBe(6);
  });

  it('each char has points', () => {
    for (const c of TRACING_CHARS) {
      expect(c.points.length).toBeGreaterThan(0);
      expect(c.char).toBeTruthy();
      expect(c.name).toBeTruthy();
    }
  });

  it('pickChar returns valid char', () => {
    const c = pickChar();
    expect(c.char).toBeTruthy();
    expect(TRACING_CHARS.map(t => t.char)).toContain(c.char);
  });

  it('getDistToPoint calculates correctly', () => {
    expect(getDistToPoint(0, 0, 3, 4)).toBeCloseTo(5, 5);
    expect(getDistToPoint(1, 1, 1, 1)).toBe(0);
  });

  it('checkTrace returns accuracy', () => {
    const char = TRACING_CHARS[0];
    // Trace exactly on points
    const perfect = checkTrace(char.points, char, 0.1);
    expect(perfect).toBe(1);
    // Empty trace
    const empty = checkTrace([], char, 0.1);
    expect(empty).toBe(0);
  });

  it('getEndResult tiers', () => {
    expect(getEndResult(0.8).stars).toBe('⭐⭐⭐');
    expect(getEndResult(0.5).stars).toBe('⭐⭐');
    expect(getEndResult(0.2).stars).toBe('⭐');
  });
});
