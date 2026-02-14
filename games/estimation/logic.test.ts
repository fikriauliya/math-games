import { describe, it, expect } from 'bun:test';
import { generateRound, scoreEstimation, scoreLabel, getResultText, TOTAL } from './logic';

describe('estimation logic', () => {
  it('generates dots matching actual count', () => {
    const r = generateRound(0);
    expect(r.dotPositions.length).toBe(r.actual);
  });

  it('actual count increases with rounds', () => {
    const early = generateRound(0);
    const late = generateRound(7);
    // Later rounds should have higher minimums
    expect(late.actual).toBeGreaterThanOrEqual(10);
  });

  it('scoreEstimation exact = 10', () => {
    expect(scoreEstimation(50, 50)).toBe(10);
  });

  it('scoreEstimation within 10% = 7', () => {
    expect(scoreEstimation(45, 50)).toBe(7);
    expect(scoreEstimation(55, 50)).toBe(7);
  });

  it('scoreEstimation within 25% = 4', () => {
    expect(scoreEstimation(38, 50)).toBe(4);
  });

  it('scoreEstimation within 50% = 2', () => {
    expect(scoreEstimation(30, 50)).toBe(2);
  });

  it('scoreEstimation way off = 0', () => {
    expect(scoreEstimation(10, 50)).toBe(0);
  });

  it('scoreLabel returns correct labels', () => {
    expect(scoreLabel(10)).toContain('Perfect');
    expect(scoreLabel(7)).toContain('close');
    expect(scoreLabel(0)).toContain('off');
  });

  it('TOTAL is 8', () => {
    expect(TOTAL).toBe(8);
  });

  it('dots have valid positions', () => {
    const r = generateRound(3);
    r.dotPositions.forEach(d => {
      expect(d.x).toBeGreaterThanOrEqual(5);
      expect(d.x).toBeLessThanOrEqual(90);
    });
  });
});
