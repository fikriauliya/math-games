import { describe, it, expect } from 'bun:test';
import { generatePuzzle, isDifference, getResultText, GRID_SIZE, DIFF_COUNT } from './logic';

describe('spot-difference logic', () => {
  it('generates puzzle with correct grid size', () => {
    const p = generatePuzzle();
    expect(p.gridA.length).toBe(GRID_SIZE);
    expect(p.gridA[0].length).toBe(GRID_SIZE);
    expect(p.gridB.length).toBe(GRID_SIZE);
  });

  it('has exactly DIFF_COUNT differences', () => {
    const p = generatePuzzle();
    expect(p.differences.length).toBe(DIFF_COUNT);
  });

  it('differences are actual differences between grids', () => {
    const p = generatePuzzle();
    for (const [r, c] of p.differences) {
      expect(p.gridA[r][c]).not.toBe(p.gridB[r][c]);
    }
  });

  it('non-difference cells are identical', () => {
    const p = generatePuzzle();
    const diffSet = new Set(p.differences.map(([r,c]) => `${r},${c}`));
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!diffSet.has(`${r},${c}`)) {
          expect(p.gridA[r][c]).toBe(p.gridB[r][c]);
        }
      }
    }
  });

  it('isDifference works', () => {
    const diffs: [number, number][] = [[0,1],[2,3]];
    expect(isDifference(0, 1, diffs)).toBe(true);
    expect(isDifference(0, 0, diffs)).toBe(false);
  });

  it('getResultText returns correct text', () => {
    expect(getResultText(15, 15).title).toBe('Perfect Eye!');
    expect(getResultText(10, 15).title).toBe('Great Job!');
    expect(getResultText(2, 15).title).toBe('Try Again!');
  });
});
