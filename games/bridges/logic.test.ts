import { describe, it, expect } from 'bun:test';
import { getPuzzle, canConnect, isSolved, addBridge } from './logic';

describe('bridges logic', () => {
  it('getPuzzle returns valid puzzle', () => {
    const p = getPuzzle('easy');
    expect(p.islands.length).toBeGreaterThan(0);
    expect(p.size).toBeGreaterThan(0);
  });

  it('islands start with current=0', () => {
    const p = getPuzzle('easy');
    for (const i of p.islands) expect(i.current).toBe(0);
  });

  it('canConnect same row', () => {
    const p = getPuzzle('easy');
    // First two islands are row 0
    expect(canConnect(p.islands, 0, 1)).toBe(true);
  });

  it('canConnect different row and col', () => {
    const p = getPuzzle('easy');
    // island 0 (0,0) and island 2 (2,2) - different row AND col
    expect(canConnect(p.islands, 0, 2)).toBe(false);
  });

  it('addBridge adds then cycles', () => {
    let b = addBridge([], 0, 1);
    expect(b.length).toBe(1);
    expect(b[0].count).toBe(1);
    b = addBridge(b, 0, 1);
    expect(b[0].count).toBe(2);
    b = addBridge(b, 0, 1);
    expect(b.length).toBe(0); // removed
  });

  it('isSolved when all targets met', () => {
    const islands = [{ row: 0, col: 0, target: 1, current: 1 }, { row: 0, col: 1, target: 1, current: 1 }];
    expect(isSolved(islands)).toBe(true);
  });

  it('isSolved false when not met', () => {
    const islands = [{ row: 0, col: 0, target: 2, current: 1 }, { row: 0, col: 1, target: 1, current: 1 }];
    expect(isSolved(islands)).toBe(false);
  });
});
