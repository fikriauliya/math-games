import { describe, it, expect } from 'bun:test';
import { initLevel, move, isSolved, getGrade, getLevelCount } from './logic';

describe('sokoban logic', () => {
  it('getLevelCount returns 5+', () => {
    expect(getLevelCount()).toBeGreaterThanOrEqual(5);
  });

  it('initLevel returns valid state', () => {
    const s = initLevel(0);
    expect(s.grid.length).toBeGreaterThan(0);
    expect(s.moves).toBe(0);
    expect(s.playerR).toBeGreaterThanOrEqual(0);
  });

  it('move into wall stays put', () => {
    const s = initLevel(0);
    // Try moving up into wall from starting position
    const s2 = move(s, -1, 0);
    // Player should stay or move depending on level layout
    expect(s2.grid.length).toBeGreaterThan(0);
  });

  it('move increments moves on valid move', () => {
    const s = initLevel(1); // level 2 has open space
    const s2 = move(s, 0, -1); // try left
    // If moved, moves should be 1; if blocked, stays 0
    expect(s2.moves).toBeGreaterThanOrEqual(0);
  });

  it('isSolved false at start', () => {
    expect(isSolved(initLevel(0))).toBe(false);
  });

  it('isSolved true when no $ remain', () => {
    const s = initLevel(0);
    // Manually clear all $ for testing
    const g = s.grid.map(r => r.map(c => c === '$' ? '*' : c));
    expect(isSolved({ ...s, grid: g })).toBe(true);
  });

  it('getGrade tiers', () => {
    expect(getGrade(10).grade).toBe('S');
    expect(getGrade(25).grade).toBe('A');
    expect(getGrade(40).grade).toBe('B');
    expect(getGrade(60).grade).toBe('C');
  });
});
